const Visitor = require('../models/Visitor');
const PreApprovedVisitor = require('../models/PreApprovedVisitor');
const BlacklistVisitor = require('../models/BlacklistVisitor');
const Alert = require('../models/Alert');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

// Feature #1: Visitor Entry Log
exports.createVisitor = async (req, res) => {
  try {
    const { name, phone, flatToVisit, vehicleNumber, purpose, preApproved } = req.body;

    // Check if blacklisted
    const blacklisted = await BlacklistVisitor.findOne({ $or: [{ name }, { phone }], isActive: true });
    if (blacklisted) {
      await Alert.create({
        type: 'alert',
        severity: 'critical',
        title: 'Blacklisted Visitor Alert',
        message: `${name} (${phone}) - blacklisted person detected at gate`,
        triggeredBy: req.user?.id,
        recipientRoles: ['admin', 'staff'],
      });
      return res.status(403).json({ message: 'Visitor is blacklisted' });
    }

    const visitor = new Visitor({
      name,
      phone,
      flatToVisit,
      vehicleNumber,
      purpose,
      preApproved: preApproved || false,
    });

    await visitor.save();

    res.status(201).json({
      message: 'Visitor entry recorded',
      visitor,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #1: Mark Visitor Exit
exports.visitExit = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    visitor.outTime = new Date();
    await visitor.save();

    res.json({
      message: 'Visitor exit recorded',
      visitor,
      duration: Math.round((visitor.outTime - visitor.inTime) / 60000), // minutes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #3: Send OTP to resident (requires Twilio setup)
exports.sendOTP = async (req, res) => {
  try {
    const { visitorId, residentPhone } = req.body;
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    visitor.otp = otp;
    visitor.otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes
    await visitor.save();

    // TODO: Integrate Twilio for SMS
    // const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilioClient.messages.create({
    //   body: `Your visitor entry OTP: ${otp}`,
    //   from: process.env.TWILIO_PHONE,
    //   to: residentPhone,
    // });

    res.json({ message: 'OTP sent to resident', otp: otp }); // Remove OTP from response in production
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #3: Verify OTP and approve visitor
exports.verifyOTPAndApprove = async (req, res) => {
  try {
    const { visitorId, otp, staffId } = req.body;
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    if (visitor.otp !== otp || new Date() > visitor.otpExpiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    visitor.approved = true;
    visitor.approvedBy = staffId;
    visitor.otp = null;
    visitor.otpExpiresAt = null;
    await visitor.save();

    res.json({ message: 'Visitor approved via OTP', visitor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #2 & #3: Get pre-approved visitor list and approve by pre-approval
exports.checkPreApproved = async (req, res) => {
  try {
    const { phone, name } = req.body;
    const preApproved = await PreApprovedVisitor.findOne({
      $or: [{ phone }, { name }],
      isActive: true,
      $expr: { $lt: [new Date(), { $ifNull: ['$expiryDate', new Date(2099, 0, 1)] }] }
    });

    if (preApproved) {
      res.json({ message: 'Pre-approved visitor found', preApproved });
    } else {
      res.status(404).json({ message: 'Not pre-approved' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #11: Overstay Detection
exports.checkOverstay = async (req, res) => {
  try {
    const overstayThreshold = parseInt(req.query.hours) || 4; // default 4 hours
    const now = new Date();

    const overstayingVisitors = await Visitor.find({
      outTime: null, // Still inside
      inTime: { $lt: new Date(now - overstayThreshold * 60 * 60 * 1000) }
    });

    if (overstayingVisitors.length > 0) {
      for (const visitor of overstayingVisitors) {
        if (!visitor.overstayAlertSent) {
          await Alert.create({
            type: 'overstay',
            severity: 'high',
            title: 'Visitor Overstay Alert',
            message: `${visitor.name} (Flat: ${visitor.flatToVisit}) exceeded ${overstayThreshold} hours`,
            relatedTo: visitor._id.toString(),
            recipientRoles: ['admin', 'staff'],
          });
          visitor.overstayAlertSent = true;
          await visitor.save();
        }
      }
    }

    res.json({
      message: `Found ${overstayingVisitors.length} overstaying visitors`,
      visitors: overstayingVisitors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #12: Daily Visitor Report
exports.getDailyReport = async (req, res) => {
  try {
    const { date, flat } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    const query = {
      inTime: { $gte: startOfDay, $lte: endOfDay }
    };

    if (flat) query.flatToVisit = flat;

    const visitors = await Visitor.find(query).sort({ inTime: -1 });

    const summary = {
      totalVisitors: visitors.length,
      approved: visitors.filter(v => v.approved).length,
      pending: visitors.filter(v => !v.approved && !v.outTime).length,
      exited: visitors.filter(v => v.outTime).length,
      stillInside: visitors.filter(v => !v.outTime).length,
    };

    res.json({
      date: queryDate.toDateString(),
      summary,
      visitors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all visitors
exports.listVisitors = async (req, res) => {
  try {
    const { status, flat, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status === 'active') query.outTime = null;
    if (status === 'exited') query.outTime = { $ne: null };
    if (flat) query.flatToVisit = flat;

    const skip = (page - 1) * limit;
    const visitors = await Visitor.find(query)
      .sort({ inTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Visitor.countDocuments(query);

    res.json({
      visitors,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single visitor
exports.getVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('approvedBy');
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve visitor
exports.approveVisitor = async (req, res) => {
  try {
    const { staffId } = req.body;
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    visitor.approved = true;
    visitor.approvedBy = staffId;
    await visitor.save();

    res.json({ message: 'Visitor approved', visitor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate QR code for pre-approved visitor gate pass (Feature #4)
exports.generateQRCode = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const qrData = JSON.stringify({ visitorId, timestamp: Date.now() });
    const qrCode = await QRCode.toDataURL(qrData);
    res.json({ qrCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
