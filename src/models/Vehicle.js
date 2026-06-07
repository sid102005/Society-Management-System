const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerFlat: { type: String, required: true },
  vehicleType: { type: String, enum: ['car', 'bike', 'scooter', 'auto', 'van', 'other'], default: 'car' },
  stickerNumber: { type: String, unique: true },
  stickerColor: { type: String },
  make: { type: String },
  model: { type: String },
  color: { type: String },
  isVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  guestVehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GuestVehicle' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
