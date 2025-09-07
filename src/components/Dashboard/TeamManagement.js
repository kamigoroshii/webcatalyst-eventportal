import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Email,
  Group
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Co-Organizer',
      status: 'active',
      joinDate: '2024-01-15',
      eventsManaged: 3
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'Event Coordinator',
      status: 'active',
      joinDate: '2024-02-01',
      eventsManaged: 1
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const getRoleColor = (role) => {
    switch (role) {
      case 'Co-Organizer': return 'primary';
      case 'Event Coordinator': return 'secondary';
      case 'Assistant': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" color="primary">
          Team Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Invite Team Member
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Team collaboration features are coming soon. Invite other organizers to help manage your events.
      </Alert>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Team Member</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Events Managed</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamMembers.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    component={TableRow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    hover
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {member.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={500}>
                            {member.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.role}
                        size="small"
                        color={getRoleColor(member.role)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.status}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{member.eventsManaged}</TableCell>
                    <TableCell>
                      {new Date(member.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small">
                        <Email />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {teamMembers.length === 0 && (
            <Box textAlign="center" py={8}>
              <Group sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No team members yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Invite collaborators to help manage your events
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setDialogOpen(true)}
              >
                Invite Team Member
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            margin="normal"
            placeholder="colleague@example.com"
          />
          <TextField
            fullWidth
            select
            label="Role"
            margin="normal"
            defaultValue="Event Coordinator"
          >
            <MenuItem value="Co-Organizer">Co-Organizer</MenuItem>
            <MenuItem value="Event Coordinator">Event Coordinator</MenuItem>
            <MenuItem value="Assistant">Assistant</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Personal Message (Optional)"
            multiline
            rows={3}
            margin="normal"
            placeholder="Join our team to help organize amazing events!"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Send Invitation</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamManagement;