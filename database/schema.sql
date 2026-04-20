-- =============================================
-- AROMA BIRIYANI - DATABASE SCHEMA
-- =============================================

CREATE DATABASE IF NOT EXISTS aroma_biriyani;
USE aroma_biriyani;

-- USERS TABLE
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'kitchen_staff', 'delivery_staff', 'admin') DEFAULT 'customer',
  otp VARCHAR(6),
  otp_expires DATETIME,
  is_verified BOOLEAN DEFAULT FALSE,
  total_orders INT DEFAULT 0,
  loyalty_tier ENUM('bronze', 'silver', 'gold') DEFAULT 'bronze',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ADDRESSES TABLE
CREATE TABLE addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  label VARCHAR(50),
  address_line VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  locality VARCHAR(100),
  pincode VARCHAR(10),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CATEGORIES TABLE
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS TABLE
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_addon BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- COMBOS TABLE
CREATE TABLE combos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COMBO PRODUCTS TABLE
CREATE TABLE combo_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  combo_id INT NOT NULL,
  product_id INT NOT NULL,
  price DECIMAL(10, 2),
  FOREIGN KEY (combo_id) REFERENCES combos(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- STORES TABLE
CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  phone VARCHAR(15),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  is_live BOOLEAN DEFAULT TRUE,
  delivery_range_km DECIMAL(5, 2) DEFAULT 10.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COUPONS TABLE
CREATE TABLE coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type ENUM('flat', 'percent') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_value DECIMAL(10, 2) DEFAULT 0,
  max_discount DECIMAL(10, 2),
  coupon_type ENUM('one_time', 'one_time_per_user', 'date_range', 'unlimited') DEFAULT 'unlimited',
  max_uses INT,
  used_count INT DEFAULT 0,
  valid_from DATE,
  valid_to DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDERS TABLE
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT,
  address_id INT,
  order_type ENUM('delivery', 'pickup') DEFAULT 'delivery',
  status ENUM('order_pending', 'order_placed', 'order_confirmed', 'order_on_the_way', 'order_delivered', 'cancelled') DEFAULT 'order_pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  loyalty_discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('online', 'cash_on_delivery') DEFAULT 'cash_on_delivery',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  coupon_code VARCHAR(50),
  otp VARCHAR(4),
  cooking_time INT,
  notes TEXT,
  delivery_lat DECIMAL(10, 8),
  delivery_lng DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (address_id) REFERENCES addresses(id)
);

-- ORDER ITEMS TABLE
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  combo_id INT,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (combo_id) REFERENCES combos(id)
);

-- ORDER ADDONS TABLE
CREATE TABLE order_addons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_item_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- LOYALTY POINTS TABLE
CREATE TABLE loyalty_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_id INT,
  points DECIMAL(10, 2) NOT NULL,
  type ENUM('credited', 'debited', 'expired') NOT NULL,
  description VARCHAR(255),
  expires_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- BLOGS TABLE
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  external_link VARCHAR(500),
  stage ENUM('draft', 'published') DEFAULT 'draft',
  tag ENUM('banner', 'whats_new', 'blog') DEFAULT 'blog',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BANNERS TABLE
CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255) NOT NULL,
  title VARCHAR(200),
  description TEXT,
  link VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0
);

-- MEDIA TABLE
CREATE TABLE media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  tag ENUM('gallery', 'blog', 'product', 'combo', 'category', 'banner') NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SEED DATA
-- =============================================

-- Default Categories
INSERT INTO categories (title, description, sort_order) VALUES
('Hyderabadi Biryani', 'Authentic Hyderabadi Dum Biryani', 1),
('Lucknowi Biryani', 'Classic Awadhi Biryani from Lucknow', 2),
('Kolkata Biryani', 'Fragrant Kolkata style Biryani with potato', 3),
('Kababs', 'Succulent kebabs grilled to perfection', 4),
('Korma and Curries', 'Rich and aromatic curries', 5),
('Combo', 'Value combo meals', 6),
('Celebration Menu', 'Special menus for celebrations', 7),
('Breads', 'Fresh baked breads and rotis', 8),
('Meetha', 'Sweet desserts', 9),
('Beverages', 'Refreshing drinks', 10),
('Extras', 'Add-ons and sides', 11);

-- Default Admin User (password: Admin@123)
INSERT INTO users (name, phone, email, password, role, is_verified) VALUES
('Admin', '9999999999', 'admin@aromabiriyani.com', '$2b$10$rQZ8kHH8dYkK5T5KQP5LOuHH5b5K5b5K5b5K5b5K5b5K5b5K5b', 'admin', TRUE);

-- Default Store
INSERT INTO stores (title, address, city, lat, lng, is_live, delivery_range_km) VALUES
('Aroma Biriyani - Main Branch', 'MG Road', 'Bangalore', 12.9716, 77.5946, TRUE, 10.00);
