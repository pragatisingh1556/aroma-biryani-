const express = require('express');
const router = express.Router();
const {
  getProfile, getLoyaltyPoints,
  getAddresses, addAddress, updateAddress, deleteAddress,
  getAllUsers, createUser, deleteUser
} = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Customer
router.get('/profile', verifyToken, getProfile);
router.get('/loyalty-points', verifyToken, getLoyaltyPoints);
router.get('/addresses', verifyToken, getAddresses);
router.post('/addresses', verifyToken, addAddress);
router.put('/addresses/:id', verifyToken, updateAddress);
router.delete('/addresses/:id', verifyToken, deleteAddress);

// Admin
router.get('/admin/all', verifyToken, isAdmin, getAllUsers);
router.post('/admin/create', verifyToken, isAdmin, createUser);
router.delete('/admin/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;
