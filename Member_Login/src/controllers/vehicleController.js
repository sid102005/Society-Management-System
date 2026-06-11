const Vehicle = require("../models/Vehicle");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const createVehicle = asyncHandler(async (req, res) => {
  const existingVehicle = await Vehicle.findOne({
    vehicleNumber: req.body.vehicleNumber.toUpperCase(),
  });

  if (existingVehicle) {
    throw new AppError(400, "Vehicle number already exists");
  }

  const vehicle = await Vehicle.create({
    residentId: req.currentResident._id,
    vehicleType: req.body.vehicleType,
    vehicleNumber: req.body.vehicleNumber.toUpperCase(),
    brand: req.body.brand || "",
    color: req.body.color || "",
  });

  return successResponse(res, "Vehicle created successfully", { vehicle }, 201);
});

const listVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({
    residentId: req.currentResident._id,
  }).sort({ createdAt: -1 });
  return successResponse(res, "Vehicles fetched successfully", { vehicles });
});

const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!vehicle) {
    throw new AppError(404, "Vehicle not found");
  }

  if (req.body.vehicleNumber) {
    const existingVehicle = await Vehicle.findOne({
      vehicleNumber: req.body.vehicleNumber.toUpperCase(),
      _id: { $ne: vehicle._id },
    });

    if (existingVehicle) {
      throw new AppError(400, "Vehicle number already exists");
    }
  }

  ["vehicleType", "vehicleNumber", "brand", "color"].forEach((field) => {
    if (req.body[field] !== undefined) {
      vehicle[field] =
        field === "vehicleNumber"
          ? req.body[field].toUpperCase()
          : req.body[field];
    }
  });

  await vehicle.save();
  return successResponse(res, "Vehicle updated successfully", { vehicle });
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOneAndDelete({
    _id: req.params.id,
    residentId: req.currentResident._id,
  });

  if (!vehicle) {
    throw new AppError(404, "Vehicle not found");
  }

  return successResponse(res, "Vehicle deleted successfully", { vehicle });
});

module.exports = {
  createVehicle,
  listVehicles,
  updateVehicle,
  deleteVehicle,
};
