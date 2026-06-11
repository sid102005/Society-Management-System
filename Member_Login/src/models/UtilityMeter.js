const mongoose = require("mongoose");

const utilityMeterSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    utilityType: {
      type: String,
      enum: ["Electricity", "Water", "Gas"],
      required: true,
      trim: true,
    },
    readingMonth: {
      type: String,
      required: true,
      trim: true,
    },
    previousReading: {
      type: Number,
      required: true,
      min: 0,
    },
    currentReading: {
      type: Number,
      required: true,
      min: 0,
    },
    ratePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Billed", "Paid"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

utilityMeterSchema.virtual("unitsConsumed").get(function unitsConsumed() {
  return Math.max((this.currentReading || 0) - (this.previousReading || 0), 0);
});

utilityMeterSchema.virtual("amount").get(function amount() {
  return this.unitsConsumed * (this.ratePerUnit || 0);
});

utilityMeterSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("UtilityMeter", utilityMeterSchema);
