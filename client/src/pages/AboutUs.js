import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => (
  <div className="page-enter" style={{ background: '#0d0d0d', minHeight: '100vh' }}>
    <Navbar />
    <div style={styles.container}>

      {/* Hero Banner */}
      <div style={styles.hero}>
        <span style={styles.heroEmoji}>🍛</span>
        <h1 style={styles.heroTitle}>Our Story</h1>
        <p style={styles.heroSub}>
          It started in a small kitchen. It became something much bigger.
        </p>
        <div style={styles.heroBadge}>Est. 2018 · Family Owned · Made Fresh Daily</div>
      </div>

      {/* Founder's Note */}
      <div style={styles.founderCard}>
        <div style={styles.quoteIcon}>"</div>
        <p style={styles.quoteText}>
          I grew up watching my mother cook biriyani every Sunday. The whole house would fill with
          the smell of saffron, fried onions, and slow-cooked meat. That smell — that feeling —
          is exactly what we try to bring to your table, every single day.
        </p>
        <div style={styles.founderInfo}>
          <div style={styles.founderAvatar}>R</div>
          <div>
            <div style={styles.founderName}>Rajan Kumar</div>
            <div style={styles.founderRole}>Founder, Aroma Biriyani</div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>How it all began 🌱</h2>
        <p style={styles.text}>
          In 2018, we opened our first tiny outlet with just 4 tables and a dream. No investors,
          no fancy equipment — just one masala box, a giant handi, and the recipe my grandmother
          never wrote down but somehow we all memorised.
        </p>
        <p style={styles.text}>
          Word spread fast. People started calling in advance just to make sure we hadn't sold
          out. Within a year, we opened our second branch. Then a third. Today, we serve
          thousands of happy customers every week — but the recipe? Still the same.
        </p>
        <p style={styles.text}>
          We don't use shortcuts. We don't believe in them. Real dum biriyani takes time,
          and we're perfectly okay with that. You deserve the real thing.
        </p>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { num: '6+', label: 'Years in Business' },
          { num: '50K+', label: 'Happy Customers' },
          { num: '12+', label: 'Menu Items' },
          { num: '4.8★', label: 'Average Rating' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statNum}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <h2 style={styles.sectionHeading}>What we stand for 🤝</h2>
      <div style={styles.valuesGrid}>
        {[
          { emoji: '🌿', title: 'No Compromises on Quality', desc: 'We use the same basmati rice and whole spices our grandmother used. No substitutes, ever.' },
          { emoji: '👨‍🍳', title: 'Chefs Who Actually Care', desc: 'Our kitchen team has been with us for years. They treat every order like it\'s for their own family.' },
          { emoji: '🚀', title: 'We Respect Your Time', desc: 'Hot, fresh, and at your door — we aim for under 45 minutes because cold biriyani is a crime.' },
          { emoji: '❤️', title: 'Community First', desc: 'We\'re a local brand and proud of it. Every order supports real people in your city, not a faceless corporation.' },
        ].map((v) => (
          <div key={v.title} className="card-hover glow-card" style={styles.valueCard}>
            <span style={styles.valueEmoji}>{v.emoji}</span>
            <h4 style={styles.valueTitle}>{v.title}</h4>
            <p style={styles.valueDesc}>{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Come say hi 👋</h2>
        <p style={styles.text}>We love hearing from our customers — whether it's a compliment, a complaint, or just a craving at 2am.</p>
        <div style={styles.contactGrid}>
          <a href="tel:+919876543210" style={styles.contactItem}>
            <span style={styles.contactIcon}>📞</span>
            <div>
              <div style={styles.contactLabel}>Call Us</div>
              <div style={styles.contactValue}>+91 98765 43210</div>
            </div>
          </a>
          <a href="mailto:hello@aromabiriyani.com" style={styles.contactItem}>
            <span style={styles.contactIcon}>✉️</span>
            <div>
              <div style={styles.contactLabel}>Email Us</div>
              <div style={styles.contactValue}>hello@aromabiriyani.com</div>
            </div>
          </a>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>⏰</span>
            <div>
              <div style={styles.contactLabel}>We're Open</div>
              <div style={styles.contactValue}>11:00 AM – 11:00 PM, Daily</div>
            </div>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactIcon}>📍</span>
            <div>
              <div style={styles.contactLabel}>Find Us</div>
              <div style={styles.contactValue}>Multiple locations in the city</div>
            </div>
          </div>
        </div>
      </div>

      {/* App Links */}
      <div style={{ ...styles.card, textAlign: 'center' }}>
        <h2 style={styles.cardTitle}>Order even faster 📱</h2>
        <p style={styles.text}>Our app is coming soon — skip the browser and order straight from your phone!</p>
        <div style={styles.appBtns}>
          <button className="btn-brand" style={styles.appBtn}
            onClick={() => alert('🚀 We\'re working on it! Coming to Play Store soon.')}>
            🤖 Google Play
          </button>
          <button className="btn-brand" style={styles.appBtn}
            onClick={() => alert('🍎 iOS app coming soon too!')}>
            🍎 App Store
          </button>
        </div>
        <p style={styles.shareText}>
          In the meantime, share us with a friend →{' '}
          <span style={{ color: '#d4580a', fontWeight: '700' }}>aromabiriyani.com</span>
        </p>
      </div>

    </div>
    <Footer />
  </div>
);

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '24px 20px' },

  /* Hero */
  hero: {
    textAlign: 'center', padding: '44px 24px',
    background: 'linear-gradient(135deg, #1a0800 0%, #2d0f00 50%, #1a0800 100%)',
    borderRadius: '20px', marginBottom: '20px',
    border: '1px solid rgba(212,88,10,0.2)',
    position: 'relative', overflow: 'hidden',
  },
  heroEmoji: { fontSize: '60px', display: 'block', marginBottom: '12px' },
  heroTitle: {
    color: '#fff', fontSize: '32px', fontWeight: '900', margin: '0 0 10px',
    background: 'linear-gradient(135deg, #d4580a, #ff8c00)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: '0 0 16px', lineHeight: 1.6 },
  heroBadge: {
    display: 'inline-block', background: 'rgba(212,88,10,0.15)',
    border: '1px solid rgba(212,88,10,0.3)', borderRadius: '20px',
    padding: '6px 16px', fontSize: '12px', color: '#d4580a', fontWeight: '700',
    letterSpacing: '0.5px',
  },

  /* Founder Card */
  founderCard: {
    background: '#1a1a1a', borderRadius: '16px', padding: '28px 28px 22px',
    marginBottom: '16px', border: '1px solid #2e2e2e',
    borderLeft: '4px solid #d4580a',
  },
  quoteIcon: { fontSize: '48px', color: '#d4580a', lineHeight: 1, marginBottom: '8px', fontFamily: 'Georgia, serif' },
  quoteText: { color: '#bbb', fontSize: '16px', lineHeight: 1.8, margin: '0 0 20px', fontStyle: 'italic' },
  founderInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  founderAvatar: {
    width: '44px', height: '44px', borderRadius: '50%',
    background: 'linear-gradient(135deg,#d4580a,#ff7020)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: '800', fontSize: '18px', flexShrink: 0,
  },
  founderName: { color: '#f5f5f5', fontWeight: '700', fontSize: '15px' },
  founderRole: { color: '#666', fontSize: '12px', marginTop: '2px' },

  /* Card */
  card: { background: '#1a1a1a', borderRadius: '16px', padding: '24px', marginBottom: '16px', border: '1px solid #2e2e2e' },
  cardTitle: { color: '#d4580a', fontWeight: '800', fontSize: '20px', margin: '0 0 14px' },
  text: { color: '#aaaaaa', fontSize: '15px', lineHeight: 1.8, margin: '0 0 12px' },

  /* Stats */
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' },
  statCard: {
    background: '#1a1a1a', borderRadius: '14px', padding: '18px 12px',
    textAlign: 'center', border: '1px solid #2e2e2e',
  },
  statNum: { fontSize: '26px', fontWeight: '900', color: '#d4580a', marginBottom: '4px' },
  statLabel: { fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },

  /* Section Heading */
  sectionHeading: { color: '#f5f5f5', fontSize: '20px', fontWeight: '800', margin: '0 0 16px' },

  /* Values */
  valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '16px' },
  valueCard: { background: '#1a1a1a', borderRadius: '14px', padding: '22px', textAlign: 'center', border: '1px solid #2e2e2e' },
  valueEmoji: { fontSize: '34px', display: 'block', marginBottom: '10px' },
  valueTitle: { color: '#f5f5f5', fontWeight: '700', margin: '0 0 8px', fontSize: '14px', lineHeight: 1.4 },
  valueDesc: { color: '#777', fontSize: '13px', lineHeight: 1.6, margin: 0 },

  /* Contact */
  contactGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' },
  contactItem: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    background: '#222222', borderRadius: '12px', padding: '14px',
    textDecoration: 'none',
  },
  contactIcon: { fontSize: '22px', flexShrink: 0, marginTop: '2px' },
  contactLabel: { color: '#666', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' },
  contactValue: { color: '#f5f5f5', fontSize: '13px', fontWeight: '600' },

  /* App */
  appBtns: { display: 'flex', gap: '12px', justifyContent: 'center', margin: '16px 0' },
  appBtn: { padding: '12px 24px', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' },
  shareText: { color: '#666', fontSize: '13px', margin: 0 },
};

export default AboutUs;
