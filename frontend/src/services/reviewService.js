import api from './api';

export const getPropertyReviewsApi = async (propertyId) => {
  const response = await api.get(`/properties/${propertyId}/reviews`);
  return response.data;
};

export const createReviewApi = async (propertyId, reviewData) => {
  const response = await api.post(`/properties/${propertyId}/reviews`, reviewData);
  return response.data;
};

export const deleteReviewApi = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};
