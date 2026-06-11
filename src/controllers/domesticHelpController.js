const DomesticHelp = require('../models/DomesticHelp');
const Alert = require('../models/Alert');

// Feature #9: Register domestic help/frequent visitor
exports.registerDomesticHelp = async (req, res) => {
  try {
    const { name, phone, type, frequency, workingDays, workingHours, aadhar } = req.body;

    const domesticHelp = new DomesticHelp({
      name,
      phone,
      type,
      flat: req.user.flat,
      registeredBy: req.user.id,
      frequency,
      workingDays,
      workingHours,
      aadhar,
      status: 'active'
    });

    await domesticHelp.save();

    // Notify admin for verification
    await Alert.create({
      type: 'notification',
      severity: 'medium',
      title: 'Domestic Help Registration',
      message: `New ${type} registered by ${req.user.name} - ${name} (${phone})`,
      recipientRoles: ['admin'],
      status: 'active'
    });

    res.status(201).json({ message: 'Domestic help registered', data: domesticHelp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my domestic help list
exports.getMyDomesticHelp = async (req, res) => {
  try {
    const helpers = await DomesticHelp.find({
      flat: req.user.flat,
      status: { $ne: 'suspended' }
    }).populate('registeredBy', 'name');

    res.json({ helpers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update domestic help
exports.updateDomesticHelp = async (req, res) => {
  try {
    const { name, phone, type, frequency, workingDays, workingHours } = req.body;
    const helper = await DomesticHelp.findById(req.params.id);

    if (!helper) return res.status(404).json({ message: 'Domestic help not found' });

    if (name) helper.name = name;
    if (phone) helper.phone = phone;
    if (type) helper.type = type;
    if (frequency) helper.frequency = frequency;
    if (workingDays) helper.workingDays = workingDays;
    if (workingHours) helper.workingHours = workingHours;

    helper.updatedAt = new Date();
    await helper.save();

    res.json({ message: 'Updated', helper });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark entry for domestic help (staff marks)
exports.markDomesticHelpEntry = async (req, res) => {
  try {
    const { domesticHelpId } = req.body;
    const helper = await DomesticHelp.findById(domesticHelpId);

    if (!helper) return res.status(404).json({ message: 'Domestic help not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayEntry = helper.entryExitLog.find(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });

    if (!todayEntry) {
      helper.entryExitLog.push({
        date: new Date(),
        inTime: new Date(),
        checkedBy: req.user.id
      });
    } else if (!todayEntry.outTime) {
      todayEntry.outTime = new Date();
      todayEntry.checkedBy = req.user.id;
    }

    helper.lastVerifiedDate = new Date();
    await helper.save();

    res.json({ message: 'Entry marked', helper });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deactivate domestic help
exports.deactivateDomesticHelp = async (req, res) => {
  try {
    const helper = await DomesticHelp.findById(req.params.id);
    if (!helper) return res.status(404).json({ message: 'Domestic help not found' });

    helper.status = 'inactive';
    await helper.save();

    res.json({ message: 'Deactivated', helper });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all domestic help (admin view)
exports.getAllDomesticHelp = async (req, res) => {
  try {
    const { flat, type, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (flat) query.flat = flat;
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const helpers = await DomesticHelp.find(query)
      .populate('registeredBy', 'name flat')
      .populate('verifiedBy', 'name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DomesticHelp.countDocuments(query);

    res.json({
      helpers,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify domestic help (admin)
exports.verifyDomesticHelp = async (req, res) => {
  try {
    const helper = await DomesticHelp.findById(req.params.id);
    if (!helper) return res.status(404).json({ message: 'Domestic help not found' });

    helper.backgroundChecked = true;
    helper.backgroundCheckDate = new Date();
    helper.verifiedBy = req.user.id;
    helper.status = 'active';

    await helper.save();

    res.json({ message: 'Verified', helper });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
