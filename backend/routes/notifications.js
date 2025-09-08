const express = require('express');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications/organizer - Get notifications for organizer
router.get('/organizer', auth, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const notifications = await Notification.find({ organizer: req.user.userId })
      .populate('event', 'title date')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', auth, authorize('organizer', 'admin'), async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating notification' });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', auth, authorize('organizer', 'admin'), async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting notification' });
  }
});

module.exports = router;
