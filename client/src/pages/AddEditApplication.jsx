import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  User,
  Mail,
  Phone,
  FileText,
  Clock,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const STATUS_OPTIONS = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected',
  'Offer Received',
];

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote', 'Freelance'];

const AddEditApplication = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    jobLocation: 'Remote',
    jobType: 'Full-Time',
    salary: '',
    applicationDate: new Date().toISOString().split('T')[0],
    jobPostingUrl: '',
    status: 'Applied',
    notes: '',
    interviewDate: '',
    hrContact: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/applications/${id}`);
      if (res.data.success) {
        const app = res.data.data;
        setFormData({
          companyName: app.companyName || '',
          jobTitle: app.jobTitle || '',
          jobDescription: app.jobDescription || '',
          jobLocation: app.jobLocation || 'Remote',
          jobType: app.jobType || 'Full-Time',
          salary: app.salary || '',
          applicationDate: app.applicationDate ? app.applicationDate.split('T')[0] : '',
          jobPostingUrl: app.jobPostingUrl || '',
          status: app.status || 'Applied',
          notes: app.notes || '',
          interviewDate: app.interviewDate ? app.interviewDate.split('T')[0] : '',
          hrContact: {
            name: app.hrContact?.name || '',
            email: app.hrContact?.email || '',
            phone: app.hrContact?.phone || '',
          },
        });
      }
    } catch (err) {
      setError('Could not load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('hr_')) {
      const field = name.replace('hr_', '');
      setFormData((prev) => ({
        ...prev,
        hrContact: { ...prev.hrContact, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.companyName || !formData.jobTitle) {
      return setError('Please provide Company Name and Job Title');
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await axiosInstance.put(`/applications/${id}`, formData);
      } else {
        await axiosInstance.post('/applications', formData);
      }
      navigate('/applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-slate-500 font-medium">Loading Application Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/applications"
            className="p-2 bg-white rounded-xl border border-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isEditMode ? 'Edit Application' : 'Add New Application'}
            </h1>
            <p className="text-xs text-slate-500">
              {isEditMode
                ? 'Update company status, interview notes, and timeline'
                : 'Log a new job application and monitor its interview lifecycle'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Core Job Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            1. Role & Company Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Google, Stripe, Microsoft"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Frontend Engineer, Full Stack Intern"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Location
              </label>
              <input
                type="text"
                name="jobLocation"
                value={formData.jobLocation}
                onChange={handleChange}
                placeholder="e.g. Remote, New York, NY, Bengaluru"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Salary / Compensation
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $85,000 / yr, $40/hr, Not Specified"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Posting URL
              </label>
              <input
                type="url"
                name="jobPostingUrl"
                value={formData.jobPostingUrl}
                onChange={handleChange}
                placeholder="https://company.com/careers/job-id"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description / Key Qualifications
            </label>
            <textarea
              rows={3}
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Paste job requirements, tech stack, or qualification bullets here..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Card 2: Status & Dates */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            2. Application Status & Timeline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-slate-800"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Date
              </label>
              <input
                type="date"
                required
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interview Date (Optional)
              </label>
              <input
                type="date"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Recruiter / HR Contact Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            3. HR / Recruiter Contact (Optional)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
              <input
                type="text"
                name="hr_name"
                value={formData.hrContact.name}
                onChange={handleChange}
                placeholder="e.g. Sarah Smith"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="hr_email"
                value={formData.hrContact.email}
                onChange={handleChange}
                placeholder="sarah@company.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="hr_phone"
                value={formData.hrContact.phone}
                onChange={handleChange}
                placeholder="+1 555-0199"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Notes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            4. Personal Notes & Follow-Up Strategy
          </h2>

          <textarea
            rows={4}
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Record interview impressions, technical question topics, referral details, or follow-up plans..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/applications"
            className="px-6 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-600/20 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {submitting ? 'Saving Application...' : isEditMode ? 'Update Application' : 'Save Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditApplication;
