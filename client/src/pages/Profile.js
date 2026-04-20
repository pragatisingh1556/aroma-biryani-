import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const tierColors = { bronze: '#cd7f32', silver: '#aaa', gold: '#ffd700' };
const tierEmoji  = { bronze: '🥉', silver: '🥈', gold: '🥇' };

const tierRules = [
  { name: 'Bronze', emoji: '🥉', orders: '1–5 Orders', earn: '10%', redeem: '10%', color: '#cd7f32' },
  { name: 'Silver', emoji: '🥈', orders: '6–12 Orders', earn: '15%', redeem: '15%', color: '#aaa' },
  { name: 'Gold',   emoji: '🥇', orders: '13+ Orders',  earn: '20%', redeem: '20%', color: '#ffd700' },
];

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [points, setPoints]     = useState({ balance: 0, history: [] });
  const [pwForm, setPwForm]     = useState({ old_password: '', new_password: '' });
  const [tab, setTab]           = useState('profile');

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [addrForm, setAddrForm]   = useState({ label: 'Home', address_line: '', city: '', locality: '', pincode: '', lat: '', lng: '', is_default: false });
  const [editAddrId, setEditAddrId] = useState(null);
  const [showAddrForm, setShowAddrForm] = useState(false);

  useEffect(() => {
    API.get('/users/profile').then(({ data }) => setProfile(data));
    API.get('/users/loyalty-points').then(({ data }) => setPoints(data));
    API.get('/users/addresses').then(({ data }) => setAddresses(data));
  }, []);

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/change-password', pwForm);
      toast.success('Password changed!');
      setPwForm({ old_password: '', new_password: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      // Clean up payload — send null for empty lat/lng (DB needs null, not empty string)
      const payload = {
        ...addrForm,
        lat: addrForm.lat !== '' ? parseFloat(addrForm.lat) : null,
        lng: addrForm.lng !== '' ? parseFloat(addrForm.lng) : null,
        locality: addrForm.locality || null,
        pincode: addrForm.pincode || null,
      };
      if (editAddrId) {
        await API.put(`/users/addresses/${editAddrId}`, payload);
        toast.success('Address updated! ✅');
      } else {
        await API.post('/users/addresses', payload);
        toast.success('Address saved! 📍');
      }
      const { data } = await API.get('/users/addresses');
      setAddresses(data);
      setShowAddrForm(false);
      setEditAddrId(null);
      setAddrForm({ label: 'Home', address_line: '', city: '', locality: '', pincode: '', lat: '', lng: '', is_default: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save address. Please try again.');
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await API.delete(`/users/addresses/${id}`);
      toast.success('Deleted');
      setAddresses(addresses.filter(a => a.id !== id));
    } catch { toast.error('Failed'); }
  };

  const startEdit = (addr) => {
    setAddrForm({ label: addr.label || 'Home', address_line: addr.address_line, city: addr.city, locality: addr.locality || '', pincode: addr.pincode || '', lat: addr.lat || '', lng: addr.lng || '', is_default: addr.is_default });
    setEditAddrId(addr.id);
    setShowAddrForm(true);
  };

  if (!profile) return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px', color: '#aaa' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>👤</div>
        <p>Loading your profile...</p>
      </div>
    </div>
  );

  return (
    <div className="page-enter" style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>

        {/* Profile Header */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>{profile.name?.charAt(0).toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <h2 style={styles.name}>{profile.name}</h2>
            <p style={styles.phone}>📱 {profile.phone}</p>
            {profile.email && <p style={styles.phone}>✉️ {profile.email}</p>}
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
            <div style={{ ...styles.tier, color: tierColors[profile.loyalty_tier] }}>
              {tierEmoji[profile.loyalty_tier]} {profile.loyalty_tier?.toUpperCase()}
            </div>
            <div style={styles.orderCount}>{profile.total_orders} Orders</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[['profile','👤 Profile'],['loyalty','⭐ Loyalty'],['addresses','📍 Addresses'],['password','🔒 Password']].map(([t, label]) => (
            <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }} onClick={() => setTab(t)}>{label}</button>
          ))}
        </div>

        {/* ── LOYALTY ── */}
        {tab === 'loyalty' && (
          <div style={styles.card}>
            <div style={styles.pointsBalance}>
              <span style={styles.pointsNum}>{Math.round(points.balance)}</span>
              <span style={styles.pointsLabel}>Points Balance &nbsp;·&nbsp; 1 Point = ₹1</span>
            </div>

            {/* Loyalty Tiers */}
            <h3 style={{ color: '#f5f5f5', marginBottom: '12px', fontSize: '16px' }}>🏆 Loyalty Program</h3>
            <div style={styles.tiersRow}>
              {tierRules.map(t => (
                <div key={t.name} className="card-hover" style={{ ...styles.tierCard, border: `2px solid ${profile.loyalty_tier === t.name.toLowerCase() ? t.color : '#2e2e2e'}`, background: profile.loyalty_tier === t.name.toLowerCase() ? 'rgba(212,88,10,0.12)' : '#222222' }}>
                  <div style={{ fontSize: '28px' }}>{t.emoji}</div>
                  <strong style={{ color: t.color }}>{t.name}</strong>
                  <span style={styles.tierOrders}>{t.orders}</span>
                  <span style={styles.tierRule}>Earn {t.earn} of order</span>
                  <span style={styles.tierRule}>Redeem {t.redeem} per order</span>
                  <span style={styles.tierExpiry}>Points expire in 4 months</span>
                  {profile.loyalty_tier === t.name.toLowerCase() && <span style={{ ...styles.currentBadge, background: t.color }}>Current Tier</span>}
                </div>
              ))}
            </div>

            <h3 style={{ color: '#f5f5f5', margin: '20px 0 12px', fontSize: '16px' }}>Transaction History</h3>
            {points.history.length === 0 ? <p style={{ color: '#aaa', fontSize: '14px' }}>No transactions yet</p> : points.history.map((p, i) => (
              <div key={i} style={styles.pointRow}>
                <div>
                  <span style={{ color: '#aaaaaa', fontSize: '14px' }}>{p.description}</span>
                  <span style={{ display: 'block', color: '#bbb', fontSize: '12px' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
                <span style={{ color: p.type === 'credited' ? 'green' : 'red', fontWeight: '700', fontSize: '16px' }}>
                  {p.type === 'credited' ? '+' : '-'}{Math.round(p.points)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── ADDRESSES ── */}
        {tab === 'addresses' && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#f5f5f5', margin: 0 }}>My Addresses</h3>
              <button style={styles.addAddrBtn} onClick={() => { setShowAddrForm(true); setEditAddrId(null); setAddrForm({ label: 'Home', address_line: '', city: '', locality: '', pincode: '', lat: '', lng: '', is_default: false }); }}>
                + Add New
              </button>
            </div>

            {showAddrForm && (
              <form onSubmit={saveAddress} style={styles.addrFormBox}>
                <h4 style={{ margin: '0 0 12px', color: '#f5f5f5' }}>{editAddrId ? 'Edit' : 'New'} Address</h4>
                <div style={styles.addrGrid}>
                  <select style={styles.addrInp} value={addrForm.label} onChange={e => setAddrForm({ ...addrForm, label: e.target.value })}>
                    <option>Home</option><option>Work</option><option>Other</option>
                  </select>
                  <input style={styles.addrInp} placeholder="Address Line" value={addrForm.address_line} onChange={e => setAddrForm({ ...addrForm, address_line: e.target.value })} required />
                  <input style={styles.addrInp} placeholder="City" value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })} required />
                  <input style={styles.addrInp} placeholder="Locality" value={addrForm.locality} onChange={e => setAddrForm({ ...addrForm, locality: e.target.value })} />
                  <input style={styles.addrInp} placeholder="Pincode" value={addrForm.pincode} onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '14px', cursor: 'pointer', color: '#aaaaaa' }}>
                  <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm({ ...addrForm, is_default: e.target.checked })} />
                  Set as default address
                </label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button className="btn-brand" style={styles.saveBtn} type="submit">Save Address</button>
                  <button style={styles.cancelBtn} type="button" onClick={() => { setShowAddrForm(false); setEditAddrId(null); }}>Cancel</button>
                </div>
              </form>
            )}

            {addresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📍</div>
                <p style={{ color: '#aaa', margin: '0 0 6px' }}>No addresses saved yet</p>
                <p style={{ color: '#666', fontSize: '13px' }}>Add your home or work address for faster checkout!</p>
              </div>
            ) : (
              addresses.map(addr => (
                <div key={addr.id} style={styles.addrCard}>
                  <div style={styles.addrLeft}>
                    <span style={styles.addrLabel}>{addr.label || 'Home'} {addr.is_default && <span style={styles.defaultBadge}>Default</span>}</span>
                    <p style={styles.addrText}>{addr.address_line}</p>
                    <p style={styles.addrCity}>{addr.locality ? `${addr.locality}, ` : ''}{addr.city} {addr.pincode}</p>
                  </div>
                  <div style={styles.addrActions}>
                    <button style={styles.editBtn} onClick={() => startEdit(addr)}>✏️ Edit</button>
                    <button style={styles.deleteBtn} onClick={() => deleteAddress(addr.id)}>🗑 Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── CHANGE PASSWORD ── */}
        {tab === 'password' && (
          <div style={styles.card}>
            <h3 style={{ color: '#f5f5f5', marginBottom: '6px' }}>🔒 Change Password</h3>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>Keep your account secure with a strong password</p>
            <form onSubmit={changePassword}>
              <input style={styles.input} type="password" placeholder="Current Password" value={pwForm.old_password} onChange={e => setPwForm({ ...pwForm, old_password: e.target.value })} required />
              <input style={styles.input} type="password" placeholder="New Password" value={pwForm.new_password} onChange={e => setPwForm({ ...pwForm, new_password: e.target.value })} required />
              <button className="btn-brand" style={styles.btn}>🔒 Update Password</button>
            </form>
          </div>
        )}

        <button style={styles.logoutBtn} onClick={() => { logout(); window.location.href = '/login'; }}>Logout</button>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '24px 20px' },
  profileCard: { background: '#1a1a1a', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.3)', border: '1px solid #2e2e2e', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#d4580a,#ff7020)', color: '#fff', fontSize: '28px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(212,88,10,0.4)' },
  name: { fontSize: '22px', fontWeight: '700', color: '#f5f5f5', margin: '0 0 4px' },
  phone: { color: '#aaaaaa', margin: '2px 0', fontSize: '14px' },
  tier: { fontWeight: '700', fontSize: '16px' },
  orderCount: { color: '#888', fontSize: '13px', marginTop: '4px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: { flex: 1, padding: '10px 8px', border: '2px solid #2e2e2e', borderRadius: '8px', background: '#1a1a1a', cursor: 'pointer', fontWeight: '600', color: '#888', fontSize: '13px', minWidth: '80px' },
  tabActive: { border: '2px solid #d4580a', color: '#d4580a', background: 'rgba(212,88,10,0.1)' },
  card: { background: '#1a1a1a', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.3)', border: '1px solid #2e2e2e' },
  pointsBalance: { textAlign: 'center', padding: '20px', background: 'rgba(212,88,10,0.1)', borderRadius: '12px', marginBottom: '20px', border: '1px solid #2e2e2e' },
  pointsNum: { display: 'block', fontSize: '48px', fontWeight: '800', color: '#d4580a' },
  pointsLabel: { color: '#888', fontSize: '14px' },
  tiersRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '8px' },
  tierCard: { borderRadius: '12px', padding: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', background: '#222222', border: '2px solid #2e2e2e' },
  tierOrders: { fontSize: '11px', color: '#888', fontWeight: '600' },
  tierRule: { fontSize: '12px', color: '#aaaaaa' },
  tierExpiry: { fontSize: '11px', color: '#666', fontStyle: 'italic' },
  currentBadge: { padding: '2px 10px', borderRadius: '10px', color: '#fff', fontSize: '11px', fontWeight: '700', marginTop: '4px' },
  pointRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #2e2e2e' },
  // Addresses
  addAddrBtn: { padding: '8px 16px', background: '#d4580a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' },
  addrFormBox: { background: 'rgba(212,88,10,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #2e2e2e' },
  addrGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  addrInp: { padding: '9px 12px', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: '13px', width: '100%', boxSizing: 'border-box', background: '#222222', color: '#f5f5f5' },
  saveBtn: { padding: '9px 20px', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
  cancelBtn: { padding: '9px 20px', background: '#222222', color: '#aaaaaa', border: '1px solid #2e2e2e', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  addrCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px', borderRadius: '12px', border: '1px solid #2e2e2e', marginBottom: '10px', background: '#222222' },
  addrLeft: {},
  addrLabel: { fontWeight: '700', color: '#f5f5f5', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
  defaultBadge: { background: '#d4580a', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px' },
  addrText: { color: '#aaaaaa', fontSize: '13px', margin: '4px 0 2px' },
  addrCity: { color: '#888', fontSize: '12px', margin: 0 },
  addrActions: { display: 'flex', flexDirection: 'column', gap: '6px' },
  editBtn: { padding: '5px 12px', background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#f5f5f5' },
  deleteBtn: { padding: '5px 12px', background: 'rgba(244,67,54,0.1)', border: '1px solid #f44336', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#f44336' },
  input: { width: '100%', padding: '12px 16px', margin: '8px 0', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', background: '#222222', color: '#f5f5f5' },
  btn: { width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
  logoutBtn: { width: '100%', padding: '12px', background: '#1a1a1a', color: '#d4580a', border: '2px solid #d4580a', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '16px' },
};

export default Profile;
