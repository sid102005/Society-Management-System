const mongoose = require("mongoose");

const surveyResponseSchema = new mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnnualSurvey",
      required: true,
      index: true,
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        answer: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

surveyResponseSchema.index({ surveyId: 1, residentId: 1 }, { unique: true });

module.exports = mongoose.model("SurveyResponse", surveyResponseSchema);
