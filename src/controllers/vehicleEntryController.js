const VehicleEntry = require('../models/VehicleEntry');
const Alert = require('../models/Alert');

// Feature #8: Record cab/vehicle entry
exports.recordVehicleEntry = async (req, res) => {
  try {
    const { entryType, vehicleNumber, vehicleType, ownerName, ownerPhone, driverName, driverPhone, flat, purpose, notes, gpsLocation } = req.body;

    const vehicleEntry = new VehicleEntry({
      entryType,
      vehicleNumber,
      vehicleType,
      ownerName,
      ownerPhone,
      driverName,
      driverPhone,
      flat,
      purpose,
      notes,
      checkedInBy: req.user.id,
      gpsLocationIn: gpsLocation,
      status: 'active'
    });

    await vehicleEntry.save();

    res.status(201).json({ message: 'Vehicle entry recorded', data: vehicleEntry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Record cab/vehicle exit
exports.recordVehicleExit = async (req, res) => {
  try {
    const { gpsLocation } = req.body;
    const vehicleEntry = await VehicleEntry.findById(req.params.id);

    if (!vehicleEntry) return res.status(404).json({ message: 'Vehicle entry not found' });

    vehicleEntry.outTime = new Date();
    vehicleEntry.checkedOutBy = req.user.id;
    vehicleEntry.gpsLocationOut = gpsLocation;
    vehicleEntry.duration = Math.round((vehicleEntry.outTime - vehicleEntry.inTime) / 60000); // minutes
    vehicleEntry.status = 'exited';

    await vehicleEntry.save();

    res.json({
      message: 'Vehicle exit recorded',
      vehicleEntry,
      duration: vehicleEntry.duration
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get vehicle entries
exports.getVehicleEntries = async (req, res) => {
  try {
    const { entryType, vehicleNumber, flat, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (entryType) query.entryType = entryType;
    if (vehicleNumber) query.vehicleNumber = vehicleNumber;
    if (flat) query.flat = flat;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const entries = await VehicleEntry.find(query)
      .populate('checkedInBy', 'name')
      .populate('checkedOutBy', 'name')
      .sort({ inTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await VehicleEntry.countDocuments(query);

    res.json({
      entries,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single vehicle entry
exports.getVehicleEntry = async (req, res) => {
  try {
    const entry = await VehicleEntry.findById(req.params.id)
      .populate('checkedInBy', 'name')
      .populate('checkedOutBy', 'name');

    if (!entry) return res.status(404).json({ message: 'Vehicle entry not found' });

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Flag vehicle (suspicious activity)
exports.flagVehicle = async (req, res) => {
  try {
    const { issues } = req.body;
    const entry = await VehicleEntry.findById(req.params.id);

    if (!entry) return res.status(404).json({ message: 'Vehicle entry not found' });

    entry.status = 'flagged';
    entry.issues = issues || [];

    await entry.save();

    // Alert admin
    await Alert.create({
      type: 'alert',
      severity: 'high',
      title: 'Vehicle Flagged',
      message: `${entry.vehicleNumber} - ${issues?.join(', ') || 'Suspicious activity detected'}`,
      recipientRoles: ['admin', 'staff'],
      status: 'active'
    });

    res.json({ message: 'Vehicle flagged', entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get active vehicles in society
exports.getActiveVehicles = async (req, res) => {
  try {
    const activeVehicles = await VehicleEntry.find({ status: 'active' })
      .populate('checkedInBy', 'name')
      .sort({ inTime: -1 });

    res.json({
      count: activeVehicles.length,
      vehicles: activeVehicles
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
