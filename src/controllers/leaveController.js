const Leave = require('../models/Leave');

// Feature #27: Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leave = new Leave({
      user: req.user.id,
      leaveType,
      startDate: start,
      endDate: end,
      numberOfDays,
      reason,
      appliedBy: req.user.id
    });

    await leave.save();
    res.status(201).json({ message: 'Leave application submitted', leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id })
      .populate('approvedBy', 'name')
      .sort({ startDate: -1 });

    res.json({ leaves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pending leave applications (admin)
exports.getPendingLeaves = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const leaves = await Leave.find({ status: 'pending' })
      .populate('user', 'name flat phone')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Leave.countDocuments({ status: 'pending' });

    res.json({
      leaves,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve or reject leave (admin)
exports.approveLeave = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ message: 'Leave application not found' });

    leave.status = status;
    leave.approvedAt = new Date();
    leave.approvedBy = req.user.id;
    if (remarks) leave.remarks = remarks;

    await leave.save();

    res.json({ message: `Leave ${status}`, leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all leaves (admin)
exports.getAllLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const leaves = await Leave.find(query)
      .populate('user', 'name flat phone')
      .populate('approvedBy', 'name')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Leave.countDocuments(query);

    res.json({
      leaves,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel leave request
exports.cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ message: 'Leave application not found' });
    if (leave.status !== 'pending') return res.status(400).json({ message: 'Can only cancel pending leaves' });

    leave.status = 'cancelled';
    await leave.save();

    res.json({ message: 'Leave cancelled', leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
