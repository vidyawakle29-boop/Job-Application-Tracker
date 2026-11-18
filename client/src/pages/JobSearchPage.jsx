import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Building,
  ExternalLink,
  PlusCircle,
  Sparkles,
  CheckCircle,
  Globe,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const JobSearchPage = () => {
  const [query, setQuery] = useState('Software Engineer');
  const [location, setLocation] = useState('Remote');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');
  const [addedJobs, setAddedJobs] = useState(new Set());
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axiosInstance.get('/scraper/jobs', {
        params: { query, location },
      });
      if (res.data.success) {
        setJobs(res.data.data);
        setSource(res.data.source || 'Aggregator');
      }
    } catch (err) {
      setError('Could not fetch external job listings. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (job) => {
    try {
      const res = await axiosInstance.post('/applications', {
        companyName: job.companyName,
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        jobLocation: job.jobLocation,
        jobType: job.jobType || 'Full-Time',
        salary: job.salary || 'Not Specified',
        jobPostingUrl: job.jobPostingUrl || '',
        status: 'Applied',
        notes: `Imported via live job search engine (${job.source || 'Scraper'}).`,
      });

      if (res.data.success) {
        setAddedJobs((prev) => new Set(prev).add(job.jobPostingUrl || job.jobTitle));
      }
    } catch (err) {
      alert('Failed to add job to your tracker');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Python Web Scraping & Public API Aggregation Engine</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Live Job Search</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Explore real-time publicly available tech job openings and import them directly into your tracker with one click.
        </p>
      </div>

      {/* Search Input Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3"
      >
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Role title or keywords (e.g. React, Python, Frontend)"
            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="sm:col-span-4 relative">
          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g. Remote, Worldwide, India)"
            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="sm:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-full min-h-[42px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Scraping Listings...' : 'Search Jobs'}
          </button>
        </div>
      </form>

      {/* Status banner */}
      <div className="flex items-center justify-between text-xs px-2 text-slate-500">
        <span>
          Showing <span className="font-bold text-slate-800">{jobs.length}</span> active job listings
        </span>
        {source && (
          <span className="inline-flex items-center gap-1 font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
            <Globe className="w-3.5 h-3.5 text-blue-600" /> Source: {source}
          </span>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Job Cards Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-xs text-slate-500 font-medium">
            Fetching & parsing public job listings via Python / API...
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No jobs found for this query</h3>
          <p className="text-xs text-slate-400 mt-1">Try broadening your keywords or location filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job, idx) => {
            const isAdded = addedJobs.has(job.jobPostingUrl || job.jobTitle);
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        Public Job Posting
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">{job.jobTitle}</h3>
                      <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {job.companyName}
                      </p>
                    </div>

                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg flex-shrink-0">
                      {job.jobType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.jobLocation}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      <DollarSign className="w-3 h-3" /> {job.salary}
                    </span>
                  </div>

                  {job.jobDescription && (
                    <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                      {job.jobDescription}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
                  {job.jobPostingUrl ? (
                    <a
                      href={job.jobPostingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View Post <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Direct Listing</span>
                  )}

                  <button
                    onClick={() => handleQuickAdd(job)}
                    disabled={isAdded}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> In Tracker
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" /> Add to Tracker
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobSearchPage;
