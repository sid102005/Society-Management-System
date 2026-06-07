const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const alertController = require('../controllers/alertController');

// Feature #32: Alerts
router.get('/', auth, alertController.getAlerts);
router.get('/emergency', auth, alertController.getEmergencyAlerts);
router.post('/:id/acknowledge', auth, alertController.acknowledgeAlert);
router.post('/:id/resolve', auth, alertController.resolveAlert);

// Admin endpoints
router.get('/all', auth, alertController.getAllAlerts);
router.get('/stats/summary', auth, alertController.getAlertStats);

module.exports = router;
