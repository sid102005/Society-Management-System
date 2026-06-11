const { validationResult } = require("express-validator");
const Resident = require("../models/Resident");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");
const AppError = require("../utils/appError");

const registerResident = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      400,
      "Validation failed",
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    );
  }

  const {
    fullName,
    email,
    phone,
    password,
    flatNumber,
    wing,
    residentType,
    isVerified,
  } = req.body;

  const existingResident = await Resident.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingResident) {
    throw new AppError(400, "Email or phone already exists");
  }

  const resident = await Resident.create({
    fullName,
    email,
    phone,
    password,
    flatNumber,
    wing,
    residentType,
    isVerified: false,
  });

  req.session.residentId = resident._id.toString();
  await new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  const Bill = require("../models/Bill");
  await Bill.create({
    residentId: resident._id,
    billType: "Maintenance",
    billingPeriod: "June 2026",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days in future
    amount: 3500,
    penaltyAmount: 0,
    paidAmount: 0,
    status: "Pending",
    notes: "Automated test outstanding bill",
  });

  return successResponse(
    res,
    "Resident registered successfully",
    { resident },
    201,
  );
});

const loginResident = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      400,
      "Validation failed",
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    );
  }

  const { email, password } = req.body;
  const resident = await Resident.findOne({ email }).select("+password");

  if (!resident) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await resident.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  req.session.residentId = resident._id.toString();
  await new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  const residentData = resident.toObject();
  delete residentData.password;

  return successResponse(res, "Login successful", { resident: residentData });
});

const logoutResident = asyncHandler(async (req, res) => {
  if (!req.session) {
    return successResponse(res, "Logout successful");
  }

  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    return successResponse(res, "Logout successful");
  });
});

const currentResident = asyncHandler(async (req, res) => {
  return successResponse(res, "Current user fetched successfully", {
    resident: req.currentResident,
  });
});

module.exports = {
  registerResident,
  loginResident,
  logoutResident,
  currentResident,
};
