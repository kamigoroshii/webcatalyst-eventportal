import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button
} from '@mui/material';
import {
  Event,
  People,
  TrendingUp,
  CalendarToday,
  Add
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Events',
      value: '12',
      icon: <Event />,
      color: '#6F714B',
      change: '+2 this month'
    },
    {
      title: 'Total Registrations',
      value: '1,247',
      icon: <People />,
      color: '#8a8c6b',
      change: '+15% from last month'
    },
    {
      title: 'Active Events',
      value: '5',
      icon: <TrendingUp />,
      color: '#a3a587',
      change: '3 ending soon'
    },
    {
      title: 'This Month',
      value: '8',
      icon: <CalendarToday />,
      color: '#6F714B',
      change: '4 upcoming'
    }
  ];

  const [recentEvents, setRecentEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const res = await require('../../services/api').eventsAPI.getMyEvents({ limit: 5 });
        // Use only the latest 5 events
        setRecentEvents(Array.isArray(res.data?.events) ? res.data.events.slice(0, 5) : []);
      } catch (err) {
        setRecentEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" color="primary">
          Dashboard Overview
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/dashboard/add-event')}
        >
          Create Event
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                  color: 'white'
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {stat.change}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        width: 56,
                        height: 56
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Events */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Events
              </Typography>
              <List>
                {loadingEvents ? (
                  <ListItem>
                    <ListItemText primary={<Typography>Loading events...</Typography>} />
                  </ListItem>
                ) : recentEvents.length === 0 ? (
                  <ListItem>
                    <ListItemText primary={<Typography>No recent events found</Typography>} />
                  </ListItem>
                ) : (
                  recentEvents.map((event, index) => (
                    <ListItem
                      key={event._id || event.id}
                      divider={index < recentEvents.length - 1}
                      sx={{ px: 0, alignItems: 'flex-start' }}
                    >
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <>
                            {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'No date'}
                            <br />
                            {(event.currentRegistrations || event.registrations || 0)}/{event.maxRegistrations || 0} registered
                          </>
                        }
                        primaryTypographyProps={{
                          variant: 'subtitle1',
                          fontWeight: 500
                        }}
                        secondaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.secondary'
                        }}
                      />
                      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                        <Chip
                          label={event.status || 'draft'}
                          size="small"
                          color={event.status === 'active' ? 'success' : 'primary'}
                          variant="outlined"
                        />
                        <LinearProgress
                          variant="determinate"
                          value={((event.currentRegistrations || event.registrations || 0) / (event.maxRegistrations || 1)) * 100}
                          sx={{ width: 100, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </ListItem>
                  ))
                )}
              </List>
              <Box mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard/events')}
                  fullWidth
                >
                  View All Events
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/dashboard/add-event')}
                  fullWidth
                >
                  Create New Event
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<People />}
                  onClick={() => navigate('/dashboard/registrations')}
                  fullWidth
                >
                  View Registrations
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Event />}
                  onClick={() => navigate('/dashboard/ai-generator')}
                  fullWidth
                >
                  AI Description Generator
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="New registration for Tech Summit"
                    secondary="2 hours ago"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Event description updated"
                    secondary="5 hours ago"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Marketing event published"
                    secondary="1 day ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;