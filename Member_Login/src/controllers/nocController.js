const NocRequest = require("../models/NocRequest");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");

const createNocRequest = asyncHandler(async (req, res) => {
  const nocRequest = await NocRequest.create({
    residentId: req.currentResident._id,
    requestType: req.body.requestType || "Other",
    purpose: req.body.purpose,
    requestedFor: req.body.requestedFor || req.currentResident.fullName,
  });

  return successResponse(
    res,
    "NOC request submitted successfully",
    {
      nocRequest,
    },
    201,
  );
});

const listNocRequests = asyncHandler(async (req, res) => {
  const nocRequests = await NocRequest.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });

  return successResponse(res, "NOC requests fetched successfully", {
    nocRequests,
  });
});

module.exports = {
  createNocRequest,
  listNocRequests,
};
