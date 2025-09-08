import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Avatar, CircularProgress } from '@mui/material';
import { SmartToy, Person, Send } from '@mui/icons-material';
import aiService from '../../services/aiService';

const ChatBotWidgetContent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);
    try {
      const conversationHistory = aiService.formatConversationHistory(
        [...messages, userMessage].slice(-6)
      );
      const response = await aiService.sendMessage(inputMessage, conversationHistory);
      const aiContent = response && response.success && typeof response.response === 'string'
        ? response.response
        : 'Sorry, I did not receive a valid response.';
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        content: aiContent,
        timestamp: new Date()
      }]);
    } catch (error) {
      setError(error.message);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, something went wrong. Please try again later.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'transparent' }}>
      <Box sx={{ flexGrow: 1, p: 1, overflowY: 'auto', bgcolor: 'transparent' }}>
        {messages.map((message) => (
          <Box key={message.id} display="flex" justifyContent={message.type === 'user' ? 'flex-end' : 'flex-start'} mb={1}>
            <Box display="flex" alignItems="flex-start" maxWidth="80%" flexDirection={message.type === 'user' ? 'row-reverse' : 'row'}>
              <Avatar sx={{ bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main', color: message.type === 'user' ? 'white' : 'primary.main', mx: 1, width: 28, height: 28 }}>
                {message.type === 'user' ? <Person sx={{ fontSize: 18 }} /> : <SmartToy sx={{ fontSize: 18 }} />}
              </Avatar>
              <Paper elevation={1} sx={{ p: 1.2, backgroundColor: message.type === 'user' ? 'primary.main' : 'background.paper', color: message.type === 'user' ? 'white' : 'text.primary', borderRadius: 2, fontSize: 13 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {message.content}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>
            </Box>
          </Box>
        ))}
        {isTyping && (
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main', mr: 1, width: 28, height: 28 }}>
              <SmartToy sx={{ fontSize: 18 }} />
            </Avatar>
            <Paper elevation={1} sx={{ p: 1.2, borderRadius: 2 }}>
              <Box display="flex" alignItems="center">
                <CircularProgress size={14} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  AI is typing...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
        <Box display="flex" alignItems="flex-end" gap={1}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 } }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: 'action.disabled' } }}
          >
            {isTyping ? <CircularProgress size={18} color="inherit" /> : <Send />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBotWidgetContent;
