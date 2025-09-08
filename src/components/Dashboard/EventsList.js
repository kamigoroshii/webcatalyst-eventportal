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
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  LinearProgress
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

      {/* Events List */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        {filteredEvents.length > 0 ? (
          <List sx={{ p: 0 }}>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ListItem
                  sx={{
                    py: 3,
                    px: 3,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(111, 113, 75, 0.04)',
                      transform: 'translateX(4px)'
                    },
                    borderLeft: `4px solid ${
                      event.status === 'active' ? 'success.main' : 
                      event.status === 'upcoming' ? 'primary.main' :
                      event.status === 'completed' ? 'grey.400' : 'warning.main'
                    }`
                  }}
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      mr: 3,
                      bgcolor: 'primary.main',
                      backgroundImage: event.image ? `url(${event.image})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!event.image && (event.title ? event.title.charAt(0).toUpperCase() : 'E')}
                  </Avatar>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                            mr: 2
                          }}
                        >
                          {event.title || 'Untitled Event'}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={event.category || 'General'}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                          <Chip
                            label={event.status?.charAt(0).toUpperCase() + event.status?.slice(1) || 'Draft'}
                            size="small"
                            color={getStatusColor(event.status)}
                            sx={{ fontSize: '0.75rem' }}
                          />
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box display="flex" alignItems="center" gap={3} mb={1.5}>
                          <Box display="flex" alignItems="center">
                            <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'No date set'}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center">
                            <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {event.location?.venue || event.location || 'No venue set'}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center">
                            <People sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {typeof event.currentRegistrations === 'number' ? event.currentRegistrations : 0}/{event.maxRegistrations || 'Unlimited'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: 1.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontStyle: !event.description ? 'italic' : 'normal'
                          }}
                        >
                          {event.description || 'No description provided.'}
                        </Typography>
                        
                        {event.maxRegistrations > 0 && (
                          <Box sx={{ maxWidth: 300 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Registration Progress
                              </Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                {Math.round(((typeof event.currentRegistrations === 'number' ? event.currentRegistrations : 0) / event.maxRegistrations) * 100)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(((typeof event.currentRegistrations === 'number' ? event.currentRegistrations : 0) / event.maxRegistrations) * 100, 100)}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'rgba(0,0,0,0.05)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: 'success.main',
                                  borderRadius: 3
                                }
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          handleEdit();
                        }}
                        startIcon={<Edit />}
                        sx={{ borderRadius: 1.5 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${event._id}`);
                        }}
                        startIcon={<Visibility />}
                        sx={{ borderRadius: 1.5 }}
                      >
                        View
                      </Button>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, event);
                        }}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                
                {index < filteredEvents.length - 1 && <Divider />}
              </motion.div>
            ))}
          </List>
        ) : (
          // No Results
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
      </Card>
        
    

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