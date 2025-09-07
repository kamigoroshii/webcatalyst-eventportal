const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      throw new Error('GEMINI_API_KEY is required');
    }
    
    console.log('Initializing Gemini AI with API key:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use the updated model name
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // System prompt for event management context
  getSystemPrompt(userRole, userEvents = []) {
    const basePrompt = `You are EventEase AI Assistant, a specialized AI helper for an event management platform. Your role is to assist users with:

1. **Event Discovery & Information**: Help users find events, get details, understand schedules
2. **Event Creation & Management**: Assist organizers with creating compelling event descriptions, managing events
3. **Registration Assistance**: Guide users through registration processes
4. **Platform Navigation**: Help users navigate the EventEase platform
5. **Event Recommendations**: Suggest relevant events based on user interests

**User Context:**
- User Role: ${userRole}
- Platform: EventEase Event Management System

**Your Personality:**
- Friendly, helpful, and professional
- Knowledgeable about events and event management
- Concise but informative responses
- Proactive in offering relevant suggestions

**Guidelines:**
- Always stay focused on event-related topics
- Provide actionable advice and clear instructions
- Use formatting (bullet points, numbered lists) for clarity
- If asked about non-event topics, politely redirect to event-related assistance
- For event descriptions, be creative and engaging while maintaining professionalism

**Available Event Data:**
${userEvents.length > 0 ? `Current events in system: ${userEvents.map(e => `- ${e.title} (${e.category})`).join('\n')}` : 'No specific events loaded in current context.'}

Remember: You're here to make event management and discovery easier and more enjoyable!`;

    return basePrompt;
  }

  // Generate event description
  async generateEventDescription(eventDetails) {
    const prompt = `Create a compelling and professional event description for the following event:

**Event Details:**
- Title: ${eventDetails.title}
- Category: ${eventDetails.category}
- Type: ${eventDetails.type || 'Not specified'}
- Target Audience: ${eventDetails.audience || 'General audience'}
- Duration: ${eventDetails.duration || 'Not specified'}
- Key Features: ${eventDetails.features || 'Not specified'}
- Special Notes: ${eventDetails.notes || 'None'}

**Requirements:**
- Create an engaging, professional description (150-300 words)
- Include key benefits for attendees
- Use compelling language that encourages registration
- Structure with clear sections if needed
- Make it suitable for the EventEase platform

Generate only the event description, no additional commentary.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating event description:', error);
      throw new Error('Failed to generate event description');
    }
  }

  // Main chat function
  async generateResponse(message, context = {}) {
    const { userRole = 'user', userEvents = [], conversationHistory = [] } = context;
    
    console.log('Generating AI response for message:', message.substring(0, 50) + '...');
    
    // Build conversation context
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n**Recent Conversation:**\n' + 
        conversationHistory.slice(-4).map(msg => 
          `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n') + '\n';
    }

    const fullPrompt = `${this.getSystemPrompt(userRole, userEvents)}${conversationContext}

**Current User Message:** ${message}

**Instructions:**
- Respond helpfully and professionally
- If the user is asking about event creation/description generation, offer to help with specific details
- If asking about events, provide relevant information or ask for clarification
- If asking about registration, provide step-by-step guidance
- Keep responses concise but informative (aim for 100-200 words unless more detail is specifically requested)
- Use markdown formatting for better readability

Respond as the EventEase AI Assistant:`;

    try {
      console.log('Sending request to Gemini API...');
      const result = await this.model.generateContent(fullPrompt);
      console.log('Received response from Gemini API');
      
      const response = result.response;
      const text = response.text();
      console.log('Generated response length:', text.length);
      
      return text;
    } catch (error) {
      console.error('Detailed error generating AI response:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check for specific API errors
      if (error.message.includes('API_KEY')) {
        throw new Error('Invalid API key. Please check your Gemini API key configuration.');
      } else if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
      } else if (error.message.includes('blocked')) {
        throw new Error('Content was blocked by safety filters. Please try rephrasing your message.');
      }
      
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  }

  // Get event recommendations
  async getEventRecommendations(userPreferences, availableEvents) {
    const prompt = `Based on the user preferences and available events, recommend the most suitable events:

**User Preferences:**
${Object.entries(userPreferences).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

**Available Events:**
${availableEvents.map(event => 
  `- ${event.title} (${event.category}) - ${event.date} - ${event.description?.substring(0, 100)}...`
).join('\n')}

Provide 3-5 event recommendations with brief explanations of why each event matches the user's interests. Format as a numbered list with event titles and reasons.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate event recommendations');
    }
  }

  // Help with event planning
  async generateEventPlanningAdvice(eventType, requirements) {
    const prompt = `Provide comprehensive event planning advice for the following:

**Event Type:** ${eventType}
**Requirements/Context:** ${requirements}

**Provide advice on:**
1. Key planning considerations
2. Timeline suggestions
3. Essential elements to include
4. Common pitfalls to avoid
5. Success tips

Keep the advice practical and actionable for event organizers using the EventEase platform.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating planning advice:', error);
      throw new Error('Failed to generate event planning advice');
    }
  }

  // Test function to verify API key works
  async testConnection() {
    try {
      console.log('Testing Gemini API connection...');
      const result = await this.model.generateContent('Hello, please respond with "API connection successful"');
      const response = result.response;
      const text = response.text();
      console.log('Test response:', text);
      return text;
    } catch (error) {
      console.error('API connection test failed:', error);
      throw error;
    }
  }
}

module.exports = new GeminiService();