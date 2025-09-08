const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult, query } = require('express-validator');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/registrations
// @desc    Register for an event
// @access  Private
router.post('/', auth, [
  body('eventId').isMongoId().withMessage('Valid event ID is required'),
  body('userInfo.name').optional().trim().isLength({ min: 2, max: 50 }),
  body('userInfo.email').optional().isEmail().normalizeEmail(),
  body('userInfo.college').optional().trim().isLength({ max: 100 }),
  body('userInfo.phone').optional().matches(/^\+?[\d\s\-\(\)]+$/),
  body('specialRequirements.dietary').optional().trim().isLength({ max: 200 }),
  body('specialRequirements.accessibility').optional().trim().isLength({ max: 200 }),
  body('specialRequirements.other').optional().trim().isLength({ max: 200 })
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

    const { eventId, userInfo, specialRequirements, referralSource } = req.body;

    // Check if event exists and is available for registration
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!event.canRegister()) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not available for this event'
      });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      user: req.user.userId,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
        data: {
          registrationId: existingRegistration.registrationId,
          status: existingRegistration.status
        }
      });
    }

    // Get user info
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }



    // Generate registrationId
    const { v4: uuidv4 } = require('uuid');
    const registrationId = uuidv4();

    // Simulate QR code generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate QR code (simple placeholder, replace with real QR code logic)
    const qrCodeData = `REGISTRATION:${registrationId}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=200x200`;

    // Create registration
    const registration = new Registration({
      user: req.user.userId,
      event: eventId,
      registrationId,
      qrCode,
      qrCodeData,
      userInfo: {
        name: userInfo?.name || user.name,
        email: userInfo?.email || user.email,
        college: userInfo?.college || user.college,
        phone: userInfo?.phone || user.phone
      },
      specialRequirements: specialRequirements || {},
      referralSource,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        source: 'web'
      }
    });

    await registration.save();

    // Send QR code to user's email (simple placeholder, replace with real mail logic)
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: registration.userInfo.email,
      subject: 'Your Event Registration QR Code',
      html: `<p>Thank you for registering! Here is your QR code:</p><img src='${qrCode}' alt='QR Code' />`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending registration email:', error);
      } else {
        console.log('Registration email sent:', info.response);
      }
    });

    // Update event registration count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentRegistrations: 1 }
    });

    // Populate event and user info
    await registration.populate([
      { path: 'event', select: 'title date location organizer' },
      { path: 'user', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        registrationId: registration.registrationId,
        qrCode: registration.qrCode,
        event: registration.event,
        status: registration.status,
        registrationDate: registration.registrationDate
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   GET /api/registrations/my-registrations
// @desc    Get user's registrations
// @access  Private
router.get('/my-registrations', auth, [
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'attended', 'no-show']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: req.user.userId };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [registrations, totalRegistrations] = await Promise.all([
      Registration.find(query)
        .populate({
          path: 'event',
          select: 'title date location status organizer',
          populate: { path: 'organizer', select: 'name email' }
        })
        .sort({ registrationDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Registration.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalRegistrations / parseInt(limit));

    res.json({
      success: true,
      data: {
        registrations,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRegistrations,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registrations'
    });
  }
});

// @route   GET /api/registrations/:registrationId
// @desc    Get registration details
// @access  Private
router.get('/:registrationId', auth, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      registrationId: req.params.registrationId
    })
    .populate('event', 'title date location organizer')
    .populate('user', 'name email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user owns this registration or is the event organizer
    const isOwner = registration.user._id.toString() === req.user.userId;
    const isOrganizer = registration.event.organizer.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this registration'
      });
    }

    res.json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registration'
    });
  }
});

