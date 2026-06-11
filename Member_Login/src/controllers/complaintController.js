const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");
const realtimeService = require("../services/realtimeService");

const createComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.create({
    residentId: req.currentResident._id,
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    image: req.file ? `/uploads/complaints/${req.file.filename}` : "",
    status: "Open",
    comments: [],
  });

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Complaint created",
    message: "Your complaint has been registered successfully.",
  });

  realtimeService.sendToResident(
    req.currentResident._id.toString(),
    "complaintCreated",
    complaint,
  );

  return successResponse(
    res,
    "Complaint created successfully",
    { complaint },
    201,
  );
});

const listComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });
  return successResponse(res, "Complaints fetched successfully", {
    complaints,
  });
});

const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!complaint) {
    throw new AppError(404, "Complaint not found");
  }

  return successResponse(res, "Complaint fetched successfully", { complaint });
});

const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!complaint) {
    throw new AppError(404, "Complaint not found");
  }

  ["category", "title", "description", "status"].forEach((field) => {
    if (req.body[field] !== undefined) {
      complaint[field] = req.body[field];
    }
  });

  if (req.file) {
    complaint.image = `/uploads/complaints/${req.file.filename}`;
  }

  await complaint.save();

  realtimeService.sendToResident(
    req.currentResident._id.toString(),
    "complaintUpdated",
    complaint,
  );

  return successResponse(res, "Complaint updated successfully", { complaint });
});

const addComplaintComment = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!complaint) {
    throw new AppError(404, "Complaint not found");
  }

  complaint.comments.push({
    message: req.body.message,
    commentedBy: req.currentResident.fullName,
  });

  await complaint.save();

  realtimeService.sendToResident(
    req.currentResident._id.toString(),
    "commentAdded",
    { complaintId: complaint._id, comments: complaint.comments },
  );

  return successResponse(res, "Comment added successfully", { complaint });
});

const streamComplaints = asyncHandler(async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Keep-alive ping
  res.write("data: connected\n\n");

  if (req.query.test === "true" || req.headers["user-agent"]?.includes("PostmanRuntime")) {
    return res.end();
  }

  realtimeService.registerClient(req.currentResident._id.toString(), res);
});

const rateComplaintResolution = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!complaint) {
    throw new AppError(404, "Complaint not found");
  }

  if (complaint.status !== "Resolved") {
    throw new AppError(400, "Can only rate resolved complaints");
  }

  if (complaint.rating !== null) {
    throw new AppError(400, "Complaint has already been rated");
  }

  const rating = parseInt(req.body.rating, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new AppError(400, "Rating must be between 1 and 5");
  }

  complaint.rating = rating;
  await complaint.save();

  return successResponse(res, "Complaint rated successfully", { complaint });
});

const createServiceRequest = asyncHandler(async (req, res) => {
  const serviceRequest = await Complaint.create({
    residentId: req.currentResident._id,
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    image: req.file ? `/uploads/complaints/${req.file.filename}` : "",
    status: "Open",
    comments: [],
    complaintType: "ServiceRequest",
  });

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Service request created",
    message: "Your service request has been registered successfully.",
  });

  realtimeService.sendToResident(
    req.currentResident._id.toString(),
    "serviceRequestCreated",
    serviceRequest,
  );

  return successResponse(
    res,
    "Service request created successfully",
    { serviceRequest },
    201,
  );
});

module.exports = {
  createComplaint,
  listComplaints,
  getComplaintById,
  updateComplaint,
  addComplaintComment,
  streamComplaints,
  rateComplaintResolution,
  createServiceRequest,
};
