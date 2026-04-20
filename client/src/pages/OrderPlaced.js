import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderPlaced = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { order_id, otp, total } = state || {};

  return (
    <div className="page-enter" style={styles.page}>
      {/* Background glow */}
      <div style={styles.bgGlow} />
      <div style={styles.bgGlow2} />

      <div style={styles.card}>
        {/* Success Icon */}
        <div style={styles.successRing}>
          <div style={styles.checkCircle}>✓</div>
        </div>

        <h1 style={styles.title}>Order Placed! 🎉</h1>
        <p style={styles.subtitle}>Your biriyani is on its way to the kitchen. Get ready for something delicious!</p>

        {/* Order Info */}
        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>📦 Order ID</span>
            <span style={styles.infoValue}>#{order_id}</span>
          </div>
          <div style={{ ...styles.infoRow, borderBottom: 'none', paddingBottom: 0 }}>
            <span style={styles.infoLabel}>💰 Amount Paid</span>
            <span style={{ ...styles.infoValue, color: '#ff8c00', fontSize: '18px' }}>₹{total}</span>
          </div>
        </div>

        {/* OTP Box */}
        <div style={styles.otpBox}>
          <p style={styles.otpLabel}>🔐 Your Delivery OTP</p>
          <div style={styles.otpValue}>{otp}</div>
          <p style={styles.otpNote}>Share this secret code with your delivery person when they arrive 🚴</p>
        </div>

        {/* Action Buttons */}
        <div style={styles.btnRow}>
          <button className="btn-brand" style={styles.trackBtn} onClick={() => navigate('/orders')}>
            📦 Track Order
          </button>
          <button style={styles.homeBtn} onClick={() => navigate('/')}>
            🍛 Order More
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', background: '#0d0d0d',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px', position: 'relative', overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(76,175,80,0.06) 0%, transparent 70%)',
    top: '30%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,88,10,0.05) 0%, transparent 70%)',
    bottom: '10%', left: '60%', transform: 'translateX(-50%)', pointerEvents: 'none',
  },
  card: {
    background: '#1a1a1a', borderRadius: '24px', padding: '40px 30px',
    maxWidth: '420px', width: '100%', textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px #2e2e2e',
    position: 'relative', zIndex: 1,
  },
  successRing: {
    width: '96px', height: '96px', borderRadius: '50%',
    border: '3px solid rgba(76,175,80,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 0 30px rgba(76,175,80,0.2)',
  },
  checkCircle: {
    width: '72px', height: '72px',
    background: 'linear-gradient(135deg,#43a047,#66bb6a)',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '34px', color: '#fff', fontWeight: '800',
    boxShadow: '0 8px 24px rgba(76,175,80,0.4)',
  },
  title: { color: '#f5f5f5', fontSize: '28px', fontWeight: '800', margin: '0 0 10px' },
  subtitle: { color: '#888', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6 },
  infoBox: {
    background: '#222222', borderRadius: '14px', padding: '16px 20px',
    marginBottom: '20px', border: '1px solid #2e2e2e',
  },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid #2e2e2e',
  },
  infoLabel: { color: '#888', fontSize: '14px' },
  infoValue: { color: '#f5f5f5', fontWeight: '700', fontSize: '15px' },
  otpBox: {
    background: 'rgba(212,88,10,0.08)', border: '2px dashed #d4580a',
    borderRadius: '16px', padding: '22px 20px', marginBottom: '28px',
  },
  otpLabel: { color: '#d4580a', fontWeight: '700', margin: '0 0 14px', fontSize: '14px' },
  otpValue: {
    fontSize: '52px', fontWeight: '900', color: '#ff8c00',
    letterSpacing: '14px', margin: '0 0 14px',
    textShadow: '0 0 20px rgba(255,140,0,0.3)',
  },
  otpNote: { color: '#777', fontSize: '12px', margin: 0, lineHeight: 1.6 },
  btnRow: { display: 'flex', gap: '12px' },
  trackBtn: {
    flex: 1, padding: '13px', color: '#fff', border: 'none',
    borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
  },
  homeBtn: {
    flex: 1, padding: '13px', background: '#1a1a1a', color: '#d4580a',
    border: '2px solid #d4580a', borderRadius: '12px', fontWeight: '700',
    cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease',
  },
};

export default OrderPlaced;
