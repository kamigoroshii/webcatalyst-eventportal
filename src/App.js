import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import EventDetailPage from './pages/EventDetailPage';
import AIAssistantPage from './pages/AIAssistantPage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import UserDashboard from './pages/UserDashboard';
import ConnectionStatus from './components/Common/ConnectionStatus';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Navbar />
          <ConnectionStatus />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Box>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;