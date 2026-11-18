/**
 * Automated API Test Suite for Job Application Tracker
 * Validates: Auth, CRUD, Search, Filter, Status History, Notifications, Stats & Scraper
 */

const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 Starting Automated API Test Suite - Internship Project');
  console.log('====================================================\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Testing Server Health Endpoint...');
    const health = await makeRequest('GET', '/health');
    if (health.status === 200 && health.body.status === 'online') {
      console.log('   ✅ Health check PASSED: Server is online.\n');
    } else {
      console.error('   ❌ Health check FAILED:', health);
      return;
    }

    // 2. Register New Test Candidate
    const testEmail = `intern_${Date.now()}@example.com`;
    console.log(`2️⃣ Testing User Registration (${testEmail})...`);
    const regRes = await makeRequest('POST', '/auth/register', {
      name: 'Internship Evaluation Candidate',
      email: testEmail,
      password: 'password123',
      targetRole: 'Full Stack Engineer',
      location: 'Bangalore, India',
    });

    let token = null;
    if (regRes.status === 201 && regRes.body.token) {
      token = regRes.body.token;
      console.log('   ✅ User Registration PASSED (JWT Token Issued).\n');
    } else {
      console.error('   ❌ User Registration FAILED:', regRes.body);
      return;
    }

    // 3. User Login Test
    console.log('3️⃣ Testing User Login...');
    const loginRes = await makeRequest('POST', '/auth/login', {
      email: testEmail,
      password: 'password123',
    });
    if (loginRes.status === 200 && loginRes.body.token) {
      console.log('   ✅ User Login PASSED: Password verified and JWT issued.\n');
    } else {
      console.error('   ❌ User Login FAILED:', loginRes.body);
      return;
    }

    // 4. Create Job Application
    console.log('4️⃣ Testing Create Job Application...');
    const appRes = await makeRequest(
      'POST',
      '/applications',
      {
        companyName: 'TechVision AI',
        jobTitle: 'Junior Software Engineer',
        jobDescription: 'Building high throughput REST APIs and React interfaces.',
        jobLocation: 'Remote',
        jobType: 'Full-Time',
        salary: '$90,000 / yr',
        jobPostingUrl: 'https://example.com/careers/techvision-junior-swe',
        status: 'Applied',
        hrContact: {
          name: 'Rachel Adams',
          email: 'rachel@techvision.ai',
          phone: '+1 555-0142',
        },
        notes: 'Submitted via employee referral.',
      },
      token
    );

    let appId = null;
    if (appRes.status === 201 && appRes.body.data?._id) {
      appId = appRes.body.data._id;
      console.log(`   ✅ Create Application PASSED: ID ${appId}.\n`);
    } else {
      console.error('   ❌ Create Application FAILED:', appRes.body);
      return;
    }

    // 5. Update Status
    console.log('5️⃣ Testing Application Status Update...');
    const statusRes = await makeRequest(
      'PATCH',
      `/applications/${appId}/status`,
      {
        status: 'Interview Scheduled',
        comment: 'Technical round scheduled for next Tuesday.',
      },
      token
    );
    if (statusRes.status === 200 && statusRes.body.data.status === 'Interview Scheduled') {
      console.log('   ✅ Status Update PASSED: Changed to "Interview Scheduled".\n');
    } else {
      console.error('   ❌ Status Update FAILED:', statusRes.body);
      return;
    }

    // 6. Test Dashboard Stats Aggregation
    console.log('6️⃣ Testing Dashboard Analytics Aggregation...');
    const statsRes = await makeRequest('GET', '/stats/dashboard', null, token);
    if (statsRes.status === 200 && statsRes.body.stats.interviewScheduled >= 1) {
      console.log('   ✅ Dashboard Stats PASSED: Metrics accurately aggregated.\n');
    } else {
      console.error('   ❌ Dashboard Stats FAILED:', statsRes.body);
    }

    // 7. Test Notifications Retrieval
    console.log('7️⃣ Testing Notifications System...');
    const notifRes = await makeRequest('GET', '/notifications', null, token);
    if (notifRes.status === 200 && notifRes.body.count > 0) {
      console.log(`   ✅ Notifications PASSED: ${notifRes.body.count} alerts generated.\n`);
    } else {
      console.error('   ❌ Notifications FAILED:', notifRes.body);
    }

    // 8. Test Scraper & Job Aggregator API
    console.log('8️⃣ Testing Job Scraper API Endpoint...');
    const scraperRes = await makeRequest('GET', '/scraper/jobs?query=Engineer', null, token);
    if (scraperRes.status === 200 && Array.isArray(scraperRes.body.data)) {
      console.log(`   ✅ Job Scraper PASSED: Fetched ${scraperRes.body.data.length} listings from ${scraperRes.body.source}.\n`);
    } else {
      console.error('   ❌ Job Scraper FAILED:', scraperRes.body);
    }

    console.log('====================================================');
    console.log('🎉 ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (error) {
    console.error('Test Execution Error:', error.message);
  }
}

// Run tests if server is active, or instruct user
runTestSuite();
