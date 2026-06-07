const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const memberController = require('../controllers/memberController');

// Feature #13: Member directory
router.get('/directory', auth, memberController.getMemberDirectory);
router.get('/profile/:id', auth, memberController.getMemberProfile);

// User profile
router.get('/profile', auth, memberController.getProfile);
router.patch('/profile', auth, memberController.updateProfile);

module.exports = router;
