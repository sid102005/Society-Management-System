const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DomesticHelp",
      required: true,
      index: true,
    },
    attendanceDate: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "On Leave"],
      default: "Present",
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

attendanceSchema.index({ helperId: 1, attendanceDate: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
