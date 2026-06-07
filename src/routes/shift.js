const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const shiftController = require('../controllers/shiftController');

// Feature #26: Shift management
router.get('/my-shifts', auth, authorize('staff'), shiftController.getMyShifts);
router.get('/:id', auth, authorize('staff', 'admin'), shiftController.getShift);

// Admin endpoints
router.post('/', auth, authorize('admin'), shiftController.createShift);
router.post('/:id/assign', auth, authorize('admin'), shiftController.assignUsersToShift);
router.get('/', auth, authorize('admin'), shiftController.getAllShifts);

module.exports = router;
