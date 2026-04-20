import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* Top Grid */}
        <div style={styles.grid}>

          {/* Brand */}
          <div style={styles.brandCol}>
            <div style={styles.logo}>🍛 Aroma Biriyani</div>
            <p style={styles.tagline}>
              We didn't just open a restaurant — we built a place where every meal feels like home.
              Slow-cooked, hand-spiced, and served with love since 2018.
            </p>
            <div style={styles.socialRow}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={styles.socialBtn} title="Instagram">📸</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={styles.socialBtn} title="Facebook">👥</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" style={styles.socialBtn} title="YouTube">▶️</a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={styles.socialBtn} title="WhatsApp">💬</a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Quick Links</h4>
            <Link to="/" style={styles.link}>🏠 Home</Link>
            <Link to="/orders" style={styles.link}>📦 My Orders</Link>
            <Link to="/offers" style={styles.link}>🎟 Offers & Deals</Link>
            <Link to="/gallery" style={styles.link}>📸 Gallery</Link>
            <Link to="/stores" style={styles.link}>📍 Find a Store</Link>
          </div>

          {/* Contact */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Say Hello 👋</h4>
            <a href="tel:+919876543210" style={styles.link}>📞 +91 98765 43210</a>
            <a href="mailto:hello@aromabiriyani.com" style={styles.link}>✉️ hello@aromabiriyani.com</a>
            <Link to="/about" style={styles.link}>ℹ️ About Us</Link>
            <span style={styles.hours}>⏰ Open daily: 11am – 11pm</span>
          </div>

        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Bottom Bar */}
        <div style={styles.bottom}>
          <span style={styles.copy}>© {year} Aroma Biriyani. All rights reserved.</span>
          <span style={styles.madeWith}>Made with ❤️ and a lot of spices 🌶️</span>
        </div>

      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#111111',
    borderTop: '1px solid #2e2e2e',
    marginTop: '40px',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '44px 24px 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '40px',
    marginBottom: '36px',
  },

  /* Brand column */
  brandCol: {},
  logo: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#d4580a',
    marginBottom: '12px',
    letterSpacing: '-0.3px',
  },
  tagline: {
    color: '#666',
    fontSize: '13px',
    lineHeight: 1.75,
    margin: '0 0 18px',
    maxWidth: '300px',
  },
  socialRow: {
    display: 'flex',
    gap: '10px',
  },
  socialBtn: {
    width: '36px', height: '36px',
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px',
    textDecoration: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  },

  /* Columns */
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  colTitle: {
    color: '#f5f5f5',
    fontWeight: '700',
    fontSize: '14px',
    margin: '0 0 6px',
    letterSpacing: '0.2px',
  },
  link: {
    color: '#777',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'color 0.2s',
    display: 'block',
  },
  hours: {
    color: '#555',
    fontSize: '12px',
    marginTop: '4px',
    fontStyle: 'italic',
  },

  /* Bottom */
  divider: {
    height: '1px',
    background: '#2e2e2e',
    marginBottom: '20px',
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  copy: {
    color: '#444',
    fontSize: '12px',
  },
  madeWith: {
    color: '#555',
    fontSize: '12px',
    fontStyle: 'italic',
  },
};

export default Footer;
