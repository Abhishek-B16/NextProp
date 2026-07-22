import api from './api';

export const createBookingApi = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getMyBookingsApi = async (params = {}) => {
  const response = await api.get('/bookings', { params });
  return response.data;
};

export const getOwnerBookingsApi = async (params = {}) => {
  const response = await api.get('/bookings/owner', { params });
  return response.data;
};

export const updateBookingStatusApi = async (bookingId, status) => {
  const response = await api.put(`/bookings/${bookingId}/status`, { status });
  return response.data;
};

export const cancelBookingApi = async (bookingId) => {
  const response = await api.delete(`/bookings/${bookingId}`);
  return response.data;
};
