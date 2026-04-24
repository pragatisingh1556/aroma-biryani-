import React, { useEffect, useState, useCallback } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const tabs = ['orders', 'products', 'categories', 'combos', 'users', 'coupons', 'stores', 'blogs', 'media', 'points', 'payments'];

const AdminDashboard = () => {
  const [tab, setTab] = useState('orders');
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Forms
  const [newProduct, setNewProduct] = useState({ title: '', price: '', description: '', category_id: '', image: '' });
  const [newCategory, setNewCategory] = useState({ title: '', description: '', image: '', sort_order: 0 });
  const [newCombo, setNewCombo] = useState({ title: '', description: '', image: '', price: '' });
  const [newUser, setNewUser] = useState({ name: '', phone: '', email: '', password: '', role: 'kitchen_staff' });
  const [newCoupon, setNewCoupon] = useState({ title: '', code: '', discount_type: 'flat', discount_value: '', min_order_value: 0, max_discount: '', valid_to: '' });
  const [newStore, setNewStore] = useState({ title: '', address: '', city: '', phone: '', lat: '', lng: '', delivery_range_km: 10 });
  const [newBlog, setNewBlog] = useState({ title: '', description: '', image: '', external_link: '', stage: 'draft', tag: 'blog' });
  const [newMedia, setNewMedia] = useState({ image_url: '', tag: 'gallery' });
  const [pointsUser, setPointsUser] = useState('');
  const [pointsHistory, setPointsHistory] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const endpoints = {
        orders: '/orders/admin/all',
        products: '/products',
        categories: '/categories',
        combos: '/combos',
        users: '/users/admin/all',
        coupons: '/coupons',
        stores: '/admin/stores',
        blogs: '/admin/blogs',
        media: '/media',
      };
      // These tabs manage their own state (no server fetch needed)
      if (tab === 'points' || tab === 'payments') return;
      if (!endpoints[tab]) return;
      const { data: res } = await API.get(endpoints[tab]);
      setData(res);
      if (tab === 'products' || tab === 'combos') {
        const catRes = await API.get('/categories');
        setCategories(catRes.data);
        if (tab === 'combos') {
          const prodRes = await API.get('/products');
          setProducts(prodRes.data);
        }
      }
    } catch { toast.error('Failed to load'); }
  }, [tab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const del = async (endpoint, id) => {
    if (!window.confirm('Delete?')) return;
    try { await API.delete(`${endpoint}/${id}`); toast.success('Deleted!'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  const fetchUserPoints = async () => {
    try {
      const { data: users } = await API.get('/users/admin/all');
      const found = users.find(u => u.phone === pointsUser || String(u.id) === pointsUser);
      if (!found) return toast.error('User not found');
      toast.success(`Showing points for ${found.name}`);
      setPointsHistory([{ description: `Total Orders: ${found.total_orders}`, points: found.loyalty_tier, type: 'info' }]);
    } catch { toast.error('Failed'); }
  };

  const StatusBadge = ({ status }) => (
    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: 'rgba(76,175,80,0.15)', color: '#4caf50', border: '1px solid rgba(76,175,80,0.3)' }}>
      {status?.replace(/_/g, ' ')}
    </span>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>⚙️ Admin Dashboard</h1>

      {/* Tabs */}
      <div style={styles.tabsWrap}>
        {tabs.map(t => (
          <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── ORDERS ── */}
      {tab === 'orders' && (
        <div>
          <h3 style={styles.secTitle}>All Orders ({data.length})</h3>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead><tr style={styles.thead}><th>#</th><th>Customer</th><th>Total</th><th>Status</th><th>Type</th><th>Payment</th><th>Date</th></tr></thead>
              <tbody>{data.map(o => (
                <tr key={o.id} style={styles.tr}>
                  <td style={{ color: '#f5f5f5' }}>#{o.id}</td>
                  <td style={{ color: '#f5f5f5' }}>{o.customer_name}<br /><small style={{ color: '#666' }}>{o.customer_phone}</small></td>
                  <td style={{ color: '#d4580a', fontWeight: '700' }}>₹{o.total}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td style={{ color: '#aaaaaa' }}>{o.order_type}</td>
                  <td style={{ color: '#aaaaaa' }}>{o.payment_method?.replace(/_/g, ' ')}</td>
                  <td style={{ color: '#aaaaaa' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PRODUCTS ── */}
      {tab === 'products' && (
        <div>
          <form onSubmit={async e => { e.preventDefault(); try { await API.post('/products', newProduct); toast.success('Added!'); fetchData(); setNewProduct({ title: '', price: '', description: '', category_id: '', image: '' }); } catch { toast.error('Failed'); } }} style={styles.form}>
            <h4 style={styles.formTitle}>Add Product</h4>
            <div style={styles.grid4}>
              <input style={styles.inp} placeholder="Title" value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} required />
              <input style={styles.inp} type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
              <select style={styles.inp} value={newProduct.category_id} onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <input style={styles.inp} placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
              <input style={{ ...styles.inp, gridColumn: 'span 3' }} placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
              <button style={styles.addBtn}>+ Add</button>
            </div>
          </form>
          <Table headers={['Title', 'Category', 'Price', 'Active', '']}
            rows={data.map(p => [p.title, p.category_name, `₹${p.price}`, p.is_active ? '✅' : '❌',
              <button style={styles.delBtn} onClick={() => del('/products', p.id)}>Delete</button>])} />
        </div>
      )}

      {/* ── CATEGORIES ── */}
      {tab === 'categories' && (
        <div>
          <form onSubmit={async e => { e.preventDefault(); try { await API.post('/categories', newCategory); toast.success('Added!'); fetchData(); setNewCategory({ title: '', description: '', image: '', sort_order: 0 }); } catch { toast.error('Failed'); } }} style={styles.form}>
            <h4 style={styles.formTitle}>Add Category</h4>
            <div style={styles.grid4}>
              <input style={styles.inp} placeholder="Title" value={newCategory.title} onChange={e => setNewCategory({ ...newCategory, title: e.target.value })} required />
              <input style={styles.inp} placeholder="Description" value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} />
              <input style={styles.inp} placeholder="Image URL" value={newCategory.image} onChange={e => setNewCategory({ ...newCategory, image: e.target.value })} />
              <input style={styles.inp} type="number" placeholder="Sort Order" value={newCategory.sort_order} onChange={e => setNewCategory({ ...newCategory, sort_order: e.target.value })} />
              <button style={styles.addBtn}>+ Add</button>
            </div>
          </form>
          <Table headers={['Title', 'Description', 'Sort', 'Active', '']}
            rows={data.map(c => [c.title, c.description, c.sort_order, c.is_active ? '✅' : '❌',
              <button style={styles.delBtn} onClick={() => del('/categories', c.id)}>Delete</button>])} />
        </div>
      )}

      {/* ── COMBOS ── */}
      {tab === 'combos' && (
        <div>
          <form onSubmit={async e => { e.preventDefault(); try { await API.post('/combos', newCombo); toast.success('Added!'); fetchData(); setNewCombo({ title: '', description: '', image: '', price: '' }); } catch { toast.error('Failed'); } }} style={styles.form}>
            <h4 style={styles.formTitle}>Add Combo</h4>
            <div style={styles.grid4}>
              <input style={styles.inp} placeholder="Combo Title" value={newCombo.title} onChange={e => setNewCombo({ ...newCombo, title: e.target.value })} required />
              <input style={styles.inp} type="number" placeholder="Price" value={newCombo.price} onChange={e => setNewCombo({ ...newCombo, price: e.target.value })} required />
              <input style={styles.inp} placeholder="Image URL" value={newCombo.image} onChange={e => setNewCombo({ ...newCombo, image: e.target.value })} />
              <input style={styles.inp} placeholder="Description" value={newCombo.description} onChange={e => setNewCombo({ ...newCombo, description: e.target.value })} />
              <button style={styles.addBtn}>+ Add</button>
            </div>
          </form>
          <Table headers={['Title', 'Price', 'Active', '']}
            rows={data.map(c => [c.title, `₹${c.price}`, c.is_active ? '✅' : '❌',
              <button style={styles.delBtn} onClick={() => del('/combos', c.id)}>Delete</button>])} />
        </div>
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div>
          <form onSubmit={async e => { e.preventDefault(); try { await API.post('/users/admin/create', newUser); toast.success('User created!'); fetchData(); setNewUser({ name: '', phone: '', email: '', password: '', role: 'kitchen_staff' }); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } }} style={styles.form}>
            <h4 style={styles.formTitle}>Add Staff User</h4>
            <div style={styles.grid4}>
              <input style={styles.inp} placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
              <input style={styles.inp} placeholder="Phone" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} required />
              <input style={styles.inp} placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              <input style={styles.inp} type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
              <select style={styles.inp} value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="kitchen_staff">Kitchen Staff</option>
                <option value="delivery_staff">Delivery Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button style={styles.addBtn}>+ Create</button>
            </div>
          </form>
          <Table headers={['Name', 'Phone', 'Role', 'Tier', 'Orders', 'Verified', '']}
            rows={data.map(u => [u.name, u.phone,
              <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', color: '#fff', background: u.role === 'admin' ? '#d4580a' : u.role === 'kitchen_staff' ? '#9c27b0' : '#2196f3' }}>{u.role}</span>,
              u.loyalty_tier, u.total_orders, u.is_verified ? '✅' : '❌',
              <button style={styles.delBtn} onClick={() => del('/users/admin', u.id)}>Delete</button>])} />
        </div>
      )}

      {/* ── COUPONS ── */}
      {tab === 'coupons' && (
        <div>
          <form onSubmit={async e => { e.preventDefault(); try { await API.post('/admin/coupons', newCoupon); toast.success('Coupon created!'); fetchData(); setNewCoupon({ title: '', code: '', discount_type: 'flat', discount_value: '', min_order_value: 0, max_discount: '', valid_to: '' }); } catch { toast.error('Failed'); } }} style={styles.form}>
            <h4 style={styles.formTitle}>Add Coupon</h4>
            <div style={styles.grid4}>
              <input style={styles.inp} placeholder="Title" value={newCoupon.title} onChange={e => setNewCoupon({ ...newCoupon, title: e.target.value })} required />
              <input style={styles.inp} placeholder="Code (e.g. SAVE50)" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} required />
              <select style={styles.inp} value={newCoupon.discount_type} onChange={e => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}>
                <option value="flat">Flat (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
              <input style={styles.inp} type="number" placeholder="Discount Value" value={newCoupon.discount_value} onChange={e => setNewCoupon({ ...newCoupon, discount_value: e.target.value })} required />
              <input style={styles.inp} type="number" placeholder="Min Order Value" value={newCoupon.min_order_value} onChange={e => setNewCoupon({ ...newCoupon, min_order_value: e.target.value })} />
              <input style={styles.inp} type="number" placeholder="Max Discount" value={newCoupon.max_discount} onChange={e => setNewCoupon({ ...newCoupon, max_discount: e.target.value })} />
              <input style={styles.inp} type="date" placeholder="Valid Till" value={newCoupon.valid_to} onChange={e => setNewCoupon({ ...newCoupon, valid_to: e.target.value })} />
              <button style={styles.addBtn}>+ Add</button>
            </div>
          </form>
          <Table headers={['Title', 'Code', 'Type', 'Value', 'Min Order', 'Used', 'Active', '']}
            rows={data.map(c => [c.title, <strong style={{ color: '#d4580a' }}>{c.code}</strong>, c.discount_type, c.discount_type === 'flat' ? `₹${c.discount_value}` : `${c.discount_value}%`, `₹${c.min_order_value}`, c.used_count || 0, c.is_active ? '✅' : '❌',
              <button style={styles.delBtn} onClick={() => del('/admin/coupons', c.id)}>Delete</button>])} />
        </div>
      )}

      {/* ── STORES ── */}
      {tab === 'stores' && (
        <div>
          <form onSubmit={async e => { e.preventDefault(); try { await API.post('/admin/stores', newStore); toast.success('Store added!'); fetchData(); setNewStore({ title: '', address: '', city: '', phone: '', lat: '', lng: '', delivery_range_km: 10 }); } catch { toast.error('Failed'); } }} style={styles.form}>
            <h4 style={styles.formTitle}>Add Store</h4>
            <div style={styles.grid4}>
              <input style={styles.inp} placeholder="Store Name" value={newStore.title} onChange={e => setNewStore({ ...newStore, title: e.target.value })} required />
              <input style={styles.inp} placeholder="Address" value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })} />
              <input style={styles.inp} placeholder="City" value={newStore.city} onChange={e => setNewStore({ ...newStore, city: e.target.value })} />
              <input style={styles.inp} placeholder="Phone" value={newStore.phone} onChange={e => setNewStore({ ...newStore, phone: e.target.value })} />
              <input style={styles.inp} type="number" step="any" placeholder="Latitude" value={newStore.lat} onChange={e => setNewStore({ ...newStore, lat: e.target.value })} />
              <input style={styles.inp} type="number" step="any" placeholder="Longitude" value={newStore.lng} onChange={e => setNewStore({ ...newStore, lng: e.target.value })} />
              <input style={styles.inp} type="number" placeholder="Delivery Range (km)" value={newStore.delivery_range_km} onChange={e => setNewStore({ ...newStore, delivery_range_km: e.target.value })} />
              <button style={styles.addBtn}>+ Add</button>
            </div>
          </form>
          <Table headers={['Name', 'City', 'Phone', 'Range (km)', 'Live', '']}
            rows={data.map(s => [s.title, s.city, s.phone, `${s.delivery_range_km} km`, s.is_live ? '🟢 Live' : '🔴 Off',
              <button style={styles.delBtn} onClick={() => del('/admin/stores', s.id)}>Delete</button>])} />
        </div>
      )}

      {/* ── BLOGS ── */}
      {tab === 'blogs' && (
        <div>
          <form onSubmit={async e => { e.preventDefault(); try { await API.post('/admin/blogs', newBlog); toast.success('Blog created!'); fetchData(); setNewBlog({ title: '', description: '', image: '', external_link: '', stage: 'draft', tag: 'blog' }); } catch { toast.error('Failed'); } }} style={styles.form}>
            <h4 style={styles.formTitle}>Add Blog / What's New</h4>
            <div style={styles.grid4}>
              <input style={styles.inp} placeholder="Title" value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} required />
              <input style={styles.inp} placeholder="Image URL" value={newBlog.image} onChange={e => setNewBlog({ ...newBlog, image: e.target.value })} />
              <input style={styles.inp} placeholder="External Link (YouTube etc)" value={newBlog.external_link} onChange={e => setNewBlog({ ...newBlog, external_link: e.target.value })} />
              <select style={styles.inp} value={newBlog.tag} onChange={e => setNewBlog({ ...newBlog, tag: e.target.value })}>
                <option value="blog">Blog Post</option>
                <option value="whats_new">What's New</option>
              </select>
              <select style={styles.inp} value={newBlog.stage} onChange={e => setNewBlog({ ...newBlog, stage: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <input style={{ ...styles.inp, gridColumn: 'span 2' }} placeholder="Description" value={newBlog.description} onChange={e => setNewBlog({ ...newBlog, description: e.target.value })} />
              <button style={styles.addBtn}>+ Add</button>
            </div>
          </form>
          <Table headers={['Title', 'Tag', 'Stage', 'External Link', '']}
            rows={data.map(b => [b.title, b.tag, <span style={{ color: b.stage === 'published' ? '#4caf50' : '#ff9800', fontWeight: '600' }}>{b.stage}</span>, b.external_link ? <a href={b.external_link} target="_blank" rel="noreferrer" style={{ color: '#d4580a' }}>Link</a> : '-',
              b.stage !== 'published' && <button style={styles.delBtn} onClick={() => del('/admin/blogs', b.id)}>Delete</button>])} />
        </div>
      )}

      {/* ── MEDIA ── */}
      {tab === 'media' && (
        <div>
          <form onSubmit={async e => { e.preventDefault(); try { await API.post('/admin/media', newMedia); toast.success('Media added!'); fetchData(); setNewMedia({ image_url: '', tag: 'gallery' }); } catch { toast.error('Failed'); } }} style={styles.form}>
            <h4 style={styles.formTitle}>Add Media</h4>
            <div style={styles.grid4}>
              <input style={{ ...styles.inp, gridColumn: 'span 2' }} placeholder="Image URL" value={newMedia.image_url} onChange={e => setNewMedia({ ...newMedia, image_url: e.target.value })} required />
              <select style={styles.inp} value={newMedia.tag} onChange={e => setNewMedia({ ...newMedia, tag: e.target.value })}>
                <option value="gallery">Gallery</option>
                <option value="blog">Blog</option>
                <option value="product">Product</option>
                <option value="combo">Combo</option>
                <option value="category">Category</option>
              </select>
              <button style={styles.addBtn}>+ Add</button>
            </div>
          </form>
          <div style={styles.mediaGrid}>
            {data.map(m => (
              <div key={m.id} style={styles.mediaCard}>
                <img src={m.image_url} alt={m.tag} style={styles.mediaImg} onError={e => { e.target.src = 'https://via.placeholder.com/100?text=img'; }} />
                <span style={styles.mediaTag}>{m.tag}</span>
                <button style={styles.delBtn} onClick={() => del('/admin/media', m.id)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── POINTS ── */}
      {tab === 'points' && (
        <div style={styles.card}>
          <h3 style={styles.secTitle}>User Loyalty Points History</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input style={{ ...styles.inp, flex: 1 }} placeholder="Enter phone number or user ID" value={pointsUser} onChange={e => setPointsUser(e.target.value)} />
            <button style={styles.addBtn} onClick={fetchUserPoints}>Search</button>
          </div>
          {pointsHistory.length > 0 && (
            <div>
              {pointsHistory.map((p, i) => (
                <div key={i} style={{ padding: '12px', borderBottom: '1px solid #2e2e2e', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#aaaaaa' }}>{p.description}</span>
                  <span style={{ color: p.type === 'credited' ? '#4caf50' : p.type === 'debited' ? '#f44336' : '#d4580a', fontWeight: '700' }}>
                    {p.type === 'credited' ? '+' : ''}{p.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PAYMENT GATEWAY ── */}
      {tab === 'payments' && <PaymentGatewaySettings />}
    </div>
  );
};

// Payment Gateway Settings
const PaymentGatewaySettings = () => {
  const [gateways, setGateways] = React.useState([
    { id: 'cod',      label: 'Cash on Delivery',  icon: '💵', enabled: true  },
    { id: 'razorpay', label: 'Razorpay (Online)',  icon: '💳', enabled: false },
    { id: 'gpay',     label: 'Google Pay (UPI)',   icon: '📱', enabled: false },
    { id: 'paytm',    label: 'Paytm',              icon: '🅿️', enabled: false },
    { id: 'netbank',  label: 'Net Banking',         icon: '🏦', enabled: false },
  ]);
  const toggle = (id) => setGateways(g => g.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));
  return (
    <div style={styles.card}>
      <h3 style={styles.secTitle}>💳 Manage Payment Gateways</h3>
      <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Turn ON/OFF payment methods available to customers</p>
      {gateways.map(g => (
        <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '10px', background: g.enabled ? 'rgba(212,88,10,0.1)' : '#111111', border: `1px solid ${g.enabled ? 'rgba(212,88,10,0.3)' : '#2e2e2e'}`, marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{g.icon}</span>
            <span style={{ fontWeight: '600', color: '#f5f5f5' }}>{g.label}</span>
          </div>
          <button onClick={() => toggle(g.id)} style={{ padding: '7px 20px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', background: g.enabled ? '#4caf50' : '#444', color: '#fff' }}>
            {g.enabled ? 'ON' : 'OFF'}
          </button>
        </div>
      ))}
      <p style={{ color: '#666', fontSize: '12px', marginTop: '12px' }}>Note: Razorpay, Google Pay & other online gateways require API keys to be configured by the development team.</p>
    </div>
  );
};

// Reusable Table
const Table = ({ headers, rows }) => (
  <div style={styles.tableWrap}>
    <table style={styles.table}>
      <thead><tr style={styles.thead}>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => (
        <tr key={i} style={styles.tr}>{row.map((cell, j) => <td key={j} style={{ color: '#aaaaaa' }}>{cell}</td>)}</tr>
      ))}</tbody>
    </table>
  </div>
);

const styles = {
  page: { minHeight: '100vh', background: '#0d0d0d', padding: '20px' },
  title: { color: '#f5f5f5', fontSize: '24px', fontWeight: '800', marginBottom: '14px' },
  tabsWrap: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' },
  tab: { padding: '8px 16px', border: '1px solid #2e2e2e', borderRadius: '8px', background: '#1a1a1a', cursor: 'pointer', fontWeight: '600', color: '#888', fontSize: '13px' },
  tabActive: { border: '1px solid #d4580a', color: '#d4580a', background: 'rgba(212,88,10,0.1)' },
  secTitle: { color: '#f5f5f5', fontSize: '17px', fontWeight: '700', marginBottom: '14px' },
  form: { background: '#1a1a1a', borderRadius: '12px', padding: '18px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', border: '1px solid #2e2e2e' },
  formTitle: { color: '#f5f5f5', marginBottom: '12px', fontWeight: '700' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', alignItems: 'end' },
  inp: { padding: '9px 12px', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: '13px', width: '100%', boxSizing: 'border-box', background: '#222222', color: '#f5f5f5' },
  addBtn: { padding: '9px 14px', background: '#d4580a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' },
  delBtn: { padding: '4px 10px', background: 'rgba(244,67,54,0.1)', color: '#f44336', border: '1px solid rgba(244,67,54,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  tableWrap: { background: '#1a1a1a', borderRadius: '12px', overflow: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', border: '1px solid #2e2e2e' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#111111', fontSize: '12px', color: '#666', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #2e2e2e', fontSize: '14px' },
  card: { background: '#1a1a1a', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', border: '1px solid #2e2e2e' },
  mediaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' },
  mediaCard: { background: '#222222', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', textAlign: 'center', padding: '8px', border: '1px solid #2e2e2e' },
  mediaImg: { width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px' },
  mediaTag: { display: 'block', fontSize: '11px', color: '#666', margin: '4px 0' },
};

export default AdminDashboard;