// @route   PUT /api/registrations/:registrationId/cancel
// @desc    Cancel registration
// @access  Private
router.put('/:registrationId/cancel', auth, [
  body('reason').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const { reason } = req.body;

    const registration = await Registration.findOne({
      registrationId: req.params.registrationId,
      user: req.user.userId
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration is already cancelled'
      });
    }

    // Check if cancellation is allowed (e.g., not too close to event date)
    const event = await Event.findById(registration.event);
    const eventDate = new Date(event.date);
    const now = new Date();
    const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);

    if (hoursUntilEvent < 24) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration less than 24 hours before the event'
      });
    }

    // Cancel registration
    await registration.cancel(reason);

    // Update event registration count
    await Event.findByIdAndUpdate(registration.event, {
      $inc: { currentRegistrations: -1 }
    });

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
      data: {
        registrationId: registration.registrationId,
        status: registration.status
      }
    });

  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling registration'
    });
  }
});

// @route   GET /api/registrations/event/:eventId
// @desc    Get event registrations (for organizers)
// @access  Private (Event organizer only)
router.get('/event/:eventId', [auth, authorize('organizer', 'admin')], [
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'attended', 'no-show']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { eventId } = req.params;
    const { status, page = 1, limit = 50, search } = req.query;

    // Check if event exists and user is the organizer
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.organizer.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view registrations for this event'
      });
    }

    // Build query
    let query = { event: eventId };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build aggregation pipeline for search
    let pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
  { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } }
    ];

    // Add search filter if provided
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'userInfo.name': { $regex: search, $options: 'i' } },
            { 'userInfo.email': { $regex: search, $options: 'i' } },
            { 'userInfo.college': { $regex: search, $options: 'i' } },
            { registrationId: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Add sorting and pagination
    pipeline.push(
      { $sort: { registrationDate: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    const [registrations, totalCount] = await Promise.all([
      Registration.aggregate(pipeline),
      Registration.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    // Get registration statistics
    const stats = await Registration.aggregate([
      { $match: { event: mongoose.Types.ObjectId(eventId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const registrationStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        registrations,
        stats: registrationStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRegistrations: totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event registrations'
    });
  }
});

// @route   PUT /api/registrations/:registrationId/check-in
// @desc    Check in user for event
// @access  Private (Event organizer only)
router.put('/:registrationId/check-in', [auth, authorize('organizer', 'admin')], [
  body('method').optional().isIn(['qr-scan', 'manual', 'self-checkin'])
], async (req, res) => {
  try {
    const { method = 'manual' } = req.body;

    const registration = await Registration.findOne({
      registrationId: req.params.registrationId
    }).populate('event', 'organizer');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if user is the event organizer
    if (registration.event.organizer.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to check in users for this event'
      });
    }

    if (registration.checkInInfo.checkedIn) {
      return res.status(400).json({
        success: false,
        message: 'User is already checked in',
        data: {
          checkInTime: registration.checkInInfo.checkInTime,
          method: registration.checkInInfo.checkInMethod
        }
      });
    }

    // Check in user
    await registration.checkIn(method);

    res.json({
      success: true,
      message: 'User checked in successfully',
      data: {
        registrationId: registration.registrationId,
        checkInTime: registration.checkInInfo.checkInTime,
        method: registration.checkInInfo.checkInMethod,
        status: registration.status
      }
    });

  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during check in'
    });
  }
});

// @route   POST /api/registrations/:registrationId/feedback
// @desc    Submit event feedback
// @access  Private
router.post('/:registrationId/feedback', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rating, comment } = req.body;

    const registration = await Registration.findOne({
      registrationId: req.params.registrationId,
      user: req.user.userId
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status !== 'attended') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for attended events'
      });
    }

    if (registration.feedback.rating) {
      return res.status(400).json({
        success: false,
        message: 'Feedback has already been submitted for this event'
      });
    }

    // Submit feedback
    await registration.submitFeedback(rating, comment);

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        rating: registration.feedback.rating,
        comment: registration.feedback.comment,
        submittedAt: registration.feedback.submittedAt
      }
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting feedback'
    });
  }
});

module.exports = router;