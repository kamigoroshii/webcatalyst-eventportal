import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Search,
  Download,
  FilterList,
  Visibility
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv';

// Mock registration data
const mockRegistrations = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    college: 'Stanford University',
    phone: '+1 (555) 123-4567',
    eventTitle: 'Tech Innovation Summit 2024',
    eventId: 1,
    registrationDate: '2024-02-15',
    status: 'confirmed',
    registrationId: 'REG-001'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    college: 'MIT',
    phone: '+1 (555) 234-5678',
    eventTitle: 'Tech Innovation Summit 2024',
    eventId: 1,
    registrationDate: '2024-02-16',
    status: 'confirmed',
    registrationId: 'REG-002'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    college: 'UC Berkeley',
    phone: '+1 (555) 345-6789',
    eventTitle: 'Digital Marketing Masterclass',
    eventId: 2,
    registrationDate: '2024-02-17',
    status: 'pending',
    registrationId: 'REG-003'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    college: 'Harvard University',
    phone: '+1 (555) 456-7890',
    eventTitle: 'Startup Pitch Competition',
    eventId: 3,
    registrationDate: '2024-02-18',
    status: 'confirmed',
    registrationId: 'REG-004'
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@email.com',
    college: 'Yale University',
    phone: '+1 (555) 567-8901',
    eventTitle: 'Tech Innovation Summit 2024',
    eventId: 1,
    registrationDate: '2024-02-19',
    status: 'cancelled',
    registrationId: 'REG-005'
  }
];

const mockEvents = [
  { id: 'all', title: 'All Events' },
  { id: 1, title: 'Tech Innovation Summit 2024' },
  { id: 2, title: 'Digital Marketing Masterclass' },
  { id: 3, title: 'Startup Pitch Competition' }
];

const ViewRegistrations = () => {
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter registrations
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.college.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = selectedEvent === 'all' || registration.eventId === selectedEvent;
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
    
    return matchesSearch && matchesEvent && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Prepare CSV data
  const csvData = filteredRegistrations.map(reg => ({
    'Registration ID': reg.registrationId,
    'Name': reg.name,
    'Email': reg.email,
    'College': reg.college,
    'Phone': reg.phone,
    'Event': reg.eventTitle,
    'Registration Date': reg.registrationDate,
    'Status': reg.status
  }));

  const csvHeaders = [
    { label: 'Registration ID', key: 'Registration ID' },
    { label: 'Name', key: 'Name' },
    { label: 'Email', key: 'Email' },
    { label: 'College', key: 'College' },
    { label: 'Phone', key: 'Phone' },
    { label: 'Event', key: 'Event' },
    { label: 'Registration Date', key: 'Registration Date' },
    { label: 'Status', key: 'Status' }
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        Event Registrations
      </Typography>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            {/* Filters */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap" alignItems="center">
              <TextField
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />

              <TextField
                select
                label="Event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {mockEvents.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    {event.title}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>

              <Box flexGrow={1} />

              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={`registrations-${new Date().toISOString().split('T')[0]}.csv`}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  disabled={filteredRegistrations.length === 0}
                >
                  Export CSV
                </Button>
              </CSVLink>
            </Box>

            {/* Summary */}
            <Alert severity="info" sx={{ mb: 3 }}>
              Showing {filteredRegistrations.length} registration(s)
              {selectedEvent !== 'all' && ` for ${mockEvents.find(e => e.id === selectedEvent)?.title}`}
            </Alert>

            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Registration ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>College</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRegistrations
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((registration) => (
                      <TableRow key={registration.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {registration.registrationId}
                          </Typography>
                        </TableCell>
                        <TableCell>{registration.name}</TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.college}</TableCell>
                        <TableCell>{registration.phone}</TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {registration.eventTitle}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(registration.registrationDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={registration.status}
                            size="small"
                            color={getStatusColor(registration.status)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredRegistrations.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* No Results */}
            {filteredRegistrations.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No registrations found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ViewRegistrations;