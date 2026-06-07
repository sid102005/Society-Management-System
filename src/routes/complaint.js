const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const complaintController = require('../controllers/complaintController');

// Feature #17: Create & view complaints
router.post('/', auth, validate(schemas.complaintCreate), complaintController.createComplaint);
router.get('/my-complaints', auth, complaintController.getAssignedComplaints);

// Feature #18: Update status
router.patch('/:id/status', auth, validate(schemas.complaintUpdate), complaintController.updateComplaintStatus);

// Feature #19: Upload proofs
router.post('/:id/proof-photos', auth, complaintController.uploadProofPhotos);

// Admin endpoints
router.get('/', auth, authorize('admin'), complaintController.getAllComplaints);
router.get('/:id', auth, complaintController.getComplaint);
router.post('/:id/assign', auth, authorize('admin'), complaintController.assignComplaint);
router.get('/stats/summary', auth, authorize('admin'), complaintController.getComplaintStats);

module.exports = router;
