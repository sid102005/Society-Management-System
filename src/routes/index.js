const express = require('express');
const router = express.Router();

// Import all route modules
const auth = require('./auth');
const visitor = require('./visitor');
const complaint = require('./complaint');
const task = require('./task');
const delivery = require('./delivery');
const packageRoutes = require('./package');
const preApprovedVisitor = require('./preApprovedVisitor');
const blacklistVisitor = require('./blacklistVisitor');
const vehicle = require('./vehicle');
const incident = require('./incident');
const attendance = require('./attendance');
const shift = require('./shift');
const leave = require('./leave');
const patrolLog = require('./patrolLog');
const notice = require('./notice');
const alert = require('./alert');
const communication = require('./communication');
const member = require('./member');
const domesticHelp = require('./domesticHelp');
const emergencyDrill = require('./emergencyDrill');
const salary = require('./salary');
const vehicleEntry = require('./vehicleEntry');

// Register all routes
router.use('/auth', auth);
router.use('/visitor', visitor);
router.use('/complaint', complaint);
router.use('/task', task);
router.use('/delivery', delivery);
router.use('/package', packageRoutes);
router.use('/pre-approved', preApprovedVisitor);
router.use('/blacklist', blacklistVisitor);
router.use('/vehicle', vehicle);
router.use('/vehicle-entry', vehicleEntry);
router.use('/incident', incident);
router.use('/attendance', attendance);
router.use('/shift', shift);
router.use('/leave', leave);
router.use('/patrol', patrolLog);
router.use('/notice', notice);
router.use('/alert', alert);
router.use('/communication', communication);
router.use('/member', member);
router.use('/domestic-help', domesticHelp);
router.use('/emergency-drill', emergencyDrill);
router.use('/salary', salary);

module.exports = router;
