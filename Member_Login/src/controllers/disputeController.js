const Dispute = require("../models/Dispute");
const Bill = require("../models/Bill");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const createDispute = asyncHandler(async (req, res) => {
  if (req.body.billId) {
    const bill = await Bill.findOne({
      _id: req.body.billId,
      residentId: req.currentResident._id,
    });

    if (!bill) {
      throw new AppError(404, "Bill not found for dispute");
    }
  }

  const dispute = await Dispute.create({
    residentId: req.currentResident._id,
    billId: req.body.billId || null,
    subject: req.body.subject,
    description: req.body.description,
  });

  return successResponse(res, "Dispute raised successfully", { dispute }, 201);
});

const listDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.find({ residentId: req.currentResident._id })
    .sort({ createdAt: -1 })
    .populate("billId");

  return successResponse(res, "Disputes fetched successfully", { disputes });
});

module.exports = {
  createDispute,
  listDisputes,
};
