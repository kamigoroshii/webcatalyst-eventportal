import api from './api';

class AIService {
  // Create event API call
  async createEvent(eventDetails) {
    try {
      const response = await api.post('/events', eventDetails);
      return response;
    } catch (error) {
      console.error('Event creation error:', error);
      return { success: false, message: error.message || 'Failed to create event' };
    }
  }
  // Send message to AI assistant
  async sendMessage(message, conversationHistory = []) {
      try {
        const response = await api.post('/ai/chat', {
          message,
          conversationHistory
        });
        return response;
      } catch (error) {
        console.error('AI chat error:', error);
        throw new Error(
          (error.response && error.response.data && error.response.data.message)
            ? error.response.data.message
            : error.message || 'Failed to get AI response'
        );
      }
  }

  // Generate event description
  async generateEventDescription(eventDetails) {
      try {
        const response = await api.post('/ai/generate-description', eventDetails);
        return response;
      } catch (error) {
        console.error('Description generation error:', error);
        throw new Error(
          (error.response && error.response.data && error.response.data.message)
            ? error.response.data.message
            : error.message || 'Failed to generate event description'
        );
      }
  }

  // Get event recommendations
  async getEventRecommendations(preferences) {
      try {
        const response = await api.post('/ai/recommendations', { preferences });
        return response;
      } catch (error) {
        console.error('Recommendations error:', error);
        throw new Error(
          (error.response && error.response.data && error.response.data.message)
            ? error.response.data.message
            : error.message || 'Failed to get recommendations'
        );
      }
  }

  // Get event planning advice
  async getEventPlanningAdvice(eventType, requirements) {
      try {
        const response = await api.post('/ai/planning-advice', {
          eventType,
          requirements
        });
        return response;
      } catch (error) {
        console.error('Planning advice error:', error);
        throw new Error(
          (error.response && error.response.data && error.response.data.message)
            ? error.response.data.message
            : error.message || 'Failed to get planning advice'
        );
      }
  }

  // Check AI service status
  async getStatus() {
    try {
      const response = await api.get('/ai/status');
      return response;
    } catch (error) {
      console.error('AI status error:', error);
      return { success: false, status: 'error', message: 'Failed to check AI status' };
    }
  }

  // Helper method to format conversation history
  formatConversationHistory(messages) {
    return messages.map(msg => ({
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp
    }));
  }

  // Helper method to detect intent from user message
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('generate') && (lowerMessage.includes('description') || lowerMessage.includes('event'))) {
      return 'generate_description';
    }
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('find event')) {
      return 'recommendations';
    }
    
    if (lowerMessage.includes('plan') && lowerMessage.includes('event')) {
      return 'planning_advice';
    }
    
    if (lowerMessage.includes('register') || lowerMessage.includes('registration')) {
      return 'registration_help';
    }
    
    if (lowerMessage.includes('navigate') || lowerMessage.includes('how to')) {
      return 'navigation_help';
    }
    
    return 'general_chat';
  }

  // Get suggested questions based on user role
  getSuggestedQuestions(userRole) {
    const commonQuestions = [
      'What events are happening this week?',
      'How do I register for an event?',
      'Show me tech events near me',
      'What are the most popular events?'
    ];

    const organizerQuestions = [
      'Generate a description for my workshop',
      'Help me plan a conference',
      'What makes a successful event?',
      'How do I promote my event effectively?',
      'Give me event planning tips'
    ];

    return userRole === 'organizer' 
      ? [...commonQuestions, ...organizerQuestions]
      : commonQuestions;
  }

  // Format AI response for better display
  formatResponse(response) {
    // Convert markdown-style formatting to HTML-friendly format
    let formatted = response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
      .replace(/\n\n/g, '\n') // Reduce double line breaks
      .replace(/\n- /g, '\n• ') // Convert dashes to bullets
      .replace(/\n(\d+)\. /g, '\n$1. '); // Ensure numbered lists

    return formatted;
  }
}

const aiService = new AIService();
export default aiService;