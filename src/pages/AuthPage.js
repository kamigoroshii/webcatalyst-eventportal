import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tab,
  Tabs,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Business,
  School,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [step, setStep] = useState('role-selection'); // 'role-selection' or 'auth'
  const [activeTab, setActiveTab] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const { register: registerField, handleSubmit, formState: { errors }, reset, watch } = useForm();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    reset();

    // If switching to Sign In, skip role selection
    if (newValue === 0) {
      setStep('auth');
      setUserRole('signin'); // Set a placeholder role for sign in
    }
  };

  const handleRoleSelection = (role) => {
    setUserRole(role);
    setStep('auth');
    setError('');
    setActiveTab(1); // Set to Sign Up tab when role is selected
  };

  const handleBackToRoleSelection = () => {
    setStep('role-selection');
    setUserRole(null);
    setActiveTab(0);
    setError('');
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    console.log('Form submitted:', { activeTab, data, userRole });

    try {
      let result;
      if (activeTab === 0) {
        // Sign In
        console.log('Attempting sign in with:', data.email);
        result = await login(data.email, data.password);
        console.log('Sign in result:', result);
      } else {
        // Sign Up
        const signupData = {
          name: data.name,
          email: data.email,
          password: data.password,
          role: userRole
        };

        // Add role-specific fields
        if (userRole === 'participant') {
          signupData.college = data.college;
          if (data.phone) signupData.phone = data.phone;
        } else if (userRole === 'organizer') {
          signupData.organization = data.organization;
          signupData.position = data.position;
          if (data.phone) signupData.phone = data.phone;
          if (data.website && data.website.trim()) signupData.website = data.website;
          signupData.address = data.address;
        }

        console.log('Sending signup data:', signupData);
        result = await register(signupData);
        console.log('Sign up result:', result);
      }

      if (result.success) {
        console.log('Authentication successful, navigating...');
        // Navigate based on user role
        if (result.user.role === 'organizer') {
          navigate('/dashboard');
        } else {
          navigate('/my-dashboard');
        }
      } else {
        console.log('Authentication failed:', result.error);
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  // Role Selection Screen Component
  const RoleSelectionScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to EventEase
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Choose how you'd like to join our platform
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          {/* Participant Option */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{ flex: 1 }}
          >
            <Card
              onClick={() => handleRoleSelection('participant')}
              sx={{
                cursor: 'pointer',
                p: 3,
                height: '100%',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: (theme) => 
                    theme.palette.mode === 'dark'
                      ? '0 8px 25px rgba(138, 140, 107, 0.25)'
                      : '0 8px 25px rgba(111, 113, 75, 0.15)'
                }
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={2}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }}
                >
                  <Person sx={{ fontSize: 48 }} />
                </Box>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Join as Participant
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discover and register for amazing events in your area. Connect with like-minded people and expand your horizons.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </motion.div>

          {/* Organizer Option */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{ flex: 1 }}
          >
            <Card
              onClick={() => handleRoleSelection('organizer')}
              sx={{
                cursor: 'pointer',
                p: 3,
                height: '100%',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: (theme) => 
                    theme.palette.mode === 'dark'
                      ? '0 8px 25px rgba(138, 140, 107, 0.25)'
                      : '0 8px 25px rgba(111, 113, 75, 0.15)'
                }
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={2}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }}
                >
                  <Business sx={{ fontSize: 48 }} />
                </Box>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Join as Organizer
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create and manage events, reach your target audience. Build your community and grow your brand.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </motion.div>
        </Box>

        {/* Sign In Option */}
        <Box textAlign="center">
          <Typography variant="body1" color="text.secondary" mb={2}>
            Already have an account?
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              setStep('auth');
              setActiveTab(0);
              setUserRole('signin');
            }}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Sign In to Your Account
          </Button>
        </Box>
      </Box>
    </motion.div>
  );

  // Authentication Form Component
  const AuthFormScreen = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with Back Button */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          onClick={handleBackToRoleSelection}
          sx={{ mr: 2, minWidth: 'auto', p: 1 }}
        >
          ←
        </Button>
        <Box flex={1} textAlign="center">
          <Typography variant="h5" component="h1" gutterBottom>
            {activeTab === 0 ? 'Sign In' :
              userRole === 'participant' ? 'Participant Account' : 'Organizer Account'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0 ? 'Sign in to your account' : 'Create your account'}
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '1rem',
            minWidth: 120
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
            height: 3,
            borderRadius: 1.5
          }
        }}
      >
        <Tab label="Sign In" />
        <Tab label="Sign Up" />
      </Tabs>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={2.5}>
          {/* Sign Up Only Fields */}
          <AnimatePresence>
            {activeTab === 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box display="flex" flexDirection="column" gap={2.5}>
                  {/* Common Fields */}
                  <motion.div variants={inputVariants} whileFocus="focus">
                    <TextField
                      fullWidth
                      label="Full Name"
                      variant="outlined"
                      {...registerField('name', {
                        required: activeTab === 1 ? 'Name is required' : false
                      })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </motion.div>

                  {/* Role-specific Fields */}
                  {userRole === 'participant' ? (
                    <Box display="flex" flexDirection="column" gap={2.5}>
                      <TextField
                        fullWidth
                        label="College/University"
                        variant="outlined"
                        {...registerField('college', {
                          required: activeTab === 1 && userRole === 'participant' ? 'College is required' : false
                        })}
                        error={!!errors.college}
                        helperText={errors.college?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <School color="action" />
                            </InputAdornment>
                          )
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        {...registerField('phone', {
                          required: activeTab === 1 && userRole === 'participant' ? 'Phone number is required' : false,
                          pattern: {
                            value: /^\+?[\d\s\-()]+$/,
                            message: 'Please enter a valid phone number'
                          }
                        })}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="action" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>
                  ) : (
                    <Box display="flex" flexDirection="column" gap={2.5}>
                      <TextField
                        fullWidth
                        label="Organization/Company"
                        variant="outlined"
                        {...registerField('organization', {
                          required: activeTab === 1 && userRole === 'organizer' ? 'Organization is required' : false
                        })}
                        error={!!errors.organization}
                        helperText={errors.organization?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Business color="action" />
                            </InputAdornment>
                          )
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Position/Title"
                        variant="outlined"
                        {...registerField('position', {
                          required: activeTab === 1 && userRole === 'organizer' ? 'Position is required' : false
                        })}
                        error={!!errors.position}
                        helperText={errors.position?.message}
                      />
                      <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        {...registerField('phone', {
                          required: activeTab === 1 && userRole === 'organizer' ? 'Phone number is required' : false,
                          pattern: {
                            value: /^\+?[\d\s\-\(\)]+$/,
                            message: 'Please enter a valid phone number'
                          }
                        })}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="action" />
                            </InputAdornment>
                          )
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Website (Optional)"
                        variant="outlined"
                        {...registerField('website', {
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message: 'Please enter a valid URL (starting with http:// or https://)'
                          }
                        })}
                        error={!!errors.website}
                        helperText={errors.website?.message}
                      />
                      <TextField
                        fullWidth
                        label="Address"
                        variant="outlined"
                        multiline
                        rows={2}
                        {...registerField('address', {
                          required: activeTab === 1 && userRole === 'organizer' ? 'Address is required' : false
                        })}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                              <LocationOn color="action" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Field */}
          <motion.div variants={inputVariants} whileFocus="focus">
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              {...registerField('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </motion.div>

          {/* Password Field */}
          <motion.div variants={inputVariants} whileFocus="focus">
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              {...registerField('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </motion.div>

          {/* Remember Me / Forgot Password */}
          {activeTab === 0 && (
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember me"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
              />
              <Link
                href="#"
                color="primary"
                sx={{ fontSize: '0.9rem', textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
            </Box>
          )}

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                activeTab === 0 ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </motion.div>
        </Box>
      </form>
    </motion.div>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(135deg, #FDFBE8 0%, #f5f3e0 100%)',
        padding: 2
      }}
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card
          sx={{
            maxWidth: 800,
            width: '100%',
            backgroundColor: 'background.paper',
            boxShadow: (theme) => 
              theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(111, 113, 75, 0.15)',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <AnimatePresence mode="wait">
              {step === 'role-selection' ? (
                <RoleSelectionScreen key="role-selection" />
              ) : (
                <AuthFormScreen key="auth-form" />
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default AuthPage;