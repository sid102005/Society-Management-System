const EmergencyDrill = require('../models/EmergencyDrill');
const Alert = require('../models/Alert');
const User = require('../models/User');

// Feature #24: Create emergency drill
exports.createDrill = async (req, res) => {
  try {
    const { drillType, title, description, scheduledDate, startTime, estimatedDuration, location, evacuationPoints, participantRoles } = req.body;

    const drill = new EmergencyDrill({
      drillType,
      title: title || `${drillType} Emergency Drill`,
      description,
      scheduledDate,
      startTime,
      estimatedDuration,
      location,
      organizedBy: req.user.id,
      evacuationPoints,
      participantRoles,
      status: 'scheduled'
    });

    await drill.save();

    // Send notification to all staff
    await Alert.create({
      type: 'notification',
      severity: 'high',
      title: 'Emergency Drill Scheduled',
      message: `${drill.title} scheduled for ${new Date(scheduledDate).toDateString()} at ${startTime}`,
      recipientRoles: participantRoles || ['staff', 'admin'],
      status: 'active'
    });

    res.status(201).json({ message: 'Emergency drill created', data: drill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all drills
exports.getDrills = async (req, res) => {
  try {
    const { status, drillType, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (drillType) query.drillType = drillType;

    const skip = (page - 1) * limit;
    const drills = await EmergencyDrill.find(query)
      .populate('organizedBy', 'name')
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EmergencyDrill.countDocuments(query);

    res.json({
      drills,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Start drill
exports.startDrill = async (req, res) => {
  try {
    const drill = await EmergencyDrill.findById(req.params.id);
    if (!drill) return res.status(404).json({ message: 'Drill not found' });

    drill.status = 'in-progress';
    drill.actualStartTime = new Date();
    await drill.save();

    // Alert all participants
    await Alert.create({
      type: 'alert',
      severity: 'critical',
      title: `${drill.title} - INITIATED`,
      message: `Evacuation zones: ${drill.evacuationPoints.join(', ')}`,
      recipientRoles: drill.participantRoles,
      status: 'active'
    });

    res.json({ message: 'Drill started', drill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark user attendance in drill
exports.markDrillAttendance = async (req, res) => {
  try {
    const { userId, role, evacuatedAt } = req.body;
    const drill = await EmergencyDrill.findById(req.params.id);

    if (!drill) return res.status(404).json({ message: 'Drill not found' });

    let attendance = drill.attendance.find(a => a.userId.toString() === userId);

    if (!attendance) {
      drill.attendance.push({
        userId,
        role,
        checkedInAt: new Date(),
        status: 'present'
      });
      drill.actualParticipants = (drill.actualParticipants || 0) + 1;
    } else {
      attendance.checkedInAt = new Date();
      attendance.status = 'present';
      if (evacuatedAt) attendance.evacuatedAt = evacuatedAt;
    }

    await drill.save();
    res.json({ message: 'Attendance marked', drill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update evacuation zone
exports.updateEvacuationZone = async (req, res) => {
  try {
    const { zoneName, peopleEvacuated, status } = req.body;
    const drill = await EmergencyDrill.findById(req.params.id);

    if (!drill) return res.status(404).json({ message: 'Drill not found' });

    let zone = drill.evacuationZones.find(z => z.name === zoneName);

    if (!zone) {
      drill.evacuationZones.push({
        name: zoneName,
        peopleEvacuated,
        evacuatedTime: new Date(),
        status: status || 'evacuating'
      });
    } else {
      zone.peopleEvacuated = peopleEvacuated;
      zone.status = status;
    }

    await drill.save();
    res.json({ message: 'Zone updated', drill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// End drill
exports.endDrill = async (req, res) => {
  try {
    const { observations, issues, recommendations, report } = req.body;
    const drill = await EmergencyDrill.findById(req.params.id);

    if (!drill) return res.status(404).json({ message: 'Drill not found' });

    drill.status = 'completed';
    drill.actualEndTime = new Date();
    drill.observations = observations;
    drill.issues = issues || [];
    drill.recommendations = recommendations;
    drill.report = report;
    drill.nextDrillDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await drill.save();

    // Send completion alert
    await Alert.create({
      type: 'notification',
      severity: 'medium',
      title: `${drill.title} - COMPLETED`,
      message: `Drill ended. Participants: ${drill.actualParticipants}/${drill.expectedParticipants}`,
      recipientRoles: ['admin'],
      status: 'active'
    });

    res.json({ message: 'Drill completed', drill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get drill report
exports.getDrillReport = async (req, res) => {
  try {
    const drill = await EmergencyDrill.findById(req.params.id)
      .populate('organizedBy', 'name')
      .populate('attendance.userId', 'name flat');

    if (!drill) return res.status(404).json({ message: 'Drill not found' });

    res.json({
      drillType: drill.drillType,
      title: drill.title,
      scheduledDate: drill.scheduledDate,
      actualStartTime: drill.actualStartTime,
      actualEndTime: drill.actualEndTime,
      duration: drill.actualEndTime ? Math.round((drill.actualEndTime - drill.actualStartTime) / 60000) : 0,
      expectedParticipants: drill.expectedParticipants,
      actualParticipants: drill.actualParticipants,
      attendance: drill.attendance,
      evacuationZones: drill.evacuationZones,
      observations: drill.observations,
      issues: drill.issues,
      recommendations: drill.recommendations,
      report: drill.report
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
