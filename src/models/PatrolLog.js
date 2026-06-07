const mongoose = require('mongoose');

const PatrolLogSchema = new mongoose.Schema({
  staffUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number }, // minutes
  route: { type: String, required: true }, // e.g., "A-Wing", "B-Wing-Ground Floor"
  checkPoints: [{
    location: String,
    checkedAt: Date,
    status: { type: String, enum: ['normal', 'issue', 'emergency'] },
    notes: String,
    gpsLocation: { latitude: Number, longitude: Number },
    photo: String
  }],
  observations: { type: String },
  issues: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PatrolLog', PatrolLogSchema);
