import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name?.split(' ')[0]}! 👋`);
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'kitchen_staff') navigate('/kitchen');
      else if (data.user.role === 'delivery_staff') navigate('/delivery');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Oops! Login failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-enter" style={styles.container}>
      <div style={styles.bgGlow} />
      <div style={styles.card}>
        <div style={styles.logo}>🍛</div>
        <h2 style={styles.title}>Welcome back!</h2>
        <p style={styles.subtitle}>Sign in to continue ordering your favourites</p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>📱 Phone Number</label>
            <input style={styles.input} type="tel" placeholder="Enter your phone number"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>🔒 Password</label>
            <input style={styles.input} type="password" placeholder="Enter your password"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn-brand" style={styles.btn} disabled={loading}>
            {loading ? '⏳ Signing in...' : 'Login  →'}
          </button>
        </form>

        <p style={styles.link}>
          New here?{' '}
          <Link to="/signup" style={styles.linkBrand}>Create an account 🎉</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0d0d0d', padding: '20px', position: 'relative', overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,88,10,0.07) 0%, transparent 70%)',
    top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none',
  },
  card: {
    background: '#1a1a1a', padding: '44px 40px', borderRadius: '22px',
    width: '100%', maxWidth: '380px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px #2e2e2e',
    textAlign: 'center', position: 'relative', zIndex: 1,
  },
  logo: { fontSize: '52px', marginBottom: '10px', display: 'block' },
  title: { color: '#f5f5f5', margin: '0 0 6px', fontSize: '26px', fontWeight: '800' },
  subtitle: { color: '#777', marginBottom: '28px', fontSize: '13px', lineHeight: 1.5 },
  inputGroup: { textAlign: 'left', marginBottom: '16px' },
  label: { display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', marginBottom: '6px', letterSpacing: '0.3px' },
  input: {
    width: '100%', padding: '12px 16px', border: '1px solid #2e2e2e', borderRadius: '10px',
    fontSize: '14px', boxSizing: 'border-box', background: '#222222', color: '#f5f5f5',
  },
  btn: {
    width: '100%', padding: '14px', color: '#fff', border: 'none',
    borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '6px',
  },
  link: { marginTop: '20px', fontSize: '14px', color: '#666' },
  linkBrand: { color: '#d4580a', fontWeight: '700' },
};

export default Login;
