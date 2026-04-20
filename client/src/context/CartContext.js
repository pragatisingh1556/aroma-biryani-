import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState(null);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon ? coupon.discount : 0;
  const total = Math.max(0, subtotal - discount);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, discount, total, cartCount, coupon, setCoupon }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
