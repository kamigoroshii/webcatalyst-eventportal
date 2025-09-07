import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Event,
  CalendarToday,
  LocationOn,
  CheckCircle,
  Cancel,
  Pending,
  Star,
  Download
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, registrationsAPI } from '../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle color="success" />;
      case 'cancelled':
        return <Cancel color="error" />;
      case 'pending':
        return <Pending color="warning" />;
      case 'attended':
        return <Star color="primary" />;
      default:
        return <Event />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'error';
      case 'pending': return 'warning';
      case 'attended': return 'primary';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
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
          <Typography variant="h4" component="h1" color="primary">
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.email} • {user?.college}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {dashboardData && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ background: 'linear-gradient(135deg, #6F714B, #8a8c6b)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {dashboardData.stats.totalRegistrations}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Events
                      </Typography>
                    </Box>
                    <Event sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card sx={{ background: 'linear-gradient(135deg, #8a8c6b, #a3a587)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {dashboardData.stats.statusStats.attended || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Attended
                      </Typography>
                    </Box>
                    <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ background: 'linear-gradient(135deg, #a3a587, #b8ba9a)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {dashboardData.stats.statusStats.confirmed || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Upcoming
                      </Typography>
                    </Box>
                    <CalendarToday sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card sx={{ background: 'linear-gradient(135deg, #b8ba9a, #cdcfad)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {dashboardData.stats.statusStats.cancelled || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Cancelled
                      </Typography>
                    </Box>
                    <Cancel sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
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
          <Tab label="Upcoming Events" />
          <Tab label="Past Events" />
          <Tab label="All Registrations" />
        </Tabs>

        <CardContent>
          {/* Upcoming Events Tab */}
          {activeTab === 0 && (
            <Box>
              {dashboardData?.upcomingEvents?.length > 0 ? (
                <List>
                  {dashboardData.upcomingEvents.map((registration, index) => (
                    <ListItem
                      key={registration._id}
                      divider={index < dashboardData.upcomingEvents.length - 1}
                      sx={{ px: 0 }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6" component="div">
                              {registration.event.title}
                            </Typography>
                            <Chip
                              label={registration.status}
                              size="small"
                              color={getStatusColor(registration.status)}
                              icon={getStatusIcon(registration.status)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box mt={1}>
                            <Box display="flex" alignItems="center" mb={0.5}>
                              <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(registration.event.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {registration.event.location.venue}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No upcoming events
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Register for events to see them here
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Past Events Tab */}
          {activeTab === 1 && (
            <Box>
              {dashboardData?.pastEvents?.length > 0 ? (
                <List>
                  {dashboardData.pastEvents.map((registration, index) => (
                    <ListItem
                      key={registration._id}
                      divider={index < dashboardData.pastEvents.length - 1}
                      sx={{ px: 0 }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6" component="div">
                              {registration.event.title}
                            </Typography>
                            <Box display="flex" gap={1}>
                              <Chip
                                label="Attended"
                                size="small"
                                color="primary"
                                icon={<Star />}
                              />
                              {registration.feedback?.rating && (
                                <Chip
                                  label={`${registration.feedback.rating}★`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box mt={1}>
                            <Box display="flex" alignItems="center" mb={0.5}>
                              <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(registration.event.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {registration.event.location.venue}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No past events
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your attended events will appear here
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* All Registrations Tab */}
          {activeTab === 2 && (
            <Box>
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
                            <Typography variant="subtitle2" fontWeight={500}>
                              {registration.event.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {registration.event.location.venue}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {new Date(registration.event.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={registration.status}
                              size="small"
                              color={getStatusColor(registration.status)}
                              icon={getStatusIcon(registration.status)}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(registration.registrationDate).toLocaleDateString()}
                          </TableCell>
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
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No registrations found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start exploring events and register to see them here
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserDashboard;