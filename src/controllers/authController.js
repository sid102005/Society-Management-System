const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, phone, password, role, flat, email } = req.body;
  try {
    // Validate required fields
    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone, and password are required' });
    }

    const existing = await User.findOne({
      $or: [
        { phone },
        { email }
      ]
    });
    if (existing) return res.status(400).json({ message: 'User exists with this phone or email' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({ name, phone, password: hash, role, flat, email });
    await user.save();
    res.status(201).json({ 
      message: 'Registered successfully',
      userId: user._id,
      data: { userId: user._id }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { phone, email, password } = req.body;
  try {
    if (!password || (!phone && !email)) {
      return res.status(400).json({ message: 'Phone or email and password are required' });
    }
    const query = phone ? { phone } : { email };
    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, flat: user.flat }, process.env.JWT_SECRET || 'secret', { expiresIn: '12h' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, flat: user.flat } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
