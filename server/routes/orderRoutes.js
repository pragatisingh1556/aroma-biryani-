const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderDetails,
  getPlacedOrders, confirmOrder,
  getConfirmedOrders, orderOnTheWay, deliverOrder,
  getAllOrders
} = require('../controllers/orderController');
const { verifyToken, isAdmin, isKitchen, isDelivery } = require('../middleware/auth');

// Customer
router.post('/', verifyToken, placeOrder);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/my-orders/:id', verifyToken, getOrderDetails);

// Kitchen Staff
router.get('/kitchen/placed', verifyToken, isKitchen, getPlacedOrders);
router.put('/kitchen/confirm/:id', verifyToken, isKitchen, confirmOrder);

// Delivery Staff
router.get('/delivery/confirmed', verifyToken, isDelivery, getConfirmedOrders);
router.put('/delivery/on-the-way/:id', verifyToken, isDelivery, orderOnTheWay);
router.put('/delivery/deliver/:id', verifyToken, isDelivery, deliverOrder);

// Admin
router.get('/admin/all', verifyToken, isAdmin, getAllOrders);

module.exports = router;
