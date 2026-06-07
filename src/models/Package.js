const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  courierCompany: { type: String, required: true },
  recipientFlat: { type: String, required: true },
  recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: { type: String, required: true },
  senderPhone: { type: String },
  receivedAt: { type: Date, default: Date.now },
  handedOverAt: { type: Date },
  handedOverBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  handedOverTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['received', 'notified', 'handed-over', 'unclaimed'], default: 'received' },
  notificationSent: { type: Boolean, default: false },
  acknowledgement: { type: Boolean, default: false },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Package', PackageSchema);
