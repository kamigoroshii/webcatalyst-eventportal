import api from './api';

const notificationsAPI = {
  getOrganizerNotifications: (params = {}) => api.get('/notifications/organizer', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  delete: (id) => api.delete(`/notifications/${id}`)
};

export default notificationsAPI;
