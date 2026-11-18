import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  Edit,
  Trash2,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import axiosInstance from '../api/axiosInstance';

const STATUS_LIST = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Offer Received',
  'Rejected',
];

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/applications/${id}`);
      if (res.data.success) {
        setApplication(res.data.data);
      }
    } catch (err) {
      setError('Could not retrieve application details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axiosInstance.patch(`/applications/${id}/status`, {
        status: newStatus,
        comment: comment.trim() || undefined,
      });
      if (res.data.success) {
        setApplication(res.data.data);
        setComment('');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete application for ${application.companyName}?`)) {
      try {
        await axiosInstance.delete(`/applications/${id}`);
        navigate('/applications');
      } catch (err) {
        alert('Failed to delete application');
      }
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-slate-500 font-medium">Loading Application...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-800">{error || 'Application not found'}</p>
        <Link to="/applications" className="mt-4 inline-block text-xs text-blue-600 font-semibold underline">
          Return to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/applications"
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900">{application.companyName}</h1>
              <StatusBadge status={application.status} size="lg" />
            </div>
            <p className="text-sm text-slate-600 font-medium mt-0.5">{application.jobTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/applications/${application._id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Application Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Job Summary
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Location</p>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {application.jobLocation}
                </p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Work Type</p>
                <p className="font-semibold text-slate-800 mt-0.5">{application.jobType}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Compensation</p>
                <p className="font-semibold text-slate-800 mt-0.5">{application.salary || 'Not specified'}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Application Date</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {new Date(application.applicationDate).toLocaleDateString()}
                </p>
              </div>

              {application.interviewDate && (
                <div>
                  <p className="text-purple-600 font-semibold">Scheduled Interview</p>
                  <p className="font-bold text-purple-900 mt-0.5">
                    {new Date(application.interviewDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {application.jobPostingUrl && (
                <div>
                  <p className="text-slate-400 font-medium">Job Post Link</p>
                  <a
                    href={application.jobPostingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-blue-600 hover:underline mt-0.5 inline-flex items-center gap-1"
                  >
                    View Original <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {application.jobDescription && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-1">Description / Notes</p>
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {application.jobDescription}
                </p>
              </div>
            )}
          </div>

          {/* Card: Status Timeline History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Application Audit Trail & Timeline
            </h2>

            <div className="space-y-4">
              {application.statusHistory && application.statusHistory.length > 0 ? (
                application.statusHistory.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 ring-4 ring-blue-50 flex-shrink-0" />
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{step.status}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(step.changedAt).toLocaleString()}
                        </span>
                      </div>
                      {step.comment && <p className="text-slate-600 mt-1">{step.comment}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No status changes recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Status Switcher & HR Contact */}
        <div className="space-y-6">
          {/* Status Quick Switch Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Update Status
            </h3>
            <p className="text-xs text-slate-500">
              Change the status of this job and record a timeline note
            </p>

            <div className="space-y-2 pt-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional audit comment..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
              />

              <div className="grid grid-cols-1 gap-1.5">
                {STATUS_LIST.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      application.status === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{st}</span>
                    {application.status === st && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* HR Contact Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Recruiter / HR Contact
            </h3>

            {application.hrContact?.name || application.hrContact?.email || application.hrContact?.phone ? (
              <div className="space-y-2 text-xs pt-1">
                {application.hrContact.name && (
                  <p className="font-bold text-slate-900">{application.hrContact.name}</p>
                )}
                {application.hrContact.email && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${application.hrContact.email}`} className="text-blue-600 hover:underline">
                      {application.hrContact.email}
                    </a>
                  </div>
                )}
                {application.hrContact.phone && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{application.hrContact.phone}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No HR contact information provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
