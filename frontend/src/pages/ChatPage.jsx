import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  User as UserIcon,
  Search,
  CheckCheck,
  Check,
  Circle,
  Loader2,
  Building2,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  getConversationsApi,
  getMessagesApi,
  sendMessageApi,
  createOrGetConversationApi
} from '../services/chatService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ChatPage() {
  const { id: paramConversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    socket,
    isUserOnline,
    joinRoom,
    emitTyping,
    emitStopTyping,
    emitMarkRead
  } = useSocket();

  // State
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPartnerTyping]);

  // Fetch Conversations List and handle target receiver if passed in state
  const fetchConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      // 1. If receiverId passed via navigation state, create/get conversation first
      let targetConvId = paramConversationId;
      if (location.state?.receiverId) {
        const directConv = await createOrGetConversationApi(location.state.receiverId);
        if (directConv && directConv.data) {
          targetConvId = directConv.data._id;
        }
      }

      // 2. Fetch all user conversations
      const data = await getConversationsApi();
      if (data && data.data) {
        setConversations(data.data);

        // Select initial conversation if match found, target set, or fallback to first
        if (targetConvId) {
          const match = data.data.find((c) => c._id === targetConvId);
          if (match) {
            setActiveConversation(match);
          } else if (data.data.length > 0) {
            setActiveConversation(data.data[0]);
          }
        } else if (data.data.length > 0) {
          setActiveConversation(data.data[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  }, [paramConversationId, location.state]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch Messages for Active Conversation
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setLoadingMessages(true);
    try {
      const data = await getMessagesApi(conversationId);
      if (data && data.data) {
        setMessages(data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (activeConversation) {
      joinRoom(activeConversation._id);
      fetchMessages(activeConversation._id);
      emitMarkRead(activeConversation._id);
    }
  }, [activeConversation?._id, joinRoom, fetchMessages, emitMarkRead]);

  // Socket.io Real-time Event Listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (activeConversation && message.conversation === activeConversation._id) {
        setMessages((prev) => {
          const msgId = message._id;
          if (msgId && prev.some((m) => m._id === msgId)) {
            return prev;
          }
          return [...prev, message];
        });
        emitMarkRead(activeConversation._id);
      }

      // Update conversations lastMessage snippet
      setConversations((prev) =>
        prev.map((c) =>
          c._id === message.conversation
            ? { ...c, lastMessage: message, updatedAt: new Date().toISOString() }
            : c
        )
      );
    };

    const handleTyping = ({ conversationId }) => {
      if (activeConversation && activeConversation._id === conversationId) {
        setIsPartnerTyping(true);
      }
    };

    const handleStopTyping = ({ conversationId }) => {
      if (activeConversation && activeConversation._id === conversationId) {
        setIsPartnerTyping(false);
      }
    };

    const handleMessagesRead = ({ conversationId }) => {
      if (activeConversation && activeConversation._id === conversationId) {
        setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, activeConversation, emitMarkRead]);

  // Handle Text Change & Emit Typing
  const handleTextChange = (e) => {
    setTextInput(e.target.value);

    if (activeConversation) {
      emitTyping(activeConversation._id);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(activeConversation._id);
      }, 2000);
    }
  };

  // Handle Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!textInput.trim() || !activeConversation) return;

    const textToSend = textInput.trim();
    setTextInput('');

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    emitStopTyping(activeConversation._id);

    // Identify partner
    const partner = activeConversation.participants?.find(
      (p) => p._id !== user._id
    );

    try {
      const data = await sendMessageApi({
        conversationId: activeConversation._id,
        receiverId: partner?._id,
        text: textToSend
      });

      if (data && data.data) {
        const sentMsg = data.data;
        setMessages((prev) => {
          if (prev.some((m) => m._id === sentMsg._id)) return prev;
          return [...prev, sentMsg];
        });
        socket?.emit('new_message', sentMsg);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Helper to extract partner info
  const getPartner = (conv) => {
    if (!conv || !conv.participants) return { name: 'User' };
    const currentUserId = String(user?._id || '');
    const partner = conv.participants.find((p) => {
      const pId = typeof p === 'string' ? p : String(p._id || p.id || '');
      return pId !== currentUserId;
    });
    if (!partner) return { name: 'User' };
    return typeof partner === 'string' ? { _id: partner, name: 'User' } : partner;
  };

  const filteredConversations = conversations.filter((c) => {
    const partner = getPartner(c);
    return partner.name?.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden h-[80vh] flex flex-col md:flex-row shadow-2xl">
      {/* LEFT SIDEBAR: Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 bg-slate-950 border-r border-slate-800 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-400" />
              <span>Real-time Chat</span>
            </h2>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-900 scrollbar-thin">
          {loadingConversations ? (
            <div className="p-6 text-center text-xs text-slate-500">Loading chats...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-700 mx-auto" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const partner = getPartner(conv);
              const isOnline = isUserOnline(partner._id);
              const isActive = activeConversation?._id === conv._id;

              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className={`p-4 cursor-pointer transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-brand-500/15 border-l-4 border-brand-500'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  {/* Avatar & Online Dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-sm">
                      {partner.name ? partner.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-100 truncate">{partner.name}</h4>
                      <span className="text-[10px] text-slate-500">
                        {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {conv.lastMessage?.text || 'Started a conversation'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT CHAT WINDOW */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-slate-900/30">
          {/* Chat Window Header */}
          {(() => {
            const partner = getPartner(activeConversation);
            const isOnline = isUserOnline(partner._id);

            return (
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden p-1 text-slate-400 hover:text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                      {partner.name ? partner.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{partner.name}</h3>
                    <p className="text-[10px] text-slate-400">
                      {isOnline ? (
                        <span className="text-emerald-400 font-semibold">● Online Now</span>
                      ) : (
                        'Offline'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Messages Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin">
            {loadingMessages ? (
              <div className="text-center py-8 text-xs text-slate-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500 italic">
                No messages yet. Send a greeting to start chatting!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender === user._id || msg.sender?._id === user._id;

                return (
                  <div
                    key={msg._id || Math.random()}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-600/10'
                          : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500">
                      <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && (
                        msg.read ? (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-400" title="Read" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-slate-500" title="Sent" />
                        )
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing Indicator */}
            {isPartnerTyping && (
              <div className="flex items-center gap-2 text-xs text-brand-400 font-medium animate-pulse">
                <div className="w-2 h-2 rounded-full bg-brand-400"></div>
                <span>Partner is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              value={textInput}
              onChange={handleTextChange}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="gradient-btn p-2.5 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-700" />
          <h3 className="text-base font-bold text-slate-300">Select a Conversation</h3>
          <p className="text-xs max-w-sm">
            Choose a partner from the sidebar list or click "Chat with Owner" on any property page to start real-time messaging.
          </p>
        </div>
      )}
    </div>
  );
}
