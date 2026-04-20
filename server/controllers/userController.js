const db = require('../config/db');

// GET MY PROFILE
const getProfile = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, phone, email, role, loyalty_tier, total_orders, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(users[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET LOYALTY POINTS
const getLoyaltyPoints = async (req, res) => {
  try {
    const [points] = await db.query(
      'SELECT * FROM loyalty_points WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    const [balance] = await db.query(
      `SELECT COALESCE(SUM(CASE WHEN type = 'credited' THEN points ELSE -points END), 0) as balance
       FROM loyalty_points WHERE user_id = ? AND (expires_at IS NULL OR expires_at > NOW())`,
      [req.user.id]
    );
    res.json({ balance: balance[0].balance, history: points });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ADDRESSES
const getAddresses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM addresses WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const addAddress = async (req, res) => {
  try {
    const { label, address_line, city, locality, pincode, lat, lng, is_default } = req.body;
    if (!address_line || !city) return res.status(400).json({ message: 'Address line and city are required' });
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.user.id]);
    }
    const latVal = (lat !== '' && lat != null) ? parseFloat(lat) : null;
    const lngVal = (lng !== '' && lng != null) ? parseFloat(lng) : null;
    const [result] = await db.query(
      'INSERT INTO addresses (user_id, label, address_line, city, locality, pincode, lat, lng, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, label || 'Home', address_line, city, locality || null, pincode || null, latVal, lngVal, is_default ? 1 : 0]
    );
    res.status(201).json({ message: 'Address added', id: result.insertId });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateAddress = async (req, res) => {
  try {
    const { label, address_line, city, locality, pincode, lat, lng, is_default } = req.body;
    if (!address_line || !city) return res.status(400).json({ message: 'Address line and city are required' });
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.user.id]);
    }
    const latVal = (lat !== '' && lat != null) ? parseFloat(lat) : null;
    const lngVal = (lng !== '' && lng != null) ? parseFloat(lng) : null;
    await db.query(
      'UPDATE addresses SET label=?, address_line=?, city=?, locality=?, pincode=?, lat=?, lng=?, is_default=? WHERE id=? AND user_id=?',
      [label || 'Home', address_line, city, locality || null, pincode || null, latVal, lngVal, is_default ? 1 : 0, req.params.id, req.user.id]
    );
    res.json({ message: 'Address updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteAddress = async (req, res) => {
  try {
    await db.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Address deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ADMIN: GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, phone, email, role, loyalty_tier, total_orders, is_verified, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ADMIN: CREATE STAFF USER
const createUser = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { name, phone, email, password, role } = req.body;
    if (!['admin', 'kitchen_staff', 'delivery_staff'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Can only create admin, kitchen_staff or delivery_staff' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, phone, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?, TRUE)',
      [name, phone, email, hashed, role]
    );
    res.status(201).json({ message: 'User created', id: result.insertId });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ADMIN: DELETE USER
const deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getProfile, getLoyaltyPoints, getAddresses, addAddress, updateAddress, deleteAddress, getAllUsers, createUser, deleteUser };
