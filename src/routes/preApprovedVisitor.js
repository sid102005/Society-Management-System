const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const preApprovedController = require('../controllers/preApprovedVisitorController');

// Feature #2: Pre-approved visitor management
router.post('/', auth, authorize('member'), validate(schemas.preApprovedCreate), preApprovedController.createPreApproved);
router.get('/my-list', auth, preApprovedController.getMyPreApprovedVisitors);
router.patch('/:id', auth, preApprovedController.updatePreApproved);
router.delete('/:id', auth, preApprovedController.deactivatePreApproved);

// Admin endpoints
router.get('/', auth, authorize('admin'), preApprovedController.getAllPreApproved);

module.exports = router;
