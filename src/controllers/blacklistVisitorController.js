const BlacklistVisitor = require('../models/BlacklistVisitor');

// Feature #10: Add to blacklist
exports.addToBlacklist = async (req, res) => {
  try {
    const { name, phone, vehicleNumber, reason, severity, description, photo } = req.body;

    const blacklisted = new BlacklistVisitor({
      name,
      phone,
      vehicleNumber,
      reason,
      severity,
      description,
      photo,
      addedBy: req.user.id
    });

    await blacklisted.save();
    res.status(201).json({ message: 'Added to blacklist', data: blacklisted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get blacklist
exports.getBlacklist = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const list = await BlacklistVisitor.find({ isActive: true })
      .populate('addedBy', 'name')
      .populate('removedBy', 'name')
      .sort({ dateAdded: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BlacklistVisitor.countDocuments({ isActive: true });

    res.json({
      blacklist: list,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove from blacklist
exports.removeFromBlacklist = async (req, res) => {
  try {
    const { removalReason } = req.body;
    const blacklisted = await BlacklistVisitor.findById(req.params.id);

    if (!blacklisted) return res.status(404).json({ message: 'Not found' });

    blacklisted.isActive = false;
    blacklisted.removedAt = new Date();
    blacklisted.removedBy = req.user.id;
    blacklisted.removalReason = removalReason;

    await blacklisted.save();
    res.json({ message: 'Removed from blacklist', blacklisted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single blacklist entry
exports.getBlacklistEntry = async (req, res) => {
  try {
    const entry = await BlacklistVisitor.findById(req.params.id)
      .populate('addedBy', 'name')
      .populate('removedBy', 'name')
      .populate('incidentReferences');

    if (!entry) return res.status(404).json({ message: 'Not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check if person is blacklisted
exports.checkBlacklist = async (req, res) => {
  try {
    const { name, phone, vehicleNumber } = req.query;

    const entry = await BlacklistVisitor.findOne({
      isActive: true,
      $or: [
        { name: new RegExp(name, 'i') },
        { phone },
        { vehicleNumber }
      ]
    });

    if (entry) {
      res.json({ blacklisted: true, entry });
    } else {
      res.json({ blacklisted: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
