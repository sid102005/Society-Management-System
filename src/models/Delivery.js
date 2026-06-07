const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  courierName: { type: String, required: true },
  courierCompany: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  vehicleNumber: { type: String },
  flatNumber: { type: String, required: true },
  numberOfPackages: { type: Number, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  purpose: { type: String, default: 'Delivery' },
  notes: { type: String },
  checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verificationId: { type: String }, // QR code reference
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delivery', DeliverySchema);
