
// ...entire contents of HomePageFixed.js...
import React, { useState, useEffect } from 'react';
import ChatBotWidget from '../components/Common/ChatBotWidget';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Pagination,
  Skeleton
} from '@mui/material';
import { Search, LocationOn, CalendarToday, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { eventsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Technology', 'Marketing', 'Business', 'Design', 'Finance', 'Entertainment'];

// Mock data - replace with API calls
const mockEvents = [
  {
    id: 1,
    title: 'Tech Innovation Summit 2024',
    date: '2024-03-15',
    location: 'Silicon Valley Convention Center',
    description: 'Join industry leaders for cutting-edge tech discussions and networking.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    category: 'Technology',
    attendees: 250,
    maxAttendees: 300
  },
  {
    id: 2,
    title: 'Digital Marketing Masterclass',
    date: '2024-03-20',
    location: 'Downtown Business Center',
    description: 'Learn advanced digital marketing strategies from experts.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
    category: 'Marketing',
    attendees: 120,
    maxAttendees: 150
  },
  // Add the web catalyst event as a mock event to ensure it shows up
  {
    id: 100,
    title: 'Web Catalyst',
    date: '2025-09-10',
    location: 'Virtual Event',
    description: 'Web Catalyst is a dynamic tech-driven event designed to bring together developers, designers, and digital innovators.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    category: 'Entertainment',
    attendees: 0,
    maxAttendees: 20
  }
];

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Try to fetch both published and draft events
        const publishedResponse = await eventsAPI.getEvents();
        const draftResponse = await eventsAPI.getEvents({ status: 'draft' });
        
        const publishedEvents = Array.isArray(publishedResponse.data?.events) ? 
          publishedResponse.data.events : [];
          
        const draftEvents = Array.isArray(draftResponse.data?.events) ? 
          draftResponse.data.events : [];
          
        // Combine both types of events
        const backendEvents = [...publishedEvents, ...draftEvents];
        
        console.log('Published events:', publishedEvents);
        console.log('Draft events:', draftEvents);
        
        // Make sure each mock event has a unique ID
        const processedMockEvents = mockEvents.map(event => {
          if (!event._id) {
            event._id = `mock-${event.id}`;
          }
          return event;
        });
        
        // Filter out mock events if a backend event exists with the same title and date
        const filteredMockEvents = processedMockEvents.filter(mock =>
          !backendEvents.some(be => 
            be.title === mock.title &&
            new Date(be.date).toDateString() === new Date(mock.date).toDateString()
          )
        );
        
        setEvents([...filteredMockEvents, ...backendEvents]);
      } catch (err) {
        console.error('Error fetching events:', err);
        setEvents([...mockEvents]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (event.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6F714B 0%, #8a8c6b 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" component="h1" gutterBottom>
              Discover Amazing Events
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Connect, learn, and grow with events tailored for you
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'background.paper'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1} flexWrap="wrap">
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    color={selectedCategory === category ? 'primary' : 'default'}
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Events Grid */}
        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            currentEvents.map((event, index) => (
              <Grid item xs={12} sm={6} md={4} key={`event-${event._id || event.id || index}`}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(111, 113, 75, 0.15)'
                      }
                    }}
                    onClick={() => handleEventClick(event._id || event.id)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.image || `https://source.unsplash.com/random/400x200/?${event.category?.toLowerCase() || 'event'}`}
                      alt={event.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400';
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h6" component="h3" sx={{ flexGrow: 1, mr: 1 }}>
                          {event.title}
                        </Typography>
                        <Chip
                          label={event.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {typeof event.location === 'object' && event.location !== null
                            ? `${event.location.venue || ''}${event.location.venue && event.location.address ? ', ' : ''}${event.location.address || ''}`
                            : event.location}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                        {event.description && event.description.length > 100 
                          ? `${event.description.substring(0, 100)}...` 
                          : event.description}
                      </Typography>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                          <Person sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.currentRegistrations || event.attendees || 0}/{event.maxRegistrations || event.maxAttendees || 0}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event._id || event.id);
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* No Results */}
        {!loading && currentEvents.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Container>
      <ChatBotWidget />
      {/* Footer Section */}
      <Box component="footer" sx={{ backgroundColor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', py: 2, mt: 4 }}>
        <Container maxWidth="lg">
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" gap={2}>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} EventEase
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                <a href="mailto:support@eventease.com" style={{ color: '#6F714B', textDecoration: 'none' }}>support@eventease.com</a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <a href="tel:+1234567890" style={{ color: '#6F714B', textDecoration: 'none' }}>+1 234 567 890</a>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
