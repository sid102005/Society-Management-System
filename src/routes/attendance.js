const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

// Feature #25: Attendance check-in/out
router.post('/check-in', auth, authorize('staff'), attendanceController.checkIn);
router.post('/check-out', auth, authorize('staff'), attendanceController.checkOut);
router.get('/my-attendance', auth, attendanceController.getMyAttendance);

// Admin endpoints
router.get('/', auth, authorize('admin'), attendanceController.getAllAttendance);
router.get('/stats/summary', auth, authorize('admin'), attendanceController.getAttendanceStats);

module.exports = router;
