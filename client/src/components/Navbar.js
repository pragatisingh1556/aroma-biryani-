import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <span style={styles.brandEmoji}>🍛</span>
        <span>Aroma Biriyani</span>
      </Link>

      <div style={styles.links}>
        <Link to="/"       className="nav-link" style={styles.link}>Menu</Link>
        <Link to="/offers" className="nav-link" style={styles.link}>🎟 Offers</Link>
        <Link to="/stores" className="nav-link" style={styles.link}>🏪 Stores</Link>
        <Link to="/gallery" className="nav-link" style={styles.link}>Gallery</Link>
        <Link to="/about"  className="nav-link" style={styles.link}>About</Link>

        {user ? (
          <>
            <Link to="/orders"  className="nav-link" style={styles.link}>My Orders</Link>
            <Link to="/profile" className="nav-link" style={styles.link}>
              <span style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</span>
            </Link>
            {user.role === 'admin'          && <Link to="/admin"    className="nav-link" style={{ ...styles.link, color: '#d4580a', fontWeight: '700' }}>⚙️ Admin</Link>}
            {user.role === 'kitchen_staff'  && <Link to="/kitchen"  className="nav-link" style={{ ...styles.link, color: '#9c27b0', fontWeight: '700' }}>👨‍🍳 Kitchen</Link>}
            {user.role === 'delivery_staff' && <Link to="/delivery" className="nav-link" style={{ ...styles.link, color: '#2196f3', fontWeight: '700' }}>🚴 Delivery</Link>}
            <button className="btn-outline" style={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"  className="nav-link" style={styles.link}>Login</Link>
            <Link to="/signup" className="btn-brand" style={styles.signupBtn}>Sign Up</Link>
          </>
        )}

        <Link to="/cart" style={styles.cartBtn}>
          🛒
          {cartCount > 0 && <span className="badge-pop" style={styles.badge}>{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#080808',
    padding: '0 24px',
    height: '62px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 16px rgba(0,0,0,0.6)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid #1e1e1e',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#d4580a',
    fontWeight: '800',
    fontSize: '20px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    letterSpacing: '-0.3px',
  },
  brandEmoji: { fontSize: '24px' },
  links: { display: 'flex', alignItems: 'center', gap: '16px' },
  link: { color: '#aaaaaa', textDecoration: 'none', fontWeight: '500', fontSize: '14px', whiteSpace: 'nowrap' },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4580a, #ff7020)',
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #2e2e2e',
    color: '#aaaaaa',
    padding: '5px 12px',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
  },
  signupBtn: {
    padding: '7px 16px',
    borderRadius: '20px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '13px',
    textDecoration: 'none',
  },
  cartBtn: {
    color: '#d4580a',
    textDecoration: 'none',
    fontSize: '22px',
    position: 'relative',
    padding: '4px',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
    background: 'linear-gradient(135deg, #d4580a, #ff7020)',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    boxShadow: '0 2px 6px rgba(212,88,10,0.5)',
  },
};

export default Navbar;
