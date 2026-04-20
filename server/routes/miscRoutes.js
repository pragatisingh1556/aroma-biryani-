const express = require('express');
const router = express.Router();
const {
  getStores, getAllStores, createStore, updateStore, deleteStore,
  getCoupons, applyCoupon, createCoupon, updateCoupon, deleteCoupon,
  getBlogs, getAllBlogs, createBlog, updateBlog, deleteBlog,
  getBanners,
  getMedia, addMedia, deleteMedia,
  checkDelivery
} = require('../controllers/miscController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Stores (public)
router.get('/stores', getStores);
router.get('/stores/check-delivery', checkDelivery);
router.get('/admin/stores', verifyToken, isAdmin, getAllStores);
router.post('/admin/stores', verifyToken, isAdmin, createStore);
router.put('/admin/stores/:id', verifyToken, isAdmin, updateStore);
router.delete('/admin/stores/:id', verifyToken, isAdmin, deleteStore);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons/apply', verifyToken, applyCoupon);
router.post('/admin/coupons', verifyToken, isAdmin, createCoupon);
router.put('/admin/coupons/:id', verifyToken, isAdmin, updateCoupon);
router.delete('/admin/coupons/:id', verifyToken, isAdmin, deleteCoupon);

// Blogs (public)
router.get('/blogs', getBlogs);
router.get('/admin/blogs', verifyToken, isAdmin, getAllBlogs);
router.post('/admin/blogs', verifyToken, isAdmin, createBlog);
router.put('/admin/blogs/:id', verifyToken, isAdmin, updateBlog);
router.delete('/admin/blogs/:id', verifyToken, isAdmin, deleteBlog);

// Banners (public)
router.get('/banners', getBanners);

// Media
router.get('/media', getMedia);
router.post('/admin/media', verifyToken, isAdmin, addMedia);
router.delete('/admin/media/:id', verifyToken, isAdmin, deleteMedia);

module.exports = router;
