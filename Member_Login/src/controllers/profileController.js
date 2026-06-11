const FamilyMember = require("../models/FamilyMember");
const Vehicle = require("../models/Vehicle");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");
const Notification = require("../models/Notification");
const { buildDashboardProfile } = require("../services/residentCoreService");

const viewProfile = asyncHandler(async (req, res) => {
  const familyMembers = await FamilyMember.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });

  const vehicles = await Vehicle.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });

  return successResponse(res, "Profile fetched successfully", {
    resident: req.currentResident,
    familyMembers,
    vehicles,
  });
});

const dashboardProfile = asyncHandler(async (req, res) => {
  const [familyMembers, vehicles] = await Promise.all([
    FamilyMember.find({ residentId: req.currentResident._id }).sort({
      createdAt: -1,
    }),
    Vehicle.find({ residentId: req.currentResident._id }).sort({
      createdAt: -1,
    }),
  ]);

  const profile = buildDashboardProfile(
    req.currentResident,
    familyMembers,
    vehicles,
  );

  return successResponse(res, "Dashboard profile fetched successfully", {
    profile,
    familyMembers,
    vehicles,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const updatableFields = [
    "fullName",
    "phone",
    "flatNumber",
    "wing",
    "floor",
    "societyName",
    "residentType",
    "profileImage",
    "gender",
    "dateOfBirth",
    "occupation",
    "emergencyContact",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.currentResident[field] = req.body[field];
    }
  });

  await req.currentResident.save();

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Profile updated",
    message: "Your profile was updated successfully.",
  });

  return successResponse(res, "Profile updated successfully", {
    resident: req.currentResident,
  });
});

const uploadProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Profile image is required",
      errors: [],
    });
  }

  req.currentResident.profileImage = `/uploads/profiles/${req.file.filename}`;
  await req.currentResident.save();

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Profile photo uploaded",
    message: "Your profile photo was uploaded successfully.",
  });

  return successResponse(res, "Profile photo uploaded successfully", {
    profileImage: req.currentResident.profileImage,
    resident: req.currentResident,
  });
});

module.exports = {
  viewProfile,
  dashboardProfile,
  updateProfile,
  uploadProfilePhoto,
};
