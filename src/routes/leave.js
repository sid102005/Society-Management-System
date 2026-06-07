const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const leaveController = require('../controllers/leaveController');

// Feature #27: Leave management
router.post('/apply', auth, authorize('staff'), leaveController.applyLeave);
router.get('/my-leaves', auth, leaveController.getMyLeaves);
router.post('/:id/cancel', auth, leaveController.cancelLeave);

// Admin endpoints
router.get('/pending', auth, authorize('admin'), leaveController.getPendingLeaves);
router.post('/:id/approve', auth, authorize('admin'), leaveController.approveLeave);
router.get('/', auth, authorize('admin'), leaveController.getAllLeaves);

module.exports = router;
