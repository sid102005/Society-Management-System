const Salary = require('../models/Salary');
const User = require('../models/User');
const Alert = require('../models/Alert');

// Feature #28: Create salary slip
exports.createSalary = async (req, res) => {
  try {
    const { staffUserId, month, year, baseSalary, allowances, deductions, bonus, penalty, remarks } = req.body;

    const user = await User.findById(staffUserId);
    if (!user || user.role !== 'staff') {
      return res.status(400).json({ message: 'Invalid staff user' });
    }

    const totalAllowances = Object.values(allowances || {}).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(deductions || {}).reduce((a, b) => a + b, 0);
    const grossSalary = baseSalary + totalAllowances + (bonus || 0);
    const netSalary = grossSalary - totalDeductions - (penalty || 0);

    const salary = new Salary({
      staffUser: staffUserId,
      month,
      year,
      baseSalary,
      allowances: allowances || {},
      totalAllowances,
      deductions: deductions || {},
      totalDeductions,
      grossSalary,
      netSalary,
      bonus: bonus || 0,
      penalty: penalty || 0,
      remarks,
      paymentStatus: 'pending'
    });

    await salary.save();

    // Notify staff
    await Alert.create({
      type: 'notification',
      severity: 'medium',
      title: 'Salary Slip Generated',
      message: `Salary for ${month}/${year} - Amount: ₹${netSalary}`,
      recipientUsers: [staffUserId],
      status: 'active'
    });

    res.status(201).json({ message: 'Salary slip created', data: salary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my salary slips
exports.getMySalarySlips = async (req, res) => {
  try {
    const { year, month, page = 1, limit = 20 } = req.query;
    const query = { staffUser: req.user.id };

    if (year) query.year = parseInt(year);
    if (month) query.month = month;

    const skip = (page - 1) * limit;
    const slips = await Salary.find(query)
      .populate('staffUser', 'name flat')
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Salary.countDocuments(query);

    res.json({
      slips,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single salary slip
exports.getSalarySlip = async (req, res) => {
  try {
    const slip = await Salary.findById(req.params.id)
      .populate('staffUser', 'name flat phone email')
      .populate('approvedBy', 'name');

    if (!slip) return res.status(404).json({ message: 'Salary slip not found' });

    // Check authorization
    if (slip.staffUser._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ slip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all salary slips (admin)
exports.getAllSalarySlips = async (req, res) => {
  try {
    const { staffUserId, month, year, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (staffUserId) query.staffUser = staffUserId;
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    if (status) query.paymentStatus = status;

    const skip = (page - 1) * limit;
    const slips = await Salary.find(query)
      .populate('staffUser', 'name flat phone')
      .populate('approvedBy', 'name')
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Salary.countDocuments(query);

    const summary = {
      totalCount: total,
      pending: await Salary.countDocuments({ ...query, paymentStatus: 'pending' }),
      processed: await Salary.countDocuments({ ...query, paymentStatus: 'processed' }),
      paid: await Salary.countDocuments({ ...query, paymentStatus: 'paid' })
    };

    res.json({
      slips,
      summary,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update salary slip
exports.updateSalary = async (req, res) => {
  try {
    const { allowances, deductions, bonus, penalty, remarks } = req.body;
    const slip = await Salary.findById(req.params.id);

    if (!slip) return res.status(404).json({ message: 'Salary slip not found' });

    if (allowances) {
      slip.allowances = allowances;
      slip.totalAllowances = Object.values(allowances).reduce((a, b) => a + b, 0);
    }

    if (deductions) {
      slip.deductions = deductions;
      slip.totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
    }

    if (bonus !== undefined) slip.bonus = bonus;
    if (penalty !== undefined) slip.penalty = penalty;
    if (remarks) slip.remarks = remarks;

    slip.grossSalary = slip.baseSalary + slip.totalAllowances + slip.bonus;
    slip.netSalary = slip.grossSalary - slip.totalDeductions - slip.penalty;

    await slip.save();

    res.json({ message: 'Salary slip updated', slip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve salary (admin)
exports.approveSalary = async (req, res) => {
  try {
    const slip = await Salary.findById(req.params.id);
    if (!slip) return res.status(404).json({ message: 'Salary slip not found' });

    slip.paymentStatus = 'processed';
    slip.approvedBy = req.user.id;
    slip.approvedDate = new Date();

    await slip.save();

    res.json({ message: 'Salary approved', slip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark salary as paid
exports.markSalaryAsPaid = async (req, res) => {
  try {
    const { paymentDate, paymentMethod, bankDetails } = req.body;
    const slip = await Salary.findById(req.params.id);

    if (!slip) return res.status(404).json({ message: 'Salary slip not found' });

    slip.paymentStatus = 'paid';
    slip.paymentDate = paymentDate || new Date();
    slip.paymentMethod = paymentMethod;
    if (bankDetails) slip.bankDetails = bankDetails;

    await slip.save();

    // Notify staff
    await Alert.create({
      type: 'notification',
      severity: 'medium',
      title: 'Salary Paid',
      message: `Your salary for ${slip.month}/${slip.year} has been paid - Amount: ₹${slip.netSalary}`,
      recipientUsers: [slip.staffUser],
      status: 'active'
    });

    res.json({ message: 'Marked as paid', slip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get salary summary for staff member
exports.getSalarySummary = async (req, res) => {
  try {
    const { staffUserId, year } = req.query;
    const targetUserId = staffUserId || req.user.id;
    const targetYear = year || new Date().getFullYear();

    const slips = await Salary.find({
      staffUser: targetUserId,
      year: parseInt(targetYear)
    });

    const summary = {
      year: targetYear,
      totalGross: slips.reduce((a, s) => a + s.grossSalary, 0),
      totalNet: slips.reduce((a, s) => a + s.netSalary, 0),
      totalAllowances: slips.reduce((a, s) => a + s.totalAllowances, 0),
      totalDeductions: slips.reduce((a, s) => a + s.totalDeductions, 0),
      totalBonus: slips.reduce((a, s) => a + s.bonus, 0),
      totalPenalty: slips.reduce((a, s) => a + s.penalty, 0),
      monthlyBreakdown: slips.map(s => ({
        month: s.month,
        gross: s.grossSalary,
        net: s.netSalary,
        status: s.paymentStatus
      }))
    };

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
