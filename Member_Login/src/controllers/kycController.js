const Kyc = require("../models/Kyc");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");
const Notification = require("../models/Notification");

const uploadKyc = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "KYC document file is required",
      errors: [],
    });
  }

  const kyc = await Kyc.create({
    residentId: req.currentResident._id,
    documentType: req.body.documentType,
    documentNumber: req.body.documentNumber,
    documentFile: `/uploads/kyc/${req.file.filename}`,
    status: "Pending",
  });

  await Notification.create({
    residentId: req.currentResident._id,
    title: "KYC uploaded",
    message: "Your KYC document has been uploaded and is pending review.",
  });

  return successResponse(res, "KYC uploaded successfully", { kyc }, 201);
});

const listKyc = asyncHandler(async (req, res) => {
  const kycRecords = await Kyc.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });
  return successResponse(res, "KYC records fetched successfully", {
    kycRecords,
  });
});

module.exports = {
  uploadKyc,
  listKyc,
};
