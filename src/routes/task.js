const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const taskController = require('../controllers/taskController');

// Feature #20: Daily task checklist
router.get('/daily-checklist', auth, taskController.getDailyTaskChecklist);
router.get('/my-tasks', auth, taskController.getAssignedTasks);

// Feature #17: View assigned tasks
router.patch('/:id/status', auth, validate(schemas.taskUpdate), taskController.updateTaskStatus);
router.get('/:id', auth, taskController.getTask);

// Admin endpoints
router.post('/', auth, authorize('admin'), validate(schemas.taskCreate), taskController.createTask);
router.get('/', auth, authorize('admin'), taskController.getAllTasks);

module.exports = router;
