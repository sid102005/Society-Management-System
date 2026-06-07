const Package = require('../models/Package');
const { v4: uuidv4 } = require('uuid');
const Alert = require('../models/Alert');

// Feature #6: Package received log
exports.recordPackage = async (req, res) => {
  try {
    const { courierCompany, recipientFlat, senderName, senderPhone, description, recipientUser } = req.body;

    const packageDoc = new Package({
      trackingId: uuidv4(),
      courierCompany,
      recipientFlat,
      senderName,
      senderPhone,
      description,
      recipientUser,
      status: 'received'
    });

    await packageDoc.save();

    // Send notification to resident (Feature #6)
    if (recipientUser) {
      await Alert.create({
        type: 'notification',
        severity: 'medium',
        title: 'Package Received',
        message: `Package from ${senderName} received for flat ${recipientFlat}`,
        recipientUsers: [recipientUser],
        status: 'active'
      });
    }

    res.status(201).json({ message: 'Package recorded', package: packageDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #7: Package handover with acknowledgement
exports.handoverPackage = async (req, res) => {
  try {
    const { handedOverTo, acknowledgement } = req.body;
    const packageDoc = await Package.findById(req.params.id);

    if (!packageDoc) return res.status(404).json({ message: 'Package not found' });

    packageDoc.handedOverAt = new Date();
    packageDoc.handedOverBy = req.user.id;
    packageDoc.handedOverTo = handedOverTo;
    packageDoc.acknowledgement = acknowledgement || false;
    packageDoc.status = 'handed-over';

    await packageDoc.save();

    res.json({ message: 'Package handed over', package: packageDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get packages
exports.getPackages = async (req, res) => {
  try {
    const { recipientFlat, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (recipientFlat) query.recipientFlat = recipientFlat;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const packages = await Package.find(query)
      .populate('recipientUser', 'name flat phone')
      .populate('handedOverBy', 'name')
      .populate('handedOverTo', 'name')
      .sort({ receivedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Package.countDocuments(query);

    res.json({
      packages,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get packages for resident
exports.getMyPackages = async (req, res) => {
  try {
    const packages = await Package.find({ recipientUser: req.user.id })
      .sort({ receivedAt: -1 });

    res.json({ packages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single package
exports.getPackage = async (req, res) => {
  try {
    const packageDoc = await Package.findById(req.params.id)
      .populate('recipientUser', 'name flat phone')
      .populate('handedOverBy', 'name')
      .populate('handedOverTo', 'name');

    if (!packageDoc) return res.status(404).json({ message: 'Package not found' });
    res.json(packageDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
