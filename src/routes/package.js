const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const packageController = require('../controllers/packageController');

// Feature #6 & #7: Package management
router.post('/', auth, authorize('staff'), packageController.recordPackage);
router.post('/:id/handover', auth, packageController.handoverPackage);
router.get('/', auth, packageController.getPackages);
router.get('/my-packages', auth, packageController.getMyPackages);
router.get('/:id', auth, packageController.getPackage);

module.exports = router;
