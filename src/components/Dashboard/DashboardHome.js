import React from 'react';
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

  const recentEvents = [
    {
      id: 1,
      title: 'Tech Innovation Summit 2024',
      date: '2024-03-15',
      registrations: 250,
      maxRegistrations: 300,
      status: 'active'
    },
    {
      id: 2,
      title: 'Digital Marketing Masterclass',
      date: '2024-03-20',
      registrations: 120,
      maxRegistrations: 150,
      status: 'active'
    },
    {
      id: 3,
      title: 'Startup Pitch Competition',
      date: '2024-03-25',
      registrations: 180,
      maxRegistrations: 200,
      status: 'upcoming'
    }
  ];

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
                {recentEvents.map((event, index) => (
                  <ListItem
                    key={event.id}
                    divider={index < recentEvents.length - 1}
                    sx={{ px: 0, alignItems: 'flex-start' }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          <br />
                          {event.registrations}/{event.maxRegistrations} registered
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
                        label={event.status}
                        size="small"
                        color={event.status === 'active' ? 'success' : 'primary'}
                        variant="outlined"
                      />
                      <LinearProgress
                        variant="determinate"
                        value={(event.registrations / event.maxRegistrations) * 100}
                        sx={{ width: 100, height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </ListItem>
                ))}
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