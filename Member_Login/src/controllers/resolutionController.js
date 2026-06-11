const CommitteeDecision = require("../models/CommitteeDecision");
const ResolutionFeedback = require("../models/ResolutionFeedback");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const listResolutions = asyncHandler(async (req, res) => {
  const resolutions = await CommitteeDecision.find({}).sort({ decisionDate: -1 });
  return successResponse(res, "Committee decisions fetched successfully", { resolutions });
});

const getResolutionById = asyncHandler(async (req, res) => {
  const resolution = await CommitteeDecision.findById(req.params.id);
  if (!resolution) {
    throw new AppError(404, "Committee decision not found");
  }
  return successResponse(res, "Committee decision fetched successfully", { resolution });
});

const submitFeedback = asyncHandler(async (req, res) => {
  const resolution = await CommitteeDecision.findById(req.params.id);
  if (!resolution) {
    throw new AppError(404, "Committee decision not found");
  }

  // Enforce unique feedback per resident per resolution
  const existingFeedback = await ResolutionFeedback.findOne({
    resolutionId: resolution._id,
    residentId: req.currentResident._id,
  });

  if (existingFeedback) {
    throw new AppError(409, "You have already submitted feedback for this resolution");
  }

  const { feedbackText, rating, reaction } = req.body;
  if (!feedbackText) {
    throw new AppError(400, "Feedback text is required");
  }
  if (!reaction) {
    throw new AppError(400, "Reaction is required");
  }

  const feedback = await ResolutionFeedback.create({
    resolutionId: resolution._id,
    residentId: req.currentResident._id,
    feedbackText,
    rating: rating ? parseInt(rating, 10) : undefined,
    reaction,
  });

  return successResponse(res, "Feedback submitted successfully", { feedback }, 201);
});

const listFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await ResolutionFeedback.find({ resolutionId: req.params.id })
    .populate("residentId", "fullName flatNumber wing")
    .sort({ createdAt: -1 });
  return successResponse(res, "Resolution feedback list fetched successfully", { feedbacks });
});

module.exports = {
  listResolutions,
  getResolutionById,
  submitFeedback,
  listFeedback,
};
