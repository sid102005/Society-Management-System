const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const blacklistController = require('../controllers/blacklistVisitorController');

// Feature #10: Blacklist visitor management
router.post('/', auth, authorize('admin', 'staff'), blacklistController.addToBlacklist);
router.get('/', auth, authorize('admin', 'staff'), blacklistController.getBlacklist);
router.get('/:id', auth, authorize('admin', 'staff'), blacklistController.getBlacklistEntry);
router.delete('/:id', auth, authorize('admin'), blacklistController.removeFromBlacklist);
router.get('/check/search', auth, blacklistController.checkBlacklist);

module.exports = router;
