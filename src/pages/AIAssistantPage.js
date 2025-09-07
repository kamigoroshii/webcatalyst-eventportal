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
      content: 'Hello! I\'m your EventEase AI Assistant powered by Google Gemini. I can help you with event information, generate compelling event descriptions, provide recommendations, and assist with event planning. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState({ status: 'checking', message: 'Checking AI service...' });
  const [error, setError] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
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
      // Get conversation history for context
      const conversationHistory = aiService.formatConversationHistory(
        currentMessages.slice(-10) // Last 10 messages for context
      );

      const response = await aiService.sendMessage(inputMessage, conversationHistory);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.response,
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
              <Psychology sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h3" component="h1">
                AI Assistant
              </Typography>
              <Chip 
                label="Powered by Gemini" 
                size="small" 
                sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Get intelligent help with events, descriptions, and planning
            </Typography>
            
            {/* AI Status Indicator */}
            <Box mt={2}>
              <Chip
                label={aiStatus?.status === 'active' ? 'AI Ready' : aiStatus?.status === 'checking' ? 'Connecting...' : 'AI Unavailable'}
                color={aiStatus?.status === 'active' ? 'success' : aiStatus?.status === 'checking' ? 'warning' : 'error'}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
              />
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Quick Actions */}
        {messages.length === 1 && (
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions
                .filter(action => action.available !== false)
                .map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        elevation: 3,
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      {action.icon}
                      <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 600 }}>
                        {action.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

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
          {messages.length <= 3 && (
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
            AI-Powered Features:
          </Typography>
          <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
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