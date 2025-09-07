import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Button, Typography, Box } from '@mui/material';
import { Refresh, Warning } from '@mui/icons-material';
import api from '../../services/api';

const ConnectionStatus = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      await api.get('/health');
      if (isOffline) {
        setIsOffline(false);
        setShowAlert(false);
      }
    } catch (error) {
      if (!isOffline && hasChecked) {
        setIsOffline(true);
        setShowAlert(true);
      }
    } finally {
      setHasChecked(true);
    }
  };

  const handleRetry = () => {
    checkConnection();
  };

  const handleClose = () => {
    setShowAlert(false);
  };

  return (
    <Snackbar
      open={showAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8 }}
    >
      <Alert
        severity="error"
        onClose={handleClose}
        icon={<Warning />}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleRetry}
            startIcon={<Refresh />}
          >
            Retry
          </Button>
        }
      >
        <Box>
          <Typography variant="body2" fontWeight="bold">
            Backend Server Not Running
          </Typography>
          <Typography variant="caption" display="block">
            Run: <code>cd backend && npm run dev</code>
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default ConnectionStatus;