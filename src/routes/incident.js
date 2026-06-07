const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const incidentController = require('../controllers/incidentController');

// Feature #22: Incident report
router.post('/', auth, validate(schemas.incidentCreate), incidentController.createIncident);
router.get('/', auth, authorize('admin', 'staff'), incidentController.getIncidents);
router.get('/:id', auth, authorize('admin', 'staff'), incidentController.getIncident);
router.patch('/:id', auth, authorize('admin'), incidentController.updateIncident);

// Feature #23: SOS / Panic button
router.post('/sos/emergency', auth, incidentController.sendSOS);

module.exports = router;
