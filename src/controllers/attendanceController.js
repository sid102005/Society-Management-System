const Attendance = require('../models/Attendance');
const moment = require('moment');

// Feature #25: Check-in attendance
exports.checkIn = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today }
    });

    if (!attendance) {
      attendance = new Attendance({
        user: req.user.id,
        date: today,
        status: 'present'
      });
    }

    attendance.checkInTime = new Date();
    attendance.checkInLocation = { latitude, longitude };
    attendance.status = 'present';

    await attendance.save();

    res.json({ message: 'Checked in', data: attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #25: Check-out attendance
exports.checkOut = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today }
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No check-in found for today' });
    }

    attendance.checkOutTime = new Date();
    attendance.checkOutLocation = { latitude, longitude };

    await attendance.save();

    res.json({ message: 'Checked out', attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { user: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const records = await Attendance.find(query).sort({ date: -1 });

    res.json({ records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all attendance (admin)
exports.getAllAttendance = async (req, res) => {
  try {
    const { date, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: d, $lt: nextDay };
    }

    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const records = await Attendance.find(query)
      .populate('user', 'name phone flat')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    res.json({
      records,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get attendance stats
exports.getAttendanceStats = async (req, res) => {
  try {
    const { month } = req.query;
    const startOfMonth = moment(month).startOf('month').toDate();
    const endOfMonth = moment(month).endOf('month').toDate();

    const stats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ month, stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
