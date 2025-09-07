import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  People,
  Event,
  Visibility,
  School,
  LocationOn
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalEvents: 12,
      totalRegistrations: 1247,
      totalViews: 8934,
      avgRegistrationsPerEvent: 104
    },
    registrationTrends: [
      { month: 'Jan', registrations: 89 },
      { month: 'Feb', registrations: 156 },
      { month: 'Mar', registrations: 234 },
      { month: 'Apr', registrations: 198 },
      { month: 'May', registrations: 267 },
      { month: 'Jun', registrations: 303 }
    ],
    topEvents: [
      { name: 'Tech Innovation Summit 2024', registrations: 250, views: 1200 },
      { name: 'Digital Marketing Masterclass', registrations: 180, views: 890 },
      { name: 'Startup Pitch Competition', registrations: 165, views: 750 },
      { name: 'AI Workshop', registrations: 95, views: 450 }
    ],
    demographics: {
      colleges: [
        { name: 'Stanford University', count: 89, percentage: 15.2 },
        { name: 'MIT', count: 76, percentage: 13.0 },
        { name: 'UC Berkeley', count: 65, percentage: 11.1 },
        { name: 'Harvard University', count: 54, percentage: 9.2 },
        { name: 'Others', count: 301, percentage: 51.5 }
      ],
      categories: [
        { name: 'Technology', count: 456, percentage: 36.6 },
        { name: 'Business', count: 298, percentage: 23.9 },
        { name: 'Marketing', count: 234, percentage: 18.8 },
        { name: 'Design', count: 156, percentage: 12.5 },
        { name: 'Others', count: 103, percentage: 8.2 }
      ]
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" component="div" fontWeight="bold" color={color}>
                {value}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: '50%',
                backgroundColor: `${color}.light`,
                color: `${color}.main`
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" color="primary">
          Analytics Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 3 months</MenuItem>
            <MenuItem value="365">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overview Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            value={analyticsData.overview.totalEvents}
            icon={<Event />}
            color="primary"
            subtitle="Active events"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Registrations"
            value={analyticsData.overview.totalRegistrations.toLocaleString()}
            icon={<People />}
            color="success"
            subtitle="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Views"
            value={analyticsData.overview.totalViews.toLocaleString()}
            icon={<Visibility />}
            color="info"
            subtitle="Event page views"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Registrations"
            value={analyticsData.overview.avgRegistrationsPerEvent}
            icon={<TrendingUp />}
            color="warning"
            subtitle="Per event"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Performing Events */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Events
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event Name</TableCell>
                      <TableCell align="right">Registrations</TableCell>
                      <TableCell align="right">Views</TableCell>
                      <TableCell align="right">Conversion Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.topEvents.map((event, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {event.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={event.registrations}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">{event.views}</TableCell>
                        <TableCell align="right">
                          {((event.registrations / event.views) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Registration Trends */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Registration Trends
              </Typography>
              <Box>
                {analyticsData.registrationTrends.map((item, index) => (
                  <Box key={index} mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">{item.month}</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {item.registrations}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(item.registrations / 350) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Demographics - Colleges */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                Participant Demographics - Colleges
              </Typography>
              <Box>
                {analyticsData.demographics.colleges.map((college, index) => (
                  <Box key={index} mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">{college.name}</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {college.count} ({college.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={college.percentage}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Demographics - Categories */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Event Categories Performance
              </Typography>
              <Box>
                {analyticsData.demographics.categories.map((category, index) => (
                  <Box key={index} mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">{category.name}</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {category.count} ({category.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={category.percentage}
                      sx={{ height: 6, borderRadius: 3 }}
                      color={index === 0 ? 'primary' : 'secondary'}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;