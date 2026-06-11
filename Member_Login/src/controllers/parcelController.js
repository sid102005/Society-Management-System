const Parcel = require("../models/Parcel");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");

const createParcel = asyncHandler(async (req, res) => {
  const parcel = await Parcel.create({
    residentId: req.currentResident._id,
    deliveryId: req.body.deliveryId || null,
    parcelType: req.body.parcelType,
    trackingNumber: req.body.trackingNumber,
    courier: req.body.courier || "",
    expectedDeliveryAt: req.body.expectedDeliveryAt || null,
    notes: req.body.notes || "",
    notificationSent: true,
  });

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Parcel notification",
    message: `Parcel ${parcel.trackingNumber} has been registered.`,
  });

  return successResponse(res, "Parcel created successfully", { parcel }, 201);
});

const listParcels = asyncHandler(async (req, res) => {
  const parcels = await Parcel.find({
    residentId: req.currentResident._id,
  }).sort({
    createdAt: -1,
  });

  return successResponse(res, "Parcels fetched successfully", { parcels });
});

module.exports = {
  createParcel,
  listParcels,
};
