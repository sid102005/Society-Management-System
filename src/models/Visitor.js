const mongoose = require('mongoose');
const VisitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  flatToVisit: { type: String },
  vehicleNumber: { type: String },
  inTime: { type: Date, default: Date.now },
  outTime: { type: Date },
  approved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  preApproved: { type: Boolean, default: false },
  purpose: { type: String },
  overstayAlertSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Visitor', VisitorSchema);
