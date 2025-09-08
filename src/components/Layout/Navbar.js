import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  AccountCircle,
  Event as EventIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isOrganizer } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/home', key: 'home' },
    { label: 'AI Assistant', path: '/ai-assistant', key: 'ai-assistant' },
    ...(isOrganizer 
      ? [{ label: 'Organizer Dashboard', path: '/dashboard', key: 'organizer-dashboard' }] 
      : user 
        ? [{ label: 'My Dashboard', path: '/my-dashboard', key: 'user-dashboard' }] 
        : []
    )
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        {/* Logo - hidden on organizer dashboard and user dashboard */}
        {!(location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/my-dashboard')) && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ marginRight: 24 }}
          >
            <Box 
              display="flex" 
              alignItems="center" 
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(user ? '/home' : '/')}
            >
              <EventIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  letterSpacing: '-0.5px'
                }}
              >
                EventEase
              </Typography>
            </Box>
          </motion.div>
        )}

        <Box display="flex" alignItems="center" gap={2} sx={{ ml: 'auto' }}>
          {navItems.map((item) => (
            <motion.div
              key={item.key}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Button
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: location.pathname === item.path ? '100%' : '0%',
                    height: 2,
                    backgroundColor: 'primary.main',
                    transition: 'width 0.3s ease'
                  },
                  '&:hover::after': {
                    width: '100%'
                  }
                }}
              >
                {item.label}
              </Button>
            </motion.div>
          ))}

          {/* Theme Toggle */}
          <IconButton onClick={toggleTheme} color="primary">
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          {/* User Menu */}
          {user ? (
            <>
              <IconButton onClick={handleMenuOpen} color="primary">
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{ borderRadius: 2 }}
              >
                Sign In
              </Button>
            </motion.div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;