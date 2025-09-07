const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Event = require('../models/Event');

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Event.deleteMany({});
    // console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@eventease.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'EventEase Admin',
        email: 'admin@eventease.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      await admin.save();
      console.log('👤 Created admin user: admin@eventease.com / admin123');
    }

    // Create sample organizer
    const organizerExists = await User.findOne({ email: 'organizer@eventease.com' });
    if (!organizerExists) {
      const organizer = new User({
        name: 'Sample Organizer',
        email: 'organizer@eventease.com',
        password: 'organizer123',
        role: 'organizer',
        college: 'EventEase University',
        phone: '+1 (555) 123-4567',
        isVerified: true
      });
      await organizer.save();
      console.log('👤 Created organizer user: organizer@eventease.com / organizer123');

      // Create sample events for the organizer
      const sampleEvents = [
        {
          title: 'Tech Innovation Summit 2024',
          description: 'Join industry leaders for cutting-edge tech discussions and networking. This summit brings together innovators, entrepreneurs, and tech enthusiasts to explore the latest trends in technology, artificial intelligence, and digital transformation.',
          category: 'Technology',
          eventType: 'Conference',
          organizer: organizer._id,
          organizerInfo: {
            name: organizer.name,
            email: organizer.email,
            phone: organizer.phone
          },
          date: new Date('2024-06-15'),
          startTime: '09:00',
          endTime: '18:00',
          location: {
            venue: 'Silicon Valley Convention Center',
            address: '123 Tech Street, Silicon Valley, CA 94000'
          },
          maxRegistrations: 300,
          registrationDeadline: new Date('2024-06-10'),
          status: 'published',
          schedule: [
            { time: '09:00', activity: 'Registration & Welcome Coffee' },
            { time: '10:00', activity: 'Keynote: Future of AI' },
            { time: '11:30', activity: 'Panel: Startup Ecosystem' },
            { time: '13:00', activity: 'Lunch & Networking' },
            { time: '14:30', activity: 'Workshop: Cloud Technologies' },
            { time: '16:00', activity: 'Investor Pitch Session' },
            { time: '17:30', activity: 'Closing Remarks' }
          ],
          rules: [
            'Please arrive 30 minutes before the event starts',
            'Bring a valid ID for registration',
            'Photography is allowed during sessions',
            'Networking is encouraged during breaks',
            'Food and beverages will be provided'
          ],
          tags: ['technology', 'ai', 'innovation', 'networking'],
          price: { amount: 0, isFree: true }
        },
        {
          title: 'Digital Marketing Masterclass',
          description: 'Learn advanced digital marketing strategies from industry experts. This comprehensive workshop covers SEO, social media marketing, content strategy, and analytics.',
          category: 'Marketing',
          eventType: 'Workshop',
          organizer: organizer._id,
          organizerInfo: {
            name: organizer.name,
            email: organizer.email,
            phone: organizer.phone
          },
          date: new Date('2024-07-20'),
          startTime: '10:00',
          endTime: '16:00',
          location: {
            venue: 'Downtown Business Center',
            address: '456 Business Ave, Downtown, CA 90210'
          },
          maxRegistrations: 150,
          registrationDeadline: new Date('2024-07-15'),
          status: 'published',
          tags: ['marketing', 'digital', 'seo', 'social-media'],
          price: { amount: 99, currency: 'USD', isFree: false }
        }
      ];

      await Event.insertMany(sampleEvents);
      console.log('📅 Created sample events');
    }

    // Create sample participant
    const participantExists = await User.findOne({ email: 'user@eventease.com' });
    if (!participantExists) {
      const participant = new User({
        name: 'Sample User',
        email: 'user@eventease.com',
        password: 'user123',
        role: 'participant',
        college: 'Sample University',
        phone: '+1 (555) 987-6543',
        isVerified: true
      });
      await participant.save();
      console.log('👤 Created participant user: user@eventease.com / user123');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@eventease.com / admin123');
    console.log('Organizer: organizer@eventease.com / organizer123');
    console.log('Participant: user@eventease.com / user123');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

setupDatabase();