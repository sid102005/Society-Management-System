const mongoose = require('mongoose');

const EmergencyDrillSchema = new mongoose.Schema({
  drillType: { type: String, enum: ['fire', 'earthquake', 'flood', 'medical', 'security', 'other'], required: true },
  title: String,
  description: String,
  scheduledDate: { type: Date, required: true },
  startTime: String, // HH:MM
  estimatedDuration: Number, // minutes
  location: String,
  organizedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  evacuationPoints: [String],
  participantRoles: [String], // ['staff', 'member', 'security']
  status: { type: String, enum: ['scheduled', 'in-progress', 'completed', 'cancelled'], default: 'scheduled' },
  
  // Execution details
  actualStartTime: Date,
  actualEndTime: Date,
  observations: String,
  issues: [String],
  
  // Attendance
  expectedParticipants: Number,
  actualParticipants: Number,
  attendance: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    checkedInAt: Date,
    checkedOutAt: Date,
    evacuatedAt: Date,
    status: { type: String, enum: ['present', 'absent', 'excused'] }
  }],
  
  // Emergency zones
  evacuationZones: [{
    name: String,
    peopleEvacuated: Number,
    evacuatedTime: Date,
    status: String
  }],
  
  photos: [String], // URLs to uploaded images
  report: String,
  recommendations: String,
  nextDrillDate: Date,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmergencyDrill', EmergencyDrillSchema);
