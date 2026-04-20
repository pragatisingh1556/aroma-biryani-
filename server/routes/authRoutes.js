const express = require('express');
const router = express.Router();
const { signup, verifyOTP, login, changePassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
