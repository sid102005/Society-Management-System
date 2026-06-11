const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });
  return successResponse(res, "Notifications fetched successfully", {
    notifications,
  });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!notification) {
    throw new AppError(404, "Notification not found");
  }

  notification.isRead = true;
  await notification.save();

  return successResponse(res, "Notification marked as read", { notification });
});

module.exports = {
  listNotifications,
  markNotificationRead,
};
