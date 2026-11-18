# Job Application Tracker 🎯💼

> **9-Week Full-Stack Internship Capstone Project**  
> An enterprise-grade web application to track, organize, analyze, and optimize job application workflows with live web scraping and pipeline analytics.

[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Python-blue.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Complete%20%26%20Production%20Ready-brightgreen.svg)]()

---

## 📌 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Project Folder Structure](#project-folder-structure)
6. [Prerequisites & Installation](#prerequisites--installation)
7. [Running the Application](#running-the-application)
8. [Testing & Postman Guide](#testing--postman-guide)
9. [Deployment Guide](#deployment-guide)
10. [Academic Internship Documentation](#academic-internship-documentation)

---

## 🚀 Project Overview
During job search cycles, applicants submit tens or hundreds of applications across multiple websites (LinkedIn, Glassdoor, company career portals). This fragmentation leads to missed interview calls, disorganized notes, and lost opportunities.

The **Job Application Tracker** provides a centralized, authenticated workspace to manage application lifecycles from submission to final offer, backed by a live Python scraping engine and interactive visual analytics.

---

## ✨ Key Features

### A. Authentication & Security
- **JWT (JSON Web Tokens)**: Stateless token authentication with Bearer headers.
- **bcrypt.js Password Hashing**: Industry-standard 10-round salted password security.
- **User Isolation**: Every candidate accesses only their own private applications and notes.

### B. Interactive Dashboard & Analytics
- **6 Key Performance Indicators (KPIs)**: Total, Applied, Pending, Interview Scheduled, Selected/Offers, and Rejected.
- **Application Velocity Chart**: Monthly cadence bar chart rendered via Recharts.
- **Status Distribution Chart**: Interactive donut chart visualizing pipeline stages.
- **Recent Applications**: Fast-access table with quick action links.

### C. Application Pipeline Management
- **Full CRUD Operations**: Create, Read, Update, and Delete applications.
- **7 Stage Workflow**: Applied ➔ Under Review ➔ Shortlisted ➔ Interview Scheduled ➔ Selected ➔ Offer Received ➔ Rejected.
- **Audit History**: Complete timestamped audit trail of every status transition.
- **Search & Multi-Filter**: Real-time filtering by status, work type (Remote, Full-Time, Internship), and keyword search.
- **HR & Recruiter Contacts**: Save recruiter name, email, and direct phone number.

### D. Live Job Search (Python Web Scraping & Public APIs)
- Fetches real-time tech listings using **BeautifulSoup4** and verified open APIs (Arbeitnow, RemoteOK).
- Clearly distinguishes public postings from user applications.
- **One-Click Import**: Save any scraped job directly into your tracker.

### E. Notification & Alert Center
- Real-time alerts when applications change status.
- Upcoming interview alerts and reminders.
- Mark single/all as read, unread badge counter, and quick navigation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, React Router v6, Axios, Lucide React, Recharts |
| **Backend** | Node.js, Express.js, RESTful Architecture, CORS, Morgan |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **Scraper** | Python 3.12, BeautifulSoup4, Requests |
| **Deployment** | Vercel (Client), Render (API Server), MongoDB Atlas (Cloud Database) |

---

## 📂 Project Folder Structure

```text
job-application-tracker/
│
├── .gitignore                          # Global git ignore configuration
├── README.md                           # Main project documentation
│
├── client/                             # React 18 Frontend
│   ├── index.html                      # HTML template
│   ├── vite.config.js                  # Vite configuration
│   ├── tailwind.config.js              # Tailwind styling config
│   ├── src/
│   │   ├── main.jsx                    # Root entry point
│   │   ├── App.jsx                     # Router & AuthProvider
│   │   ├── api/axiosInstance.js        # Axios with JWT interceptor
│   │   ├── context/AuthContext.jsx     # User authentication state
│   │   ├── components/                 # Reusable UI components
│   │   └── pages/                      # 10 Application pages
│
├── server/                             # Express REST API
│   ├── server.js                       # Server entry point
│   ├── package.json                    # Backend dependencies
│   ├── .env.example                    # Environment variable template
│   ├── config/db.js                    # MongoDB connection
│   ├── models/                         # User, JobApplication, Notification
│   ├── controllers/                    # Business logic controllers
│   ├── middleware/                     # Auth & error middleware
│   ├── routes/                         # Express REST routes
│   └── test-api.js                     # Automated API test suite
│
├── scraper/                            # Python Web Scraper Module
│   ├── requirements.txt                # Python dependencies
│   └── job_scraper.py                  # BeautifulSoup & API scraper
│
└── docs/                               # Internship Deliverables
    ├── internship_project_report.md    # 18-section formal project report
    └── job_tracker_postman_collection.json # Ready-to-import Postman suite
```

---

## ⚡ Quick Start & PowerShell Execution Guide

### 1. Start MongoDB
If using local MongoDB, ensure MongoDB service is running:
```powershell
net start MongoDB
```
*(Or specify your MongoDB Atlas connection string in `server/.env`)*

### 2. Run Backend REST API
Open a PowerShell terminal:
```powershell
cd "c:\Users\HP\Downloads\blogging platform\job-application-tracker\server"
npm run dev
# Server starts at http://localhost:5000
```

### 3. Run Frontend Client
Open a second PowerShell terminal:
```powershell
cd "c:\Users\HP\Downloads\blogging platform\job-application-tracker\client"
npm run dev
# Frontend opens at http://localhost:5173
```

---

## 🧪 Testing & Evaluation

### Run Automated End-to-End API Test Suite:
With the backend server running, execute:
```powershell
cd "c:\Users\HP\Downloads\blogging platform\job-application-tracker\server"
node test-api.js
```
This tests:
1. Server health check
2. User registration
3. User login & token generation
4. Job application creation
5. Status update & history logging
6. Dashboard statistics aggregation
7. Notifications generation
8. Python scraper integration

### Postman Collection:
Import `docs/job_tracker_postman_collection.json` directly into Postman to run requests interactively.

---

## 🌐 Production Deployment

### Frontend (Vercel)
1. Push repository to GitHub.
2. In Vercel, import the repository and set Root Directory to `client`.
3. Set build command: `npm run build` and output directory: `dist`.
4. Add environment variable: `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`.

### Backend (Render)
1. Create a Web Service on Render pointing to your GitHub repo.
2. Set Root Directory to `server`.
3. Build command: `npm install`.
4. Start command: `node server.js`.
5. Set environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/job_tracker_db`
   - `JWT_SECRET=your_production_secret_key`
   - `CLIENT_URL=https://your-frontend.vercel.app`

---

## 🎓 Internship Mentor Evaluation Summary
- **Week 1-2**: Architecture & Responsive UI (Completed)
- **Week 3-4**: RESTful API & MongoDB Integration (Completed)
- **Week 5**: Python Web Scraping & Aggregation (Completed)
- **Week 6**: Testing & Postman Verification (Completed)
- **Week 7-8**: Deployment & Documentation (Completed)
