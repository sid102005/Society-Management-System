const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const patrolController = require('../controllers/patrolLogController');

// Feature #21: Patrol logging
router.post('/start', auth, authorize('staff'), patrolController.startPatrol);
router.post('/:id/checkpoint', auth, authorize('staff'), patrolController.addCheckpoint);
router.post('/:id/end', auth, authorize('staff'), patrolController.endPatrol);
router.get('/my-patrols', auth, authorize('staff'), patrolController.getMyPatrols);
router.get('/:id', auth, authorize('staff', 'admin'), patrolController.getPatrolLog);

// Admin endpoints
router.get('/', auth, authorize('admin'), patrolController.getAllPatrols);

module.exports = router;
