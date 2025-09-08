import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Search,
  CalendarToday,
  LocationOn,
  People
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { eventsAPI } from '../../services/api';

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: 'Tech Innovation Summit 2024',
    date: '2024-03-15',
    location: 'Silicon Valley Convention Center',
    category: 'Technology',
    registrations: 250,
    maxRegistrations: 300,
    status: 'active',
    description: 'Join industry leaders for cutting-edge tech discussions.'
  },
  {
    id: 2,
    title: 'Digital Marketing Masterclass',
    date: '2024-03-20',
    location: 'Downtown Business Center',
    category: 'Marketing',
    registrations: 120,
    maxRegistrations: 150,
    status: 'active',
    description: 'Learn advanced digital marketing strategies from experts.'
  },
  {
    id: 3,
    title: 'Startup Pitch Competition',
    date: '2024-03-25',
    location: 'Innovation Hub',
    category: 'Business',
    registrations: 180,
    maxRegistrations: 200,
    status: 'upcoming',
    description: 'Watch promising startups pitch their ideas to investors.'
  },
  {
    id: 4,
    title: 'AI Workshop (Completed)',
    date: '2024-02-15',
    location: 'Tech Campus',
    category: 'Technology',
    registrations: 95,
    maxRegistrations: 100,
    status: 'completed',
    description: 'Hands-on workshop covering AI techniques.'
  }
];

const EventsList = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventsAPI.getMyEvents();
        // Ensure events is always an array from backend response
        setEvents(Array.isArray(res.data?.events) ? res.data.events : []);
      } catch (err) {
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuOpen = (event, eventData) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const handleEdit = () => {
  navigate(`/dashboard/edit-event/${selectedEvent._id}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
  setEvents(events.filter(event => event._id !== selectedEvent._id));
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleView = () => {
  navigate(`/events/${selectedEvent._id}`);
    handleMenuClose();
  };

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'upcoming': return 'primary';
      case 'completed': return 'default';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" color="primary">
          My Events
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/dashboard/add-event')}
        >
          Create Event
        </Button>
      </Box>

      {/* Search */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {filteredEvents.map((event, index) => (
          <Grid item xs={12} key={event._id}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  width: '100%',
                  minHeight: 160,
                  background: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.primary.contrastText,
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(111, 113, 75, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(111, 113, 75, 0.25)'
                  }
                }}
                onClick={() => navigate(`/events/${event._id}`)}
              >
                <CardContent>
                  {/* Header with menu */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flexGrow={1}>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 700, color: (theme) => theme.palette.primary.contrastText }}>
                        {event.title || <span style={{ color: '#e0e0e0' }}>Untitled Event</span>}
                      </Typography>
                      <Chip
                        label={event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Draft'}
                        size="small"
                        color="secondary"
                        variant="filled"
                        sx={{ fontWeight: 500, textTransform: 'capitalize', color: (theme) => theme.palette.primary.main, background: (theme) => theme.palette.secondary.main }}
                      />
                    </Box>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, event)}
                      size="small"
                      sx={{ color: (theme) => theme.palette.primary.contrastText }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  {/* Event Details */}
                  <Box mb={2}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: (theme) => theme.palette.primary.contrastText }} />
                      <Typography variant="body2" sx={{ color: (theme) => theme.palette.primary.contrastText }}>
                        {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : <span style={{ color: '#e0e0e0' }}>No date</span>}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: (theme) => theme.palette.primary.contrastText }} />
                      <Typography variant="body2" sx={{ color: (theme) => theme.palette.primary.contrastText }}>
                        {event.location?.venue || event.location || <span style={{ color: '#e0e0e0' }}>No venue</span>}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <People sx={{ fontSize: 16, mr: 1, color: (theme) => theme.palette.primary.contrastText }} />
                      <Typography variant="body2" sx={{ color: (theme) => theme.palette.primary.contrastText }}>
                        {typeof event.currentRegistrations === 'number' ? event.currentRegistrations : 0}/{event.maxRegistrations || 0} registered
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2, fontStyle: !event.description ? 'italic' : 'normal', color: (theme) => theme.palette.primary.contrastText }}>
                    {event.description || 'No description provided.'}
                  </Typography>

                  {/* Category */}
                  <Chip
                    label={event.category || 'Uncategorized'}
                    size="small"
                    color="secondary"
                    variant="filled"
                    sx={{ fontWeight: 500, textTransform: 'capitalize', color: (theme) => theme.palette.primary.main, background: (theme) => theme.palette.secondary.main }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredEvents.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {searchTerm ? 'Try adjusting your search criteria' : 'Create your first event to get started'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/dashboard/add-event')}
          >
            Create Event
          </Button>
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <Visibility sx={{ mr: 1 }} />
          View Event
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} />
          Edit Event
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete Event
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography>
            Are you sure you want to delete "{selectedEvent?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventsList;