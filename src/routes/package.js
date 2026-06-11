const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const packageController = require('../controllers/packageController');

// Feature #6 & #7: Package management
router.post('/', auth, authorize('staff'), packageController.recordPackage);

// Specific GET routes BEFORE generic /:id routes
router.get('/my-packages', auth, packageController.getMyPackages);
router.get('/', auth, packageController.getPackages);

// Routes with ID parameter
router.post('/:id/handover', auth, packageController.handoverPackage);
router.get('/:id', auth, packageController.getPackage);

module.exports = router;
