const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  type: { type: String, enum: ['sos', 'overstay', 'emergency', 'incident', 'system', 'notification'], required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who triggered it
  location: { latitude: Number, longitude: Number },
  relatedTo: { type: String }, // reference ID (visitor, incident, etc)
  recipientUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // who receives alert
  recipientRoles: [{ type: String }], // admin, staff, etc
  status: { type: String, enum: ['active', 'acknowledged', 'resolved', 'dismissed'], default: 'active' },
  acknowledgedAt: { type: Date },
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
