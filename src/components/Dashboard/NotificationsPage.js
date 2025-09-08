import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Badge,
  Tabs,
  Tab,
  Button,
  Alert
} from '@mui/material';
import {
  Notifications,
  Event,
  Person,
  Warning,
  Info,
  CheckCircle,
  Delete,
  MarkEmailRead
} from '@mui/icons-material';
import { motion } from 'framer-motion';


import { useEffect } from 'react';
import notificationsAPI from '../../services/notificationsAPI';
import NotificationSnackbar from './NotificationSnackbar';

const iconMap = {
  registration: <Person />,
  event: <Event />,
  system: <Info />,
  warning: <Warning />,
  success: <CheckCircle />,
};

const colorMap = {
  registration: 'primary',
  event: 'warning',
  system: 'info',
  warning: 'error',
  success: 'success',
};

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationsAPI.getOrganizerNotifications();
        const notifs = res.data.map(n => ({
          id: n._id,
          type: n.type,
          title: n.type === 'registration' ? 'New Registration' : 'Notification',
          message: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          read: n.read,
          icon: iconMap[n.type] || <Info />,
          color: colorMap[n.type] || 'info',
        }));
        setNotifications(notifs);
        // Show popup for new unread notifications
        const newNotif = notifs.find(n => !n.read);
        if (newNotif) {
          setSnackbarMsg(newNotif.message);
          setSnackbarOpen(true);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchNotifications();
    // Optionally poll every 30s for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 1:
        return notifications.filter(n => !n.read);
      case 2:
        return notifications.filter(n => n.type === 'registration');
      case 3:
        return notifications.filter(n => n.type === 'event');
      case 4:
        return notifications.filter(n => n.type === 'system');
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMsg('');
  };

  return (
    <Box>
      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        onClose={handleSnackbarClose}
        severity="info"
      />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" color="primary">
          <Badge badgeContent={unreadCount} color="error">
            <Notifications sx={{ mr: 2 }} />
          </Badge>
          Notifications
        </Typography>
        <Button
          variant="outlined"
          startIcon={<MarkEmailRead />}
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark All as Read
        </Button>
      </Box>

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
          <Tab label="All" />
          <Tab label={`Unread (${unreadCount})`} />
          <Tab label="Registrations" />
          <Tab label="Events" />
          <Tab label="System" />
        </Tabs>

        <CardContent sx={{ p: 0 }}>
          {getFilteredNotifications().length > 0 ? (
            <List>
              {getFilteredNotifications().map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListItem
                    divider={index < getFilteredNotifications().length - 1}
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '50%',
                          backgroundColor: `${notification.color}.light`,
                          color: `${notification.color}.main`
                        }}
                      >
                        {notification.icon}
                      </Box>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={notification.read ? 400 : 600}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.read && (
                            <Chip label="New" size="small" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {notification.time}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Box display="flex" gap={1}>
                        {!notification.read && (
                          <IconButton
                            size="small"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <CheckCircle />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete notification"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                </motion.div>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={8}>
              <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No notifications found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeTab === 1 ? 'All caught up! No unread notifications.' : 'You have no notifications in this category.'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Configure your notification preferences in Profile Settings
          </Alert>
          <Button
            variant="outlined"
            onClick={() => window.location.href = '/dashboard/profile'}
          >
            Go to Settings
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotificationsPage;