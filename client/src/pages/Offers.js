import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Offers = () => {
  const [coupons, setCoupons] = useState([]);
  const { setCoupon, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/coupons').then(({ data }) => setCoupons(data)).catch(() => {});
  }, []);

  const applyOffer = async (code) => {
    if (!user) {
      toast.error('Please login to apply coupons');
      navigate('/login');
      return;
    }
    if (subtotal === 0) { toast.error('Add items to cart first'); navigate('/'); return; }
    try {
      const { data } = await API.post('/coupons/apply', { code, order_amount: subtotal });
      setCoupon({ code, discount: data.discount, title: data.coupon_title });
      toast.success(`🎉 "${code}" applied! Saved ₹${data.discount}`);
      navigate('/cart');
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot apply'); }
  };

  return (
    <div className="page-enter" style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 className="section-title" style={styles.title}>🎟 Offers & Promo Codes</h2>
        <p style={styles.subtitle}>Stack up the savings — use a promo code at checkout! 💸</p>
        {coupons.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '64px', marginBottom: '14px' }}>🎟</div>
            <h3 style={{ color: '#f5f5f5', marginBottom: '8px' }}>No offers right now</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Check back soon — exciting deals are on their way! 🔥</p>
          </div>
        ) : (
          coupons.map(c => (
            <div key={c.id} className="card-hover" style={styles.card}>
              <div style={styles.leftStripe} />
              <div style={styles.cardBody}>
                <div style={styles.topRow}>
                  <div>
                    <span style={styles.codeTag}>{c.code}</span>
                    <h4 style={styles.couponTitle}>{c.title}</h4>
                    {c.description && <p style={styles.desc}>{c.description}</p>}
                  </div>
                  <div style={styles.discountBadge}>
                    <span style={styles.discountVal}>{c.discount_type === 'flat' ? `₹${c.discount_value}` : `${c.discount_value}%`}</span>
                    <span style={styles.discountOff}>OFF</span>
                  </div>
                </div>
                <div style={styles.bottomRow}>
                  <div>
                    {c.min_order_value > 0 && <span style={styles.condition}>Min order: ₹{c.min_order_value}</span>}
                    {c.max_discount && <span style={styles.condition}> · Max discount: ₹{c.max_discount}</span>}
                    {c.valid_to && <span style={styles.condition}> · Valid till {new Date(c.valid_to).toLocaleDateString()}</span>}
                  </div>
                  <button className="btn-brand" style={styles.applyBtn} onClick={() => applyOffer(c.code)}>Apply →</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '24px 20px' },
  title: { color: '#f5f5f5', fontSize: '24px', fontWeight: '700', marginBottom: '6px' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '24px' },
  card: { background: '#1a1a1a', borderRadius: '14px', marginBottom: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', border: '1px solid #2e2e2e', display: 'flex', overflow: 'hidden' },
  leftStripe: { width: '6px', background: 'linear-gradient(180deg,#d4580a,#ff8c00)', flexShrink: 0 },
  cardBody: { flex: 1, padding: '16px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  codeTag: { background: 'rgba(212,88,10,0.1)', border: '1px dashed #d4580a', color: '#d4580a', padding: '3px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '800', letterSpacing: '1px', display: 'inline-block', marginBottom: '6px' },
  couponTitle: { color: '#f5f5f5', fontWeight: '700', fontSize: '15px', margin: '0 0 4px' },
  desc: { color: '#888', fontSize: '13px', margin: 0 },
  discountBadge: { textAlign: 'center', background: 'rgba(212,88,10,0.1)', borderRadius: '10px', padding: '10px 14px', flexShrink: 0, border: '1px solid #2e2e2e' },
  discountVal: { display: 'block', color: '#d4580a', fontWeight: '900', fontSize: '20px' },
  discountOff: { color: '#d4580a', fontSize: '12px', fontWeight: '700' },
  bottomRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #2e2e2e', paddingTop: '10px' },
  condition: { color: '#888', fontSize: '12px' },
  applyBtn: { padding: '7px 18px', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '60px' },
};

export default Offers;
