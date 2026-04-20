const db = require('../config/db');

// ---- CATEGORIES ----
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories WHERE is_active = TRUE ORDER BY sort_order');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createCategory = async (req, res) => {
  try {
    const { title, description, image, sort_order } = req.body;
    const [result] = await db.query(
      'INSERT INTO categories (title, description, image, sort_order) VALUES (?, ?, ?, ?)',
      [title, description, image, sort_order || 0]
    );
    res.status(201).json({ message: 'Category created', id: result.insertId });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateCategory = async (req, res) => {
  try {
    const { title, description, image, sort_order, is_active } = req.body;
    await db.query(
      'UPDATE categories SET title=?, description=?, image=?, sort_order=?, is_active=? WHERE id=?',
      [title, description, image, sort_order, is_active, req.params.id]
    );
    res.json({ message: 'Category updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteCategory = async (req, res) => {
  try {
    await db.query('UPDATE categories SET is_active = FALSE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---- PRODUCTS ----
const getProducts = async (req, res) => {
  try {
    const { category_id, search } = req.query;
    let query = `SELECT p.*, c.title as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = TRUE`;
    const params = [];
    if (category_id) { query += ' AND p.category_id = ?'; params.push(category_id); }
    if (search) { query += ' AND p.title LIKE ?'; params.push(`%${search}%`); }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createProduct = async (req, res) => {
  try {
    const { category_id, title, description, image, price, is_addon } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (category_id, title, description, image, price, is_addon) VALUES (?, ?, ?, ?, ?, ?)',
      [category_id, title, description, image, price, is_addon || false]
    );
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateProduct = async (req, res) => {
  try {
    const { category_id, title, description, image, price, is_active } = req.body;
    await db.query(
      'UPDATE products SET category_id=?, title=?, description=?, image=?, price=?, is_active=? WHERE id=?',
      [category_id, title, description, image, price, is_active, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteProduct = async (req, res) => {
  try {
    await db.query('UPDATE products SET is_active = FALSE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---- COMBOS ----
const getCombos = async (req, res) => {
  try {
    const [combos] = await db.query('SELECT * FROM combos WHERE is_active = TRUE');
    res.json(combos);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createCombo = async (req, res) => {
  try {
    const { title, description, image, price, products } = req.body;
    const [result] = await db.query(
      'INSERT INTO combos (title, description, image, price) VALUES (?, ?, ?, ?)',
      [title, description, image, price]
    );
    const combo_id = result.insertId;
    if (products && products.length > 0) {
      for (const p of products) {
        await db.query('INSERT INTO combo_products (combo_id, product_id, price) VALUES (?, ?, ?)', [combo_id, p.product_id, p.price]);
      }
    }
    res.status(201).json({ message: 'Combo created', id: combo_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateCombo = async (req, res) => {
  try {
    const { title, description, image, price, is_active } = req.body;
    await db.query('UPDATE combos SET title=?, description=?, image=?, price=?, is_active=? WHERE id=?',
      [title, description, image, price, is_active, req.params.id]);
    res.json({ message: 'Combo updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteCombo = async (req, res) => {
  try {
    await db.query('UPDATE combos SET is_active = FALSE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Combo deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---- ADDONS ----
const getAddons = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.* FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.is_addon = TRUE AND p.is_active = TRUE`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory, getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCombos, createCombo, updateCombo, deleteCombo, getAddons };
