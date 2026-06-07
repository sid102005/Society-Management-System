const Alert = require('../models/Alert');

// Get alerts for user
exports.getAlerts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {
      $or: [
        { recipientUsers: req.user.id },
        { recipientRoles: req.user.role }
      ]
    };

    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const alerts = await Alert.find(query)
      .populate('triggeredBy', 'name phone')
      .populate('acknowledgedBy', 'name')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Alert.countDocuments(query);

    res.json({
      alerts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #32: Get emergency alerts
exports.getEmergencyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      severity: 'critical',
      status: { $in: ['active', 'acknowledged'] },
      $or: [
        { recipientUsers: req.user.id },
        { recipientRoles: req.user.role }
      ]
    })
      .populate('triggeredBy', 'name phone')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ emergencyAlerts: alerts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Acknowledge alert
exports.acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    alert.status = 'acknowledged';
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = req.user.id;

    await alert.save();

    res.json({ message: 'Alert acknowledged', alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Resolve alert
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    alert.status = 'resolved';
    alert.resolvedAt = new Date();
    alert.resolvedBy = req.user.id;

    await alert.save();

    res.json({ message: 'Alert resolved', alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all alerts (admin)
exports.getAllAlerts = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (page - 1) * limit;
    const alerts = await Alert.find(query)
      .populate('triggeredBy', 'name phone')
      .populate('recipientUsers', 'name')
      .populate('acknowledgedBy', 'name')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Alert.countDocuments(query);

    res.json({
      alerts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get alert statistics
exports.getAlertStats = async (req, res) => {
  try {
    const stats = await Alert.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const byType = await Alert.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      byStatus: Object.fromEntries(stats.map(x => [x._id, x.count])),
      byType: Object.fromEntries(byType.map(x => [x._id, x.count]))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
