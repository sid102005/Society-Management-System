const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const domesticHelpController = require('../controllers/domesticHelpController');

// Register domestic help
router.post('/register', auth, domesticHelpController.registerDomesticHelp);

// Get my domestic help list
router.get('/my-helpers', auth, domesticHelpController.getMyDomesticHelp);

// Update domestic help
router.put('/:id', auth, domesticHelpController.updateDomesticHelp);

// Mark entry/exit for domestic help
router.post('/:id/mark-entry', auth, authorize('staff', 'admin'), domesticHelpController.markDomesticHelpEntry);

// Deactivate domestic help
router.delete('/:id', auth, domesticHelpController.deactivateDomesticHelp);

// Admin routes
router.get('/', auth, authorize('admin'), domesticHelpController.getAllDomesticHelp);
router.post('/:id/verify', auth, authorize('admin'), domesticHelpController.verifyDomesticHelp);

module.exports = router;
