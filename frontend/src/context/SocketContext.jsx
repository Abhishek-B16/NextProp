import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCount, setUnreadCount] = useState(0);

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('⚡ Socket.io connected:', socketInstance.id);
      socketInstance.emit('setup', String(user._id));
    });

    const handleOnlineUsersList = (usersList) => {
      if (Array.isArray(usersList)) {
        setOnlineUsers(new Set(usersList.map((id) => String(id))));
      }
    };

    socketInstance.on('online_users', handleOnlineUsersList);
    socketInstance.on('get_online_users', handleOnlineUsersList);

    socketInstance.on('user_connected', (userId) => {
      if (userId) {
        setOnlineUsers((prev) => new Set([...prev, String(userId)]));
      }
    });

    socketInstance.on('user_disconnected', (userId) => {
      if (userId) {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(String(userId));
          return next;
        });
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isAuthenticated, user?._id]);

  const joinRoom = useCallback((conversationId) => {
    if (socket && conversationId) {
      socket.emit('join_conversation', conversationId);
      socket.emit('join_room', conversationId);
    }
  }, [socket]);

  const emitTyping = useCallback((conversationId, receiverId) => {
    if (socket && conversationId) {
      socket.emit('typing', { conversationId, receiverId });
    }
  }, [socket]);

  const emitStopTyping = useCallback((conversationId, receiverId) => {
    if (socket && conversationId) {
      socket.emit('stop_typing', { conversationId, receiverId });
    }
  }, [socket]);

  const emitMarkRead = useCallback((conversationId, senderId) => {
    if (socket && conversationId) {
      socket.emit('mark_read', { conversationId, senderId });
    }
  }, [socket]);

  const isUserOnline = useCallback((userId) => {
    if (!userId) return false;
    const strId = typeof userId === 'object' ? String(userId._id || userId) : String(userId);
    return onlineUsers.has(strId);
  }, [onlineUsers]);

  const value = {
    socket,
    onlineUsers,
    isUserOnline,
    unreadCount,
    setUnreadCount,
    joinRoom,
    emitTyping,
    emitStopTyping,
    emitMarkRead
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
