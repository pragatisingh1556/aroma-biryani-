import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [cookTime, setCookTime] = useState({});

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/kitchen/placed');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders');
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const confirm = async (id) => {
    try {
      await API.put(`/orders/kitchen/confirm/${id}`, { cooking_time: cookTime[id] || 30 });
      toast.success('Order confirmed!');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to confirm');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>👨‍🍳 Kitchen Dashboard</h1>
        <button style={styles.refreshBtn} onClick={fetchOrders}>🔄 Refresh</button>
      </div>
      <p style={styles.count}>{orders.length} new order(s) waiting</p>
      {orders.length === 0 ? (
        <div style={styles.empty}>No pending orders 🍽️</div>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.orderId}>Order #{order.id}</span>
              <span style={styles.type}>{order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}</span>
            </div>
            <p style={styles.customer}>👤 {order.customer_name} · 📱 {order.customer_phone}</p>
            <p style={styles.amount}>Total: ₹{order.total}</p>
            {order.notes && <p style={styles.notes}>📝 {order.notes}</p>}
            <p style={styles.time}>🕐 {new Date(order.created_at).toLocaleTimeString()}</p>
            <div style={styles.actionRow}>
              <div style={styles.cookRow}>
                <label style={styles.label}>Cook Time (mins):</label>
                <input type="number" style={styles.cookInput} defaultValue={30} min={5} max={120}
                  onChange={(e) => setCookTime({ ...cookTime, [order.id]: e.target.value })} />
              </div>
              <button style={styles.confirmBtn} onClick={() => confirm(order.id)}>✅ Confirm</button>
            </div>
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
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  orderId: { fontWeight: '700', fontSize: '18px', color: '#f5f5f5' },
  type: { color: '#888', fontSize: '14px' },
  customer: { color: '#aaaaaa', fontSize: '14px', margin: '4px 0' },
  amount: { color: '#d4580a', fontWeight: '700', fontSize: '16px', margin: '4px 0' },
  notes: { color: '#888', fontSize: '13px', fontStyle: 'italic', margin: '4px 0' },
  time: { color: '#666', fontSize: '12px', margin: '4px 0 12px' },
  actionRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' },
  cookRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  label: { fontSize: '14px', color: '#aaaaaa' },
  cookInput: { width: '70px', padding: '6px', border: '1px solid #2e2e2e', borderRadius: '6px', textAlign: 'center', background: '#222222', color: '#f5f5f5' },
  confirmBtn: { padding: '10px 20px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' },
  empty: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '18px' },
};

export default KitchenDashboard;
