const FamilyMember = require("../models/FamilyMember");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const createFamilyMember = asyncHandler(async (req, res) => {
  const familyMember = await FamilyMember.create({
    residentId: req.currentResident._id,
    name: req.body.name,
    relation: req.body.relation,
    age: req.body.age,
    phone: req.body.phone || "",
    occupation: req.body.occupation || "",
  });

  return successResponse(
    res,
    "Family member created successfully",
    { familyMember },
    201,
  );
});

const listFamilyMembers = asyncHandler(async (req, res) => {
  const familyMembers = await FamilyMember.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });
  return successResponse(res, "Family members fetched successfully", {
    familyMembers,
  });
});

const updateFamilyMember = asyncHandler(async (req, res) => {
  const familyMember = await FamilyMember.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!familyMember) {
    throw new AppError(404, "Family member not found");
  }

  ["name", "relation", "age", "phone", "occupation"].forEach((field) => {
    if (req.body[field] !== undefined) {
      familyMember[field] = req.body[field];
    }
  });

  await familyMember.save();
  return successResponse(res, "Family member updated successfully", {
    familyMember,
  });
});

const deleteFamilyMember = asyncHandler(async (req, res) => {
  const familyMember = await FamilyMember.findOneAndDelete({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!familyMember) {
    throw new AppError(404, "Family member not found");
  }

  return successResponse(res, "Family member deleted successfully", {
    familyMember,
  });
});

module.exports = {
  createFamilyMember,
  listFamilyMembers,
  updateFamilyMember,
  deleteFamilyMember,
};
