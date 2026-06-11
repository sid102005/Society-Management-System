const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const vehicleEntryController = require('../controllers/vehicleEntryController');

// Record vehicle entry
router.post('/', auth, authorize('staff', 'admin'), vehicleEntryController.recordVehicleEntry);

// Specific GET routes BEFORE generic /:id routes
router.get('/active', vehicleEntryController.getActiveVehicles);

// Get vehicle entries
router.get('/', auth, authorize('staff', 'admin'), vehicleEntryController.getVehicleEntries);

// Record vehicle exit
router.post('/:id/exit', auth, authorize('staff', 'admin'), vehicleEntryController.recordVehicleExit);

// Flag vehicle
router.post('/:id/flag', auth, authorize('admin', 'staff'), vehicleEntryController.flagVehicle);

// Get single entry
router.get('/:id', auth, authorize('staff', 'admin'), vehicleEntryController.getVehicleEntry);

module.exports = router;
