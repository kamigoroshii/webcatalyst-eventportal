const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  description: { type: String },
  category: { type: String },
  eventType: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organizerInfo: {
    name: { type: String },
    email: { type: String },
    phone: String
  },
  date: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  location: {
    venue: { type: String },
    address: { type: String },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  maxRegistrations: { type: Number },
  currentRegistrations: { type: Number, default: 0 },
  registrationDeadline: { type: Date },
  status: { type: String, default: 'draft' },
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
  return (this.status === 'published' || this.status === 'draft') && 
         this.currentRegistrations < this.maxRegistrations &&
         new Date() < new Date(this.registrationDeadline);
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