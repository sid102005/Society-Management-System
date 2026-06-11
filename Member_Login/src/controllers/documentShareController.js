const crypto = require("crypto");
const DocumentShare = require("../models/DocumentShare");
const Document = require("../models/Document");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const createDocumentShare = asyncHandler(async (req, res) => {
  const { documentId, sharedWithEmail, expiryDate } = req.body;

  // Check if document exists
  const document = await Document.findById(documentId);
  if (!document) {
    throw new AppError(404, "Document not found");
  }

  // Generate unique access token
  const accessToken = crypto.randomBytes(32).toString("hex");

  const documentShare = await DocumentShare.create({
    residentId: req.currentResident._id,
    documentId,
    sharedWithEmail,
    expiryDate: new Date(expiryDate),
    accessToken,
    isActive: true,
  });

  // Create notification
  await Notification.create({
    residentId: req.currentResident._id,
    title: "Document shared",
    message: `You shared "${document.title}" with ${sharedWithEmail}.`,
  });

  return successResponse(
    res,
    "Document shared successfully",
    {
      documentShare,
    },
    201,
  );
});

const listDocumentShares = asyncHandler(async (req, res) => {
  const documentShares = await DocumentShare.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });

  return successResponse(res, "Document shares fetched successfully", {
    documentShares,
  });
});

const deleteDocumentShare = asyncHandler(async (req, res) => {
  const documentShare = await DocumentShare.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!documentShare) {
    throw new AppError(404, "Document share not found");
  }

  await DocumentShare.deleteOne({ _id: req.params.id });

  return successResponse(res, "Document share deleted successfully", {
    documentShare,
  });
});

const resolveDocumentShare = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const documentShare = await DocumentShare.findOne({
    accessToken: token,
    isActive: true,
  }).populate("documentId");

  if (!documentShare) {
    throw new AppError(404, "Shared document link not found or inactive");
  }

  // Check if document has expired
  if (
    documentShare.expiryDate &&
    new Date(documentShare.expiryDate) < new Date()
  ) {
    throw new AppError(410, "Shared document link has expired");
  }

  if (!documentShare.documentId) {
    throw new AppError(404, "Document not found");
  }

  return successResponse(res, "Document share resolved successfully", {
    title: documentShare.documentId.title,
    description: documentShare.documentId.description,
    documentFile: documentShare.documentId.documentFile,
    sharedWithEmail: documentShare.sharedWithEmail,
    expiryDate: documentShare.expiryDate,
  });
});

module.exports = {
  createDocumentShare,
  listDocumentShares,
  deleteDocumentShare,
  resolveDocumentShare,
};
