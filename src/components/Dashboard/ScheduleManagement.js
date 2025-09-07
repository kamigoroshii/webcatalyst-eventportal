import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Schedule,
  DragIndicator
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      eventName: 'Tech Innovation Summit 2024',
      items: [
        { time: '09:00', activity: 'Registration & Welcome Coffee', duration: 60 },
        { time: '10:00', activity: 'Keynote: Future of AI', duration: 90 },
        { time: '11:30', activity: 'Panel: Startup Ecosystem', duration: 90 },
        { time: '13:00', activity: 'Lunch & Networking', duration: 90 },
        { time: '14:30', activity: 'Workshop: Cloud Technologies', duration: 90 },
        { time: '16:00', activity: 'Investor Pitch Session', duration: 90 },
        { time: '17:30', activity: 'Closing Remarks', duration: 30 }
      ]
    }
  ]);

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        Schedule Management
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Drag and drop interface for schedule management is coming soon. For now, you can manage schedules through the event creation form.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Event Schedules
          </Typography>
          
          {schedules.map((schedule) => (
            <Card key={schedule.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {schedule.eventName}
                </Typography>
                <List dense>
                  {schedule.items.map((item, index) => (
                    <ListItem key={index}>
                      <DragIndicator sx={{ mr: 1, color: 'text.secondary' }} />
                      <ListItemText
                        primary={item.activity}
                        secondary={`${item.time} (${item.duration} minutes)`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ScheduleManagement;