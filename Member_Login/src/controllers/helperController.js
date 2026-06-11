const DomesticHelp = require("../models/DomesticHelp");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

async function findResidentHelper(req, helperId) {
  const helper = await DomesticHelp.findOne({
    _id: helperId,
    residentId: req.currentResident._id,
  });

  if (!helper) {
    throw new AppError(404, "Domestic helper not found");
  }

  return helper;
}

const createHelper = asyncHandler(async (req, res) => {
  const helper = await DomesticHelp.create({
    residentId: req.currentResident._id,
    helperName: req.body.helperName,
    phone: req.body.phone || "",
    role: req.body.role,
    shiftStart: req.body.shiftStart || "",
    shiftEnd: req.body.shiftEnd || "",
    notes: req.body.notes || "",
  });

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Domestic helper added",
    message: `${helper.helperName} was added to your helper list.`,
  });

  return successResponse(
    res,
    "Domestic helper created successfully",
    {
      helper,
    },
    201,
  );
});

const listHelpers = asyncHandler(async (req, res) => {
  const helpers = await DomesticHelp.find({
    residentId: req.currentResident._id,
  }).sort({
    createdAt: -1,
  });

  return successResponse(res, "Domestic helpers fetched successfully", {
    helpers,
  });
});

const createAttendance = asyncHandler(async (req, res) => {
  const helper = await findResidentHelper(req, req.body.helperId);

  const today = new Date();
  today.setHours(23, 59, 59, 999); // allow today
  const attDate = new Date(req.body.attendanceDate);
  if (attDate > today) {
    throw new AppError(400, "Attendance date cannot be in the future");
  }

  let checkIn = null;
  let checkOut = null;

  if (req.body.checkInTime) {
    checkIn = new Date(req.body.checkInTime);
    if (checkIn > new Date()) {
      throw new AppError(400, "Check-in time cannot be in the future");
    }
    if (checkIn.toDateString() !== attDate.toDateString()) {
      throw new AppError(400, "Check-in time must be on the same date as attendance");
    }
  }

  if (req.body.checkOutTime) {
    if (!req.body.checkInTime) {
      throw new AppError(400, "Check-in time is required if check-out time is provided");
    }
    checkOut = new Date(req.body.checkOutTime);
    if (checkOut > new Date()) {
      throw new AppError(400, "Check-out time cannot be in the future");
    }
    if (checkOut < checkIn) {
      throw new AppError(400, "Check-out time must be after check-in time");
    }
    if (checkOut.toDateString() !== attDate.toDateString()) {
      throw new AppError(400, "Check-out time must be on the same date as attendance");
    }
  }

  // Shift overlap check
  if (checkIn && checkOut) {
    const helperIds = [helper._id];
    if (helper.phone) {
      const samePhoneHelpers = await DomesticHelp.find({ phone: helper.phone });
      samePhoneHelpers.forEach(h => {
        if (!helperIds.some(id => id.equals(h._id))) {
          helperIds.push(h._id);
        }
      });
    } else {
      const sameNameHelpers = await DomesticHelp.find({ helperName: helper.helperName });
      sameNameHelpers.forEach(h => {
        if (!helperIds.some(id => id.equals(h._id))) {
          helperIds.push(h._id);
        }
      });
    }

    const overlap = await Attendance.findOne({
      helperId: { $in: helperIds },
      residentId: { $ne: req.currentResident._id },
      checkInTime: { $lt: checkOut },
      checkOutTime: { $gt: checkIn },
    });
    if (overlap) {
      throw new AppError(409, "Shift overlap detected: Helper is already marked present at another flat during this time.");
    }
  }

  // Find existing attendance to check if check-in/out alert needs to be sent
  const existing = await Attendance.findOne({
    residentId: req.currentResident._id,
    helperId: helper._id,
    attendanceDate: req.body.attendanceDate,
  });

  const attendance = await Attendance.findOneAndUpdate(
    {
      residentId: req.currentResident._id,
      helperId: helper._id,
      attendanceDate: req.body.attendanceDate,
    },
    {
      residentId: req.currentResident._id,
      helperId: helper._id,
      attendanceDate: req.body.attendanceDate,
      checkInTime: checkIn,
      checkOutTime: checkOut,
      status: req.body.status || "Present",
      notes: req.body.notes || "",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // Send notifications/alerts
  if (checkIn && (!existing || !existing.checkInTime)) {
    const timeStr = checkIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    await Notification.create({
      residentId: req.currentResident._id,
      title: "Helper Check-In",
      message: `${helper.helperName} (${helper.role}) checked in at ${timeStr}.`,
    });
  }

  if (checkOut && (!existing || !existing.checkOutTime)) {
    const timeStr = checkOut.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    await Notification.create({
      residentId: req.currentResident._id,
      title: "Helper Check-Out",
      message: `${helper.helperName} (${helper.role}) checked out at ${timeStr}.`,
    });
  }

  return successResponse(
    res,
    "Attendance recorded successfully",
    {
      attendance,
    },
    201,
  );
});

const listAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.find({
    residentId: req.currentResident._id,
  })
    .sort({ attendanceDate: -1, createdAt: -1 })
    .populate("helperId");

  return successResponse(res, "Attendance records fetched successfully", {
    attendance,
  });
});

module.exports = {
  createHelper,
  listHelpers,
  createAttendance,
  listAttendance,
};
