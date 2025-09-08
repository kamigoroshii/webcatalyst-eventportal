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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  LocationOn,
  People,
  Event
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const VenueManagement = () => {
  const [venues, setVenues] = useState([
    {
      id: 1,
      name: 'Silicon Valley Convention Center',
      address: '123 Tech Street, Silicon Valley, CA 94000',
      capacity: 500,
      facilities: ['WiFi', 'Projector', 'Sound System', 'Parking'],
      status: 'active',
      eventsCount: 3
    },
    {
      id: 2,
      name: 'Downtown Business Center',
      address: '456 Business Ave, Downtown, CA 90210',
      capacity: 200,
      facilities: ['WiFi', 'Projector', 'Catering'],
      status: 'active',
      eventsCount: 1
    },
    {
      id: 3,
      name: 'Innovation Hub',
      address: '789 Innovation Blvd, Tech City, CA 95000',
      capacity: 150,
      facilities: ['WiFi', 'Whiteboard', 'Coffee Station'],
      status: 'maintenance',
      eventsCount: 0
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleAddVenue = () => {
    setEditingVenue(null);
    reset();
    setDialogOpen(true);
  };

  const handleEditVenue = (venue) => {
    setEditingVenue(venue);
    reset({
      name: venue.name,
      address: venue.address,
      capacity: venue.capacity,
      facilities: venue.facilities.join(', ')
    });
    setDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteVenue = (venueId) => {
    setVenues(venues.filter(venue => venue.id !== venueId));
    setAnchorEl(null);
  };

  const onSubmit = (data) => {
    const facilitiesArray = data.facilities.split(',').map(f => f.trim()).filter(f => f);
    
    if (editingVenue) {
      // Update existing venue
      setVenues(venues.map(venue => 
        venue.id === editingVenue.id 
          ? { ...venue, ...data, facilities: facilitiesArray }
          : venue
      ));
    } else {
      // Add new venue
      const newVenue = {
        id: Date.now(),
        ...data,
        facilities: facilitiesArray,
        status: 'active',
        eventsCount: 0
      };
      setVenues([...venues, newVenue]);
    }
    
    setDialogOpen(false);
    reset();
  };

  const handleMenuOpen = (event, venue) => {
    setAnchorEl(event.currentTarget);
    setSelectedVenue(venue);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVenue(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" color="primary">
          Venue Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddVenue}
        >
          Add Venue
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Venue Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="center">Capacity</TableCell>
                  <TableCell>Facilities</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Events</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {venues.map((venue, index) => (
                  <motion.tr
                    key={venue.id}
                    component={TableRow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight={500}>
                          {venue.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {venue.address}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <People sx={{ mr: 0.5, fontSize: 16 }} />
                        {venue.capacity}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {venue.facilities.slice(0, 2).map((facility, idx) => (
                          <Chip
                            key={idx}
                            label={facility}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {venue.facilities.length > 2 && (
                          <Chip
                            label={`+${venue.facilities.length - 2} more`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={venue.status}
                        size="small"
                        color={getStatusColor(venue.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Event sx={{ mr: 0.5, fontSize: 16 }} />
                        {venue.eventsCount}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, venue)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {venues.length === 0 && (
            <Box textAlign="center" py={8}>
              <LocationOn sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No venues added yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Add your first venue to start managing event locations
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddVenue}
              >
                Add Venue
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditVenue(selectedVenue)}>
          <Edit sx={{ mr: 1 }} />
          Edit Venue
        </MenuItem>
        <MenuItem 
          onClick={() => handleDeleteVenue(selectedVenue?.id)}
          sx={{ color: 'error.main' }}
          disabled={selectedVenue?.eventsCount > 0}
        >
          <Delete sx={{ mr: 1 }} />
          Delete Venue
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingVenue ? 'Edit Venue' : 'Add New Venue'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Venue Name"
                  {...register('name', { required: 'Venue name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  {...register('address', { required: 'Address is required' })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Capacity"
                  type="number"
                  {...register('capacity', { 
                    required: 'Capacity is required',
                    min: { value: 1, message: 'Capacity must be at least 1' }
                  })}
                  error={!!errors.capacity}
                  helperText={errors.capacity?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Facilities"
                  placeholder="WiFi, Projector, Sound System, Parking (comma separated)"
                  {...register('facilities')}
                  helperText="Enter facilities separated by commas"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingVenue ? 'Update' : 'Add'} Venue
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default VenueManagement;