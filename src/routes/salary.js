const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const salaryController = require('../controllers/salaryController');

// Create salary slip (admin)
router.post('/', auth, authorize('admin'), salaryController.createSalary);

// Get my salary slips
router.get('/my-slips', auth, salaryController.getMySalarySlips);

// Get single salary slip
router.get('/:id', auth, salaryController.getSalarySlip);

// Get salary summary
router.get('/summary', auth, salaryController.getSalarySummary);

// Admin routes
router.get('/', auth, authorize('admin'), salaryController.getAllSalarySlips);
router.put('/:id', auth, authorize('admin'), salaryController.updateSalary);
router.post('/:id/approve', auth, authorize('admin'), salaryController.approveSalary);
router.post('/:id/mark-paid', auth, authorize('admin'), salaryController.markSalaryAsPaid);

module.exports = router;
