const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { sendNotification } = require('../utils/notificationHelper');

// @desc    Get existing 1-on-1 conversation or create a new one
// @route   POST /api/chat/conversations
// @access  Private
const getOrCreateConversation = async (req, res) => {
  try {
    const { receiverId, propertyId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a receiver user ID'
      });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        status: 'fail',
        message: 'You cannot start a conversation with yourself'
      });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        status: 'fail',
        message: 'Target user not found'
      });
    }

    // Search for existing conversation between these 2 users
    const query = {
      participants: { $all: [req.user._id, receiverId] }
    };
    if (propertyId) {
      query.property = propertyId;
    }

    let conversation = await Conversation.findOne(query)
      .populate('participants', 'name email phone avatar role')
      .populate('property', 'title price city images')
      .populate('lastMessage');

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [req.user._id, receiverId],
        property: propertyId || null
      });

      await conversation.populate([
        { path: 'participants', select: 'name email phone avatar role' },
        { path: 'property', select: 'title price city images' }
      ]);

      console.log(`💬 New Conversation Created ID: ${conversation._id} between Users ${req.user._id} & ${receiverId}`);
    }

    return res.status(200).json({
      status: 'success',
      data: conversation
    });
  } catch (error) {
    console.error('❌ Get/Create Conversation Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error processing conversation'
    });
  }
};

// @desc    Get all active conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name email phone avatar role')
      .populate('property', 'title price city images')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'name avatar' }
      })
      .sort('-updatedAt')
      .lean();

    return res.status(200).json({
      status: 'success',
      results: conversations.length,
      data: conversations
    });
  } catch (error) {
    console.error('❌ Get User Conversations Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching conversations'
    });
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/chat/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    let { conversationId, receiverId, propertyId, text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        status: 'fail',
        message: 'Message text cannot be empty'
      });
    }

    let conversation;

    // 1. Locate or create conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          status: 'fail',
          message: 'Conversation not found'
        });
      }
    } else if (receiverId) {
      if (receiverId.toString() === req.user._id.toString()) {
        return res.status(400).json({
          status: 'fail',
          message: 'You cannot send messages to yourself'
        });
      }

      conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, receiverId] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, receiverId],
          property: propertyId || null
        });
      }
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide either a conversationId or receiverId'
      });
    }

    // Verify current user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: You are not a participant in this conversation'
      });
    }

    // Identify target receiver ID
    const actualReceiverId = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );

    // 2. Create Message document
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      receiver: actualReceiverId,
      text: text.trim()
    });

    // 3. Update Conversation's lastMessage reference & timestamp
    conversation.lastMessage = message._id;
    await conversation.save();

    await message.populate([
      { path: 'sender', select: 'name avatar role' },
      { path: 'receiver', select: 'name avatar role' }
    ]);

    // 4. Trigger Notification for receiver
    const previewText = text.length > 40 ? `${text.substring(0, 40)}...` : text;
    await sendNotification({
      recipient: actualReceiverId,
      sender: req.user._id,
      type: 'new_message',
      title: `New Message from ${req.user.name}`,
      message: previewText,
      data: {
        conversationId: conversation._id,
        messageId: message._id
      }
    });

    console.log(`💬 Message sent in Conversation ${conversation._id} by User ${req.user._id}`);

    return res.status(201).json({
      status: 'success',
      data: message
    });
  } catch (error) {
    console.error('❌ Send Message Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error sending message'
    });
  }
};

// @desc    Get message history for a specific conversation
// @route   GET /api/chat/conversations/:conversationId/messages
// @access  Private
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Conversation not found'
      });
    }

    // Verify user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: You cannot access messages from this conversation'
      });
    }

    // Mark all unread messages received by this user as read
    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: req.user._id,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalMessages = await Message.countDocuments({ conversation: conversationId });
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role')
      .sort('createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      status: 'success',
      results: messages.length,
      total: totalMessages,
      data: messages
    });
  } catch (error) {
    console.error('❌ Get Conversation Messages Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching chat history'
    });
  }
};

module.exports = {
  getOrCreateConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages
};
