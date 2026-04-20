import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const statusColors = {
  order_pending:   '#ff9800',
  order_placed:    '#2196f3',
  order_confirmed: '#9c27b0',
  order_on_the_way:'#ff5722',
  order_delivered: '#4caf50',
  cancelled:       '#f44336',
};
const statusLabels = {
  order_pending:    '⏳ Pending',
  order_placed:     '✅ Placed',
  order_confirmed:  '👨‍🍳 Confirmed',
  order_on_the_way: '🚴 On the Way',
  order_delivered:  '🎉 Delivered',
  cancelled:        '❌ Cancelled',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my-orders')
      .then(({ data }) => { setOrders(data); setLoading(false); })
      .catch(() => { toast.error('Failed to load orders'); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px', color: '#aaa' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍛</div>
        <p>Fetching your orders...</p>
      </div>
    </div>
  );

  return (
    <div className="page-enter" style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>📦 My Orders</h2>
        <p style={styles.subtitle}>{orders.length > 0 ? `You have ${orders.length} order${orders.length > 1 ? 's' : ''}` : ''}</p>

        {orders.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '70px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ color: '#f5f5f5', marginBottom: '8px' }}>No orders yet!</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Your delicious journey hasn't started — go explore the menu! 🍛</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="card-hover glow-card" style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.orderId}>Order #{order.id}</span>
                  <span style={styles.orderDate}>
                    📅 {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <span style={{ ...styles.badge, background: statusColors[order.status] || '#888' }}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              <div style={styles.row}>
                <span style={styles.metaText}>
                  {order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                  &nbsp;·&nbsp;
                  {order.payment_method?.replace(/_/g, ' ')}
                </span>
                <span style={styles.amount}>₹{order.total}</span>
              </div>

              {order.status === 'order_confirmed' && order.cooking_time && (
                <div style={styles.cookingChip}>
                  🕐 Estimated cooking time: <strong>{order.cooking_time} mins</strong>
                </div>
              )}

              {order.status === 'order_on_the_way' && (
                <div style={styles.otpBox}>
                  <span style={styles.otpLabel}>🔐 Delivery OTP</span>
                  <span style={styles.otpValue}>{order.otp}</span>
                  <span style={styles.otpNote}>Share this with your delivery person</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '28px 20px' },
  title: { color: '#f5f5f5', fontWeight: '800', fontSize: '26px', marginBottom: '4px' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '24px' },
  empty: { textAlign: 'center', padding: '60px 20px' },
  card: {
    background: '#1a1a1a', borderRadius: '16px', padding: '20px',
    marginBottom: '14px', border: '1px solid #2e2e2e',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  orderId: { fontWeight: '800', color: '#f5f5f5', fontSize: '16px', display: 'block', marginBottom: '3px' },
  orderDate: { color: '#666', fontSize: '12px' },
  badge: {
    padding: '5px 12px', borderRadius: '20px', color: '#fff',
    fontSize: '12px', fontWeight: '700', flexShrink: 0,
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' },
  metaText: { color: '#777', fontSize: '13px' },
  amount: { fontWeight: '800', color: '#ff8c00', fontSize: '20px', letterSpacing: '-0.5px' },
  cookingChip: {
    marginTop: '12px', background: 'rgba(156,39,176,0.1)',
    border: '1px solid rgba(156,39,176,0.3)', borderRadius: '8px',
    padding: '8px 12px', fontSize: '13px', color: '#ce93d8',
  },
  otpBox: {
    marginTop: '12px', background: 'rgba(212,88,10,0.08)',
    border: '1px dashed #d4580a', borderRadius: '12px',
    padding: '14px 16px', display: 'flex', alignItems: 'center',
    gap: '12px', flexWrap: 'wrap',
  },
  otpLabel: { color: '#d4580a', fontWeight: '700', fontSize: '13px' },
  otpValue: { fontSize: '22px', fontWeight: '900', color: '#ff8c00', letterSpacing: '6px' },
  otpNote: { color: '#666', fontSize: '12px', flexBasis: '100%' },
};

export default Orders;
