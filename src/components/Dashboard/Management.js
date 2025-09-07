import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Avatar
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  LocationOn,
  Schedule,
  Group
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Management = () => {
  const navigate = useNavigate();

  const managementOptions = [
    {
      title: 'Analytics',
      description: 'View detailed analytics and insights about your events',
      icon: <AnalyticsIcon />,
      path: '/dashboard/analytics',
      color: '#6F714B'
    },
    {
      title: 'Venue Management',
      description: 'Manage venues and locations for your events',
      icon: <LocationOn />,
      path: '/dashboard/venues',
      color: '#8a8c6b'
    },
    {
      title: 'Schedule Management',
      description: 'Organize and manage event schedules and timelines',
      icon: <Schedule />,
      path: '/dashboard/schedules',
      color: '#a3a587'
    },
    {
      title: 'Team Management',
      description: 'Manage your team members and their roles',
      icon: <Group />,
      path: '/dashboard/team',
      color: '#6F714B'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        Management Center
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Access all your management tools and features from one central location
      </Typography>

      <Grid container spacing={3}>
        {managementOptions.map((option, index) => (
          <Grid item xs={12} sm={6} md={6} key={option.title}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea
                  onClick={() => navigate(option.path)}
                  sx={{ height: '100%', p: 3 }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: option.color,
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      {option.icon}
                    </Avatar>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Management;