import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  Button,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  CardContent,
  Grid,
  TextField,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Event,
  CalendarToday,
  LocationOn,
  CheckCircle,
  Cancel,
  Pending,
  Star,
  Download,
  Person,
  Feedback,
  Notifications,
  Help,
  Logout,
  Folder,
  Settings,
  Edit,
  Save,
  Security
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, registrationsAPI } from '../services/api';

const SIDEBAR_WIDTH = 220;
const COLLAPSED_SIDEBAR_WIDTH = 70;
const SIDEBAR_ITEMS = [
  { label: 'My Events', icon: <Event />, key: 'events' },
  { label: 'My Tickets', icon: <Download />, key: 'tickets' },
  { label: 'Profile & Settings', icon: <Person />, key: 'profile' },
  { label: 'Feedback & Reviews', icon: <Feedback />, key: 'feedback' },
  { label: 'Downloads', icon: <Folder />, key: 'downloads' },
  { label: 'Notifications', icon: <Notifications />, key: 'notifications' },
  { label: 'Help & Support', icon: <Help />, key: 'help' },
  { label: 'Logout', icon: <Logout />, key: 'logout' },
];

const UserDashboard = () => {
  // Add state for feedbackTab and notificationTab at top-level
  const [feedbackTab, setFeedbackTab] = useState(0);
  const [notificationTab, setNotificationTab] = useState(0);
  // State for profile tabs and editing
  const [profileTab, setProfileTab] = useState(0);
  const [editingProfile, setEditingProfile] = useState(false);
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('events');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchRegistrations();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await userAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await registrationsAPI.getMyRegistrations();
      setRegistrations(response.data.registrations);
    } catch (error) {
      setError('Failed to load registrations');
      console.error('Registrations error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sidebar rendering
  const renderSidebar = () => (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarCollapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: sidebarCollapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          background: '#f7f7f7',
          transition: 'width 0.2s',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: '1.5rem', mb: 1 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        {!sidebarCollapsed && (
          <>
            <Typography variant="h6" color="primary" fontWeight={700}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {user?.email}
            </Typography>
          </>
        )}
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 1, minWidth: 0, px: 1, borderRadius: 2 }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? '>' : '<'}
        </Button>
      </Box>
      <Divider />
      <List>
        {SIDEBAR_ITEMS.map(item => (
          <ListItem
            button
            key={item.key}
            selected={activeSection === item.key}
            onClick={() => {
              if (item.key === 'logout') {
                logout();
                return;
              }
              setActiveSection(item.key);
            }}
            sx={{
              py: 1.5,
              px: sidebarCollapsed ? 1 : 2,
              borderRadius: 2,
              mb: 0.5,
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              ...(activeSection === item.key && { bgcolor: 'primary.light', color: 'primary.main' })
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary={item.label} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  // Main content rendering
  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
        </Box>
      );
    }
    if (error) {
      return <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>;
    }
    switch (activeSection) {
      case 'events':
        return (
          <Box p={3}>
            <Typography variant="h5" fontWeight={700} mb={2}>My Events</Typography>
            {dashboardData?.upcomingEvents?.length > 0 ? (
              <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={3}>
                {dashboardData.upcomingEvents.map((registration) => {
                  const statusColor =
                    registration.status === 'confirmed' ? 'primary' :
                    registration.status === 'pending' ? 'warning' :
                    registration.status === 'cancelled' ? 'error' : 'default';
                  return (
                    <Paper key={registration._id} elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: 'none', border: '1px solid', borderColor: 'divider', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 3 } }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="h6" fontWeight={600} color="text.primary">{registration.event.title}</Typography>
                        <Chip label={registration.status} size="small" color={statusColor} sx={{ fontWeight: 500 }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {registration.event.description && registration.event.description.length > 80
                          ? registration.event.description.substring(0, 80) + '...'
                          : registration.event.description}
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(registration.event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {registration.event.location.venue}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Organizer: {registration.event.organizer?.name || 'N/A'}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
                          onClick={() => window.open(`/events/${registration.event._id || registration.event.id}`, '_blank')}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary" gutterBottom>No upcoming events</Typography>
                <Typography variant="body2" color="text.secondary">Register for events to see them here</Typography>
              </Box>
            )}
          </Box>
        );
      case 'tickets':
        return (
          <Box p={3}>
            <Typography variant="h5" fontWeight={700} mb={2}>My Tickets</Typography>
            {registrations.length > 0 ? (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Registration Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registrations.map((registration) => (
                      <TableRow key={registration._id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={500}>{registration.event.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{registration.event.location.venue}</Typography>
                        </TableCell>
                        <TableCell>{new Date(registration.event.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label={registration.status} size="small" color="primary" />
                        </TableCell>
                        <TableCell>{new Date(registration.registrationDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {registration.qrCode && (
                            <Button
                              size="small"
                              startIcon={<Download />}
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = registration.qrCode;
                                link.download = `ticket-${registration.registrationId}.png`;
                                link.click();
                              }}
                            >
                              Ticket
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary" gutterBottom>No tickets found</Typography>
                <Typography variant="body2" color="text.secondary">Register for events to get your tickets</Typography>
              </Box>
            )}
          </Box>
        );
      case 'profile':
        // Organizer-style Profile & Settings with tabs
        return (
          <Box p={3} maxWidth={700} mx="auto">
            <Typography variant="h4" component="h1" color="primary" gutterBottom>
              Profile Settings
            </Typography>
            <Paper>
              <Tabs
                value={profileTab}
                onChange={(_, newValue) => setProfileTab(newValue)}
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
                {profileTab === 0 && (
                  <Box>
                    <Box display="flex" alignItems="center" mb={4}>
                      <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem', mr: 3 }}>
                        {user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" gutterBottom>{user?.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user?.role === 'organizer' ? 'Event Organizer' : 'Participant'}
                        </Typography>
                      </Box>
                      <Box ml="auto">
                        {!editingProfile ? (
                          <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditingProfile(true)}>
                            Edit Profile
                          </Button>
                        ) : (
                          <Button variant="outlined" startIcon={<Cancel />} onClick={() => setEditingProfile(false)}>
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </Box>
                    <form>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Full Name" disabled={!editingProfile} value={user?.name || ''} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Email" type="email" disabled value={user?.email || ''} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="College/University" disabled={!editingProfile} value={user?.college || ''} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Phone Number" disabled={!editingProfile} value={user?.phone || ''} />
                        </Grid>
                        {editingProfile && (
                          <Grid item xs={12}>
                            <Button type="submit" variant="contained" startIcon={<Save />} size="large">Save Changes</Button>
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </Box>
                )}
                {/* Security Tab */}
                {profileTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Change Password</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Ensure your account is using a long, random password to stay secure.
                    </Typography>
                    <form>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth label="Current Password" type="password" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="New Password" type="password" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Confirm New Password" type="password" />
                        </Grid>
                        <Grid item xs={12}>
                          <Button type="submit" variant="contained" startIcon={<Security />} size="large">Update Password</Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                )}
                {/* Notifications Tab */}
                {profileTab === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Choose how you want to be notified about events and updates.
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <FormControlLabel control={<Switch color="primary" />} label="Email Notifications" />
                      <FormControlLabel control={<Switch color="primary" />} label="SMS Notifications" />
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" gutterBottom>Event Notifications</Typography>
                      <FormControlLabel control={<Switch color="primary" />} label="Event Reminders" />
                      <FormControlLabel control={<Switch color="primary" />} label="New Registration Alerts" />
                      <FormControlLabel control={<Switch color="primary" />} label="System Updates" />
                      <Box mt={3}>
                        <Button variant="contained" startIcon={<Save />} size="large">Save Preferences</Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Paper>
          </Box>
        );
      case 'feedback':
        // Organizer-style Feedback & Reviews with tabs and cards
        const feedbackTabs = ['All', 'My Feedback', 'Event Feedback'];
        const feedbacks = [
          { id: 1, name: 'Alice', event: 'Tech Innovation Summit 2024', rating: 5, comment: 'Great event, learned a lot!', mine: false },
          { id: 2, name: 'Bob', event: 'Digital Marketing Masterclass', rating: 4, comment: 'Very informative, good speakers.', mine: false },
          { id: 3, name: user?.name, event: 'Web Catalyst', rating: 5, comment: 'Awesome experience!', mine: true },
        ];
        const filteredFeedbacks = feedbacks.filter(fb => {
          if (feedbackTab === 1) return fb.mine;
          if (feedbackTab === 2) return fb.event === 'Web Catalyst';
          return true;
        });
        return (
          <Box p={3} maxWidth={700} mx="auto">
            <Typography variant="h5" fontWeight={700} mb={2}>Feedback & Reviews</Typography>
            <Paper>
              <Tabs
                value={feedbackTab}
                onChange={(_, newValue) => setFeedbackTab(newValue)}
                sx={{ borderBottom: '1px solid', borderColor: 'divider', '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 } }}
              >
                {feedbackTabs.map((tab, idx) => <Tab key={tab} label={tab} />)}
              </Tabs>
              <CardContent sx={{ p: 3 }}>
                {filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((fb) => (
                    <Paper key={fb.id} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>{fb.name.charAt(0).toUpperCase()}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{fb.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{fb.event}</Typography>
                        </Box>
                        <Chip label={`Rating: ${fb.rating}/5`} color="primary" size="small" sx={{ ml: 'auto' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">{fb.comment}</Typography>
                    </Paper>
                  ))
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">No feedback found for this tab.</Typography>
                  </Box>
                )}
                <Button variant="outlined" color="primary" sx={{ borderRadius: 2, mt: 2 }}>Submit Feedback</Button>
              </CardContent>
            </Paper>
          </Box>
        );
      case 'downloads':
        return (
          <Box p={3} maxWidth={500} mx="auto">
            <Typography variant="h5" fontWeight={700} mb={2}>Downloads</Typography>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" mb={2}>Download your event resources and tickets here. (Feature coming soon)</Typography>
              <Button variant="outlined" color="primary" disabled sx={{ borderRadius: 2 }}>Download All</Button>
            </Paper>
          </Box>
        );
      case 'notifications':
        // Organizer-style Notifications with tabs and actions
        const notificationTabs = ['All', 'Unread', 'Events', 'System'];
        const notifications = [
          { id: 1, type: 'event', title: 'Event Reminder', message: 'Tech Innovation Summit 2024 starts tomorrow!', date: '2025-09-07', read: false },
          { id: 2, type: 'registration', title: 'Registration Confirmed', message: 'You are registered for Digital Marketing Masterclass.', date: '2025-09-06', read: true },
          { id: 3, type: 'system', title: 'System Update', message: 'New features added to your dashboard.', date: '2025-09-05', read: false },
        ];
        const filteredNotifications = notifications.filter(note => {
          if (notificationTab === 1) return !note.read;
          if (notificationTab === 2) return note.type === 'event';
          if (notificationTab === 3) return note.type === 'system';
          return true;
        });
        const unreadCount = notifications.filter(n => !n.read).length;
        return (
          <Box p={3} maxWidth={700} mx="auto">
            <Typography variant="h5" fontWeight={700} mb={2}>Notifications</Typography>
            <Paper>
              <Tabs
                value={notificationTab}
                onChange={(_, newValue) => setNotificationTab(newValue)}
                sx={{ borderBottom: '1px solid', borderColor: 'divider', '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 } }}
              >
                {notificationTabs.map((tab, idx) => <Tab key={tab} label={tab === 'Unread' ? `Unread (${unreadCount})` : tab} />)}
              </Tabs>
              <CardContent sx={{ p: 3 }}>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((note) => (
                    <Paper key={note.id} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: note.read ? 'background.paper' : 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Chip label={note.type.charAt(0).toUpperCase() + note.type.slice(1)} color={note.type === 'event' ? 'primary' : note.type === 'system' ? 'info' : 'default'} size="small" />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{note.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{note.date}</Typography>
                        </Box>
                        {!note.read && <Chip label="New" color="primary" size="small" sx={{ ml: 'auto' }} />}
                      </Box>
                      <Typography variant="body2" color="text.secondary">{note.message}</Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <Button variant="outlined" size="small" color="primary">Mark as Read</Button>
                        <Button variant="outlined" size="small" color="error">Delete</Button>
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">No notifications found for this tab.</Typography>
                  </Box>
                )}
              </CardContent>
            </Paper>
          </Box>
        );
      case 'help':
        return (
          <Box p={3} maxWidth={500} mx="auto">
            <Typography variant="h5" fontWeight={700} mb={2}>Help & Support</Typography>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" mb={2}>Need help? Contact support at <a href="mailto:support@eventease.com" style={{ color: '#6F714B', textDecoration: 'none' }}>support@eventease.com</a></Typography>
              <Button variant="outlined" color="primary" href="mailto:support@eventease.com" sx={{ borderRadius: 2 }}>Email Support</Button>
            </Paper>
          </Box>
        );
      default:
        return <Box p={3}><Typography variant="h6">Coming soon...</Typography></Box>;
    }
  };

  return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {renderSidebar()}
  <Box sx={{ flexGrow: 1, p: 0, transition: 'margin 0.2s', ml: 0, minWidth: 0 }}>
          {renderContent()}
        </Box>
      </Box>
  );
};

export default UserDashboard;