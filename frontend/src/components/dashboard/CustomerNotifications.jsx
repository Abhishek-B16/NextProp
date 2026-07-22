import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Check, CheckCheck, Trash2, Calendar, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { getNotificationsApi, markNotificationReadApi, clearAllNotificationsApi } from '../../services/notificationService';

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotificationsApi();
      if (data && data.data) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotificationsApi();
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 animate-pulse space-y-3">
        <div className="h-4 bg-slate-900 rounded w-1/3 mx-auto"></div>
        <div className="h-16 bg-slate-900 rounded"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center border border-slate-800 space-y-2">
        <Bell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-200">No Notifications</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Updates regarding your visit requests, owner messages, and reviews will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-slate-100">Notifications ({notifications.length})</h3>
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
              n.isRead
                ? 'bg-slate-900/40 border-slate-800/60 opacity-70'
                : 'bg-slate-900 border-brand-500/30 text-slate-100 shadow-md shadow-brand-500/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">{n.title || 'Notification Update'}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {!n.isRead && (
              <button
                type="button"
                onClick={() => handleMarkRead(n._id)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                title="Mark as Read"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
