import api from './api';

export const getWishlistApi = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const addToWishlistApi = async (propertyId) => {
  const response = await api.post(`/wishlist/${propertyId}`);
  return response.data;
};

export const removeFromWishlistApi = async (propertyId) => {
  const response = await api.delete(`/wishlist/${propertyId}`);
  return response.data;
};

export const checkWishlistStatusApi = async (propertyId) => {
  const response = await api.get(`/wishlist/check/${propertyId}`);
  return response.data;
};
