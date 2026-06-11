const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  incidentType: { type: String, enum: ['accident', 'fight', 'theft', 'fire', 'medical', 'suspicious', 'vandalism','emergency','other'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedAt: { type: Date, default: Date.now },
  gpsLocation: { latitude: Number, longitude: Number },
  witnesses: [{ type: String }], // witness names/phones
  photos: [{ type: String }], // URLs to photos
  status: { type: String, enum: ['reported', 'investigating', 'resolved', 'closed'], default: 'reported' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  investigation: { type: String },
  actionTaken: { type: String },
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', IncidentSchema);
