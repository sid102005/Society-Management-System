const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  listEmergencyContacts,
  createSOSAlert,
  listMySOSAlerts,
  getSOSAlertById,
} = require("../controllers/emergencyController");

const router = express.Router();

router.use(authMiddleware);

// Emergency contacts (public for residents)
router.get("/contacts", listEmergencyContacts);

// SOS alerts
router.post(
  "/sos",
  [
    body("alertType")
      .isIn(["Medical", "Fire", "Security", "Other"])
      .withMessage("Valid alert type is required"),
    body("location").optional().trim(),
    body("description").optional().trim(),
  ],
  validateRequest,
  createSOSAlert,
);
router.get("/sos", listMySOSAlerts);
router.get("/sos/:id", getSOSAlertById);

module.exports = router;
