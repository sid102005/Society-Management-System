const Delivery = require("../models/Delivery");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");
const { generateAuthorizationCode } = require("../services/visitorService");

const authorizeDelivery = asyncHandler(async (req, res) => {
  const delivery = await Delivery.create({
    residentId: req.currentResident._id,
    deliveryPartner: req.body.deliveryPartner,
    recipientName: req.body.recipientName,
    purpose: req.body.purpose || "",
    authorizationCode: generateAuthorizationCode(),
    status: "Authorized",
    authorizedAt: new Date(),
    notes: req.body.notes || "",
  });

  await Notification.create({
    residentId: req.currentResident._id,
    title: "Delivery authorized",
    message: `Delivery authorization created for ${delivery.deliveryPartner}.`,
  });

  return successResponse(
    res,
    "Delivery authorized successfully",
    {
      delivery,
    },
    201,
  );
});

module.exports = {
  authorizeDelivery,
};
