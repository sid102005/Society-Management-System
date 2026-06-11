const mongoose = require('mongoose');

const DomesticHelpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, enum: ['maid', 'cook', 'gardener', 'driver', 'other'], required: true },
  flat: { type: String, required: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  frequency: { type: String, enum: ['daily', 'weekly', '2-weekly', 'monthly'], default: 'daily' },
  workingDays: [String], // ['Monday', 'Tuesday', etc]
  workingHours: {
    startTime: String, // HH:MM
    endTime: String
  },
  aadhar: String,
  backgroundChecked: { type: Boolean, default: false },
  backgroundCheckDate: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  lastVerifiedDate: Date,
  isFrequentVisitor: { type: Boolean, default: true },
  entryExitLog: [{
    date: Date,
    inTime: Date,
    outTime: Date,
    checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DomesticHelp', DomesticHelpSchema);
