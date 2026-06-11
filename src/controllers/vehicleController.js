const Vehicle = require('../models/Vehicle');
const GuestVehicle = require('../models/GuestVehicle');
const QRCode = require('qrcode');

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
    res.status(201).json({ message: 'Vehicle registered', data: vehicle });
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

    const vehicle = await Vehicle.findOne({ stickerNumber, isVerified: true })
      .populate('ownerUser', 'name flat phone');
    
    if (!vehicle) return res.status(404).json({ verified: false, message: 'Vehicle not verified' });

    res.json({ 
      verified: true, 
      vehicle: {
        stickerNumber: vehicle.stickerNumber,
        registrationNumber: vehicle.registrationNumber,
        ownerName: vehicle.ownerUser.name,
        ownerFlat: vehicle.ownerFlat,
        vehicleType: vehicle.vehicleType,
        color: vehicle.color,
        stickerColor: vehicle.stickerColor,
        isActive: vehicle.isActive
      },
      message: 'Resident vehicle verified' 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #15: Scan & verify sticker
exports.scanSticker = async (req, res) => {
  try {
    const { stickerNumber, gateLocation } = req.body;

    const vehicle = await Vehicle.findOne({ stickerNumber })
      .populate('ownerUser', 'name flat phone');
    
    if (!vehicle) {
      return res.status(404).json({ 
        verified: false, 
        message: 'Sticker not found in database' 
      });
    }

    if (!vehicle.isVerified) {
      return res.status(403).json({ 
        verified: false, 
        message: 'Vehicle sticker not verified by admin',
        vehicle: { registrationNumber: vehicle.registrationNumber }
      });
    }

    if (!vehicle.isActive) {
      return res.status(403).json({ 
        verified: false, 
        message: 'Vehicle is inactive' 
      });
    }

    res.json({ 
      verified: true,
      type: 'resident',
      vehicle: {
        stickerNumber: vehicle.stickerNumber,
        registrationNumber: vehicle.registrationNumber,
        ownerName: vehicle.ownerUser.name,
        ownerFlat: vehicle.ownerFlat,
        vehicleType: vehicle.vehicleType,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        stickerColor: vehicle.stickerColor
      },
      gateLocation,
      timestamp: new Date(),
      message: 'Sticker verified - Resident vehicle'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #15: Verify guest vehicle sticker
exports.verifyGuestSticker = async (req, res) => {
  try {
    const { registrationNumber, gateLocation } = req.body;

    const guestVehicle = await GuestVehicle.findOne({ registrationNumber })
      .populate('visitorId')
      .populate('approvedBy', 'name');
    
    if (!guestVehicle) {
      return res.status(404).json({ 
        verified: false, 
        message: 'Guest vehicle not found' 
      });
    }

    // Check if within allowed duration
    const durationMinutes = Math.round((new Date() - guestVehicle.entryTime) / 60000);
    if (durationMinutes > guestVehicle.allowedDurationMinutes) {
      return res.status(403).json({ 
        verified: false, 
        message: `Vehicle overstay - allowed ${guestVehicle.allowedDurationMinutes}min, already ${durationMinutes}min`,
        vehicle: { registrationNumber }
      });
    }

    res.json({ 
      verified: true,
      type: 'guest',
      vehicle: {
        registrationNumber: guestVehicle.registrationNumber,
        ownerName: guestVehicle.ownerName,
        flat: guestVehicle.flat,
        vehicleType: guestVehicle.vehicleType,
        approvedBy: guestVehicle.approvedBy.name
      },
      remainingTime: guestVehicle.allowedDurationMinutes - durationMinutes,
      gateLocation,
      message: 'Sticker verified - Guest vehicle'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #15: Admin verification of sticker
exports.approveVehicleSticker = async (req, res) => {
  try {
    const { stickerColor, remarks } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    vehicle.isVerified = true;
    vehicle.stickerColor = stickerColor;
    await vehicle.save();

    res.json({ message: 'Vehicle sticker verified by admin', vehicle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #4: Generate QR code for vehicle sticker
exports.generateStickerQR = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('ownerUser', 'name flat phone');

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Only owner or admin can request QR code
    if (vehicle.ownerUser._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create QR code data with vehicle info
    const qrData = {
      vehicleId: vehicle._id.toString(),
      registrationNumber: vehicle.registrationNumber,
      stickerNumber: vehicle.stickerNumber,
      ownerFlat: vehicle.ownerFlat,
      timestamp: new Date().toISOString()
    };

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      message: 'QR code generated successfully',
      qrCode,
      vehicle: {
        vehicleId: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        stickerNumber: vehicle.stickerNumber,
        ownerName: vehicle.ownerUser.name,
        ownerFlat: vehicle.ownerFlat
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #4: Scan QR code from vehicle sticker
exports.scanQRCode = async (req, res) => {
  try {
    const { qrData, gateLocation } = req.body;

    // Parse QR code data
    let decodedData;
    try {
      decodedData = JSON.parse(qrData);
    } catch (e) {
      return res.status(400).json({ 
        verified: false, 
        message: 'Invalid QR code format' 
      });
    }

    const { vehicleId, registrationNumber, stickerNumber } = decodedData;

    // Find vehicle by ID or registration
    const vehicle = await Vehicle.findOne({
      $or: [
        { _id: vehicleId },
        { registrationNumber },
        { stickerNumber }
      ]
    }).populate('ownerUser', 'name flat phone');

    if (!vehicle) {
      return res.status(404).json({ 
        verified: false, 
        message: 'Vehicle not found in system' 
      });
    }

    if (!vehicle.isVerified) {
      return res.status(403).json({ 
        verified: false, 
        message: 'Vehicle not verified by admin',
        vehicle: { registrationNumber: vehicle.registrationNumber }
      });
    }

    if (!vehicle.isActive) {
      return res.status(403).json({ 
        verified: false, 
        message: 'Vehicle is inactive',
        vehicle: { registrationNumber: vehicle.registrationNumber }
      });
    }

    res.json({ 
      verified: true,
      type: 'resident_qr',
      vehicle: {
        vehicleId: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        stickerNumber: vehicle.stickerNumber,
        ownerName: vehicle.ownerUser.name,
        ownerFlat: vehicle.ownerFlat,
        vehicleType: vehicle.vehicleType,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        stickerColor: vehicle.stickerColor
      },
      gateLocation,
      scannedAt: new Date(),
      message: 'QR code verified - Resident vehicle'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #4: Get QR code image for vehicle
exports.getQRCodeImage = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Create QR code data
    const qrData = {
      vehicleId: vehicle._id.toString(),
      registrationNumber: vehicle.registrationNumber,
      stickerNumber: vehicle.stickerNumber,
      ownerFlat: vehicle.ownerFlat,
      timestamp: new Date().toISOString()
    };

    // Generate QR code as PNG buffer
    const qrImage = await QRCode.toBuffer(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 500,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="sticker-${vehicle.registrationNumber}.png"`);
    res.send(qrImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
