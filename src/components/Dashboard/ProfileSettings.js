import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Tab,
  Tabs,
  IconButton
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const ProfileSettings = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      college: user?.college || '',
      phone: user?.phone || ''
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm();

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    smsNotifications: user?.preferences?.smsNotifications ?? false,
    eventReminders: true,
    registrationAlerts: true,
    systemUpdates: true
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const onProfileSubmit = async (data) => {
    try {
      const result = await updateProfile(data);
      if (result.success) {
        setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        setEditing(false);
      } else {
        setSnackbar({ open: true, message: result.error, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      if (result.success) {
        setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
        resetPassword();
      } else {
        setSnackbar({ open: true, message: result.error, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to change password', severity: 'error' });
    }
  };

  const handleNotificationChange = (setting) => (event) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: event.target.checked
    });
  };

  const saveNotificationSettings = async () => {
    try {
      const result = await updateProfile({
        preferences: {
          ...user.preferences,
          emailNotifications: notificationSettings.emailNotifications,
          smsNotifications: notificationSettings.smsNotifications
        }
      });
      
      if (result.success) {
        setSnackbar({ open: true, message: 'Notification settings saved!', severity: 'success' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        Profile Settings
      </Typography>

      <Card>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500
            }
          }}
        >
          <Tab icon={<Person />} label="Profile" />
          <Tab icon={<Security />} label="Security" />
          <Tab icon={<Notifications />} label="Notifications" />
        </Tabs>

        <CardContent sx={{ p: 4 }}>
          {/* Profile Tab */}
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box display="flex" alignItems="center" mb={4}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mr: 3
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.role === 'organizer' ? 'Event Organizer' : 'Participant'}
                  </Typography>
                </Box>
                <Box ml="auto">
                  {!editing ? (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => {
                          setEditing(false);
                          reset();
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              <form onSubmit={handleSubmit(onProfileSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      disabled={!editing}
                      {...register('name', { required: 'Name is required' })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      disabled={true} // Email usually can't be changed
                      {...register('email')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="College/University"
                      disabled={!editing}
                      {...register('college')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      disabled={!editing}
                      {...register('phone')}
                    />
                  </Grid>
                  {editing && (
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        size="large"
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </form>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Ensure your account is using a long, random password to stay secure.
              </Typography>

              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      error={!!passwordErrors.currentPassword}
                      helperText={passwordErrors.currentPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      {...registerPassword('newPassword', { 
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                      error={!!passwordErrors.newPassword}
                      helperText={passwordErrors.newPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      {...registerPassword('confirmPassword', { required: 'Please confirm your password' })}
                      error={!!passwordErrors.confirmPassword}
                      helperText={passwordErrors.confirmPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Security />}
                      size="large"
                    >
                      Update Password
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose how you want to be notified about events and updates.
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange('emailNotifications')}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onChange={handleNotificationChange('smsNotifications')}
                      color="primary"
                    />
                  }
                  label="SMS Notifications"
                />
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Event Notifications
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.eventReminders}
                      onChange={handleNotificationChange('eventReminders')}
                      color="primary"
                    />
                  }
                  label="Event Reminders"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.registrationAlerts}
                      onChange={handleNotificationChange('registrationAlerts')}
                      color="primary"
                    />
                  }
                  label="New Registration Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onChange={handleNotificationChange('systemUpdates')}
                      color="primary"
                    />
                  }
                  label="System Updates"
                />

                <Box mt={3}>
                  <Button
                    variant="contained"
                    onClick={saveNotificationSettings}
                    startIcon={<Save />}
                    size="large"
                  >
                    Save Preferences
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileSettings;