const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Registered", "Attended", "Cancelled"],
      default: "Registered",
    },
  },
  {
    timestamps: true,
  },
);

eventRegistrationSchema.index({ eventId: 1, residentId: 1 }, { unique: true });

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
