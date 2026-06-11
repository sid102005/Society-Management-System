const MoveOutRequest = require("../models/MoveOutRequest");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

function assertOwnerResident(resident) {
  if (resident.residentType !== "Owner") {
    throw new AppError(403, "Only owners can manage move-out requests");
  }
}

const createMoveOutRequest = asyncHandler(async (req, res) => {
  assertOwnerResident(req.currentResident);

  // Validate move-out date is in the future
  const moveOutDate = new Date(req.body.moveOutDate);
  if (isNaN(moveOutDate.getTime())) {
    throw new AppError(400, "Valid move-out date is required");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (moveOutDate <= today) {
    throw new AppError(400, "Move-out date must be in the future");
  }

  const moveOutRequest = await MoveOutRequest.create({
    residentId: req.currentResident._id,
    moveOutDate: req.body.moveOutDate,
    reason: req.body.reason,
    remarks: req.body.remarks || "",
  });

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Move-out request submitted",
    message: "Your move-out request has been submitted successfully.",
  });

  return successResponse(
    res,
    "Move-out request created successfully",
    {
      moveOutRequest,
    },
    201,
  );
});

const listMoveOutRequests = asyncHandler(async (req, res) => {
  assertOwnerResident(req.currentResident);

  const moveOutRequests = await MoveOutRequest.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });

  return successResponse(res, "Move-out requests fetched successfully", {
    moveOutRequests,
  });
});

const getMoveOutRequestById = asyncHandler(async (req, res) => {
  assertOwnerResident(req.currentResident);

  const moveOutRequest = await MoveOutRequest.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!moveOutRequest) {
    throw new AppError(404, "Move-out request not found");
  }

  return successResponse(res, "Move-out request fetched successfully", {
    moveOutRequest,
  });
});

const deleteMoveOutRequest = asyncHandler(async (req, res) => {
  assertOwnerResident(req.currentResident);

  const moveOutRequest = await MoveOutRequest.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!moveOutRequest) {
    throw new AppError(404, "Move-out request not found");
  }

  // Only allow deletion of pending requests
  if (moveOutRequest.status !== "Pending") {
    throw new AppError(400, "Can only delete pending move-out requests");
  }

  await MoveOutRequest.deleteOne({ _id: req.params.id });

  return successResponse(res, "Move-out request deleted successfully", {
    moveOutRequest,
  });
});

module.exports = {
  createMoveOutRequest,
  listMoveOutRequests,
  getMoveOutRequestById,
  deleteMoveOutRequest,
};
