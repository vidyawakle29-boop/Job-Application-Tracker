import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  CalendarCheck,
  TrendingUp,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      alert('Failed to mark all as read');
    }
  };

  const markSingleRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'interview_reminder':
        return <CalendarCheck className="w-5 h-5 text-purple-600" />;
      case 'status_update':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time status changes, interview alerts, and timeline updates
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" /> Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-xs text-slate-500 font-medium">Loading Notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">You're completely caught up!</h3>
            <p className="text-xs text-slate-400 mt-1">
              New alerts and interview reminders will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  item.isRead ? 'bg-white' : 'bg-blue-50/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-slate-100 rounded-xl mt-0.5 flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                    <span className="inline-block text-[10px] text-slate-400 mt-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.relatedApplication && (
                    <Link
                      to={`/applications/${item.relatedApplication._id || item.relatedApplication}`}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  {!item.isRead && (
                    <button
                      onClick={() => markSingleRead(item._id)}
                      title="Mark as read"
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(item._id)}
                    title="Delete notification"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
