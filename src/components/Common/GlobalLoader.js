import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Backdrop
} from '@mui/material';
import { motion } from 'framer-motion';

const GlobalLoader = ({ loading, message = 'Loading...' }) => {
  if (!loading) return null;

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark'
            ? 'rgba(26, 26, 26, 0.9)'
            : 'rgba(111, 113, 75, 0.9)',
        backdropFilter: 'blur(6px)'
      }}
      open={loading}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 3,
            p: 4,
            minWidth: 250,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(111, 113, 75, 0.2)'
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ color: 'primary.main' }}
            />
          </motion.div>
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              EventEase
            </Typography>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Typography variant="body2" color="text.secondary">
                {message}
              </Typography>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </Backdrop>
  );
};

export default GlobalLoader;