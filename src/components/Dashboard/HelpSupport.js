import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  MenuItem
} from '@mui/material';
import {
  ExpandMore,
  Help,
  Email,
  Phone,
  Chat,
  Book,
  VideoLibrary,
  BugReport,
  Feedback
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const HelpSupport = () => {
  const [expanded, setExpanded] = useState('faq1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      id: 'faq1',
      question: 'How do I create a new event?',
      answer: 'To create a new event, go to the "Add New Event" section in your dashboard. Fill in all the required details including event title, description, date, time, location, and registration limits. You can also use our AI Description Generator to create compelling event descriptions.'
    },
    {
      id: 'faq2',
      question: 'How can I view event registrations?',
      answer: 'Navigate to the "Registrations" section in your dashboard to view all registrations for your events. You can filter by event, export data to CSV, and manage individual registrations including check-ins.'
    },
    {
      id: 'faq3',
      question: 'Can I edit an event after publishing?',
      answer: 'Yes, you can edit most event details after publishing. Go to "Events List", find your event, and click the edit button. Note that some changes might affect existing registrations, so participants will be notified of significant updates.'
    },
    {
      id: 'faq4',
      question: 'How do I check in participants at the event?',
      answer: 'Use the QR code scanner feature in the registrations section to quickly check in participants. You can also manually mark attendees as checked in from the registration management interface.'
    },
    {
      id: 'faq5',
      question: 'What analytics are available?',
      answer: 'The Analytics section provides comprehensive insights including registration trends, participant demographics, event performance metrics, and conversion rates. You can filter data by different time periods.'
    }
  ];

  const supportOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: <Email />,
      action: 'support@eventease.com',
      color: 'primary'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: <Chat />,
      action: 'Start Chat',
      color: 'success'
    },
    {
      title: 'Phone Support',
      description: 'Call us for urgent issues',
      icon: <Phone />,
      action: '+1 (555) 123-4567',
      color: 'warning'
    }
  ];

  const resources = [
    {
      title: 'User Guide',
      description: 'Complete guide to using EventEase',
      icon: <Book />,
      type: 'PDF'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video tutorials',
      icon: <VideoLibrary />,
      type: 'Video'
    },
    {
      title: 'API Documentation',
      description: 'For developers and integrations',
      icon: <Help />,
      type: 'Web'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        Help & Support
      </Typography>

      <Grid container spacing={3}>
        {/* Contact Support */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Support
              </Typography>
              <List>
                {supportOptions.map((option, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '50%',
                          backgroundColor: `${option.color}.light`,
                          color: `${option.color}.main`
                        }}
                      >
                        {option.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={option.title}
                      secondary={option.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resources
              </Typography>
              <List>
                {resources.map((resource, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {resource.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={resource.title}
                      secondary={resource.description}
                    />
                    <Chip label={resource.type} size="small" variant="outlined" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* FAQ */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Frequently Asked Questions
              </Typography>
              
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Accordion
                    expanded={expanded === faq.id}
                    onChange={handleChange(faq.id)}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Feedback */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Submit Feedback
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Help us improve EventEase by sharing your feedback and suggestions.
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Subject"
                    placeholder="Brief description of your feedback"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Category"
                    defaultValue="general"
                  >
                    <MenuItem value="general">General Feedback</MenuItem>
                    <MenuItem value="bug">Bug Report</MenuItem>
                    <MenuItem value="feature">Feature Request</MenuItem>
                    <MenuItem value="improvement">Improvement Suggestion</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Feedback"
                    placeholder="Please describe your feedback in detail..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<Feedback />}
                    >
                      Submit Feedback
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<BugReport />}
                    >
                      Report Bug
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HelpSupport;