const express = require('express');
const router = express.Router();
const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  updateStatus,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

// Protect all application routes with JWT verification
router.use(protect);

router.route('/')
  .get(getApplications)
  .post(createApplication);

router.route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

router.route('/:id/status')
  .patch(updateStatus);

module.exports = router;
