const db = require('../config/db');

const generateOrderOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// PLACE ORDER
const placeOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { items, address_id, order_type, payment_method, coupon_code, loyalty_points_used, store_id, notes } = req.body;
    const user_id = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
      if (item.addons) {
        for (const addon of item.addons) {
          subtotal += addon.price * addon.quantity;
        }
      }
    }

    // Apply coupon
    let discount = 0;
    if (coupon_code) {
      const [coupons] = await conn.query(
        'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE AND (valid_to IS NULL OR valid_to >= CURDATE())',
        [coupon_code]
      );
      if (coupons.length > 0) {
        const coupon = coupons[0];
        if (subtotal >= coupon.min_order_value) {
          discount = coupon.discount_type === 'flat'
            ? coupon.discount_value
            : (subtotal * coupon.discount_value) / 100;
          if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
          await conn.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [coupon.id]);
        }
      }
    }

    // Loyalty points discount
    let loyalty_discount = 0;
    if (loyalty_points_used && loyalty_points_used > 0) {
      const [points] = await conn.query(
        'SELECT SUM(CASE WHEN type = "credited" THEN points ELSE -points END) as balance FROM loyalty_points WHERE user_id = ? AND (expires_at IS NULL OR expires_at > NOW())',
        [user_id]
      );
      const available_points = points[0].balance || 0;
      loyalty_discount = Math.min(loyalty_points_used, available_points);
    }

    const total = Math.max(0, subtotal - discount - loyalty_discount);
    const otp = generateOrderOTP();

    // Create order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, store_id, address_id, order_type, status, subtotal, discount, loyalty_discount, total, payment_method, coupon_code, otp, notes)
       VALUES (?, ?, ?, ?, 'order_pending', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, store_id || null, address_id || null, order_type || 'delivery', subtotal, discount, loyalty_discount, total, payment_method || 'cash_on_delivery', coupon_code || null, otp, notes || null]
    );

    const order_id = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      const [itemResult] = await conn.query(
        'INSERT INTO order_items (order_id, product_id, combo_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [order_id, item.product_id || null, item.combo_id || null, item.quantity, item.price]
      );

      if (item.addons && item.addons.length > 0) {
        for (const addon of item.addons) {
          await conn.query(
            'INSERT INTO order_addons (order_item_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [itemResult.insertId, addon.product_id, addon.quantity || 1, addon.price]
          );
        }
      }
    }

    // Update order status to 'order_placed' if payment_method is cod
    if (payment_method === 'cash_on_delivery') {
      await conn.query('UPDATE orders SET status = "order_placed" WHERE id = ?', [order_id]);
    }

    await conn.commit();
    res.status(201).json({ message: 'Order placed successfully', order_id, otp, total });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Order failed', error: err.message });
  } finally {
    conn.release();
  }
};

// GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, s.title as store_name
       FROM orders o
       LEFT JOIN stores s ON o.store_id = s.id
       WHERE o.user_id = ? ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// GET ORDER DETAILS
const getOrderDetails = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });

    const [items] = await db.query(
      `SELECT oi.*, p.title as product_title, p.image as product_image, c.title as combo_title
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       LEFT JOIN combos c ON oi.combo_id = c.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ order: orders[0], items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order details', error: err.message });
  }
};

// KITCHEN: GET PLACED ORDERS
const getPlacedOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as customer_name, u.phone as customer_phone
       FROM orders o JOIN users u ON o.user_id = u.id
       WHERE o.status = 'order_placed' ORDER BY o.created_at ASC`
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// KITCHEN: CONFIRM ORDER
const confirmOrder = async (req, res) => {
  try {
    const { cooking_time } = req.body;
    await db.query(
      'UPDATE orders SET status = "order_confirmed", cooking_time = ? WHERE id = ? AND status = "order_placed"',
      [cooking_time, req.params.id]
    );
    res.json({ message: 'Order confirmed', cooking_time });
  } catch (err) {
    res.status(500).json({ message: 'Failed to confirm order', error: err.message });
  }
};

// DELIVERY: GET CONFIRMED ORDERS
const getConfirmedOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as customer_name, u.phone as customer_phone, a.address_line, a.city
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.status = 'order_confirmed' ORDER BY o.created_at ASC`
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// DELIVERY: ORDER ON THE WAY
const orderOnTheWay = async (req, res) => {
  try {
    await db.query(
      'UPDATE orders SET status = "order_on_the_way" WHERE id = ? AND status = "order_confirmed"',
      [req.params.id]
    );
    res.json({ message: 'Order is on the way' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};

// DELIVERY: VERIFY OTP AND MARK DELIVERED
const deliverOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { otp } = req.body;
    const [orders] = await conn.query(
      'SELECT * FROM orders WHERE id = ? AND otp = ? AND status = "order_on_the_way"',
      [req.params.id, otp]
    );

    if (orders.length === 0) return res.status(400).json({ message: 'Invalid OTP or order not found' });

    const order = orders[0];
    await conn.query('UPDATE orders SET status = "order_delivered", payment_status = "paid" WHERE id = ?', [order.id]);

    // Credit loyalty points
    const [users] = await conn.query('SELECT * FROM users WHERE id = ?', [order.user_id]);
    const user = users[0];
    const newTotalOrders = user.total_orders + 1;

    let pointsPercent = 10;
    let newTier = 'bronze';
    if (newTotalOrders >= 13) { pointsPercent = 20; newTier = 'gold'; }
    else if (newTotalOrders >= 6) { pointsPercent = 15; newTier = 'silver'; }

    const pointsEarned = (order.total * pointsPercent) / 100;
    const expiresAt = new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000); // 4 months

    await conn.query(
      'INSERT INTO loyalty_points (user_id, order_id, points, type, description, expires_at) VALUES (?, ?, ?, "credited", ?, ?)',
      [order.user_id, order.id, pointsEarned, `Points earned for order #${order.id}`, expiresAt]
    );

    await conn.query(
      'UPDATE users SET total_orders = ?, loyalty_tier = ? WHERE id = ?',
      [newTotalOrders, newTier, order.user_id]
    );

    await conn.commit();
    res.json({ message: 'Order delivered successfully', points_earned: pointsEarned });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Failed to deliver order', error: err.message });
  } finally {
    conn.release();
  }
};

// ADMIN: GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = `SELECT o.*, u.name as customer_name, u.phone as customer_phone
                 FROM orders o JOIN users u ON o.user_id = u.id`;
    const params = [];
    if (status) { query += ' WHERE o.status = ?'; params.push(status); }
    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const [orders] = await db.query(query, params);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderDetails, getPlacedOrders, confirmOrder, getConfirmedOrders, orderOnTheWay, deliverOrder, getAllOrders };
