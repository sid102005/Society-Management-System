const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const vehicleController = require('../controllers/vehicleController');

// Feature #14 & #15: Resident vehicle management
router.post('/register', auth, vehicleController.registerVehicle);
router.get('/my-vehicles', auth, vehicleController.getMyVehicles);
router.get('/verify-sticker', auth, vehicleController.verifySticker);
router.post('/sticker/scan', auth, authorize('staff', 'admin'), vehicleController.scanSticker);
router.post('/:id/approve-sticker', auth, authorize('admin'), vehicleController.approveVehicleSticker);

// Feature #4: QR code for vehicle sticker
router.post('/:id/generate-qr', auth, vehicleController.generateStickerQR);
router.post('/scan/qr-code', auth, authorize('staff', 'admin'), vehicleController.scanQRCode);
router.get('/:id/qr-code-image', auth, vehicleController.getQRCodeImage);

// Feature #16: Guest vehicle management
router.post('/guest/register', auth, authorize('staff'), vehicleController.registerGuestVehicle);
router.post('/guest/:id/exit', auth, authorize('staff'), vehicleController.recordGuestVehicleExit);
router.get('/guest/list', auth, authorize('staff', 'admin'), vehicleController.getGuestVehicles);
router.post('/guest/verify-sticker', auth, authorize('staff', 'admin'), vehicleController.verifyGuestSticker);

// Admin endpoints
router.get('/', auth, authorize('admin'), vehicleController.getAllVehicles);

module.exports = router;
