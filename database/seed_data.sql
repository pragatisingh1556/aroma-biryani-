USE aroma_biriyani;

-- =============================================
-- PRODUCTS
-- =============================================

-- Hyderabadi Biryani (category_id = 1)
INSERT INTO products (category_id, title, description, image, price) VALUES
(1, 'Hyderabadi Chicken Dum Biryani', 'Slow-cooked chicken biryani with aromatic basmati rice, saffron and fried onions', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', 299),
(1, 'Hyderabadi Mutton Dum Biryani', 'Tender mutton pieces cooked with fragrant spices in authentic Hyderabadi style', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 349),
(1, 'Hyderabadi Veg Biryani', 'Seasonal vegetables cooked with basmati rice and Hyderabadi spices', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400', 199),
(1, 'Hyderabadi Paneer Biryani', 'Soft paneer cubes with fragrant basmati rice cooked dum style', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400', 249);

-- Lucknowi Biryani (category_id = 2)
INSERT INTO products (category_id, title, description, image, price) VALUES
(2, 'Lucknowi Chicken Biryani', 'Delicate Awadhi style chicken biryani with subtle spices and long grain rice', 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400', 279),
(2, 'Lucknowi Mutton Biryani', 'Melt-in-mouth mutton with rose water infused rice — a royal treat', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', 329),
(2, 'Lucknowi Veg Biryani', 'Awadhi style vegetable biryani with whole spices and caramelized onions', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400', 189);

-- Kolkata Biryani (category_id = 3)
INSERT INTO products (category_id, title, description, image, price) VALUES
(3, 'Kolkata Chicken Biryani', 'Fragrant Kolkata biryani with potato and boiled egg — uniquely delicious', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', 259),
(3, 'Kolkata Mutton Biryani', 'Classic Kolkata style with tender mutton, potato and aromatic rice', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 309);

-- Kababs (category_id = 4)
INSERT INTO products (category_id, title, description, image, price) VALUES
(4, 'Seekh Kebab (6 pcs)', 'Minced chicken kebabs with herbs, grilled on skewers', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', 199),
(4, 'Galouti Kebab (4 pcs)', 'Melt-in-mouth Lucknowi galouti kebabs with mint chutney', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', 229),
(4, 'Reshmi Kebab (4 pcs)', 'Silky smooth chicken kebabs marinated in cream and saffron', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', 219),
(4, 'Paneer Tikka (6 pcs)', 'Chargrilled paneer with bell peppers and spicy marinade', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', 189);

-- Korma and Curries (category_id = 5)
INSERT INTO products (category_id, title, description, image, price) VALUES
(5, 'Chicken Korma', 'Slow-cooked chicken in rich cream and cashew gravy', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', 249),
(5, 'Mutton Rogan Josh', 'Classic Kashmiri mutton curry with whole spices', 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400', 299),
(5, 'Dal Makhani', 'Creamy black lentil dal slow-cooked overnight', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', 149),
(5, 'Paneer Butter Masala', 'Soft paneer in rich tomato butter gravy', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400', 199);

-- Breads (category_id = 8)
INSERT INTO products (category_id, title, description, image, price, is_addon) VALUES
(8, 'Butter Naan', 'Soft leavened bread baked in tandoor with butter', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 39, TRUE),
(8, 'Tandoori Roti', 'Whole wheat bread baked fresh in clay oven', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 29, TRUE),
(8, 'Garlic Naan', 'Naan topped with garlic and fresh coriander', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 49, TRUE),
(8, 'Paratha', 'Flaky whole wheat layered bread', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 35, TRUE);

-- Meetha / Desserts (category_id = 9)
INSERT INTO products (category_id, title, description, image, price, is_addon) VALUES
(9, 'Shahi Tukda', 'Fried bread soaked in rabri and garnished with dry fruits', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 99, TRUE),
(9, 'Phirni', 'Chilled ground rice pudding with cardamom', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 79, TRUE),
(9, 'Gulab Jamun (2 pcs)', 'Soft milk dumplings in sugar syrup', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 59, TRUE);

-- Beverages (category_id = 10)
INSERT INTO products (category_id, title, description, image, price, is_addon) VALUES
(10, 'Sweet Lassi', 'Chilled yogurt drink sweetened with sugar', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 59, TRUE),
(10, 'Masala Chaas', 'Spiced buttermilk with cumin and mint', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 49, TRUE),
(10, 'Rose Sharbat', 'Chilled rose-flavored drink', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 49, TRUE),
(10, 'Soft Drink (Can)', 'Assorted canned soft drinks', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 39, TRUE);

-- Extras (category_id = 11)
INSERT INTO products (category_id, title, description, image, price, is_addon) VALUES
(11, 'Raita', 'Cooling yogurt with cucumber and spices', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 49, TRUE),
(11, 'Mirchi ka Salan', 'Traditional green chilli curry — biryani companion', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 59, TRUE),
(11, 'Papad (2 pcs)', 'Crispy fried papad', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 29, TRUE),
(11, 'Salad', 'Fresh garden salad with dressing', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 39, TRUE);

-- =============================================
-- COMBOS (category_id = 6)
-- =============================================
INSERT INTO combos (title, description, image, price) VALUES
('Biryani + Kebab Combo', 'Hyderabadi Chicken Biryani + Seekh Kebab + Raita', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', 449),
('Family Feast', 'Mutton Biryani + Chicken Korma + 4 Naans + Raita + Gulab Jamun', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 899),
('Veg Delight Combo', 'Veg Biryani + Paneer Butter Masala + 2 Naans + Raita', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400', 399),
('Date Night Special', 'Chicken Biryani + Mutton Korma + Shahi Tukda + 2 Lassi', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', 699);

-- =============================================
-- BANNERS (sliding banner on home)
-- =============================================
INSERT INTO banners (title, description, image, is_active, sort_order) VALUES
('Aroma Biriyani', 'Authentic Flavors, Delivered Fresh', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', TRUE, 1),
('Family Feast Combo', 'Order for 4 and save Rs.200! Use code FEAST200', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', TRUE, 2),
('New: Kolkata Biryani', 'Fragrant Kolkata Biryani with Potato is here!', 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=800', TRUE, 3),
('Free Delivery Today!', 'Order above Rs.399 and get free delivery', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', TRUE, 4);

-- =============================================
-- BLOGS (What's New + Blog Posts)
-- =============================================
INSERT INTO blogs (title, description, image, external_link, stage, tag) VALUES
('Zero Contact Delivery', 'We now offer 100% contactless delivery for your safety. Watch how it works!', 'https://images.unsplash.com/photo-1626166390000-4fe6754e1a30?w=400', 'https://www.youtube.com', 'published', 'whats_new'),
('Kolkata Biryani is Here!', 'We are thrilled to introduce authentic Kolkata Biryani with potato and egg to our menu.', 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400', NULL, 'published', 'whats_new'),
('The Secret Behind Our Biryani', 'Our chefs share the secret behind the perfect Dum Biryani — slow cooking, hand-picked spices, and love.', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', NULL, 'published', 'blog'),
('5 Health Benefits of Biryani Spices', 'Did you know the spices in biryani — cloves, cardamom, saffron — have amazing health benefits?', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', NULL, 'published', 'blog'),
('How to Pair Biryani with the Right Drink', 'Sweet lassi or masala chaas? We tell you the best drinks to go with each biryani.', 'https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', NULL, 'published', 'blog');

-- =============================================
-- COUPONS
-- =============================================
INSERT INTO coupons (title, description, code, discount_type, discount_value, min_order_value, max_discount, coupon_type) VALUES
('Welcome Offer', 'Get ₹50 off on your first order', 'WELCOME50', 'flat', 50, 199, NULL, 'unlimited'),
('Weekend Special', 'Flat 15% off every weekend', 'WEEKEND15', 'percent', 15, 299, 150, 'unlimited'),
('Family Feast', '₹200 off on orders above ₹799', 'FEAST200', 'flat', 200, 799, NULL, 'unlimited'),
('Biryani Lover', '10% off on all biryani orders', 'BIRYANI10', 'percent', 10, 199, 100, 'unlimited');

-- =============================================
-- GALLERY MEDIA
-- =============================================
INSERT INTO media (image_url, tag) VALUES
('https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', 'gallery'),
('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 'gallery'),
('https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400', 'gallery'),
('https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', 'gallery'),
('https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400', 'gallery'),
('https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', 'gallery'),
('https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', 'gallery'),
('https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', 'gallery'),
('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', 'gallery'),
('https://images.unsplash.com/photo-1571167530149-c1105da4562e?w=400', 'gallery');

-- =============================================
-- MORE STORES
-- =============================================
INSERT INTO stores (title, address, city, phone, lat, lng, is_live, delivery_range_km) VALUES
('Aroma Biriyani - Koramangala', 'Koramangala 5th Block', 'Bangalore', '+91-80-12345678', 12.9352, 77.6245, TRUE, 8.00),
('Aroma Biriyani - Indiranagar', '100 Feet Road, Indiranagar', 'Bangalore', '+91-80-87654321', 12.9784, 77.6408, TRUE, 7.00),
('Aroma Biriyani - Whitefield', 'ITPL Main Road', 'Bangalore', '+91-80-11223344', 12.9698, 77.7499, FALSE, 10.00);

-- =============================================
-- UPDATE ADMIN PASSWORD (Admin@123)
-- =============================================
UPDATE users SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE phone = '9999999999';
