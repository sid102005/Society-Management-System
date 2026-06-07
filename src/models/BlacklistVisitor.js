const mongoose = require('mongoose');

const BlacklistVisitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  vehicleNumber: { type: String },
  reason: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  description: { type: String },
  photo: { type: String }, // URL to uploaded photo
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateAdded: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  removedAt: { type: Date },
  removedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  removalReason: { type: String },
  incidentReferences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlacklistVisitor', BlacklistVisitorSchema);
