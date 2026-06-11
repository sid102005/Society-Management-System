const AnnualSurvey = require("../models/AnnualSurvey");
const SurveyResponse = require("../models/SurveyResponse");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

const listSurveys = asyncHandler(async (req, res) => {
  const surveys = await AnnualSurvey.find({ isActive: true }).sort({ year: -1, createdAt: -1 });
  return successResponse(res, "Annual surveys fetched successfully", { surveys });
});

const getSurveyById = asyncHandler(async (req, res) => {
  const survey = await AnnualSurvey.findOne({ _id: req.params.id, isActive: true });
  if (!survey) {
    throw new AppError(404, "Annual survey not found");
  }
  return successResponse(res, "Annual survey fetched successfully", { survey });
});

const submitSurveyResponse = asyncHandler(async (req, res) => {
  const survey = await AnnualSurvey.findOne({ _id: req.params.id, isActive: true });
  if (!survey) {
    throw new AppError(404, "Annual survey not found");
  }

  // Check if already submitted
  const existingResponse = await SurveyResponse.findOne({
    surveyId: survey._id,
    residentId: req.currentResident._id,
  });

  if (existingResponse) {
    throw new AppError(409, "You have already submitted feedback for this survey");
  }

  const { answers } = req.body;
  if (!Array.isArray(answers) || answers.length !== survey.questions.length) {
    throw new AppError(400, `Answers array must contain exactly ${survey.questions.length} items`);
  }

  const formattedAnswers = answers.map((ans) => {
    if (ans.questionIndex === undefined || ans.answer === undefined) {
      throw new AppError(400, "Each answer must have questionIndex and answer fields");
    }
    return {
      questionIndex: ans.questionIndex,
      answer: ans.answer,
    };
  });

  const response = await SurveyResponse.create({
    surveyId: survey._id,
    residentId: req.currentResident._id,
    answers: formattedAnswers,
  });

  return successResponse(res, "Survey response submitted successfully", { response }, 201);
});

const getMyResponses = asyncHandler(async (req, res) => {
  const responses = await SurveyResponse.find({ residentId: req.currentResident._id })
    .populate("surveyId")
    .sort({ createdAt: -1 });
  return successResponse(res, "Your survey responses fetched successfully", { responses });
});

module.exports = {
  listSurveys,
  getSurveyById,
  submitSurveyResponse,
  getMyResponses,
};
