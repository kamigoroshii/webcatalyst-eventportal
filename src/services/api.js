import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle network errors (backend not running)
    if (!error.response) {
      return Promise.reject({
        message: 'Backend server is not running. Please start the backend server.',
        status: null,
        data: null,
        code: 'NETWORK_ERROR'
      });
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('eventease_token');
      localStorage.removeItem('eventease_user');
      // Only redirect if not already on auth page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    return Promise.reject({
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  logout: () => api.post('/auth/logout'),
};

// Events API
export const eventsAPI = {
  getEvents: (params = {}) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getMyEvents: (params = {}) => api.get('/events/organizer/my-events', { params }),
  getCategories: () => api.get('/events/meta/categories'),
};

// Registrations API
export const registrationsAPI = {
  register: (registrationData) => api.post('/registrations', registrationData),
  getMyRegistrations: (params = {}) => api.get('/registrations/my-registrations', { params }),
  getRegistration: (registrationId) => api.get(`/registrations/${registrationId}`),
  cancelRegistration: (registrationId, reason) => 
    api.put(`/registrations/${registrationId}/cancel`, { reason }),
  getEventRegistrations: (eventId, params = {}) => 
    api.get(`/registrations/event/${eventId}`, { params }),
  getAllRegistrations: (params = {}) => api.get('/registrations/all', { params }),
  checkInUser: (registrationId, method) => 
    api.put(`/registrations/${registrationId}/check-in`, { method }),
  submitFeedback: (registrationId, feedbackData) => 
    api.post(`/registrations/${registrationId}/feedback`, feedbackData),
};

// Users API
export const userAPI = {
  getDashboard: () => api.get('/users/dashboard'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getStats: () => api.get('/users/stats'),
  getUsers: (params = {}) => api.get('/users', { params }),
  updateUserRole: (userId, role) => api.put(`/users/${userId}/role`, { role }),
};

// Helper functions
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Network errors (backend not running)
  if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error') || error.message.includes('ERR_CONNECTION_REFUSED')) {
    return 'Backend server is not running. Please start the backend server.';
  }
  
  if (error.status === 401) {
    return 'Authentication required. Please log in again.';
  } else if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  } else if (error.status === 404) {
    return 'The requested resource was not found.';
  } else if (error.status === 422) {
    return 'Please check your input and try again.';
  } else if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Export default api instance
export default api;