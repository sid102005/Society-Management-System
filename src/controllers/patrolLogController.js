const PatrolLog = require('../models/PatrolLog');
const Shift = require('../models/Shift');

// Feature #21: Create patrol log
exports.startPatrol = async (req, res) => {
  try {
    const { route, shiftId } = req.body;

    const patrolLog = new PatrolLog({
      staffUser: req.user.id,
      route,
      shiftId,
      startTime: new Date(),
      checkPoints: []
    });

    await patrolLog.save();
    res.status(201).json({ message: 'Patrol started', data: patrolLog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add checkpoint to patrol
exports.addCheckpoint = async (req, res) => {
  try {
    const { location, status, notes, gpsLocation, photo } = req.body;
    const patrolLog = await PatrolLog.findById(req.params.id);

    if (!patrolLog) return res.status(404).json({ message: 'Patrol log not found' });

    patrolLog.checkPoints.push({
      location,
      checkedAt: new Date(),
      status,
      notes,
      gpsLocation,
      photo
    });

    await patrolLog.save();
    res.json({ message: 'Checkpoint added', patrolLog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// End patrol
exports.endPatrol = async (req, res) => {
  try {
    const { observations, issues } = req.body;
    const patrolLog = await PatrolLog.findById(req.params.id);

    if (!patrolLog) return res.status(404).json({ message: 'Patrol log not found' });

    patrolLog.endTime = new Date();
    patrolLog.duration = Math.round((patrolLog.endTime - patrolLog.startTime) / 60000);
    patrolLog.observations = observations;
    if (issues) patrolLog.issues = issues;

    await patrolLog.save();
    res.json({ message: 'Patrol ended', patrolLog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my patrol logs
exports.getMyPatrols = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const logs = await PatrolLog.find({ staffUser: req.user.id })
      .populate('shiftId')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PatrolLog.countDocuments({ staffUser: req.user.id });

    res.json({
      logs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all patrol logs (admin)
exports.getAllPatrols = async (req, res) => {
  try {
    const { date, page = 1, limit = 20 } = req.query;
    const query = {};

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      query.startTime = { $gte: d, $lt: nextDay };
    }

    const skip = (page - 1) * limit;
    const logs = await PatrolLog.find(query)
      .populate('staffUser', 'name phone')
      .populate('shiftId')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PatrolLog.countDocuments(query);

    res.json({
      logs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single patrol log
exports.getPatrolLog = async (req, res) => {
  try {
    const log = await PatrolLog.findById(req.params.id)
      .populate('staffUser', 'name phone')
      .populate('shiftId');

    if (!log) return res.status(404).json({ message: 'Patrol log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
