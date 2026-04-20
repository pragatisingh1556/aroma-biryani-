import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [delivering, setDelivering] = useState({});

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/delivery/confirmed');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load');
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const startDelivery = async (id) => {
    try {
      await API.put(`/orders/delivery/on-the-way/${id}`);
      toast.success('Order is on the way!');
      fetchOrders();
    } catch (err) {
      toast.error('Failed');
    }
  };

  const markDelivered = async (id) => {
    const otp = otpInputs[id];
    if (!otp) return toast.error('Enter OTP');
    setDelivering({ ...delivering, [id]: true });
    try {
      const { data } = await API.put(`/orders/delivery/deliver/${id}`, { otp });
      toast.success(`Delivered! 🎉 Points earned: ${Math.round(data.points_earned)}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setDelivering({ ...delivering, [id]: false });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>🚴 Delivery Dashboard</h1>
        <button style={styles.refreshBtn} onClick={fetchOrders}>🔄 Refresh</button>
      </div>
      <p style={styles.count}>{orders.length} order(s) ready for delivery</p>
      {orders.length === 0 ? (
        <div style={styles.empty}>No orders ready yet 🛵</div>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.orderId}>Order #{order.id}</span>
              <span style={{ ...styles.badge, background: order.status === 'order_on_the_way' ? '#ff5722' : '#9c27b0' }}>
                {order.status === 'order_on_the_way' ? '🚴 On the Way' : '✅ Ready'}
              </span>
            </div>
            <p style={styles.customer}>👤 {order.customer_name} · 📱 {order.customer_phone}</p>
            {order.address_line && <p style={styles.address}>📍 {order.address_line}, {order.city}</p>}
            <p style={styles.amount}>₹{order.total}</p>
            <p style={styles.cookTime}>🕐 Cook time: {order.cooking_time} mins</p>

            {order.status === 'order_confirmed' && (
              <button style={styles.onWayBtn} onClick={() => startDelivery(order.id)}>🚴 Start Delivery</button>
            )}

            {order.status === 'order_on_the_way' && (
              <div style={styles.otpRow}>
                <input style={styles.otpInput} placeholder="Enter OTP" maxLength={4}
                  onChange={(e) => setOtpInputs({ ...otpInputs, [order.id]: e.target.value })} />
                <button style={styles.deliverBtn} disabled={delivering[order.id]} onClick={() => markDelivered(order.id)}>
                  {delivering[order.id] ? '...' : '✅ Delivered'}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#0d0d0d', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  title: { color: '#f5f5f5', fontSize: '24px', fontWeight: '800' },
  refreshBtn: { padding: '8px 16px', background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '8px', cursor: 'pointer', color: '#aaaaaa', fontWeight: '600' },
  count: { color: '#888', marginBottom: '16px' },
  card: { background: '#1a1a1a', borderRadius: '12px', padding: '20px', marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', border: '1px solid #2e2e2e' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  orderId: { fontWeight: '700', fontSize: '18px', color: '#f5f5f5' },
  badge: { padding: '4px 12px', borderRadius: '20px', color: '#fff', fontSize: '12px', fontWeight: '600' },
  customer: { color: '#aaaaaa', fontSize: '14px', margin: '4px 0' },
  address: { color: '#aaaaaa', fontSize: '14px', margin: '4px 0' },
  amount: { color: '#d4580a', fontWeight: '700', fontSize: '16px', margin: '4px 0' },
  cookTime: { color: '#888', fontSize: '13px', margin: '4px 0 12px' },
  onWayBtn: { width: '100%', padding: '10px', background: '#ff5722', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
  otpRow: { display: 'flex', gap: '10px' },
  otpInput: { flex: 1, padding: '10px', border: '2px solid #2e2e2e', borderRadius: '8px', textAlign: 'center', fontSize: '18px', letterSpacing: '4px', background: '#222222', color: '#f5f5f5' },
  deliverBtn: { padding: '10px 20px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '18px' },
};

export default DeliveryDashboard;
