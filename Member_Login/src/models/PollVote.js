const mongoose = require("mongoose");

const pollVoteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
      index: true,
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    optionIndex: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

pollVoteSchema.index({ pollId: 1, residentId: 1 }, { unique: true });

module.exports = mongoose.model("PollVote", pollVoteSchema);
