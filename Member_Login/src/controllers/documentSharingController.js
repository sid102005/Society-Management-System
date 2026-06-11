const SharedDocument = require("../models/SharedDocument");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");
const { generateShareToken } = require("../services/residentCoreService");
const path = require("path");

const createSharedDocument = asyncHandler(async (req, res) => {
  let filePath;

  if (req.file) {
    filePath = `/uploads/shared-documents/${req.file.filename}`;
  } else if (req.body.filePath) {
    const fs = require("fs");
    const inputPath = req.body.filePath;
    const filename = path.basename(inputPath);
    filePath = `/uploads/shared-documents/${filename}`;

    const fullPath = path.join(__dirname, "..", filePath);
    if (!fs.existsSync(fullPath)) {
      throw new AppError(400, "Invalid file path. File does not exist.");
    }
  } else {
    throw new AppError(400, "Document file or filePath is required");
  }

  const sharedDocument = await SharedDocument.create({
    residentId: req.currentResident._id,
    documentName: req.body.documentName,
    filePath,
    shareToken: generateShareToken(),
    expiryDate: req.body.expiryDate,
    sharedWith: req.body.sharedWith || "",
  });

  return successResponse(
    res,
    "Document shared successfully",
    {
      sharedDocument,
    },
    201,
  );
});

const listSharedDocuments = asyncHandler(async (req, res) => {
  const sharedDocuments = await SharedDocument.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });

  return successResponse(res, "Shared documents fetched successfully", {
    sharedDocuments,
  });
});

const deleteSharedDocument = asyncHandler(async (req, res) => {
  const sharedDocument = await SharedDocument.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!sharedDocument) {
    throw new AppError(404, "Shared document not found");
  }

  // Delete the file from disk if it exists in uploads directory
  if (
    sharedDocument.filePath &&
    sharedDocument.filePath.startsWith("/uploads/shared-documents/")
  ) {
    const fs = require("fs");
    const fullPath = path.join(__dirname, "..", sharedDocument.filePath);
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.error("Failed to delete file:", err.message);
    }
  }

  await SharedDocument.deleteOne({ _id: req.params.id });

  return successResponse(res, "Shared document deleted successfully", {
    sharedDocument,
  });
});

const resolveSharedDocument = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const sharedDocument = await SharedDocument.findOne({
    shareToken: token,
  });

  if (!sharedDocument) {
    throw new AppError(404, "Shared document not found or expired");
  }

  // Check if document has expired
  if (
    sharedDocument.expiryDate &&
    new Date(sharedDocument.expiryDate) < new Date()
  ) {
    throw new AppError(410, "Shared document has expired");
  }

  return successResponse(res, "Shared document resolved successfully", {
    documentName: sharedDocument.documentName,
    filePath: sharedDocument.filePath,
    expiryDate: sharedDocument.expiryDate,
    sharedWith: sharedDocument.sharedWith,
  });
});

module.exports = {
  createSharedDocument,
  listSharedDocuments,
  deleteSharedDocument,
  resolveSharedDocument,
};
