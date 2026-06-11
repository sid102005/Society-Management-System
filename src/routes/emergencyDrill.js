const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const emergencyDrillController = require('../controllers/emergencyDrillController');

// Create drill
router.post('/', auth, authorize('admin', 'staff'), emergencyDrillController.createDrill);

// Get all drills
router.get('/', auth, emergencyDrillController.getDrills);

// Start drill
router.post('/:id/start', auth, authorize('admin', 'staff'), emergencyDrillController.startDrill);

// Mark attendance
router.post('/:id/attendance', auth, emergencyDrillController.markDrillAttendance);

// Update evacuation zone
router.post('/:id/evacuation-zone', auth, authorize('admin', 'staff'), emergencyDrillController.updateEvacuationZone);

// End drill
router.post('/:id/end', auth, authorize('admin', 'staff'), emergencyDrillController.endDrill);

// Get drill report
router.get('/:id/report', auth, authorize('admin', 'staff'), emergencyDrillController.getDrillReport);

module.exports = router;
