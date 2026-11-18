import React from 'react';

const statusStyles = {
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Shortlisted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Interview Scheduled': 'bg-purple-50 text-purple-700 border-purple-200',
  Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Offer Received': 'bg-green-50 text-green-700 border-green-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

const StatusBadge = ({ status, size = 'sm' }) => {
  const currentStyle = statusStyles[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${currentStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {status}
    </span>
  );
};

export default StatusBadge;
