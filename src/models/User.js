const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  flat: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['staff', 'member', 'admin'], default: 'staff' },
  vehicle: { type: String },
  isActive: { type: Boolean, default: true },
  profilePhoto: { type: String },
  bio: { type: String },
  emergencyContact: { type: String },
  allowDirectoryListing: { type: Boolean, default: true }, // Feature #13: Privacy
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
