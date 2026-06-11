const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  createMoveOutRequest,
  listMoveOutRequests,
  getMoveOutRequestById,
  deleteMoveOutRequest,
} = require("../controllers/moveOutController");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  [
    body("moveOutDate")
      .isISO8601()
      .withMessage("Valid move out date is required"),
    body("reason").trim().notEmpty().withMessage("Reason is required"),
  ],
  validateRequest,
  createMoveOutRequest,
);
router.get("/", listMoveOutRequests);
router.get("/:id", getMoveOutRequestById);
router.delete("/:id", deleteMoveOutRequest);

module.exports = router;
