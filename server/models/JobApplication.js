const mongoose = require('mongoose');

const ApplicationStatus = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected',
  'Offer Received',
];

const JobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please provide the company name'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Please provide the job title'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    jobDescription: {
      type: String,
      default: '',
      trim: true,
    },
    jobLocation: {
      type: String,
      default: 'Remote',
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote', 'Freelance'],
      default: 'Full-Time',
    },
    salary: {
      type: String,
      default: 'Not Specified',
      trim: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    jobPostingUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ApplicationStatus,
        message: '{VALUE} is not a valid application status',
      },
      default: 'Applied',
      index: true,
    },
    hrContact: {
      name: { type: String, default: '', trim: true },
      email: { type: String, default: '', trim: true },
      phone: { type: String, default: '', trim: true },
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        comment: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add compound index for fast user searching and sorting
JobApplicationSchema.index({ user: 1, applicationDate: -1 });
JobApplicationSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
module.exports.ApplicationStatus = ApplicationStatus;
