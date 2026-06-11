const Receipt = require("../models/Receipt");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const getReceiptById = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  }).populate("billId paymentId");

  if (!receipt) {
    throw new AppError(404, "Receipt not found");
  }

  return successResponse(res, "Receipt fetched successfully", { receipt });
});

module.exports = {
  getReceiptById,
};
