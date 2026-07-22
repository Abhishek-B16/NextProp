import api from './api';

export const getConversationsApi = async () => {
  const response = await api.get('/chat/conversations');
  return response.data;
};

export const createOrGetConversationApi = async (receiverId) => {
  const response = await api.post('/chat/conversations', { receiverId });
  return response.data;
};

export const getMessagesApi = async (conversationId) => {
  const response = await api.get(`/chat/conversations/${conversationId}/messages`);
  return response.data;
};

export const sendMessageApi = async ({ conversationId, receiverId, text }) => {
  const response = await api.post('/chat/messages', { conversationId, receiverId, text });
  return response.data;
};
