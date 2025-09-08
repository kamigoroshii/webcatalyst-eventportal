
import React, { useState } from 'react';
import { Box, IconButton, Paper, Fade, Typography } from '@mui/material';
import { SmartToy } from '@mui/icons-material';
import ChatBotWidgetContent from './ChatBotWidgetContent';

const ChatBotWidget = () => {
  const [open, setOpen] = useState(false);

  return (
  <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1500 }}>
      {/* Floating Button */}
      <Fade in={!open}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: '#2e2e38',
            boxShadow: '0 4px 16px rgba(44,44,60,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid #fff',
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: '0 8px 24px rgba(44,44,60,0.28)', bgcolor: '#1a1a24' }
          }}
          onClick={() => setOpen(true)}
        >
          <SmartToy sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
      </Fade>
      {/* Popup Chat Area */}
      <Fade in={open}>
        <Paper
          elevation={10}
          sx={{
            position: 'absolute',
            bottom: 64,
            right: 0,
            width: 320,
            height: 400,
            borderRadius: 6,
            overflow: 'hidden',
            display: open ? 'block' : 'none',
            p: 0,
            boxShadow: '0 8px 32px rgba(44,44,60,0.12)',
            background: 'linear-gradient(135deg, #f8f8fa 0%, #eaeaf2 100%)',
          }}
        >
          {/* Modern header for widget */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.2, bgcolor: '#2e2e38', color: '#fff', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <SmartToy sx={{ fontSize: 20, color: '#fff' }} />
              <Typography variant="subtitle2" fontWeight={600} fontSize={15}>AI Chat</Typography>
            </Box>
            <IconButton size="small" sx={{ color: '#fff' }} onClick={() => setOpen(false)}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>&times;</span>
            </IconButton>
          </Box>
          {/* Chat area only, minimal padding, scrollable */}
          <Box sx={{ height: 'calc(100% - 44px)', width: '100%', p: 0.5, bgcolor: 'transparent', overflowY: 'auto' }}>
            <ChatBotWidgetContent />
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ChatBotWidget;
