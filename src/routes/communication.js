const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const communicationController = require('../controllers/communicationController');

// Feature #29 & #30: Messaging & Calling
router.post('/message/send', auth, communicationController.sendMessage);
router.get('/messages/:userId', auth, communicationController.getMessages);
router.get('/unread-count', auth, communicationController.getUnreadCount);
router.get('/recent-chats', auth, communicationController.getRecentChats);

// Feature #29: Intercom calling
router.post('/call/initiate', auth, communicationController.initiateCall);
router.patch('/call/:id/status', auth, communicationController.updateCallStatus);

module.exports = router;
