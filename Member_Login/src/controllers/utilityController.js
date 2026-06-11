const UtilityMeter = require("../models/UtilityMeter");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const listUtilities = asyncHandler(async (req, res) => {
  const utilities = await UtilityMeter.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });

  return successResponse(res, "Utility consumption fetched successfully", {
    utilities,
  });
});

const createUtilityMeter = asyncHandler(async (req, res) => {
  const {
    utilityType,
    readingMonth,
    previousReading,
    currentReading,
    ratePerUnit,
    notes,
  } = req.body;

  // Validate readings
  if (Number(currentReading) < Number(previousReading)) {
    throw new AppError(
      400,
      "Current reading cannot be less than previous reading",
    );
  }

  const utilityMeter = await UtilityMeter.create({
    residentId: req.currentResident._id,
    utilityType,
    readingMonth,
    previousReading,
    currentReading,
    ratePerUnit,
    notes: notes || "",
  });

  return successResponse(
    res,
    "Utility meter created successfully",
    {
      utilityMeter,
    },
    201,
  );
});

module.exports = {
  listUtilities,
  createUtilityMeter,
};
