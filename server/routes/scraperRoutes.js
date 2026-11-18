const express = require('express');
const router = express.Router();
const { searchScrapedJobs } = require('../controllers/scraperController');
const { protect } = require('../middleware/authMiddleware');

router.get('/jobs', protect, searchScrapedJobs);

module.exports = router;
