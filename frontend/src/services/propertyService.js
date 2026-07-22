import api from './api';

export const getPropertiesApi = async (params = {}) => {
  const response = await api.get('/properties', { params });
  return response.data;
};

export const getPropertyByIdApi = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

export const createPropertyApi = async (formData) => {
  const response = await api.post('/properties', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updatePropertyApi = async (id, formData) => {
  const response = await api.put(`/properties/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deletePropertyApi = async (id) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};
