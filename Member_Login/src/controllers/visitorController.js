const Visitor = require("../models/Visitor");
const VisitorOTP = require("../models/VisitorOTP");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");
const { generateVisitorOtp } = require("../services/visitorService");

async function findResidentVisitor(req, visitorId) {
  const visitor = await Visitor.findOne({
    _id: visitorId,
    residentId: req.currentResident._id,
  });

  if (!visitor) {
    throw new AppError(404, "Visitor not found");
  }

  return visitor;
}

const preApproveVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.create({
    residentId: req.currentResident._id,
    visitorName: req.body.visitorName,
    phone: req.body.phone || "",
    purpose: req.body.purpose,
    expectedVisitAt: req.body.expectedVisitAt || null,
    status: "Pending",
  });

  const otpCode = generateVisitorOtp();
  const visitorOtp = await VisitorOTP.create({
    residentId: req.currentResident._id,
    visitorId: visitor._id,
    otpCode,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Visitor pre-approved",
    message: `${visitor.visitorName} is waiting for OTP approval.`,
  });

  return successResponse(
    res,
    "Visitor pre-approved successfully",
    {
      visitor,
      otp: visitorOtp.otpCode,
      otpExpiresAt: visitorOtp.expiresAt,
    },
    201,
  );
});

const approveVisitor = asyncHandler(async (req, res) => {
  const visitor = await findResidentVisitor(req, req.body.visitorId);
  const visitorOtp = await VisitorOTP.findOne({
    visitorId: visitor._id,
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });

  if (!visitorOtp) {
    throw new AppError(404, "Visitor OTP not found");
  }

  if (visitorOtp.expiresAt < new Date()) {
    throw new AppError(400, "Visitor OTP has expired");
  }

  if (visitorOtp.otpCode !== req.body.otp) {
    visitorOtp.attempts += 1;
    await visitorOtp.save();
    throw new AppError(400, "Invalid OTP");
  }

  visitor.status = "Approved";
  visitor.otpVerified = true;
  visitor.entryTime = visitor.entryTime || new Date();
  visitor.approvalMethod = "OTP";
  await visitor.save();

  visitorOtp.verifiedAt = new Date();
  await visitorOtp.save();

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Visitor approved",
    message: `${visitor.visitorName} was approved using OTP.`,
  });

  return successResponse(res, "Visitor approved successfully", {
    visitor,
    visitorOtp,
  });
});

const denyVisitor = asyncHandler(async (req, res) => {
  const visitor = await findResidentVisitor(req, req.body.visitorId);

  visitor.status = "Denied";
  visitor.deniedReason = req.body.reason || "Denied by resident";
  visitor.exitTime = visitor.exitTime || new Date();
  await visitor.save();

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Visitor denied",
    message: `${visitor.visitorName} was denied access.`,
  });

  return successResponse(res, "Visitor denied successfully", { visitor });
});

const checkoutVisitor = asyncHandler(async (req, res) => {
  const visitor = await findResidentVisitor(req, req.body.visitorId);

  if (visitor.status === "Denied") {
    throw new AppError(400, "Denied visitors cannot be checked out");
  }

  if (visitor.status === "Exited") {
    throw new AppError(400, "Visitor is already checked out");
  }

  visitor.status = "Exited";
  visitor.exitTime = new Date();
  await visitor.save();

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Visitor checked out",
    message: `${visitor.visitorName} exit time was recorded.`,
  });

  return successResponse(res, "Visitor checked out successfully", { visitor });
});

const listVisitorHistory = asyncHandler(async (req, res) => {
  const visitors = await Visitor.find({
    residentId: req.currentResident._id,
  }).sort({
    createdAt: -1,
  });

  return successResponse(res, "Visitor history fetched successfully", {
    visitors,
  });
});

module.exports = {
  preApproveVisitor,
  approveVisitor,
  denyVisitor,
  checkoutVisitor,
  listVisitorHistory,
};
