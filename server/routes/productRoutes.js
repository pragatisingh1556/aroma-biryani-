const express = require('express');
const router = express.Router();
const {
  getCategories, createCategory, updateCategory, deleteCategory,
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  getCombos, createCombo, updateCombo, deleteCombo,
  getAddons
} = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Categories
router.get('/categories', getCategories);
router.post('/categories', verifyToken, isAdmin, createCategory);
router.put('/categories/:id', verifyToken, isAdmin, updateCategory);
router.delete('/categories/:id', verifyToken, isAdmin, deleteCategory);

// Products
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', verifyToken, isAdmin, createProduct);
router.put('/products/:id', verifyToken, isAdmin, updateProduct);
router.delete('/products/:id', verifyToken, isAdmin, deleteProduct);

// Combos
router.get('/combos', getCombos);
router.post('/combos', verifyToken, isAdmin, createCombo);
router.put('/combos/:id', verifyToken, isAdmin, updateCombo);
router.delete('/combos/:id', verifyToken, isAdmin, deleteCombo);

// Addons
router.get('/addons', getAddons);

module.exports = router;
