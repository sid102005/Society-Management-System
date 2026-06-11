const EmergencyContact = require("../models/EmergencyContact");
const SOSAlert = require("../models/SOSAlert");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const listEmergencyContacts = asyncHandler(async (req, res) => {
  const contacts = await EmergencyContact.find({ isActive: true }).sort({ type: 1, name: 1 });
  return successResponse(res, "Emergency contacts fetched successfully", { contacts });
});

const createSOSAlert = asyncHandler(async (req, res) => {
  const sosAlert = await SOSAlert.create({
    residentId: req.currentResident._id,
    alertType: req.body.alertType,
    location: req.body.location || req.currentResident.flatNumber,
    description: req.body.description || "",
  });

  // Create notification for the resident
  await Notification.create({
    residentId: req.currentResident._id,
    title: "SOS Alert Activated",
    message: `Your ${sosAlert.alertType} SOS alert has been sent. Help is on the way.`,
  });

  return successResponse(res, "SOS alert sent successfully", { sosAlert }, 201);
});

const listMySOSAlerts = asyncHandler(async (req, res) => {
  const alerts = await SOSAlert.find({ residentId: req.currentResident._id }).sort({
    createdAt: -1,
  });
  return successResponse(res, "SOS alerts fetched successfully", { alerts });
});

const getSOSAlertById = asyncHandler(async (req, res) => {
  const alert = await SOSAlert.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!alert) {
    throw new AppError(404, "SOS alert not found");
  }

  return successResponse(res, "SOS alert fetched successfully", { alert });
});

module.exports = {
  listEmergencyContacts,
  createSOSAlert,
  listMySOSAlerts,
  getSOSAlertById,
};
