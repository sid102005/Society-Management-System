const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const visitorController = require('../controllers/visitorController');

// Feature #1, #3, #11, #12: Visitor management
router.post('/', validate(schemas.visitorEntry), visitorController.createVisitor);
router.get('/', auth, visitorController.listVisitors);
router.get('/:id', auth, visitorController.getVisitor);
router.post('/:id/exit', auth, validate(schemas.visitExit), visitorController.visitExit);
router.post('/:id/approve', auth, visitorController.approveVisitor);

// Feature #3: OTP
router.post('/otp/send', auth, visitorController.sendOTP);
router.post('/otp/verify', auth, visitorController.verifyOTPAndApprove);

// Feature #2: Pre-approved check
router.post('/check-preapproved', visitorController.checkPreApproved);

// Feature #11: Overstay detection
router.get('/alerts/overstay', auth, authorize('admin', 'staff'), visitorController.checkOverstay);

// Feature #12: Daily report
router.get('/reports/daily', auth, authorize('admin', 'staff'), visitorController.getDailyReport);

// Feature #4: QR Code
router.get('/:id/qr-code', auth, visitorController.generateQRCode);

module.exports = router;
