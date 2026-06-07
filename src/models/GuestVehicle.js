const mongoose = require('mongoose');

const GuestVehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true },
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor' },
  ownerName: { type: String, required: true },
  ownerPhone: { type: String },
  vehicleType: { type: String, enum: ['car', 'bike', 'scooter', 'auto', 'van', 'other'], default: 'car' },
  make: { type: String },
  model: { type: String },
  color: { type: String },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  duration: { type: Number }, // minutes
  flat: { type: String }, // visiting flat
  allowedDurationMinutes: { type: Number, default: 60 },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GuestVehicle', GuestVehicleSchema);
