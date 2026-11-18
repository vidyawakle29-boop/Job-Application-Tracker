import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Search,
  Bell,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isMobileOpen, closeMobile }) => {
  const { logout, user } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Applications', path: '/applications', icon: Briefcase },
    { name: 'Add Application', path: '/applications/new', icon: PlusCircle },
    { name: 'Job Search (Scraper)', path: '/jobs/search', icon: Search },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile Settings', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-18 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight tracking-tight">Job Tracker</h1>
            <p className="text-[11px] text-blue-400 font-medium">Internship Edition</p>
          </div>
        </div>

        {/* User Card Mini */}
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/40">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="text-sm font-semibold text-white truncate">{user?.name || 'Intern Student'}</p>
          <span className="inline-block mt-1 text-[10px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full font-medium">
            {user?.targetRole || 'Software Engineer'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Bottom Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
