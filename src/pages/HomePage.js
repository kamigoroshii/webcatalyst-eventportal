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
  Skeleton
} from '@mui/material';
import { Search, LocationOn, CalendarToday, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  {
    id: 3,
    title: 'Startup Pitch Competition',
    date: '2024-03-25',
    location: 'Innovation Hub',
    description: 'Watch promising startups pitch their ideas to investors.',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
    category: 'Business',
    attendees: 180,
    maxAttendees: 200
  },
  {
    id: 4,
    title: 'AI & Machine Learning Workshop',
    date: '2024-04-01',
    location: 'Tech Campus Auditorium',
    description: 'Hands-on workshop covering latest AI and ML techniques.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    category: 'Technology',
    attendees: 95,
    maxAttendees: 100
  },
  {
    id: 5,
    title: 'Creative Design Conference',
    date: '2024-04-05',
    location: 'Art District Gallery',
    description: 'Explore the latest trends in creative design and UX.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    category: 'Design',
    attendees: 160,
    maxAttendees: 180
  },
  {
    id: 6,
    title: 'Blockchain & Crypto Summit',
    date: '2024-04-10',
    location: 'Financial District Center',
    description: 'Deep dive into blockchain technology and cryptocurrency trends.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    category: 'Finance',
    attendees: 220,
    maxAttendees: 250
  }
];

const categories = ['All', 'Technology', 'Marketing', 'Business', 'Design', 'Finance'];

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
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

      <Container maxWidth="lg" sx={{ py: 4 }}>
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
              <Grid item xs={12} sm={6} md={4} key={index}>
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
              <Grid item xs={12} sm={6} md={4} key={event.id}>
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
                    onClick={() => handleEventClick(event.id)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.image}
                      alt={event.title}
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
                          {event.location}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                        {event.description}
                      </Typography>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                          <Person sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.attendees}/{event.maxAttendees}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event.id);
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
    </Box>
  );
};

export default HomePage;