import api from './api';

export const getAdminAnalyticsApi = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

export const getAdminUsersApi = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const verifyOwnerApi = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/verify`);
  return response.data;
};

export const deleteUserApi = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAdminPropertiesApi = async (params = {}) => {
  const response = await api.get('/admin/properties', { params });
  return response.data;
};

export const deleteAdminPropertyApi = async (propertyId) => {
  const response = await api.delete(`/admin/properties/${propertyId}`);
  return response.data;
};
