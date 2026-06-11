const Document = require("../models/Document");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const listDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find().sort({ uploadedAt: -1 });
  return successResponse(res, "Documents fetched successfully", { documents });
});

const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    throw new AppError(404, "Document not found");
  }

  return successResponse(res, "Document fetched successfully", { document });
});

module.exports = {
  listDocuments,
  getDocumentById,
};
