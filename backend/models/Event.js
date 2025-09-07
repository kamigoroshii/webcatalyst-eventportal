const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Business', 'Marketing', 'Design', 'Finance', 'Education', 'Health', 'Entertainment', 'Sports', 'Other']
  },
  eventType: {
    type: String,
    enum: ['Conference', 'Workshop', 'Seminar', 'Meetup', 'Webinar', 'Competition', 'Networking Event', 'Training Session', 'Panel Discussion', 'Hackathon'],
    default: 'Conference'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  },
  location: {
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      maxlength: [100, 'Venue name cannot be more than 100 characters']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      maxlength: [200, 'Address cannot be more than 200 characters']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  maxRegistrations: {
    type: Number,
    required: [true, 'Maximum registrations is required'],
    min: [1, 'Maximum registrations must be at least 1']
  },
  currentRegistrations: {
    type: Number,
    default: 0
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Registration deadline is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  schedule: [{
    time: {
      type: String,
      required: true
    },
    activity: {
      type: String,
      required: true,
      maxlength: [200, 'Activity description cannot be more than 200 characters']
    },
    speaker: String,
    duration: Number // in minutes
  }],
  rules: [{
    type: String,
    maxlength: [300, 'Rule cannot be more than 300 characters']
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  price: {
    amount: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    isFree: {
      type: Boolean,
      default: true
    }
  },
  requirements: [{
    type: String,
    maxlength: [200, 'Requirement cannot be more than 200 characters']
  }],
  benefits: [{
    type: String,
    maxlength: [200, 'Benefit cannot be more than 200 characters']
  }],
  socialLinks: {
    website: String,
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ organizer: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ 'location.venue': 'text', title: 'text', description: 'text' });

// Virtual for registration availability
eventSchema.virtual('availableSpots').get(function() {
  return this.maxRegistrations - this.currentRegistrations;
});

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function() {
  const now = new Date();
  if (now > this.registrationDeadline) {
    return 'closed';
  }
  if (this.currentRegistrations >= this.maxRegistrations) {
    return 'full';
  }
  return 'open';
});

// Virtual for event status based on date
eventSchema.virtual('eventStatus').get(function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  
  if (this.status === 'cancelled') return 'cancelled';
  if (now < eventDate) return 'upcoming';
  if (now.toDateString() === eventDate.toDateString()) return 'ongoing';
  return 'completed';
});

// Middleware to update event status based on date
eventSchema.pre('find', function() {
  this.populate('organizer', 'name email');
});

eventSchema.pre('findOne', function() {
  this.populate('organizer', 'name email');
});

// Method to increment view count
eventSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  return this.save();
};

// Method to check if user can register
eventSchema.methods.canRegister = function() {
  const now = new Date();
  return (
    this.status === 'published' &&
    now <= this.registrationDeadline &&
    this.currentRegistrations < this.maxRegistrations
  );
};

// Static method to get events by category
eventSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category, 
    status: 'published',
    isPublic: true 
  }).sort({ date: 1 });
};

// Static method to get upcoming events
eventSchema.statics.getUpcoming = function(limit = 10) {
  const now = new Date();
  return this.find({ 
    date: { $gte: now },
    status: 'published',
    isPublic: true 
  })
  .sort({ date: 1 })
  .limit(limit);
};

module.exports = mongoose.model('Event', eventSchema);