import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Building,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import axiosInstance from '../api/axiosInstance';

const ALL_STATUSES = [
  'All',
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Offer Received',
  'Rejected',
];

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, typeFilter, sortBy, sortOrder]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {
        sortBy,
        sortOrder,
      };
      if (statusFilter !== 'All') params.status = statusFilter;
      if (typeFilter !== 'All') params.jobType = typeFilter;
      if (search.trim()) params.search = search.trim();

      const res = await axiosInstance.get('/applications', { params });
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosInstance.patch(`/applications/${id}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id, company) => {
    if (window.confirm(`Are you sure you want to delete your application for ${company}?`)) {
      try {
        await axiosInstance.delete(`/applications/${id}`);
        setApplications((prev) => prev.filter((app) => app._id !== id));
      } catch (err) {
        alert('Failed to delete application');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Applications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, filter, and update the status of your active job pipeline
          </p>
        </div>
        <Link
          to="/applications/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add Application
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, job title, notes, or location..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
            >
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Remote">Remote</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="font-semibold text-slate-600">Sort by Date:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-xs text-slate-400 font-medium">Filtering Applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No applications match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or filters, or track a new application opportunity.
            </p>
            <Link
              to="/applications/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" /> Add Application
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Company & Role</th>
                  <th className="px-6 py-3.5">Location & Type</th>
                  <th className="px-6 py-3.5">Salary</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Current Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{app.companyName}</div>
                      <div className="text-slate-500 font-medium">{app.jobTitle}</div>
                      {app.jobPostingUrl && (
                        <a
                          href={app.jobPostingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline mt-0.5"
                        >
                          Job Post <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.jobLocation}</span>
                      </div>
                      <span className="inline-block mt-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm text-[10px] font-semibold">
                        {app.jobType}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-600">
                      {app.salary || 'Not specified'}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(app.applicationDate).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <StatusBadge status={app.status} />
                        {/* Quick Status Select */}
                        <select
                          value={app.status}
                          onChange={(e) => handleQuickStatusChange(app._id, e.target.value)}
                          className="text-[11px] bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-600 focus:outline-hidden"
                        >
                          {ALL_STATUSES.filter((s) => s !== 'All').map((s) => (
                            <option key={s} value={s}>
                              Update: {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/applications/${app._id}`}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/applications/${app._id}/edit`}
                          title="Edit Application"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(app._id, app.companyName)}
                          title="Delete Application"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
