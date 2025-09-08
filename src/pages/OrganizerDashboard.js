import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event,
  Add,
  People,
  AutoAwesome,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Notifications,
  Settings,
  Help,
  Logout,
  Analytics,

  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import DashboardHome from '../components/Dashboard/DashboardHome';
import EventsList from '../components/Dashboard/EventsList';
import AddEditEvent from '../components/Dashboard/AddEditEvent';
import ViewRegistrations from '../components/Dashboard/ViewRegistrations';
import AIDescriptionGenerator from '../components/Dashboard/AIDescriptionGenerator';
import NotificationsPage from '../components/Dashboard/NotificationsPage';
import ProfileSettings from '../components/Dashboard/ProfileSettings';
import AnalyticsComponent from '../components/Dashboard/Analytics';
import VenueManagement from '../components/Dashboard/VenueManagement';
import ScheduleManagement from '../components/Dashboard/ScheduleManagement';
import TeamManagement from '../components/Dashboard/TeamManagement';
import HelpSupport from '../components/Dashboard/HelpSupport';
import Management from '../components/Dashboard/Management';

const drawerWidth = 280;
const collapsedDrawerWidth = 70;

const OrganizerDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [eventsExpanded, setEventsExpanded] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const currentDrawerWidth = sidebarCollapsed ? collapsedDrawerWidth : drawerWidth;

  const mainMenuItems = [
    { text: 'Dashboard Home', icon: <DashboardIcon />, path: '/dashboard', key: 'dashboard' },
    { text: 'Notifications', icon: <Notifications />, path: '/dashboard/notifications', key: 'notifications' },
  ];

  const eventMenuItems = [
    { text: 'Events List', icon: <Event />, path: '/dashboard/events', key: 'events' },
    { text: 'Add New Event', icon: <Add />, path: '/dashboard/add-event', key: 'add-event' },
    { text: 'Registrations', icon: <People />, path: '/dashboard/registrations', key: 'registrations' },
    { text: 'AI Generator', icon: <AutoAwesome />, path: '/dashboard/ai-generator', key: 'ai-generator' },
  ];

  const managementMenuItem = { text: 'Management', icon: <Analytics />, path: '/dashboard/management', key: 'management' };

  const bottomMenuItems = [
    { text: 'Profile Settings', icon: <Settings />, path: '/dashboard/profile', key: 'profile' },
    { text: 'Help & Support', icon: <Help />, path: '/dashboard/help', key: 'help' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const renderMenuItem = (item, isSubItem = false) => (
    <ListItem key={item.key} disablePadding sx={{ pl: isSubItem && !sidebarCollapsed ? 2 : 0 }}>
      <ListItemButton
        selected={location.pathname === item.path}
        onClick={() => handleMenuClick(item.path)}
        sx={{
          minHeight: 48,
          justifyContent: sidebarCollapsed ? 'center' : 'initial',
          px: 2.5,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
              color: 'white',
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: sidebarCollapsed ? 0 : 3,
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ListItemText primary={item.text} />
            </motion.div>
          )}
        </AnimatePresence>
      </ListItemButton>
    </ListItem>
  );

  const renderExpandableSection = (title, items, expanded, setExpanded) => (
    <>
      {!sidebarCollapsed && (
        <ListItem disablePadding>
          <ListItemButton onClick={() => setExpanded(!expanded)}>
            <ListItemText 
              primary={title} 
              sx={{ 
                '& .MuiTypography-root': { 
                  fontWeight: 600, 
                  fontSize: '0.875rem',
                  color: 'text.secondary'
                } 
              }} 
            />
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
      )}
      <Collapse in={expanded || sidebarCollapsed} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item) => renderMenuItem(item, true))}
        </List>
      </Collapse>
    </>
  );

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Toolbar sx={{ justifyContent: sidebarCollapsed ? 'center' : 'space-between' }}>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 32,
                    height: 32,
                    mr: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="primary" fontWeight={600}>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Organizer
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        {sidebarCollapsed && (
          <Typography
            variant="h6"
            color="primary"
            fontWeight={700}
            sx={{ letterSpacing: 1 }}
            noWrap
          >
            EventEase
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={handleSidebarToggle} size="small">
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Toolbar>
      
      <Divider />

      {/* Menu Items */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {/* Main Menu */}
          {mainMenuItems.map((item) => renderMenuItem(item))}
          
          <Divider sx={{ my: 1 }} />
          
          {/* Events Section */}
          {renderExpandableSection('Events', eventMenuItems, eventsExpanded, setEventsExpanded)}
          
          <Divider sx={{ my: 1 }} />
          
          {/* Management Section */}
          {renderMenuItem(managementMenuItem)}
        </List>
      </Box>

      {/* Bottom Menu */}
      <Box>
        <Divider />
        <List>
          {bottomMenuItems.map((item) => renderMenuItem(item))}
          
          {/* Logout */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: sidebarCollapsed ? 'center' : 'initial',
                px: 2.5,
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sidebarCollapsed ? 0 : 3,
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                <Logout />
              </ListItemIcon>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListItemText primary="Logout" />
                  </motion.div>
                )}
              </AnimatePresence>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
            ml: { sm: `${currentDrawerWidth}px` },
            display: { md: 'none' }
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Organizer Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: isMobile ? drawerWidth : currentDrawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {isMobile && <Toolbar />}
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/add-event" element={<AddEditEvent />} />
            <Route path="/edit-event/:id" element={<AddEditEvent />} />
            <Route path="/registrations" element={<ViewRegistrations />} />
            <Route path="/ai-generator" element={<AIDescriptionGenerator />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/management" element={<Management />} />
            <Route path="/analytics" element={<AnalyticsComponent />} />
            <Route path="/venues" element={<VenueManagement />} />
            <Route path="/schedules" element={<ScheduleManagement />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/help" element={<HelpSupport />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default OrganizerDashboard;