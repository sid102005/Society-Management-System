const mongoose = require('mongoose');

const PreApprovedVisitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: { type: String, required: true }, // friend, family, service, etc
  approvedByMember: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberFlat: { type: String, required: true },
  vehicleNumber: { type: String },
  visitsAllowedPerMonth: { type: Number, default: -1 }, // -1 for unlimited
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true },
  qrCode: { type: String }, // QR code data
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PreApprovedVisitor', PreApprovedVisitorSchema);
