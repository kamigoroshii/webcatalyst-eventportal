import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Person,
  Email,
  Phone,
  AccessTime,
  Group
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'qrcode.react';

// Mock event data - replace with API call
const mockEventDetails = {
  1: {
    id: 1,
    title: 'Tech Innovation Summit 2024',
    date: '2024-03-15',
    time: '09:00 AM - 06:00 PM',
    location: 'Silicon Valley Convention Center',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    description: 'Join industry leaders for cutting-edge tech discussions and networking. This summit brings together innovators, entrepreneurs, and tech enthusiasts to explore the latest trends in technology, artificial intelligence, and digital transformation.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    category: 'Technology',
    attendees: 250,
    maxAttendees: 300,
    organizer: {
      name: 'Tech Events Inc.',
      email: 'contact@techevents.com',
      phone: '+1 (555) 123-4567'
    },
    schedule: [
      { time: '09:00 AM', activity: 'Registration & Welcome Coffee' },
      { time: '10:00 AM', activity: 'Keynote: Future of AI' },
      { time: '11:30 AM', activity: 'Panel: Startup Ecosystem' },
      { time: '01:00 PM', activity: 'Lunch & Networking' },
      { time: '02:30 PM', activity: 'Workshop: Cloud Technologies' },
      { time: '04:00 PM', activity: 'Investor Pitch Session' },
      { time: '05:30 PM', activity: 'Closing Remarks' }
    ],
    rules: [
      'Please arrive 30 minutes before the event starts',
      'Bring a valid ID for registration',
      'Photography is allowed during sessions',
      'Networking is encouraged during breaks',
      'Food and beverages will be provided'
    ]
  }
};

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const eventData = mockEventDetails[id];
      if (eventData) {
        setEvent(eventData);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    if (event) {
      const updateCountdown = () => {
        const eventDate = new Date(event.date + ' ' + event.time.split(' - ')[0]);
        const now = new Date();
        const difference = eventDate - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else {
          setTimeLeft('Event has started');
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 60000);
      return () => clearInterval(interval);
    }
  }, [event]);

  const handleRegistration = (data) => {
    // Simulate registration process
    const registrationInfo = {
      ...data,
      eventId: event.id,
      eventTitle: event.title,
      registrationId: `REG-${Date.now()}`,
      qrCode: `${event.id}-${Date.now()}`
    };
    
    setRegistrationData(registrationInfo);
    setRegistrationSuccess(true);
    setRegistrationOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Event not found</Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: 400,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${event.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              {event.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Box display="flex" alignItems="center">
                <CalendarToday sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <AccessTime sx={{ mr: 1 }} />
                <Typography variant="h6">{event.time}</Typography>
              </Box>
              <Chip label={event.category} color="primary" size="large" />
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Countdown Timer */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #6F714B, #8a8c6b)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Event Starts In
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {timeLeft}
                </Typography>
              </CardContent>
            </Card>

            {/* Description */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  About This Event
                </Typography>
                <Typography variant="body1" paragraph>
                  {event.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Event Schedule
                </Typography>
                {event.schedule.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" py={1}>
                    <Typography variant="body2" color="primary" sx={{ minWidth: 100, fontWeight: 600 }}>
                      {item.time}
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 2 }}>
                      {item.activity}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Event Guidelines
                </Typography>
                {event.rules.map((rule, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {rule}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Registration Card */}
            <Card sx={{ mb: 3, position: 'sticky', top: 20 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Registration</Typography>
                  <Chip
                    label={`${event.attendees}/${event.maxAttendees}`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Group sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.maxAttendees - event.attendees} spots remaining
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => user ? setRegistrationOpen(true) : navigate('/')}
                  disabled={event.attendees >= event.maxAttendees}
                  sx={{ mb: 2 }}
                >
                  {user ? 'Register Now' : 'Sign In to Register'}
                </Button>

                <Divider sx={{ my: 2 }} />

                {/* Location */}
                <Box mb={2}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Location</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.address}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Organizer */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Organizer
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {event.organizer.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {event.organizer.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Email sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.organizer.email}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Phone sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.organizer.phone}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Registration Dialog */}
      <Dialog open={registrationOpen} onClose={() => setRegistrationOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register for {event.title}</DialogTitle>
        <form onSubmit={handleSubmit(handleRegistration)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...register('name', { required: 'Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="College/University"
                  {...register('college', { required: 'College is required' })}
                  error={!!errors.college}
                  helperText={errors.college?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone (Optional)"
                  {...register('phone')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRegistrationOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Register</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Registration Success Dialog */}
      <Dialog open={registrationSuccess} onClose={() => setRegistrationSuccess(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registration Successful!</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 3 }}>
            You have successfully registered for {event.title}
          </Alert>
          
          {registrationData && (
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Your Registration Ticket
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Registration ID: {registrationData.registrationId}
              </Typography>
              
              <Box display="flex" justifyContent="center" my={3}>
                <QRCode value={registrationData.qrCode} size={150} />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Please save this QR code and bring it to the event
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegistrationSuccess(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDetailPage;