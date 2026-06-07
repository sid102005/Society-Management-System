const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const noticeController = require('../controllers/noticeController');

// Feature #31: Notices & Announcements
router.get('/', auth, noticeController.getNotices);
router.post('/:id/read', auth, noticeController.markNoticeAsRead);
router.get('/:id', auth, noticeController.getNotice);

// Admin endpoints
router.post('/', auth, authorize('admin'), noticeController.createNotice);
router.get('/all', auth, authorize('admin'), noticeController.getAllNotices);
router.patch('/:id', auth, authorize('admin'), noticeController.updateNotice);
router.delete('/:id', auth, authorize('admin'), noticeController.deactivateNotice);

module.exports = router;
