import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  TrendingUp,
  Search,
  BellRing,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">Job Tracker</span>
              <span className="hidden sm:inline-block ml-2 text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                Internship Capstone
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900/0 to-slate-900 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-semibold mb-8">
            <Layers className="w-4 h-4" />
            <span>Full-Stack 9-Week Production Project</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Master Your Career Search with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Precision & Intelligence
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop losing job applications in spreadsheets. Organize interview schedules, track recruiter contacts, analyze hiring stats, and explore live scraped tech jobs in one centralized hub.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xl shadow-blue-600/25 transition-all text-base flex items-center justify-center gap-2"
            >
              Start Tracking Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-all text-base flex items-center justify-center"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-slate-950 border-t border-slate-800/80 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineered for Modern Job Seekers
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Built with React, Node.js, Express, MongoDB, and Python scraping engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-blue-900/50 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Stage-by-Stage Tracking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Log applications through 7 distinct statuses: Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Rejected, and Offer Received.
              </p>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-indigo-900/50 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Web Scraper & APIs</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Aggregates real-time remote and regional engineering job postings using BeautifulSoup & open developer job feeds. One-click import into your tracker.
              </p>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-emerald-900/50 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Interactive Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visualize monthly application cadence, response rates, and offer conversion ratios using dynamic charts and KPIs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 Job Application Tracker • Academic & Internship Full-Stack Capstone Project.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
