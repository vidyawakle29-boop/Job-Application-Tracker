import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/applications': 'Job Applications',
  '/applications/new': 'Track New Application',
  '/jobs/search': 'Live Job Search (Scraper & APIs)',
  '/notifications': 'Notification Center',
  '/profile': 'Profile Settings',
};

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Job Tracker';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          toggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
          title={title}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
