import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  'Technology',
  'Business',
  'Marketing',
  'Design',
  'Finance',
  'Education',
  'Health',
  'Entertainment',
  'Sports',
  'Other'
];

// Mock event data for editing
const mockEventData = {
  1: {
    title: 'Tech Innovation Summit 2024',
    description: 'Join industry leaders for cutting-edge tech discussions and networking. This summit brings together innovators, entrepreneurs, and tech enthusiasts to explore the latest trends in technology.',
    date: '2024-03-15',
    time: '09:00',
    endTime: '18:00',
    location: 'Silicon Valley Convention Center',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    category: 'Technology',
    maxRegistrations: 300,
    registrationDeadline: '2024-03-10',
    organizer: 'Tech Events Inc.',
    email: 'contact@techevents.com',
    phone: '+1 (555) 123-4567'
  }
};

const AddEditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      endTime: '',
      location: '',
      address: '',
      category: '',
      maxRegistrations: '',
      registrationDeadline: '',
      organizer: '',
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    if (isEditing && id) {
      // Load event data for editing
      const eventData = mockEventData[id];
      if (eventData) {
        Object.keys(eventData).forEach(key => {
          setValue(key, eventData[key] || '');
        });
      }
    }
  }, [id, isEditing, setValue]);

  const { eventsAPI } = require('../../services/api');
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;
      if (isEditing && id) {
        response = await eventsAPI.updateEvent(id, data);
      } else {
        response = await eventsAPI.createEvent(data);
      }
      setSnackbar({
        open: true,
        message: isEditing ? 'Event updated successfully!' : 'Event created successfully!',
        severity: 'success'
      });
      setTimeout(() => {
        navigate('/dashboard/events');
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || 'An error occurred. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/events');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </Typography>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Title"
                    {...register('title', {
                      required: 'Event title is required',
                      minLength: { value: 2, message: 'Title must be at least 2 characters' },
                      maxLength: { value: 100, message: 'Title must be at most 100 characters' }
                    })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Event Description"
                    {...register('description', {
                      required: 'Event description is required',
                      minLength: { value: 20, message: 'Description must be at least 20 characters' },
                      maxLength: { value: 2000, message: 'Description must be at most 2000 characters' }
                    })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Category"
                    {...register('category', { required: 'Category is required' })}
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Registrations"
                    {...register('maxRegistrations', { 
                      required: 'Maximum registrations is required',
                      min: { value: 1, message: 'Must be at least 1' }
                    })}
                    error={!!errors.maxRegistrations}
                    helperText={errors.maxRegistrations?.message}
                  />
                </Grid>

                {/* Date and Time */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Date and Time
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Event Date"
                    InputLabelProps={{ shrink: true }}
                    {...register('date', { required: 'Event date is required' })}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Start Time"
                    InputLabelProps={{ shrink: true }}
                    {...register('time', {
                      required: 'Start time is required',
                      pattern: {
                        value: /^([01]\d|2[0-3]):([0-5]\d)$/,
                        message: 'Please provide valid start time (HH:MM)'
                      }
                    })}
                    error={!!errors.time}
                    helperText={errors.time?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="time"
                    label="End Time"
                    InputLabelProps={{ shrink: true }}
                    {...register('endTime', { required: 'End time is required' })}
                    error={!!errors.endTime}
                    helperText={errors.endTime?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Registration Deadline"
                    InputLabelProps={{ shrink: true }}
                    {...register('registrationDeadline', { required: 'Registration deadline is required' })}
                    error={!!errors.registrationDeadline}
                    helperText={errors.registrationDeadline?.message}
                  />
                </Grid>

                {/* Location */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Location
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Venue Name"
                    {...register('location', {
                      required: 'Venue name is required',
                      minLength: { value: 2, message: 'Venue must be at least 2 characters' },
                      maxLength: { value: 100, message: 'Venue must be at most 100 characters' }
                    })}
                    error={!!errors.location}
                    helperText={errors.location?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Address"
                    {...register('address', {
                      required: 'Address is required',
                      minLength: { value: 5, message: 'Address must be at least 5 characters' },
                      maxLength: { value: 200, message: 'Address must be at most 200 characters' }
                    })}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>

                {/* Organizer Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Organizer Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Organizer Name"
                    {...register('organizer', { required: 'Organizer name is required' })}
                    error={!!errors.organizer}
                    helperText={errors.organizer?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Contact Email"
                    {...register('email', { 
                      required: 'Contact email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    {...register('phone', { required: 'Contact phone is required' })}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success/Error Snackbar */}
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

export default AddEditEvent;