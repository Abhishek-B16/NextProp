const { Server } = require('socket.io');

let io = null;
// Map storing userId -> Set of socketIds (to support multiple tabs/devices per user)
const onlineUsers = new Map();

/**
 * Initialize Socket.io server instance
 * @param {Object} server - Node HTTP server instance
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins in development
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Client connected via Socket.io: ${socket.id}`);

    // 1. User Setup / Join Personal Room & Track Online Status
    socket.on('setup', (userId) => {
      if (!userId) return;
      
      const strUserId = userId.toString();
      socket.userId = strUserId;
      socket.join(`user:${strUserId}`);

      if (!onlineUsers.has(strUserId)) {
        onlineUsers.set(strUserId, new Set());
      }
      onlineUsers.get(strUserId).add(socket.id);

      console.log(`👤 User Online: ${strUserId} (Socket ID: ${socket.id})`);

      // Broadcast list of currently online user IDs to all connected clients
      io.emit('get_online_users', Array.from(onlineUsers.keys()));
    });

    // 2. Join Specific Conversation Room
    socket.on('join_conversation', (conversationId) => {
      if (!conversationId) return;
      socket.join(`conversation:${conversationId}`);
      console.log(`💬 Socket ${socket.id} joined conversation room: conversation:${conversationId}`);
    });

    // 3. Leave Specific Conversation Room
    socket.on('leave_conversation', (conversationId) => {
      if (!conversationId) return;
      socket.leave(`conversation:${conversationId}`);
      console.log(`🚪 Socket ${socket.id} left conversation room: conversation:${conversationId}`);
    });

    // 4. Typing Indicator Events
    socket.on('typing', ({ conversationId, receiverId }) => {
      if (receiverId) {
        io.to(`user:${receiverId}`).emit('typing', {
          conversationId,
          senderId: socket.userId
        });
      }
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('typing', {
          conversationId,
          senderId: socket.userId
        });
      }
    });

    socket.on('stop_typing', ({ conversationId, receiverId }) => {
      if (receiverId) {
        io.to(`user:${receiverId}`).emit('stop_typing', {
          conversationId,
          senderId: socket.userId
        });
      }
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('stop_typing', {
          conversationId,
          senderId: socket.userId
        });
      }
    });

    // 5. Read Receipt Event
    socket.on('mark_read', ({ conversationId, senderId }) => {
      if (senderId) {
        io.to(`user:${senderId}`).emit('messages_read', {
          conversationId,
          readBy: socket.userId,
          readAt: new Date()
        });
      }
    });

    // 6. Handle Disconnection & Cleanup
    socket.on('disconnect', () => {
      console.log(`⚡ Client disconnected: ${socket.id}`);
      if (socket.userId && onlineUsers.has(socket.userId)) {
        const userSockets = onlineUsers.get(socket.userId);
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(socket.userId);
          console.log(`👤 User Offline: ${socket.userId}`);
        }
      }

      // Broadcast updated online users list
      io.emit('get_online_users', Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

/**
 * Get active Socket.io instance
 */
const getIO = () => {
  if (!io) {
    console.warn('⚠️ Socket.io instance requested before initialization');
  }
  return io;
};

/**
 * Emit event to a specific user by userId
 */
const emitToUser = (userId, event, data) => {
  if (!io || !userId) return;
  io.to(`user:${userId.toString()}`).emit(event, data);
};

/**
 * Emit event to a conversation room
 */
const emitToConversation = (conversationId, event, data) => {
  if (!io || !conversationId) return;
  io.to(`conversation:${conversationId.toString()}`).emit(event, data);
};

/**
 * Check if a user is currently online
 */
const isUserOnline = (userId) => {
  return userId && onlineUsers.has(userId.toString());
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToConversation,
  isUserOnline
};
