const FamilyMember = require("../models/FamilyMember");
const Vehicle = require("../models/Vehicle");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");

const getHomeDashboard = asyncHandler(async (req, res) => {
  const [familyMembers, vehicles] = await Promise.all([
    FamilyMember.find({ residentId: req.currentResident._id }).sort({ createdAt: -1 }),
    Vehicle.find({ residentId: req.currentResident._id }).sort({ createdAt: -1 }),
  ]);

  return successResponse(res, "Home dashboard fetched successfully", {
    resident: req.currentResident,
    familyMembers,
    vehicles,
  });
});

module.exports = {
  getHomeDashboard,
};
