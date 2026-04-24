import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, discount, total, coupon, setCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderType, setOrderType] = useState('delivery');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loyaltyBalance, setLoyaltyBalance] = useState(0);
  const [loyaltyUsed, setLoyaltyUsed] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  useEffect(() => {
    if (user) {
      API.get('/users/addresses').then(({ data }) => {
        setAddresses(data);
        const def = data.find((a) => a.is_default);
        if (def) setSelectedAddress(def.id);
      }).catch(() => {});
      API.get('/users/loyalty-points').then(({ data }) => setLoyaltyBalance(data.balance || 0)).catch(() => {});
    }
  }, [user]);

  const applyC = async () => {
    if (!user) {
      toast.error('Please login to apply coupons');
      navigate('/login');
      return;
    }
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    try {
      const { data } = await API.post('/coupons/apply', { code: couponCode.trim(), order_amount: subtotal });
      setCoupon({ code: couponCode.trim(), discount: data.discount, title: data.coupon_title });
      toast.success(`🎉 Coupon applied! Saved ₹${data.discount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const finalTotal = Math.max(0, subtotal - discount - loyaltyUsed);

  const checkDeliveryRange = async (addrId) => {
    const addr = addresses.find(a => a.id === addrId);
    if (!addr?.lat || !addr?.lng) return;
    try {
      const { data } = await API.get(`/stores/check-delivery?lat=${addr.lat}&lng=${addr.lng}`);
      if (!data.can_deliver) toast.error("Sorry, we couldn't deliver to this location");
      else toast.success(`✅ Delivery available! (${data.store?.title})`);
    } catch (e) {}
  };

  const placeOrder = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (orderType === 'delivery' && !selectedAddress) { toast.error('Please select a delivery address'); return; }
    setPlacing(true);
    try {
      const items = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        addons: item.selectedAddons?.map((a) => ({ product_id: a.id, quantity: 1, price: a.price })) || []
      }));
      const { data } = await API.post('/orders', {
        items,
        order_type: orderType,
        address_id: orderType === 'delivery' ? selectedAddress : null,
        payment_method: paymentMethod,
        coupon_code: coupon?.code || null,
        loyalty_points_used: loyaltyUsed,
      });
      clearCart();
      navigate('/order-placed', { state: { order_id: data.order_id, otp: data.otp, total: data.total } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-enter" style={{ background: '#0d0d0d', minHeight: '100vh' }}>
        <Navbar />
        <div style={styles.empty}>
          <div style={{ fontSize: '80px', marginBottom: '8px' }}>🛒</div>
          <h2 style={{ color: '#f5f5f5', marginBottom: '8px' }}>Your cart is empty</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
            Looks like you haven't added anything yet — let's fix that! 🍛
          </p>
          <button className="btn-brand" style={styles.btnPrimary} onClick={() => navigate('/')}>
            🍽️ Explore Menu
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.pageTitle}>🛒 Your Cart</h2>
        <div style={styles.layout}>

          {/* Cart Items */}
          <div>
            {cart.map((item) => (
              <div key={item.id} className="card-hover" style={styles.cartItem}>
                <div style={styles.itemInfo}>
                  <span style={styles.itemName}>{item.title}</span>
                  <span style={styles.itemPrice}>₹{item.price}</span>
                </div>
                {item.selectedAddons?.length > 0 && (
                  <p style={styles.addonsList}>
                    + {item.selectedAddons.map(a => a.title).join(', ')}
                  </p>
                )}
                <div style={styles.qtyRow}>
                  <button style={styles.qtyBtn} onClick={() => {
                    if (item.quantity === 1) removeFromCart(item.id);
                    else updateQuantity(item.id, item.quantity - 1);
                  }}>-</button>
                  <span style={styles.qty}>{item.quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <span style={styles.itemTotal}>₹{item.price * item.quantity}</span>
                  <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={styles.summaryCol}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>

            {/* Order Type */}
            <div style={styles.typeRow}>
              <button
                style={{ ...styles.typeBtn, ...(orderType === 'delivery' ? styles.typeBtnActive : {}) }}
                onClick={() => setOrderType('delivery')}>
                🚚 Delivery
              </button>
              <button
                style={{ ...styles.typeBtn, ...(orderType === 'pickup' ? styles.typeBtnActive : {}) }}
                onClick={() => setOrderType('pickup')}>
                🏪 Pickup
              </button>
            </div>

            {/* Address Selection */}
            {orderType === 'delivery' && user && (
              <div style={styles.addressSection}>
                <div style={styles.addressHeader}>
                  <span style={styles.addressLabel}>📍 Delivery Address</span>
                  <button style={styles.manageBtn} onClick={() => navigate('/profile')}>+ Manage</button>
                </div>
                {addresses.length === 0 ? (
                  <p style={{ color: '#d4580a', fontSize: '13px' }}>
                    No addresses saved.{' '}
                    <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/profile')}>
                      Add one
                    </span>
                  </p>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      style={{ ...styles.addrCard, border: `2px solid ${selectedAddress === addr.id ? '#d4580a' : '#2e2e2e'}` }}
                      onClick={() => { setSelectedAddress(addr.id); checkDeliveryRange(addr.id); }}>
                      <div style={styles.addrRadio}>
                        <div style={{ ...styles.radio, background: selectedAddress === addr.id ? '#d4580a' : 'transparent' }} />
                      </div>
                      <div>
                        <span style={styles.addrTag}>{addr.label || 'Home'}</span>
                        <p style={styles.addrText}>{addr.address_line}, {addr.city}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Coupon */}
            <div style={styles.couponRow}>
              <input
                style={styles.couponInput}
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button style={styles.applyBtn} onClick={applyC}>Apply</button>
            </div>
            <button style={styles.checkOffersBtn} onClick={() => navigate('/offers')}>
              🎟 Check Offers
            </button>

            {/* Loyalty Points */}
            {user && loyaltyBalance > 0 && (
              <div style={styles.loyaltyBox}>
                <div style={styles.loyaltyHeader}>
                  <span>⭐ Use Loyalty Points</span>
                  <span style={{ color: '#d4580a', fontWeight: '700' }}>Balance: {Math.round(loyaltyBalance)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.min(loyaltyBalance, subtotal)}
                  step={1}
                  value={loyaltyUsed}
                  onChange={(e) => setLoyaltyUsed(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#d4580a', margin: '8px 0' }}
                />
                <p style={{ fontSize: '13px', color: '#aaaaaa', margin: 0 }}>
                  Using: <strong style={{ color: '#f5f5f5' }}>{Math.round(loyaltyUsed)} points = ₹{Math.round(loyaltyUsed)}</strong>
                </p>
              </div>
            )}

            {/* Payment Method */}
            <div style={styles.paySection}>
              <p style={styles.payLabel}>💳 Payment</p>
              <div style={styles.typeRow}>
                <button
                  style={{ ...styles.typeBtn, ...(paymentMethod === 'cash_on_delivery' ? styles.typeBtnActive : {}) }}
                  onClick={() => setPaymentMethod('cash_on_delivery')}>
                  💵 COD
                </button>
                <button
                  style={{ ...styles.typeBtn, ...(paymentMethod === 'online' ? styles.typeBtnActive : {}) }}
                  onClick={() => setPaymentMethod('online')}>
                  📱 Online
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div style={styles.summaryRow}>
              <span>Subtotal</span><span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div style={{ ...styles.summaryRow, color: '#4caf50' }}>
                <span>🎟 Coupon ({coupon?.title})</span><span>-₹{discount}</span>
              </div>
            )}
            {loyaltyUsed > 0 && (
              <div style={{ ...styles.summaryRow, color: '#4caf50' }}>
                <span>⭐ Loyalty</span><span>-₹{Math.round(loyaltyUsed)}</span>
              </div>
            )}
            <div style={{ ...styles.summaryRow, fontWeight: '700', fontSize: '18px', borderTop: '1px solid #2e2e2e', paddingTop: '12px', marginTop: '4px', color: '#f5f5f5' }}>
              <span>Total</span>
              <span style={{ color: '#d4580a' }}>₹{finalTotal}</span>
            </div>

            <button className="btn-brand" style={styles.placeBtn} onClick={placeOrder} disabled={placing}>
              {placing ? '⏳ Placing your order...' : `🚀 Place Order • ₹${finalTotal}`}
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '24px 20px' },
  pageTitle: { color: '#f5f5f5', fontSize: '24px', marginBottom: '20px', fontWeight: '700' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' },
  cartItem: { background: '#1a1a1a', padding: '16px', borderRadius: '12px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', border: '1px solid #2e2e2e' },
  itemInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  itemName: { fontWeight: '600', color: '#f5f5f5' },
  itemPrice: { color: '#d4580a', fontWeight: '600' },
  addonsList: { fontSize: '12px', color: '#888', margin: '0 0 8px', fontStyle: 'italic' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: { width: '28px', height: '28px', border: '2px solid #d4580a', borderRadius: '50%', background: '#222222', color: '#d4580a', cursor: 'pointer', fontWeight: '700', fontSize: '16px' },
  qty: { fontWeight: '700', minWidth: '20px', textAlign: 'center', color: '#f5f5f5' },
  itemTotal: { marginLeft: 'auto', color: '#ff8c00', fontWeight: '600' },
  removeBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px' },
  summaryCol: { background: '#1a1a1a', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.3)', border: '1px solid #2e2e2e', height: 'fit-content' },
  summaryTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '14px', color: '#f5f5f5' },
  typeRow: { display: 'flex', gap: '8px', marginBottom: '14px' },
  typeBtn: { flex: 1, padding: '8px', border: '2px solid #d4580a', borderRadius: '8px', background: '#222222', color: '#d4580a', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  typeBtnActive: { background: '#d4580a', color: '#fff' },
  addressSection: { marginBottom: '14px' },
  addressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  addressLabel: { fontWeight: '600', color: '#f5f5f5', fontSize: '14px' },
  manageBtn: { fontSize: '12px', color: '#d4580a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' },
  addrCard: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer', background: '#222222' },
  addrRadio: { flexShrink: 0 },
  radio: { width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #d4580a' },
  addrTag: { fontSize: '12px', fontWeight: '700', color: '#d4580a', textTransform: 'uppercase' },
  addrText: { fontSize: '13px', color: '#aaaaaa', margin: '2px 0 0' },
  couponRow: { display: 'flex', gap: '8px', marginBottom: '12px' },
  couponInput: { flex: 1, padding: '8px 12px', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: '14px', background: '#222222', color: '#f5f5f5' },
  applyBtn: { padding: '8px 14px', background: '#d4580a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  loyaltyBox: { background: 'rgba(212,88,10,0.1)', border: '1px solid #2e2e2e', borderRadius: '10px', padding: '12px', marginBottom: '12px' },
  loyaltyHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#f5f5f5' },
  paySection: { marginBottom: '12px' },
  payLabel: { fontWeight: '600', color: '#f5f5f5', fontSize: '14px', margin: '0 0 8px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#aaaaaa', fontSize: '14px' },
  checkOffersBtn: { width: '100%', padding: '8px', background: 'rgba(212,88,10,0.1)', border: '1px dashed #d4580a', borderRadius: '8px', color: '#d4580a', fontWeight: '600', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' },
  placeBtn: { width: '100%', padding: '14px', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '14px' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  btnPrimary: { padding: '14px 36px', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', fontWeight: '700' },
};

export default Cart;
