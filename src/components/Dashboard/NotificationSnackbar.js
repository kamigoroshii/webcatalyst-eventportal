import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationSnackbar = ({ open, message, onClose, severity = 'info' }) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default NotificationSnackbar;
