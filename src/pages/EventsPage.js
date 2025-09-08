import React, { useState, useEffect } from 'react';
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
  Skeleton,
  LinearProgress,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { 
  Search, 
  LocationOn, 
  CalendarToday, 
  Person, 
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { eventsAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const categories = ['All', 'Technology', 'Marketing', 'Business', 'Design', 'Finance', 'Entertainment'];

// Mock data - same as HomePage
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
  },
  {
    id: 3,
    title: 'UX/UI Design Workshop',
    date: '2024-04-10',
    location: 'Design Studio Downtown',
    description: 'Learn the latest design trends and tools from industry experts.',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400',
    category: 'Design',
    attendees: 85,
    maxAttendees: 100
  },
  {
    id: 4,
    title: 'Financial Planning Seminar',
    date: '2024-04-20',
    location: 'Business Center Plaza',
    description: 'Master your personal and business finances with expert guidance.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    category: 'Finance',
    attendees: 65,
    maxAttendees: 80
  },
  {
    id: 5,
    title: 'Music Festival 2024',
    date: '2024-05-15',
    location: 'City Park Amphitheater',
    description: 'A spectacular music festival featuring top artists from around the world.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    category: 'Entertainment',
    attendees: 1500,
    maxAttendees: 2000
  }
];

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9; // Show more events per page
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Home
          </MuiLink>
          <Typography color="text.primary">All Events</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 2
            }}
          >
            All Events
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Discover and join amazing events happening around you
          </Typography>
        </Box>

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
                    backgroundColor: 'background.paper',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover, &.Mui-focused': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1} flexWrap="wrap" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    color={selectedCategory === category ? 'primary' : 'default'}
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: '16px',
                      fontWeight: selectedCategory === category ? 600 : 400,
                      px: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Events Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {loading ? 'Loading...' : `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} found`}
          </Typography>
        </Box>

        {/* Events Grid */}
        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            Array.from({ length: 9 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  <Skeleton variant="rectangular" height={200} animation="wave" />
                  <CardContent>
                    <Skeleton variant="text" height={32} animation="wave" />
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                      <Skeleton variant="circular" width={20} height={20} animation="wave" sx={{ mr: 1 }} />
                      <Skeleton variant="text" height={20} width="60%" animation="wave" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                      <Skeleton variant="circular" width={20} height={20} animation="wave" sx={{ mr: 1 }} />
                      <Skeleton variant="text" height={20} width="70%" animation="wave" />
                    </Box>
                    <Skeleton variant="text" height={60} animation="wave" />
                    <Skeleton variant="rectangular" width="100%" height={36} animation="wave" sx={{ mt: 2, borderRadius: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            currentEvents.map((event, index) => {
              const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              const percentFull = event.currentRegistrations || event.attendees && event.maxRegistrations || event.maxAttendees ? 
                Math.round(((event.currentRegistrations || event.attendees) / (event.maxRegistrations || event.maxAttendees)) * 100) : null;
                
              return (
                <Grid item xs={12} sm={6} md={4} key={`event-${event._id || event.id || index}`}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        '&:hover': {
                          boxShadow: '0 12px 28px rgba(111, 113, 75, 0.18)'
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
                        sx={{ 
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                          <Typography variant="h6" component="h3" sx={{ 
                            flexGrow: 1, 
                            mr: 1,
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3
                          }}>
                            {event.title}
                          </Typography>
                          <Chip
                            label={event.category}
                            size="small"
                            color="primary"
                            sx={{ 
                              ml: 1, 
                              fontWeight: 500,
                              bgcolor: 'rgba(111, 113, 75, 0.1)',
                              color: 'primary.main',
                              borderColor: 'primary.main'
                            }}
                            variant="outlined"
                          />
                        </Box>
                        
                        <Box display="flex" alignItems="center" mb={1.5}>
                          <CalendarToday sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {formattedDate}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={1.5}>
                          <LocationOn sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {typeof event.location === 'object' && event.location !== null
                              ? `${event.location.venue || ''}${event.location.venue && event.location.address ? ', ' : ''}${event.location.address || ''}`
                              : event.location}
                          </Typography>
                        </Box>

                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2, 
                            flexGrow: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.5
                          }}
                        >
                          {event.description || "No description available"}
                        </Typography>

                        {percentFull !== null && (
                          <Box sx={{ mt: 0.5, mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {event.currentRegistrations || event.attendees || 0} / {event.maxRegistrations || event.maxAttendees || 0} spots filled
                              </Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                {percentFull}%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={percentFull} 
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: 'rgba(0,0,0,0.05)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: 'success.main',
                                }
                              }} 
                            />
                          </Box>
                        )}

                        <Button
                          variant="contained"
                          fullWidth
                          endIcon={<ArrowForwardIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event._id || event.id);
                          }}
                          sx={{
                            mt: 'auto',
                            py: 1,
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: 2,
                            '&:hover': {
                              boxShadow: 4,
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease'
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })
          )}
        </Grid>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={6}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        )}

        {/* No Results */}
        {!loading && currentEvents.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/"
              sx={{ borderRadius: 2 }}
            >
              Back to Home
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default EventsPage;
