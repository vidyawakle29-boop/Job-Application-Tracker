import React, { useState, useEffect } from 'react';
import { Menu, Bell, User as UserIcon, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const Navbar = ({ toggleMobileSidebar, title = 'Dashboard' }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data.slice(0, 5));
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.warn('Could not fetch notifications:', err.message);
    }
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.patch('/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h2>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Card */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No notifications yet.</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item._id}
                      className={`px-4 py-3 text-xs transition-colors ${
                        item.isRead ? 'bg-white' : 'bg-blue-50/50 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{item.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{item.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 px-4 border-t border-slate-100 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowDropdown(false)}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 max-w-[120px] truncate">
            {user?.name || 'My Profile'}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
