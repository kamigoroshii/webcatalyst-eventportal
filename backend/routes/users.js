const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (req.user.role === 'organizer') {
      // Organizer dashboard data
      const [
        totalEvents,
        publishedEvents,
        totalRegistrations,
        recentRegistrations,
        upcomingEvents,
        eventStats
      ] = await Promise.all([
        Event.countDocuments({ organizer: userId }),
        Event.countDocuments({ organizer: userId, status: 'published' }),
        Registration.countDocuments({
          event: { $in: await Event.find({ organizer: userId }).distinct('_id') }
        }),
        Registration.find({
          event: { $in: await Event.find({ organizer: userId }).distinct('_id') }
        })
        .populate('event', 'title')
        .populate('user', 'name email')
        .sort({ registrationDate: -1 })
        .limit(5),
        Event.find({
          organizer: userId,
          date: { $gte: new Date() },
          status: 'published'
        })
        .sort({ date: 1 })
        .limit(5)
        .select('title date location currentRegistrations maxRegistrations'),
        Event.aggregate([
          { $match: { organizer: new mongoose.Types.ObjectId(userId) } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const eventStatusStats = eventStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          role: 'organizer',
          stats: {
            totalEvents,
            publishedEvents,
            totalRegistrations,
            eventStatusStats
          },
          recentRegistrations,
          upcomingEvents
        }
      });

    } else {
      // Participant dashboard data
      const [
        totalRegistrations,
        upcomingEvents,
        pastEvents,
        recentRegistrations,
        registrationStats
      ] = await Promise.all([
        Registration.countDocuments({ user: userId }),
        Registration.find({
          user: userId,
          status: { $in: ['confirmed', 'pending'] }
        })
        .populate('event', 'title date location organizer')
        .sort({ 'event.date': 1 })
        .limit(5),
        Registration.find({
          user: userId,
          status: 'attended'
        })
        .populate('event', 'title date location')
        .sort({ 'event.date': -1 })
        .limit(5),
        Registration.find({ user: userId })
        .populate('event', 'title date')
        .sort({ registrationDate: -1 })
        .limit(5),
        Registration.aggregate([
          { $match: { user: new mongoose.Types.ObjectId(userId) } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const statusStats = registrationStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          role: 'participant',
          stats: {
            totalRegistrations,
            statusStats
          },
          upcomingEvents,
          pastEvents,
          recentRegistrations
        }
      });
    }

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('college').optional().trim().isLength({ max: 100 }),
  body('phone').optional().matches(/^\+?[\d\s\-\(\)]+$/),
  body('preferences.emailNotifications').optional().isBoolean(),
  body('preferences.smsNotifications').optional().isBoolean(),
  body('preferences.categories').optional().isArray()
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

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'college', 'phone', 'preferences'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'preferences') {
          updates[field] = { ...user.preferences, ...req.body[field] };
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (req.user.role === 'organizer') {
      // Organizer statistics
      const stats = await Promise.all([
        Event.countDocuments({ organizer: userId }),
        Event.countDocuments({ organizer: userId, status: 'published' }),
        Event.countDocuments({ organizer: userId, status: 'completed' }),
        Registration.countDocuments({
          event: { $in: await Event.find({ organizer: userId }).distinct('_id') }
        }),
        Event.aggregate([
          { $match: { organizer: new mongoose.Types.ObjectId(userId) } },
          { $group: { _id: null, totalViews: { $sum: '$analytics.views' } } }
        ])
      ]);

      const [totalEvents, publishedEvents, completedEvents, totalRegistrations, viewsData] = stats;
      const totalViews = viewsData.length > 0 ? viewsData[0].totalViews : 0;

      // Monthly event creation stats
      const monthlyStats = await Event.aggregate([
        { $match: { organizer: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]);

      res.json({
        success: true,
        data: {
          totalEvents,
          publishedEvents,
          completedEvents,
          totalRegistrations,
          totalViews,
          monthlyStats
        }
      });

    } else {
      // Participant statistics
      const stats = await Promise.all([
        Registration.countDocuments({ user: userId }),
        Registration.countDocuments({ user: userId, status: 'attended' }),
        Registration.countDocuments({ user: userId, status: 'confirmed' }),
        Registration.aggregate([
          { $match: { user: new mongoose.Types.ObjectId(userId) } },
          {
            $lookup: {
              from: 'events',
              localField: 'event',
              foreignField: '_id',
              as: 'eventDetails'
            }
          },
          { $unwind: '$eventDetails' },
          {
            $group: {
              _id: '$eventDetails.category',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const [totalRegistrations, attendedEvents, upcomingEvents, categoryStats] = stats;

      res.json({
        success: true,
        data: {
          totalRegistrations,
          attendedEvents,
          upcomingEvents,
          categoryStats
        }
      });
    }

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics'
    });
  }
});

// @route   GET /api/users (Admin only)
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/', [auth, authorize('admin')], [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['participant', 'organizer', 'admin']),
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

    const { page = 1, limit = 20, role, search } = req.query;

    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select('-password -verificationToken -resetPasswordToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @route   PUT /api/users/:id/role (Admin only)
// @desc    Update user role
// @access  Private (Admin only)
router.put('/:id/role', [auth, authorize('admin')], [
  body('role').isIn(['participant', 'organizer', 'admin']).withMessage('Invalid role')
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

    const { role } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user role'
    });
  }
});

module.exports = router;