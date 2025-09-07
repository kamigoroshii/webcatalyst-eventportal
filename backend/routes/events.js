const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['Technology', 'Business', 'Marketing', 'Design', 'Finance', 'Education', 'Health', 'Entertainment', 'Sports', 'Other']),
  query('status').optional().isIn(['published', 'upcoming', 'ongoing', 'completed']),
  query('search').optional().isLength({ max: 100 }).withMessage('Search term too long')
], optionalAuth, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      category,
      status,
      search,
      sortBy = 'date',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    let query = { isPublic: true };

    if (category) {
      query.category = category;
    }

    if (status) {
      if (status === 'upcoming') {
        query.date = { $gte: new Date() };
        query.status = 'published';
      } else {
        query.status = status;
      }
    } else {
      // Default to published events only
      query.status = 'published';
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    let sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [events, totalEvents] = await Promise.all([
      Event.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('organizer', 'name email')
        .lean(),
      Event.countDocuments(query)
    ]);

    // Add registration info for authenticated users
    if (req.user) {
      const userRegistrations = await Registration.find({
        user: req.user.userId,
        event: { $in: events.map(e => e._id) }
      }).select('event status');

      const registrationMap = {};
      userRegistrations.forEach(reg => {
        registrationMap[reg.event.toString()] = reg.status;
      });

      events.forEach(event => {
        event.userRegistrationStatus = registrationMap[event._id.toString()] || null;
      });
    }

    const totalPages = Math.ceil(totalEvents / parseInt(limit));

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalEvents,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email phone')
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is public or user is the organizer
    if (!event.isPublic && (!req.user || req.user.userId !== event.organizer._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'This event is private'
      });
    }

    // Increment view count
    await Event.findByIdAndUpdate(req.params.id, {
      $inc: { 'analytics.views': 1 }
    });

    // Add user registration status if authenticated
    if (req.user) {
      const registration = await Registration.findOne({
        user: req.user.userId,
        event: req.params.id
      }).select('status registrationId qrCode');

      event.userRegistration = registration;
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Get event error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Organizers only)
router.post('/', [auth, authorize('organizer', 'admin')], [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  body('category').isIn(['Technology', 'Business', 'Marketing', 'Design', 'Finance', 'Education', 'Health', 'Entertainment', 'Sports', 'Other']),
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please provide valid start time (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please provide valid end time (HH:MM)'),
  body('location.venue').trim().isLength({ min: 2, max: 100 }).withMessage('Venue must be between 2 and 100 characters'),
  body('location.address').trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('maxRegistrations').isInt({ min: 1 }).withMessage('Maximum registrations must be at least 1'),
  body('registrationDeadline').isISO8601().withMessage('Please provide a valid registration deadline')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const eventData = {
      ...req.body,
      organizer: req.user.userId,
      organizerInfo: {
        name: req.user.name,
        email: req.user.email
      }
    };

    // Validate dates
    const eventDate = new Date(eventData.date);
    const registrationDeadline = new Date(eventData.registrationDeadline);
    const now = new Date();

    if (eventDate <= now) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be in the future'
      });
    }

    if (registrationDeadline >= eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline must be before event date'
      });
    }

    const event = new Event(eventData);
    await event.save();

    // Populate organizer info
    await event.populate('organizer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating event'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Event organizer only)
router.put('/:id', [auth, authorize('organizer', 'admin')], [
  body('title').optional().trim().isLength({ min: 5, max: 100 }),
  body('description').optional().trim().isLength({ min: 20, max: 2000 }),
  body('category').optional().isIn(['Technology', 'Business', 'Marketing', 'Design', 'Finance', 'Education', 'Health', 'Entertainment', 'Sports', 'Other']),
  body('date').optional().isISO8601(),
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('maxRegistrations').optional().isInt({ min: 1 }),
  body('registrationDeadline').optional().isISO8601()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Update event
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        event[key] = req.body[key];
      }
    });

    await event.save();
    await event.populate('organizer', 'name email');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });

  } catch (error) {
    console.error('Update event error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Event organizer only)
router.delete('/:id', [auth, authorize('organizer', 'admin')], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Check if event has registrations
    const registrationCount = await Registration.countDocuments({ event: req.params.id });
    if (registrationCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event with existing registrations. Cancel the event instead.'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
});

// @route   GET /api/events/organizer/my-events
// @desc    Get organizer's events
// @access  Private (Organizers only)
router.get('/organizer/my-events', [auth, authorize('organizer', 'admin')], async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = { organizer: req.user.userId };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [events, totalEvents] = await Promise.all([
      Event.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Event.countDocuments(query)
    ]);

    // Add registration counts
    for (let event of events) {
      const registrationStats = await Registration.aggregate([
        { $match: { event: event._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      event.registrationStats = registrationStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});

      event.totalRegistrations = registrationStats.reduce((sum, stat) => sum + stat.count, 0);
    }

    const totalPages = Math.ceil(totalEvents / parseInt(limit));

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalEvents,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get organizer events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching organizer events'
    });
  }
});

// @route   GET /api/events/categories
// @desc    Get event categories with counts
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Event.aggregate([
      { $match: { status: 'published', isPublic: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

module.exports = router;