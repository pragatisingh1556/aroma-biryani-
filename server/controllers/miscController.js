const db = require('../config/db');

// ---- STORES ----
const getStores = async (req, res) => {
  try {
    const [stores] = await db.query('SELECT * FROM stores WHERE is_live = TRUE');
    res.json(stores);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAllStores = async (req, res) => {
  try {
    const [stores] = await db.query('SELECT * FROM stores ORDER BY created_at DESC');
    res.json(stores);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createStore = async (req, res) => {
  try {
    const { title, address, city, phone, lat, lng, is_live, delivery_range_km } = req.body;
    const [result] = await db.query(
      'INSERT INTO stores (title, address, city, phone, lat, lng, is_live, delivery_range_km) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, address, city, phone, lat, lng, is_live !== false, delivery_range_km || 10]
    );
    res.status(201).json({ message: 'Store created', id: result.insertId });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateStore = async (req, res) => {
  try {
    const { title, address, city, phone, lat, lng, is_live, delivery_range_km } = req.body;
    await db.query(
      'UPDATE stores SET title=?, address=?, city=?, phone=?, lat=?, lng=?, is_live=?, delivery_range_km=? WHERE id=?',
      [title, address, city, phone, lat, lng, is_live, delivery_range_km, req.params.id]
    );
    res.json({ message: 'Store updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteStore = async (req, res) => {
  try {
    await db.query('DELETE FROM stores WHERE id = ?', [req.params.id]);
    res.json({ message: 'Store deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---- COUPONS ----
const getCoupons = async (req, res) => {
  try {
    const [coupons] = await db.query('SELECT * FROM coupons WHERE is_active = TRUE AND (valid_to IS NULL OR valid_to >= CURDATE())');
    res.json(coupons);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const applyCoupon = async (req, res) => {
  try {
    const { code, order_amount } = req.body;
    const [coupons] = await db.query(
      'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE AND (valid_to IS NULL OR valid_to >= CURDATE())',
      [code]
    );
    if (coupons.length === 0) return res.status(400).json({ message: 'Invalid or expired coupon' });

    const coupon = coupons[0];
    if (order_amount < coupon.min_order_value) {
      return res.status(400).json({ message: `Minimum order value is Rs.${coupon.min_order_value}` });
    }

    let discount = coupon.discount_type === 'flat'
      ? coupon.discount_value
      : (order_amount * coupon.discount_value) / 100;
    if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);

    res.json({ valid: true, discount, coupon_title: coupon.title });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createCoupon = async (req, res) => {
  try {
    const { title, description, image, code, discount_type, discount_value, min_order_value, max_discount, coupon_type, max_uses, valid_from, valid_to } = req.body;
    const [result] = await db.query(
      `INSERT INTO coupons (title, description, image, code, discount_type, discount_value, min_order_value, max_discount, coupon_type, max_uses, valid_from, valid_to)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, image, code, discount_type, discount_value, min_order_value || 0, max_discount, coupon_type || 'unlimited', max_uses, valid_from, valid_to]
    );
    res.status(201).json({ message: 'Coupon created', id: result.insertId });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateCoupon = async (req, res) => {
  try {
    const { title, description, is_active } = req.body;
    await db.query('UPDATE coupons SET title=?, description=?, is_active=? WHERE id=?', [title, description, is_active, req.params.id]);
    res.json({ message: 'Coupon updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteCoupon = async (req, res) => {
  try {
    await db.query('UPDATE coupons SET is_active = FALSE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Coupon deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---- BLOGS ----
const getBlogs = async (req, res) => {
  try {
    const { tag } = req.query;
    let query = "SELECT * FROM blogs WHERE stage = 'published'";
    const params = [];
    if (tag) { query += ' AND tag = ?'; params.push(tag); }
    query += ' ORDER BY created_at DESC';
    const [blogs] = await db.query(query, params);
    res.json(blogs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAllBlogs = async (req, res) => {
  try {
    const [blogs] = await db.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(blogs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createBlog = async (req, res) => {
  try {
    const { title, description, image, external_link, stage, tag } = req.body;
    const [result] = await db.query(
      'INSERT INTO blogs (title, description, image, external_link, stage, tag) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image, external_link, stage || 'draft', tag || 'blog']
    );
    res.status(201).json({ message: 'Blog created', id: result.insertId });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateBlog = async (req, res) => {
  try {
    const { title, description, image, external_link, stage, tag } = req.body;
    const [existing] = await db.query('SELECT stage FROM blogs WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Blog not found' });
    if (existing[0].stage === 'published' && req.body.stage !== 'published') {
      return res.status(400).json({ message: 'Cannot edit published blog' });
    }
    await db.query('UPDATE blogs SET title=?, description=?, image=?, external_link=?, stage=?, tag=? WHERE id=?',
      [title, description, image, external_link, stage, tag, req.params.id]);
    res.json({ message: 'Blog updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteBlog = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT stage FROM blogs WHERE id = ?', [req.params.id]);
    if (existing.length > 0 && existing[0].stage === 'published') {
      return res.status(400).json({ message: 'Cannot delete published blog' });
    }
    await db.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Blog deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---- BANNERS ----
const getBanners = async (req, res) => {
  try {
    const [banners] = await db.query('SELECT * FROM banners WHERE is_active = TRUE ORDER BY sort_order');
    res.json(banners);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---- MEDIA ----
const getMedia = async (req, res) => {
  try {
    const { tag } = req.query;
    let query = 'SELECT * FROM media';
    const params = [];
    if (tag) { query += ' WHERE tag = ?'; params.push(tag); }
    const [media] = await db.query(query, params);
    res.json(media);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const addMedia = async (req, res) => {
  try {
    const { image_url, tag } = req.body;
    const [result] = await db.query('INSERT INTO media (image_url, tag) VALUES (?, ?)', [image_url, tag]);
    res.status(201).json({ message: 'Media added', id: result.insertId });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteMedia = async (req, res) => {
  try {
    await db.query('DELETE FROM media WHERE id = ?', [req.params.id]);
    res.json({ message: 'Media deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ---- CHECK DELIVERY AVAILABILITY ----
const checkDelivery = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const [stores] = await db.query('SELECT * FROM stores WHERE is_live = TRUE');

    const toRad = (val) => (val * Math.PI) / 180;
    const haversine = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    let nearestStore = null;
    for (const store of stores) {
      const dist = haversine(parseFloat(lat), parseFloat(lng), store.lat, store.lng);
      if (dist <= store.delivery_range_km) {
        nearestStore = { ...store, distance: dist.toFixed(2) };
        break;
      }
    }

    if (nearestStore) {
      res.json({ can_deliver: true, store: nearestStore });
    } else {
      res.json({ can_deliver: false, message: "Sorry, we couldn't deliver to this location" });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getStores, getAllStores, createStore, updateStore, deleteStore, getCoupons, applyCoupon, createCoupon, updateCoupon, deleteCoupon, getBlogs, getAllBlogs, createBlog, updateBlog, deleteBlog, getBanners, getMedia, addMedia, deleteMedia, checkDelivery };
