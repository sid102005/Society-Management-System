const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    flatNumber: {
      type: String,
      required: true,
      trim: true,
    },
    wing: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: String,
      default: "",
      trim: true,
    },
    societyName: {
      type: String,
      default: "",
      trim: true,
    },
    residentType: {
      type: String,
      enum: ["Owner", "Tenant"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    occupation: {
      type: String,
      default: "",
    },
    emergencyContact: {
      type: String,
      default: "",
    },
    autoPayEnabled: {
      type: Boolean,
      default: false,
    },
    autoPayDay: {
      type: Number,
      default: null,
      min: 1,
      max: 28,
    },
    autoPayMode: {
      type: String,
      default: "UPI",
    },
  },
  {
    timestamps: true,
  },
);

residentSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

residentSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

residentSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("Resident", residentSchema);
