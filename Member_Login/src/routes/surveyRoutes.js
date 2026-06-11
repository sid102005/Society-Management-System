const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validate");
const {
  listSurveys,
  getSurveyById,
  submitSurveyResponse,
  getMyResponses,
} = require("../controllers/surveyController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listSurveys);
router.get("/responses/my", getMyResponses);
router.get("/:id", getSurveyById);

router.post(
  "/:id/responses",
  [
    body("answers").isArray().withMessage("Answers must be an array"),
    body("answers.*.questionIndex").isInt({ min: 0 }).withMessage("Valid questionIndex is required"),
    body("answers.*.answer").notEmpty().withMessage("Answer content cannot be empty"),
  ],
  validateRequest,
  submitSurveyResponse,
);

module.exports = router;
