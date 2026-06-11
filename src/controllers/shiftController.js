const Shift = require('../models/Shift');

// Feature #26: Create shift roster
exports.createShift = async (req, res) => {
  try {
    const { shiftName, startTime, endTime, date, duties } = req.body;

    const shift = new Shift({
      shiftName,
      startTime,
      endTime,
      date,
      duties: duties || []
    });

    await shift.save();
    res.status(201).json({ message: 'Shift created', data: shift });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign users to shift
exports.assignUsersToShift = async (req, res) => {
  try {
    const { assignedUsers } = req.body;
    const shift = await Shift.findById(req.params.id);

    if (!shift) return res.status(404).json({ message: 'Shift not found' });

    shift.assignedUsers = assignedUsers;
    await shift.save();

    res.json({ message: 'Users assigned to shift', shift });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my shifts
exports.getMyShifts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { assignedUsers: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const shifts = await Shift.find(query)
      .populate('assignedUsers', 'name phone')
      .sort({ date: 1 });

    res.json({ shifts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all shifts (admin)
exports.getAllShifts = async (req, res) => {
  try {
    const { date, page = 1, limit = 20 } = req.query;
    const query = {};

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: d, $lt: nextDay };
    }

    const skip = (page - 1) * limit;
    const shifts = await Shift.find(query)
      .populate('assignedUsers', 'name phone')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Shift.countDocuments(query);

    res.json({
      shifts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single shift
exports.getShift = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id)
      .populate('assignedUsers', 'name phone');

    if (!shift) return res.status(404).json({ message: 'Shift not found' });
    res.json(shift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
