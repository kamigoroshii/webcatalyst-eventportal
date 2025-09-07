import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  Chip,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  AutoAwesome,
  Event,
  Help
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your EventEase AI Assistant. I can help you with event information, generate event descriptions, or answer any questions about our platform. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, isOrganizer } = useAuth();

  const suggestedQuestions = [
    'What events are happening this week?',
    'How do I register for an event?',
    'Generate a description for a tech meetup',
    'What are the upcoming AI conferences?',
    'Help me create an event description'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('event') && lowerInput.includes('this week')) {
      return 'Here are the upcoming events this week:\n\n1. **Tech Innovation Summit** - March 15, 2024\n2. **Digital Marketing Masterclass** - March 20, 2024\n3. **Startup Pitch Competition** - March 25, 2024\n\nWould you like more details about any of these events?';
    }
    
    if (lowerInput.includes('register')) {
      return 'To register for an event:\n\n1. Browse events on the homepage\n2. Click on an event card to view details\n3. Click the "Register Now" button\n4. Fill out the registration form\n5. You\'ll receive a confirmation with a QR code\n\nMake sure you\'re signed in to register for events!';
    }
    
    if (lowerInput.includes('generate') && lowerInput.includes('description')) {
      return 'I\'d be happy to help generate an event description! Please provide me with:\n\n• Event type (conference, workshop, meetup, etc.)\n• Topic or theme\n• Target audience\n• Duration\n• Key highlights or speakers\n\nWith this information, I can create a compelling event description for you.';
    }
    
    if (lowerInput.includes('ai conference')) {
      return 'Here are some upcoming AI-related events:\n\n1. **AI & Machine Learning Workshop** - April 1, 2024\n   Location: Tech Campus Auditorium\n   Focus: Hands-on ML techniques\n\n2. **Future of AI Summit** - Coming Soon\n   Stay tuned for more AI conferences!\n\nWould you like to be notified when new AI events are added?';
    }
    
    if (lowerInput.includes('create') && lowerInput.includes('event')) {
      if (isOrganizer) {
        return 'As an organizer, you can create events through your dashboard:\n\n1. Go to Dashboard → Add Event\n2. Fill in event details\n3. Use the AI Description Generator for compelling descriptions\n4. Set registration limits and requirements\n5. Publish your event\n\nWould you like me to help you brainstorm ideas for your event?';
      } else {
        return 'Event creation is available for organizers. If you\'d like to become an event organizer, please contact our support team. I can help you find existing events that match your interests instead!';
      }
    }
    
    // Default response
    return 'I understand you\'re asking about "' + input + '". I can help you with:\n\n• Finding and browsing events\n• Registration assistance\n• Event information and details\n• Generating event descriptions (for organizers)\n• Platform navigation\n\nCould you please be more specific about what you\'d like to know?';
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6F714B 0%, #8a8c6b 100%)',
          color: 'white',
          py: 4,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <SmartToy sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h3" component="h1">
                AI Assistant
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Get instant help with events, registrations, and more
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Chat Container */}
        <Paper
          elevation={3}
          sx={{
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: 'auto',
              backgroundColor: 'background.default'
            }}
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    display="flex"
                    justifyContent={message.type === 'user' ? 'flex-end' : 'flex-start'}
                    mb={2}
                  >
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      maxWidth="80%"
                      flexDirection={message.type === 'user' ? 'row-reverse' : 'row'}
                    >
                      <Avatar
                        sx={{
                          bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main',
                          color: message.type === 'user' ? 'white' : 'primary.main',
                          mx: 1
                        }}
                      >
                        {message.type === 'user' ? <Person /> : <SmartToy />}
                      </Avatar>
                      
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          backgroundColor: message.type === 'user' ? 'primary.main' : 'background.paper',
                          color: message.type === 'user' ? 'white' : 'text.primary',
                          borderRadius: 2,
                          borderTopLeftRadius: message.type === 'user' ? 2 : 0.5,
                          borderTopRightRadius: message.type === 'user' ? 0.5 : 2
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: 'pre-line',
                            '& strong': {
                              fontWeight: 600
                            }
                          }}
                        >
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.7,
                            display: 'block',
                            mt: 1,
                            fontSize: '0.75rem'
                          }}
                        >
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main', mr: 1 }}>
                      <SmartToy />
                    </Avatar>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                      <Box display="flex" alignItems="center">
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          AI is typing...
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </Box>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Try asking:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {suggestedQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    variant="outlined"
                    size="small"
                    onClick={() => handleSuggestedQuestion(question)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper'
            }}
          >
            <Box display="flex" alignItems="flex-end" gap={1}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask me anything about events..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'action.disabled'
                  }
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Features Info */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom textAlign="center">
            What I can help you with:
          </Typography>
          <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
            <Chip icon={<Event />} label="Event Information" variant="outlined" />
            <Chip icon={<Help />} label="Registration Help" variant="outlined" />
            <Chip icon={<AutoAwesome />} label="Event Descriptions" variant="outlined" />
            {isOrganizer && (
              <Chip icon={<SmartToy />} label="Organizer Tools" variant="outlined" />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AIAssistantPage;