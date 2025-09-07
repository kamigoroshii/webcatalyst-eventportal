const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const geminiService = require('../services/geminiService');
const Event = require('../models/Event');
const rateLimit = require('express-rate-limit');

// Rate limiting for AI requests
const aiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // limit each IP to 30 requests per windowMs
    message: 'Too many AI requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// @route   POST /api/ai/chat
// @desc    Send message to AI assistant
// @access  Private
router.post('/chat',
    aiRateLimit,
    auth,
    body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
    body('conversationHistory').optional().isArray().withMessage('Conversation history must be an array'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { message, conversationHistory = [] } = req.body;
            const user = req.user;

            // Get user's events if they're an organizer
            let userEvents = [];
            if (user.role === 'organizer') {
                userEvents = await Event.find({ organizer: user.id })
                    .select('title category description date')
                    .limit(10);
            }

            // Get recent events for context
            const recentEvents = await Event.find({ date: { $gte: new Date() } })
                .select('title category description date')
                .sort({ date: 1 })
                .limit(5);

            const context = {
                userRole: user.role,
                userEvents: userEvents.concat(recentEvents),
                conversationHistory: conversationHistory.slice(-6) // Keep last 6 messages for context
            };

            const aiResponse = await geminiService.generateResponse(message, context);

            res.json({
                success: true,
                response: aiResponse,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('AI chat error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get AI response',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// @route   POST /api/ai/generate-description
// @desc    Generate event description using AI
// @access  Private (Organizers only)
router.post('/generate-description',
    aiRateLimit,
    auth,
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
    body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
    body('type').optional().trim(),
    body('audience').optional().trim(),
    body('duration').optional().trim(),
    body('features').optional().trim(),
    body('notes').optional().trim(),
    async (req, res) => {
        try {
            // Check if user is organizer
            if (req.user.role !== 'organizer') {
                return res.status(403).json({
                    success: false,
                    message: 'Only organizers can generate event descriptions'
                });
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const eventDetails = req.body;
            const description = await geminiService.generateEventDescription(eventDetails);

            res.json({
                success: true,
                description,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Description generation error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate event description',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// @route   POST /api/ai/recommendations
// @desc    Get personalized event recommendations
// @access  Private
router.post('/recommendations',
    aiRateLimit,
    auth,
    body('preferences').isObject().withMessage('Preferences must be an object'),
    body('preferences.categories').optional().isArray(),
    body('preferences.interests').optional().isString(),
    body('preferences.location').optional().isString(),
    body('preferences.dateRange').optional().isObject(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { preferences } = req.body;

            // Get available events based on preferences
            let eventQuery = { date: { $gte: new Date() } };

            if (preferences.categories && preferences.categories.length > 0) {
                eventQuery.category = { $in: preferences.categories };
            }

            if (preferences.location) {
                eventQuery.location = new RegExp(preferences.location, 'i');
            }

            if (preferences.dateRange) {
                if (preferences.dateRange.start) {
                    eventQuery.date.$gte = new Date(preferences.dateRange.start);
                }
                if (preferences.dateRange.end) {
                    eventQuery.date.$lte = new Date(preferences.dateRange.end);
                }
            }

            const availableEvents = await Event.find(eventQuery)
                .select('title category description date location')
                .sort({ date: 1 })
                .limit(20);

            if (availableEvents.length === 0) {
                return res.json({
                    success: true,
                    recommendations: 'No events found matching your preferences. Try adjusting your criteria or check back later for new events!',
                    eventCount: 0
                });
            }

            const recommendations = await geminiService.getEventRecommendations(preferences, availableEvents);

            res.json({
                success: true,
                recommendations,
                eventCount: availableEvents.length,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Recommendations error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate recommendations',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// @route   POST /api/ai/planning-advice
// @desc    Get event planning advice
// @access  Private (Organizers only)
router.post('/planning-advice',
    aiRateLimit,
    auth,
    body('eventType').trim().isLength({ min: 1 }).withMessage('Event type is required'),
    body('requirements').trim().isLength({ min: 1, max: 1000 }).withMessage('Requirements must be between 1 and 1000 characters'),
    async (req, res) => {
        try {
            // Check if user is organizer
            if (req.user.role !== 'organizer') {
                return res.status(403).json({
                    success: false,
                    message: 'Only organizers can access planning advice'
                });
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { eventType, requirements } = req.body;
            const advice = await geminiService.generateEventPlanningAdvice(eventType, requirements);

            res.json({
                success: true,
                advice,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Planning advice error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate planning advice',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
);

// @route   GET /api/ai/status
// @desc    Check AI service status
// @access  Private
router.get('/status', auth, async (req, res) => {
    try {
        const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';

        let connectionTest = null;
        if (hasApiKey) {
            try {
                connectionTest = await geminiService.testConnection();
            } catch (error) {
                console.error('Connection test failed:', error);
                connectionTest = `Connection failed: ${error.message}`;
            }
        }

        res.json({
            success: true,
            status: hasApiKey ? 'active' : 'inactive',
            message: hasApiKey ? 'AI service is ready' : 'AI service requires API key configuration',
            connectionTest,
            features: {
                chat: hasApiKey,
                descriptionGeneration: hasApiKey,
                recommendations: hasApiKey,
                planningAdvice: hasApiKey
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to check AI status'
        });
    }
});

module.exports = router;