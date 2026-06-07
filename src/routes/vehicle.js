const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const vehicleController = require('../controllers/vehicleController');

// Feature #14 & #15: Resident vehicle management
router.post('/register', auth, vehicleController.registerVehicle);
router.get('/my-vehicles', auth, vehicleController.getMyVehicles);
router.get('/verify-sticker', auth, vehicleController.verifySticker);

// Feature #16: Guest vehicle management
router.post('/guest/register', auth, authorize('staff'), vehicleController.registerGuestVehicle);
router.post('/guest/:id/exit', auth, authorize('staff'), vehicleController.recordGuestVehicleExit);
router.get('/guest/list', auth, authorize('staff', 'admin'), vehicleController.getGuestVehicles);

// Admin endpoints
router.get('/', auth, authorize('admin'), vehicleController.getAllVehicles);

module.exports = router;
