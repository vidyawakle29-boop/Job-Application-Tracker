import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  CalendarCheck,
  CheckCircle,
  XCircle,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#06b6d4'];

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      total: 0,
      applied: 0,
      pending: 0,
      interviewScheduled: 0,
      selected: 0,
      rejected: 0,
      offerReceived: 0,
    },
    recentApplications: [],
    jobTypeStats: [],
    timelineData: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/stats/dashboard');
      if (res.data.success) {
        setData({
          stats: res.data.stats,
          recentApplications: res.data.recentApplications || [],
          jobTypeStats: res.data.jobTypeStats || [],
          timelineData: res.data.timelineData || [],
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusDistribution = [
    { name: 'Applied', value: data.stats.applied },
    { name: 'Under Review', value: data.stats.underReview || 0 },
    { name: 'Interviews', value: data.stats.interviewScheduled },
    { name: 'Selected', value: data.stats.selected },
    { name: 'Offers', value: data.stats.offerReceived },
    { name: 'Rejected', value: data.stats.rejected },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-sm text-slate-500 font-medium">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Internship Progress Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="text-blue-100/80 text-sm mt-1 max-w-xl">
            You currently have <span className="font-bold text-white">{data.stats.total} tracked applications</span>. Stay proactive and follow up on pending interviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/applications/new"
            className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-md text-sm transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add Application
          </Link>
          <Link
            to="/jobs/search"
            className="px-5 py-2.5 bg-blue-600/60 hover:bg-blue-600 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Search Jobs
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Tracked"
          value={data.stats.total}
          icon={Briefcase}
          color="blue"
          subtitle="All records"
        />
        <StatCard
          title="Applied"
          value={data.stats.applied}
          icon={TrendingUp}
          color="indigo"
          subtitle="Sent out"
        />
        <StatCard
          title="Pending Review"
          value={data.stats.pending}
          icon={Clock}
          color="amber"
          subtitle="Awaiting reply"
        />
        <StatCard
          title="Interviews"
          value={data.stats.interviewScheduled}
          icon={CalendarCheck}
          color="purple"
          subtitle="Scheduled"
        />
        <StatCard
          title="Selected / Offers"
          value={data.stats.selected + data.stats.offerReceived}
          icon={CheckCircle}
          color="emerald"
          subtitle="Positive outcome"
        />
        <StatCard
          title="Rejected"
          value={data.stats.rejected}
          icon={XCircle}
          color="rose"
          subtitle="Closed"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Velocity</h3>
              <p className="text-xs text-slate-500">Number of jobs applied per month</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-lg">
              Last 6 Months
            </span>
          </div>

          <div className="h-64 w-full">
            {data.timelineData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No monthly data recorded yet. Start tracking applications!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.timelineData}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="applications" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Distribution Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <h3 className="text-base font-bold text-slate-900">Status Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Breakdown of current application pipeline</p>

          <div className="h-64 w-full flex-1 flex items-center justify-center">
            {statusDistribution.length === 0 ? (
              <p className="text-xs text-slate-400">No statuses recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
            <p className="text-xs text-slate-500">Your most recently tracked opportunities</p>
          </div>
          <Link
            to="/applications"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View All ({data.stats.total}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {data.recentApplications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No applications tracked yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Start tracking your first job opportunity now.
              </p>
              <Link
                to="/applications/new"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                <PlusCircle className="w-4 h-4" /> Add Application
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Company</th>
                  <th className="px-6 py-3.5">Job Title</th>
                  <th className="px-6 py-3.5">Location & Type</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.recentApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{app.companyName}</td>
                    <td className="px-6 py-4 font-medium">{app.jobTitle}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {app.jobLocation} • <span className="font-medium text-slate-600">{app.jobType}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/applications/${app._id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
