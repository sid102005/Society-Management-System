const Vehicle = require('../models/Vehicle');
const GuestVehicle = require('../models/GuestVehicle');

// Feature #14 & #15: Register resident vehicle
exports.registerVehicle = async (req, res) => {
  try {
    const { registrationNumber, vehicleType, make, model, color, stickerNumber } = req.body;

    const vehicle = new Vehicle({
      registrationNumber,
      ownerUser: req.user.id,
      ownerFlat: req.user.flat,
      vehicleType,
      make,
      model,
      color,
      stickerNumber
    });

    await vehicle.save();
    res.status(201).json({ message: 'Vehicle registered', vehicle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get resident vehicles
exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ ownerUser: req.user.id });
    res.json({ vehicles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all vehicles (admin)
exports.getAllVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const vehicles = await Vehicle.find()
      .populate('ownerUser', 'name flat phone')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vehicle.countDocuments();

    res.json({
      vehicles,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #16: Register guest vehicle
exports.registerGuestVehicle = async (req, res) => {
  try {
    const { registrationNumber, ownerName, ownerPhone, vehicleType, make, model, color, visitorId, flat, allowedDurationMinutes } = req.body;

    const guestVehicle = new GuestVehicle({
      registrationNumber,
      ownerName,
      ownerPhone,
      vehicleType,
      make,
      model,
      color,
      visitorId,
      flat,
      allowedDurationMinutes: allowedDurationMinutes || 60,
      approvedBy: req.user.id
    });

    await guestVehicle.save();
    res.status(201).json({ message: 'Guest vehicle registered', guestVehicle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Record guest vehicle exit
exports.recordGuestVehicleExit = async (req, res) => {
  try {
    const guestVehicle = await GuestVehicle.findById(req.params.id);
    if (!guestVehicle) return res.status(404).json({ message: 'Guest vehicle not found' });

    guestVehicle.exitTime = new Date();
    guestVehicle.duration = Math.round((guestVehicle.exitTime - guestVehicle.entryTime) / 60000);

    await guestVehicle.save();
    res.json({ message: 'Guest vehicle exit recorded', guestVehicle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get guest vehicles
exports.getGuestVehicles = async (req, res) => {
  try {
    const { flat, page = 1, limit = 20 } = req.query;
    const query = {};
    if (flat) query.flat = flat;

    const skip = (page - 1) * limit;
    const vehicles = await GuestVehicle.find(query)
      .populate('visitorId')
      .populate('approvedBy', 'name')
      .sort({ entryTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await GuestVehicle.countDocuments(query);

    res.json({
      vehicles,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify vehicle sticker (Feature #15)
exports.verifySticker = async (req, res) => {
  try {
    const { stickerNumber } = req.query;

    const vehicle = await Vehicle.findOne({ stickerNumber, isVerified: true });
    if (!vehicle) return res.status(404).json({ verified: false, message: 'Vehicle not verified' });

    res.json({ verified: true, vehicle, message: 'Resident vehicle verified' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
