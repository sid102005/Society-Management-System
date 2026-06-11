const mongoose = require('mongoose');

const VehicleEntrySchema = new mongoose.Schema({
  entryType: { type: String, enum: ['cab', 'taxi', 'delivery', 'personal', 'other'], required: true },
  vehicleNumber: { type: String, required: true },
  vehicleType: { type: String, enum: ['sedan', 'suv', 'auto', 'truck', 'van', 'other'] },
  ownerName: String,
  ownerPhone: String,
  driverName: String,
  driverPhone: String,
  
  inTime: { type: Date, required: true, default: Date.now },
  outTime: Date,
  duration: Number, // minutes
  
  flat: String,
  purpose: String,
  notes: String,
  
  checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  gpsLocationIn: {
    latitude: Number,
    longitude: Number,
    timestamp: Date
  },
  gpsLocationOut: {
    latitude: Number,
    longitude: Number,
    timestamp: Date
  },
  
  documents: {
    drivingLicense: String,
    vehicleRegistration: String,
    insuranceProof: String
  },
  
  status: { type: String, enum: ['active', 'exited', 'flagged'], default: 'active' },
  issues: [String],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VehicleEntry', VehicleEntrySchema);
