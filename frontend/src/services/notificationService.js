import api from './api';

export const getNotificationsApi = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationReadApi = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const clearAllNotificationsApi = async () => {
  const response = await api.delete('/notifications');
  return response.data;
};
