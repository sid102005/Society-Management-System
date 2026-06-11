const Delivery = require('../models/Delivery');

// Feature #5: Delivery entry log
exports.recordDeliveryEntry = async (req, res) => {
  try {
    const { courierName, courierCompany, phoneNumber, vehicleNumber, flatNumber, numberOfPackages, notes } = req.body;

    const delivery = new Delivery({
      courierName,
      courierCompany,
      phoneNumber,
      vehicleNumber,
      flatNumber,
      numberOfPackages,
      notes,
      checkedInBy: req.user.id
    });

    await delivery.save();
    res.status(201).json({ message: 'Delivery entry recorded', data: delivery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Record delivery exit
exports.recordDeliveryExit = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.exitTime = new Date();
    delivery.checkedOutBy = req.user.id;

    await delivery.save();
    res.json({ message: 'Delivery exit recorded', delivery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get deliveries
exports.getDeliveries = async (req, res) => {
  try {
    const { flatNumber, page = 1, limit = 20 } = req.query;
    const query = {};
    if (flatNumber) query.flatNumber = flatNumber;

    const skip = (page - 1) * limit;
    const deliveries = await Delivery.find(query)
      .populate('checkedInBy', 'name')
      .populate('checkedOutBy', 'name')
      .sort({ entryTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Delivery.countDocuments(query);

    res.json({
      deliveries,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single delivery
exports.getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('checkedInBy', 'name')
      .populate('checkedOutBy', 'name');

    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
