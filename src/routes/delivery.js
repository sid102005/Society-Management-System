const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const deliveryController = require('../controllers/deliveryController');

// Feature #5: Delivery entry log
router.post('/', auth, authorize('staff'), validate(schemas.deliveryEntry), deliveryController.recordDeliveryEntry);
router.post('/:id/exit', auth, authorize('staff'), deliveryController.recordDeliveryExit);
router.get('/', auth, deliveryController.getDeliveries);
router.get('/:id', auth, deliveryController.getDelivery);

module.exports = router;
