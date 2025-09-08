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
  Fade,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  AutoAwesome,
  Event,
  Help,
  Lightbulb,
  TipsAndUpdates,
  Psychology
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import aiService from '../services/aiService';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your EventEase AI Assistant. I can help you with event information, generate compelling event descriptions, provide recommendations, and assist with event planning. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState({ status: 'checking', message: 'Checking AI service...' });
  const [error, setError] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [pendingEventDetails, setPendingEventDetails] = useState(null);
  const [pendingEventQuestions, setPendingEventQuestions] = useState([]);
  const messagesEndRef = useRef(null);
  const { user, isOrganizer } = useAuth();

  const suggestedQuestions = aiService.getSuggestedQuestions(user?.role || 'user');

  const quickActions = [
    {
      title: 'Generate Event Description',
      description: 'Create compelling descriptions for your events',
      icon: <AutoAwesome />,
      action: () => setInputMessage('Help me generate an event description'),
      available: isOrganizer
    },
    {
      title: 'Find Events',
      description: 'Discover events that match your interests',
      icon: <Event />,
      action: () => setInputMessage('Show me upcoming events that might interest me')
    },
    {
      title: 'Event Planning Tips',
      description: 'Get advice on organizing successful events',
      icon: <Lightbulb />,
      action: () => setInputMessage('Give me tips for planning a successful event'),
      available: isOrganizer
    },
    {
      title: 'Registration Help',
      description: 'Learn how to register for events',
      icon: <Help />,
      action: () => setInputMessage('How do I register for an event?')
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const status = await aiService.getStatus();
      setAiStatus(status);
    } catch (error) {
      setAiStatus({ 
        status: 'error', 
        message: 'Failed to connect to AI service' 
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      // If we are collecting event details, handle that flow
      if (pendingEventQuestions.length > 0) {
        // Add user's answer to pendingEventDetails
        const nextDetailKey = pendingEventQuestions[0].key;
        const updatedDetails = { ...pendingEventDetails, [nextDetailKey]: inputMessage };
        const remainingQuestions = pendingEventQuestions.slice(1);
        setPendingEventDetails(updatedDetails);
        setPendingEventQuestions(remainingQuestions);
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'user',
          content: inputMessage,
          timestamp: new Date()
        }]);
        setInputMessage('');
        // If more questions remain, ask next
        if (remainingQuestions.length > 0) {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'ai',
            content: remainingQuestions[0].question,
            timestamp: new Date()
          }]);
        } else {
          // All details collected, create event
          setIsTyping(true);
          const eventResult = await aiService.createEvent(updatedDetails);
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: Date.now() + 2,
            type: 'ai',
            content: eventResult.success && eventResult.event
              ? `✅ Your event "${eventResult.event.title || eventResult.event.name}" has been created!`
              : '❌ Sorry, I could not create the event.',
            timestamp: new Date()
          }]);
          setPendingEventDetails(null);
          setPendingEventQuestions([]);
        }
        return;
      }

      // Normal AI flow
      const conversationHistory = aiService.formatConversationHistory(
        currentMessages.slice(-10)
      );
      const response = await aiService.sendMessage(inputMessage, conversationHistory);
      console.log('AI API response:', response);
      let aiContent = response && response.success && typeof response.response === 'string'
        ? response.response
        : 'Sorry, I did not receive a valid response.';

      // If AI detects create_event intent, start collecting details if missing
      if (response.intent === 'create_event') {
        const requiredFields = [
          { key: 'title', question: 'What is the title of your event?' },
          { key: 'date', question: 'When will your event take place? (Please provide date and time)' },
          { key: 'location', question: 'Where will your event be held?' },
          { key: 'category', question: 'What is the category of your event?' },
          { key: 'description', question: 'Please provide a brief description of your event.' }
        ];
        const missingFields = requiredFields.filter(f => !response.eventDetails || !response.eventDetails[f.key]);
        if (missingFields.length > 0) {
          setPendingEventDetails(response.eventDetails || {});
          setPendingEventQuestions(missingFields);
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'ai',
            content: missingFields[0].question,
            timestamp: new Date()
          }]);
          setInputMessage('');
          return;
        } else if (response.eventDetails) {
          // All details present, create event
          setIsTyping(true);
          const eventResult = await aiService.createEvent(response.eventDetails);
          setIsTyping(false);
          aiContent += eventResult.success && eventResult.event
            ? `\n\n✅ Your event "${eventResult.event.title || eventResult.event.name}" has been created!`
            : '\n\n❌ Sorry, I could not create the event.';
        }
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      setError(error.message);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment, or contact support if the issue persists.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    action();
    setShowQuickActions(false);
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
  <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', color: 'text.primary' }}>
      {/* Header */}
      <Box
        sx={{
          background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #23272a 0%, #2c2f33 100%)' : 'linear-gradient(135deg, #6F714B 0%, #8a8c6b 100%)',
          color: 'text.primary',
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
              <Psychology sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h3" component="h1">
                EaseBot
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Get intelligent help with events, descriptions, and planning
            </Typography>
          
          </motion.div>
        </Container>
      </Box>

  <Container maxWidth={false} disableGutters sx={{ p: 0, m: 0, width: '100vw', height: '100vh' }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        

        {/* Chat Container */}
        <Paper
          elevation={3}
          sx={{
            height: 'calc(100vh - 120px)',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            boxShadow: 'none',
            overflow: 'hidden',
            width: '100vw',
            position: 'relative',
            m: 0,
            p: 0,
            backgroundColor: 'background.paper',
            color: 'text.primary'
          }}
        >
          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: 'auto',
              backgroundColor: 'background.default',
              color: 'text.primary'
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
                          backgroundColor: message.type === 'user'
                            ? (theme) => theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main'
                            : 'background.paper',
                          color: message.type === 'user'
                            ? (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'white'
                            : 'text.primary',
                          borderRadius: 2,
                          borderTopLeftRadius: message.type === 'user' ? 2 : 0.5,
                          borderTopRightRadius: message.type === 'user' ? 0.5 : 2,
                          boxShadow: 0
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
                          dangerouslySetInnerHTML={{
                            __html: aiService.formatResponse(message.content)
                          }}
                        />
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
                {suggestedQuestions.slice(0, 4).map((question, index) => (
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
              backgroundColor: 'background.paper',
              color: 'text.primary'
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
                disabled={!inputMessage.trim() || isTyping || aiStatus?.status !== 'active'}
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
                {isTyping ? <CircularProgress size={20} color="inherit" /> : <Send />}
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Features Info */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom textAlign="center">

          </Typography>
          <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} sx={{ color: 'text.primary' }}>
            <Chip icon={<Event />} label="Event Discovery" variant="outlined" />
            <Chip icon={<Help />} label="Smart Assistance" variant="outlined" />
            <Chip icon={<AutoAwesome />} label="Content Generation" variant="outlined" />
            <Chip icon={<TipsAndUpdates />} label="Planning Advice" variant="outlined" />
            {isOrganizer && (
              <Chip icon={<Psychology />} label="Organizer AI Tools" variant="outlined" />
            )}
          </Box>
          
          {aiStatus?.status !== 'active' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                {aiStatus?.message || 'AI service status unknown'} - Some AI features may be limited.
              </Typography>
            </Alert>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default AIAssistantPage;