const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate 4-digit Order OTP
const generateOrderOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.query(
      'INSERT INTO users (name, phone, email, password, otp, otp_expires) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, email || null, hashedPassword, otp, otpExpires]
    );

    // In production: send OTP via Twilio
    console.log(`OTP for ${phone}: ${otp}`);

    res.status(201).json({ message: 'OTP sent to your phone number', otp }); // Remove otp in production
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// VERIFY OTP
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const [users] = await db.query(
      'SELECT * FROM users WHERE phone = ? AND otp = ? AND otp_expires > NOW()',
      [phone, otp]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await db.query('UPDATE users SET is_verified = TRUE, otp = NULL WHERE phone = ?', [phone]);

    const token = jwt.sign(
      { id: users[0].id, phone, role: users[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Phone verified successfully', token, user: { id: users[0].id, name: users[0].name, phone, role: users[0].role } });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid phone or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone or password' });
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, loyalty_tier: user.loyalty_tier }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashed = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change password', error: err.message });
  }
};

module.exports = { signup, verifyOTP, login, changePassword };
