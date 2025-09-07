const mongoose = require('mongoose');
const QRCode = require('qrcode');

const registrationSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    college: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'attended', 'no-show'],
    default: 'confirmed'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  qrCode: {
    type: String, // Base64 encoded QR code
    required: true
  },
  qrCodeData: {
    type: String, // Data encoded in QR code
    required: true
  },
  paymentInfo: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: String,
    transactionId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed'
    },
    paymentDate: Date
  },
  checkInInfo: {
    checkedIn: {
      type: Boolean,
      default: false
    },
    checkInTime: Date,
    checkInMethod: {
      type: String,
      enum: ['qr-scan', 'manual', 'self-checkin']
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Feedback comment cannot be more than 500 characters']
    },
    submittedAt: Date
  },
  specialRequirements: {
    dietary: String,
    accessibility: String,
    other: String
  },
  communicationPreferences: {
    emailReminders: {
      type: Boolean,
      default: true
    },
    smsReminders: {
      type: Boolean,
      default: false
    }
  },
  referralSource: {
    type: String,
    enum: ['website', 'social-media', 'email', 'friend', 'search-engine', 'other']
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
registrationSchema.index({ user: 1, event: 1 }, { unique: true }); // Prevent duplicate registrations
registrationSchema.index({ event: 1 });
registrationSchema.index({ user: 1 });
registrationSchema.index({ registrationId: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ registrationDate: 1 });

// Generate unique registration ID
registrationSchema.pre('save', async function(next) {
  if (!this.registrationId) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    this.registrationId = `REG-${timestamp}-${randomStr}`.toUpperCase();
  }
  next();
});

// Generate QR code before saving
registrationSchema.pre('save', async function(next) {
  if (!this.qrCode) {
    try {
      // Create QR code data
      const qrData = {
        registrationId: this.registrationId,
        eventId: this.event,
        userId: this.user,
        timestamp: Date.now()
      };
      
      this.qrCodeData = JSON.stringify(qrData);
      
      // Generate QR code as base64 string
      this.qrCode = await QRCode.toDataURL(this.qrCodeData, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#6F714B',
          light: '#FFFFFF'
        }
      });
      
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Virtual for days until event
registrationSchema.virtual('daysUntilEvent').get(function() {
  if (!this.event || !this.event.date) return null;
  
  const eventDate = new Date(this.event.date);
  const today = new Date();
  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Method to check in user
registrationSchema.methods.checkIn = function(method = 'qr-scan') {
  this.checkInInfo.checkedIn = true;
  this.checkInInfo.checkInTime = new Date();
  this.checkInInfo.checkInMethod = method;
  
  if (this.status === 'confirmed') {
    this.status = 'attended';
  }
  
  return this.save();
};

// Method to cancel registration
registrationSchema.methods.cancel = function(reason) {
  this.status = 'cancelled';
  this.metadata.cancellationReason = reason;
  this.metadata.cancellationDate = new Date();
  return this.save();
};

// Method to submit feedback
registrationSchema.methods.submitFeedback = function(rating, comment) {
  this.feedback.rating = rating;
  this.feedback.comment = comment;
  this.feedback.submittedAt = new Date();
  return this.save();
};

// Static method to get registrations by event
registrationSchema.statics.getByEvent = function(eventId, status = null) {
  const query = { event: eventId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('user', 'name email college phone')
    .populate('event', 'title date location')
    .sort({ registrationDate: -1 });
};

// Static method to get user's registrations
registrationSchema.statics.getByUser = function(userId, status = null) {
  const query = { user: userId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('event', 'title date location organizer status')
    .sort({ registrationDate: -1 });
};

// Static method to get registration statistics
registrationSchema.statics.getStats = function(eventId) {
  return this.aggregate([
    { $match: { event: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Registration', registrationSchema);