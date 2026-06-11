const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  listResolutions,
  getResolutionById,
  submitFeedback,
  listFeedback,
} = require("../controllers/resolutionController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listResolutions);
router.get("/:id", getResolutionById);

router.post(
  "/:id/feedback",
  [
    body("feedbackText").trim().notEmpty().withMessage("Feedback text is required"),
    body("reaction").isIn(["support", "neutral", "oppose"]).withMessage("Reaction must be support, neutral, or oppose"),
    body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  ],
  validateRequest,
  submitFeedback,
);

router.get("/:id/feedback", listFeedback);

module.exports = router;
