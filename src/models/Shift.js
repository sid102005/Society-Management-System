const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
  shiftName: { type: String, required: true }, // Morning, Afternoon, Night
  startTime: { type: String, required: true }, // HH:mm format
  endTime: { type: String, required: true },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  date: { type: Date, required: true },
  duties: [{ type: String }], // List of duties for this shift
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shift', ShiftSchema);
