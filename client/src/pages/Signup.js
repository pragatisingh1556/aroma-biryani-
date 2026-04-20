import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/signup', form);
      toast.success('OTP sent to your phone! 📲');
      if (data.otp) setOtp(data.otp);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/verify-otp', { phone: form.phone, otp });
      toast.success("You're all set! Please login 🎉");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-enter" style={styles.container}>
      <div style={styles.bgGlow} />
      <div style={styles.card}>
        <div style={styles.logo}>🍛</div>
        <h2 style={styles.title}>{step === 1 ? 'Create your account' : 'Verify your number'}</h2>
        <p style={styles.subtitle}>
          {step === 1 ? 'Join us and enjoy the best biriyani in town!' : `OTP sent to ${form.phone} 📲`}
        </p>

        {/* Step indicator */}
        <div style={styles.stepRow}>
          <div style={{ ...styles.step, background: '#d4580a' }}>1</div>
          <div style={{ ...styles.stepLine, background: step === 2 ? '#d4580a' : '#2e2e2e' }} />
          <div style={{ ...styles.step, background: step === 2 ? '#d4580a' : '#2e2e2e', color: step === 2 ? '#fff' : '#555' }}>2</div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSignup} style={{ width: '100%' }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>👤 Full Name</label>
              <input style={styles.input} placeholder="What should we call you?" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>📱 Phone Number</label>
              <input style={styles.input} type="tel" placeholder="Your 10-digit number" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>✉️ Email <span style={{ color: '#555', fontWeight: '400' }}>(optional)</span></label>
              <input style={styles.input} type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>🔒 Password</label>
              <input style={styles.input} type="password" placeholder="Create a strong password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn-brand" style={styles.btn} disabled={loading}>
              {loading ? '⏳ Sending OTP...' : 'Send OTP  →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} style={{ width: '100%' }}>
            <p style={styles.otpHint}>Enter the 6-digit code</p>
            <input
              style={styles.otpInput}
              maxLength={6} placeholder="------"
              value={otp} onChange={e => setOtp(e.target.value)} required
            />
            <button className="btn-brand" style={styles.btn} disabled={loading}>
              {loading ? '⏳ Verifying...' : '✅ Verify & Continue'}
            </button>
            <button type="button" style={styles.backBtn} onClick={() => setStep(1)}>← Go back</button>
          </form>
        )}

        <p style={styles.link}>
          Already have an account?{' '}
          <Link to="/login" style={styles.linkBrand}>Login here</Link>
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
    background: '#1a1a1a', padding: '40px 36px', borderRadius: '22px',
    width: '100%', maxWidth: '390px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px #2e2e2e',
    textAlign: 'center', position: 'relative', zIndex: 1,
  },
  logo: { fontSize: '48px', marginBottom: '8px', display: 'block' },
  title: { color: '#f5f5f5', margin: '0 0 6px', fontSize: '24px', fontWeight: '800' },
  subtitle: { color: '#777', marginBottom: '20px', fontSize: '13px', lineHeight: 1.5 },
  stepRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
  step: {
    width: '28px', height: '28px', borderRadius: '50%', color: '#fff',
    fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  stepLine: { width: '60px', height: '2px', transition: 'background 0.3s' },
  inputGroup: { textAlign: 'left', marginBottom: '14px' },
  label: { display: 'block', color: '#888', fontSize: '12px', fontWeight: '600', marginBottom: '6px' },
  input: {
    width: '100%', padding: '11px 14px', border: '1px solid #2e2e2e', borderRadius: '10px',
    fontSize: '14px', boxSizing: 'border-box', background: '#222222', color: '#f5f5f5',
  },
  btn: {
    width: '100%', padding: '14px', color: '#fff', border: 'none',
    borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '6px',
  },
  backBtn: {
    width: '100%', padding: '11px', background: 'none', border: '1px solid #2e2e2e',
    borderRadius: '12px', color: '#aaaaaa', cursor: 'pointer', marginTop: '10px', fontSize: '14px',
  },
  otpHint: { color: '#777', fontSize: '13px', marginBottom: '14px' },
  otpInput: {
    width: '100%', padding: '16px', textAlign: 'center', fontSize: '28px',
    letterSpacing: '12px', fontWeight: '700', border: '2px solid #2e2e2e', borderRadius: '12px',
    background: '#222222', color: '#d4580a', boxSizing: 'border-box', marginBottom: '12px',
  },
  link: { marginTop: '18px', fontSize: '13px', color: '#555' },
  linkBrand: { color: '#d4580a', fontWeight: '700' },
};

export default Signup;
