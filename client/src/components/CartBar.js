import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartBar = () => {
  const { cartCount, subtotal } = useCart();
  const navigate = useNavigate();

  if (cartCount === 0) return null;

  return (
    <div style={styles.bar} onClick={() => navigate('/cart')}>
      <div style={styles.left}>
        <div style={styles.badge}>{cartCount}</div>
        <span style={styles.itemsText}>
          {cartCount} item{cartCount > 1 ? 's' : ''} in cart
        </span>
      </div>
      <div style={styles.right}>
        <span style={styles.subtotal}>₹{subtotal}</span>
        <span style={styles.viewCart}>View Cart →</span>
      </div>
    </div>
  );
};

const styles = {
  bar: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(135deg, #d4580a 0%, #ff7020 100%)',
    color: '#fff',
    padding: '14px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    cursor: 'pointer', zIndex: 500,
    boxShadow: '0 -4px 20px rgba(212,88,10,0.45)',
    transition: 'transform 0.2s ease',
  },
  left: { display: 'flex', alignItems: 'center', gap: '12px' },
  badge: {
    background: 'rgba(255,255,255,0.25)',
    backdropFilter: 'blur(4px)',
    padding: '4px 10px', borderRadius: '12px',
    fontWeight: '800', fontSize: '14px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  itemsText: { fontWeight: '600', fontSize: '15px' },
  right: { display: 'flex', alignItems: 'center', gap: '14px' },
  subtotal: { fontWeight: '900', fontSize: '20px', letterSpacing: '-0.5px' },
  viewCart: {
    background: '#fff',
    color: '#d4580a',
    padding: '7px 18px',
    borderRadius: '20px',
    fontWeight: '800',
    fontSize: '13px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
};

export default CartBar;
