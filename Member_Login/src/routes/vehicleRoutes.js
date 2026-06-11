const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createVehicle,
  listVehicles,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  [
    body("vehicleType")
      .trim()
      .notEmpty()
      .withMessage("Vehicle type is required"),
    body("vehicleNumber")
      .trim()
      .notEmpty()
      .withMessage("Vehicle number is required"),
  ],
  validateRequest,
  createVehicle,
);
router.get("/", listVehicles);
router.put(
  "/:id",
  [
    body("vehicleType").optional().trim().notEmpty().withMessage("Vehicle type cannot be empty"),
    body("vehicleNumber").optional().trim().notEmpty().withMessage("Vehicle number cannot be empty"),
  ],
  validateRequest,
  updateVehicle,
);
router.delete("/:id", deleteVehicle);

module.exports = router;
