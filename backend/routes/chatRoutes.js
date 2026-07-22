const express = require('express');
const router = express.Router();
const {
  getOrCreateConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages
} = require('../controllers/chatController');
const { protectRoute } = require('../middleware/authMiddleware');

router.use(protectRoute);

// Conversation endpoints
router.post('/conversations', getOrCreateConversation);
router.get('/conversations', getUserConversations);

// Message endpoints
router.post('/messages', sendMessage);
router.get('/conversations/:conversationId/messages', getConversationMessages);

module.exports = router;
