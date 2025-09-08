
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
  Skeleton,
  LinearProgress
} from '@mui/material';
import { 
  Search, 
  LocationOn, 
  CalendarToday, 
  Person, 
  Event as EventIcon, 
  ArrowForward as ArrowForwardIcon,
  LocalFireDepartment as LocalFireDepartmentIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { eventsAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

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
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 18 } }
};  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6F714B 0%, #8a8c6b 100%)',
          color: 'white',
          py: { xs: 7, md: 10 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          {/* Animated background shapes */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
          }}>
            <motion.div
              animate={{
                x: [0, 60, -60, 0],
                y: [0, 30, -30, 0],
                scale: [1, 1.15, 0.95, 1]
              }}
              transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '18%',
                left: '8%',
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                filter: 'blur(12px)',
                boxShadow: '0 0 40px 10px rgba(255,255,255,0.08)'
              }}
            />
            <motion.div
              animate={{
                x: [0, -50, 50, 0],
                y: [0, -25, 25, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                bottom: '12%',
                right: '10%',
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(120deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
                filter: 'blur(8px)',
                boxShadow: '0 0 30px 8px rgba(255,255,255,0.07)'
              }}
            />
            <motion.div
              animate={{
                x: [0, 30, -30, 0],
                y: [0, -20, 20, 0],
                scale: [1, 1.1, 0.9, 1]
              }}
              transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '65%',
                left: '38%',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(120deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02))',
                filter: 'blur(6px)',
                boxShadow: '0 0 20px 4px rgba(255,255,255,0.06)'
              }}
            />
          </Box>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2.2rem' },
                letterSpacing: 0.5,
              }}
            >
              Discover Amazing Events
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Connect, learn, and grow with events tailored for you
            </Typography>
            <Button 
              variant="contained" 
              color="secondary"
              size="large"
              onClick={() => navigate('/events')}
            >
              Explore Events
            </Button>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Featured Events Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" sx={{ 
            mb: 3, 
            fontWeight: 700,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              backgroundColor: 'primary.main',
              borderRadius: 2
            }
          }}>
            Featured Events
          </Typography>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Grid container spacing={3}>
              {!loading && filteredEvents.slice(0, 3).map((event, index) => (
                <Grid item xs={12} md={4} key={`featured-${event._id || event.id || index}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(111, 113, 75, 0.15)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 32px rgba(111, 113, 75, 0.2)'
                        },
                        '&:hover .MuiCardMedia-root': {
                          transform: 'scale(1.05)'
                        }
                      }}
                      onClick={() => handleEventClick(event._id || event.id)}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={event.image || `https://source.unsplash.com/random/400x200/?${event.category?.toLowerCase() || 'event'}`}
                          alt={event.title}
                          sx={{ 
                            transition: 'transform 0.6s ease',
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                          {event.title}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={1.5}>
                          <CalendarToday sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={2}>
                          <LocationOn sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {typeof event.location === 'object' && event.location !== null
                              ? `${event.location.venue || ''}${event.location.venue && event.location.address ? ', ' : ''}${event.location.address || ''}`
                              : event.location}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {event.description && event.description.length > 120 
                            ? `${event.description.substring(0, 120)}...` 
                            : event.description}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          endIcon={<ArrowForwardIcon />}
                          sx={{ 
                            mt: 'auto',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1,
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white'
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
              
              {loading && (
                <>
                  {[1, 2, 3].map((_, index) => (
                    <Grid item xs={12} md={4} key={`featured-skeleton-${index}`}>
                      <Card sx={{ height: '100%', borderRadius: 2 }}>
                        <Skeleton variant="rectangular" height={200} animation="wave" />
                        <CardContent>
                          <Skeleton variant="text" height={40} animation="wave" />
                          <Skeleton variant="text" height={24} width="60%" animation="wave" />
                          <Skeleton variant="text" height={24} width="40%" animation="wave" />
                          <Skeleton variant="text" height={80} animation="wave" />
                          <Skeleton variant="rectangular" height={40} animation="wave" sx={{ mt: 2, borderRadius: 1 }} />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </motion.div>
        </Box>
        
        {/* Category Filters Only */}
        <Box sx={{ mb: 5 }} id="events-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
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
          </motion.div>
        </Box>

        {/* Events Grid */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" component="h2" sx={{ 
            mb: 3, 
            fontWeight: 700,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              backgroundColor: 'primary.main',
              borderRadius: 2
            }
          }}>
            Upcoming Events
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {loading ? (
            // Enhanced loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
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
                    <Skeleton variant="text" height={20} animation="wave" />
                    <Skeleton variant="text" height={20} width="90%" animation="wave" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Skeleton variant="text" width="30%" height={36} animation="wave" />
                      <Skeleton variant="rectangular" width="30%" height={36} animation="wave" sx={{ borderRadius: 1 }} />
                    </Box>
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

        {/* View All Events Button */}
        {!loading && currentEvents.length > 0 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/events')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.1rem',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(111, 113, 75, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              View All Events
            </Button>
          </Box>
        )}
      </Container>
      <ChatBotWidget />
      
      {/* Footer Section */}
      <Box 
        component="footer" 
        sx={{ 
          backgroundColor: 'background.paper', 
          borderTop: '1px solid', 
          borderColor: 'divider', 
          py: 2, 
          mt: 4 
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" gap={2}>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} EventEase
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                <a href="mailto:support@eventease.com" style={{ color: 'inherit', textDecoration: 'none' }}>support@eventease.com</a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <a href="tel:+1234567890" style={{ color: 'inherit', textDecoration: 'none' }}>+1 234 567 890</a>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
