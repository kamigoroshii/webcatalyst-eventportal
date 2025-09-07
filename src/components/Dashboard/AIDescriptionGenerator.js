import React, { useState } from 'react';
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
  Paper,
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  AutoAwesome,
  ContentCopy,
  Refresh,
  Save
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const eventTypes = [
  'Conference',
  'Workshop',
  'Seminar',
  'Meetup',
  'Webinar',
  'Competition',
  'Networking Event',
  'Training Session',
  'Panel Discussion',
  'Hackathon'
];

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

const tones = [
  'Professional',
  'Casual',
  'Exciting',
  'Informative',
  'Inspiring',
  'Technical'
];

const AIDescriptionGenerator = () => {
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const watchedValues = watch();

  const generateDescription = async (data) => {
    setLoading(true);
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI-generated description based on inputs
      const description = createMockDescription(data);
      setGeneratedDescription(description);
      
    } catch (error) {
      console.error('Error generating description:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMockDescription = (data) => {
    const { eventType, category, topic, audience, duration, tone, highlights } = data;
    
    let description = '';
    
    // Opening based on tone
    switch (tone) {
      case 'Exciting':
        description += `🚀 Get ready for an incredible ${eventType.toLowerCase()} experience! `;
        break;
      case 'Professional':
        description += `Join us for a comprehensive ${eventType.toLowerCase()} focused on ${topic}. `;
        break;
      case 'Inspiring':
        description += `Transform your understanding of ${topic} at this inspiring ${eventType.toLowerCase()}. `;
        break;
      default:
        description += `Discover the latest in ${topic} at our upcoming ${eventType.toLowerCase()}. `;
    }
    
    // Main content
    description += `This ${duration} ${eventType.toLowerCase()} is specifically designed for ${audience} who want to deepen their knowledge in ${category.toLowerCase()}. `;
    
    // Highlights
    if (highlights) {
      description += `\n\n🌟 What You'll Experience:\n`;
      const highlightsList = highlights.split(',').map(h => h.trim()).filter(h => h);
      highlightsList.forEach(highlight => {
        description += `• ${highlight}\n`;
      });
    }
    
    // Call to action based on tone
    switch (tone) {
      case 'Exciting':
        description += `\n🎯 Don't miss this amazing opportunity to connect, learn, and grow! Register now and be part of something extraordinary!`;
        break;
      case 'Professional':
        description += `\n📈 This event offers valuable insights and networking opportunities for professionals in the ${category.toLowerCase()} industry. Secure your spot today.`;
        break;
      case 'Inspiring':
        description += `\n✨ Join a community of like-minded individuals and take your ${category.toLowerCase()} journey to the next level. Your transformation starts here!`;
        break;
      default:
        description += `\n🎪 Register today to secure your place at this essential ${category.toLowerCase()} event.`;
    }
    
    return description;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedDescription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleRegenerate = () => {
    if (watchedValues.eventType && watchedValues.topic) {
      generateDescription(watchedValues);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        AI Description Generator
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Let AI help you create compelling event descriptions that attract the right audience.
      </Typography>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Event Details
                </Typography>

                <form onSubmit={handleSubmit(generateDescription)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Event Type"
                        {...register('eventType', { required: 'Event type is required' })}
                        error={!!errors.eventType}
                        helperText={errors.eventType?.message}
                      >
                        {eventTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
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

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Topic/Theme"
                        placeholder="e.g., Artificial Intelligence, Digital Marketing, Startup Funding"
                        {...register('topic', { required: 'Topic is required' })}
                        error={!!errors.topic}
                        helperText={errors.topic?.message}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Target Audience"
                        placeholder="e.g., Software developers, Marketing professionals, Entrepreneurs"
                        {...register('audience', { required: 'Target audience is required' })}
                        error={!!errors.audience}
                        helperText={errors.audience?.message}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Duration"
                        placeholder="e.g., 2-hour, full-day, 3-day"
                        {...register('duration', { required: 'Duration is required' })}
                        error={!!errors.duration}
                        helperText={errors.duration?.message}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Tone"
                        {...register('tone', { required: 'Tone is required' })}
                        error={!!errors.tone}
                        helperText={errors.tone?.message}
                      >
                        {tones.map((tone) => (
                          <MenuItem key={tone} value={tone}>
                            {tone}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Key Highlights (Optional)"
                        placeholder="Separate multiple highlights with commas"
                        {...register('highlights')}
                        helperText="e.g., Expert speakers, Hands-on workshops, Networking opportunities"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
                        disabled={loading}
                        fullWidth
                        size="large"
                      >
                        {loading ? 'Generating...' : 'Generate Description'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Generated Description */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" color="primary">
                    Generated Description
                  </Typography>
                  {generatedDescription && (
                    <Box display="flex" gap={1}>
                      <IconButton
                        onClick={handleRegenerate}
                        color="primary"
                        disabled={loading}
                        title="Regenerate"
                      >
                        <Refresh />
                      </IconButton>
                      <IconButton
                        onClick={handleCopy}
                        color="primary"
                        title="Copy to clipboard"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {loading ? (
                  <Box display="flex" alignItems="center" justifyContent="center" py={8}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary" ml={2}>
                      AI is crafting your description...
                    </Typography>
                  </Box>
                ) : generatedDescription ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      backgroundColor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: 1.7
                      }}
                    >
                      {generatedDescription}
                    </Typography>
                  </Paper>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    py={8}
                    sx={{
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      backgroundColor: 'background.default'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Fill in the event details and click "Generate Description"<br />
                      to create your AI-powered event description
                    </Typography>
                  </Box>
                )}

                {copied && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Description copied to clipboard!
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Tips */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            💡 Tips for Better Descriptions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                label="Be specific about your topic"
                variant="outlined"
                sx={{ mb: 1, mr: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                label="Define your target audience clearly"
                variant="outlined"
                sx={{ mb: 1, mr: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                label="Include key highlights and benefits"
                variant="outlined"
                sx={{ mb: 1, mr: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip
                label="Choose the right tone for your audience"
                variant="outlined"
                sx={{ mb: 1, mr: 1 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AIDescriptionGenerator;