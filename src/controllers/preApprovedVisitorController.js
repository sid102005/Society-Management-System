const PreApprovedVisitor = require('../models/PreApprovedVisitor');
const QRCode = require('qrcode');

// Feature #2: Create pre-approved visitor
exports.createPreApproved = async (req, res) => {
  try {
    const { name, phone, relation, vehicleNumber, expiryDate, notes } = req.body;

    const preApproved = new PreApprovedVisitor({
      name,
      phone,
      relation,
      vehicleNumber,
      expiryDate,
      notes,
      approvedByMember: req.user.id,
      memberFlat: req.user.flat
    });

    // Generate QR code
    const qrData = JSON.stringify({
      visitorName: name,
      memberFlat: req.user.flat,
      timestamp: Date.now()
    });
    preApproved.qrCode = await QRCode.toDataURL(qrData);

    await preApproved.save();
    res.status(201).json({ message: 'Pre-approved visitor added', preApproved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pre-approved visitors for a member
exports.getMyPreApprovedVisitors = async (req, res) => {
  try {
    const visitors = await PreApprovedVisitor.find({
      approvedByMember: req.user.id,
      isActive: true
    });

    res.json({ visitors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update pre-approved visitor
exports.updatePreApproved = async (req, res) => {
  try {
    const { name, phone, relation, vehicleNumber, expiryDate, notes } = req.body;
    const preApproved = await PreApprovedVisitor.findById(req.params.id);

    if (!preApproved) return res.status(404).json({ message: 'Not found' });

    if (name) preApproved.name = name;
    if (phone) preApproved.phone = phone;
    if (relation) preApproved.relation = relation;
    if (vehicleNumber) preApproved.vehicleNumber = vehicleNumber;
    if (expiryDate) preApproved.expiryDate = expiryDate;
    if (notes) preApproved.notes = notes;

    preApproved.updatedAt = new Date();
    await preApproved.save();

    res.json({ message: 'Updated', preApproved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deactivate pre-approved visitor
exports.deactivatePreApproved = async (req, res) => {
  try {
    const preApproved = await PreApprovedVisitor.findById(req.params.id);
    if (!preApproved) return res.status(404).json({ message: 'Not found' });

    preApproved.isActive = false;
    await preApproved.save();

    res.json({ message: 'Deactivated', preApproved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all pre-approved visitors (admin)
exports.getAllPreApproved = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const visitors = await PreApprovedVisitor.find()
      .populate('approvedByMember', 'name flat')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PreApprovedVisitor.countDocuments();

    res.json({
      visitors,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
