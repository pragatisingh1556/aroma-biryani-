import React, { useEffect, useState } from 'react';

const messages = [
  'Warming up the handi... 🔥',
  'Adding the secret spices... 🌶️',
  'Almost ready — smells amazing! 🍛',
];

const Loader = ({ onDone }) => {
  const [fade, setFade] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setMsgIndex(1), 600);
    const t2 = setTimeout(() => setMsgIndex(2), 1200);
    const t3 = setTimeout(() => setFade(true), 1800);
    const t4 = setTimeout(() => onDone(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <div style={{ ...styles.container, opacity: fade ? 0 : 1, transition: 'opacity 0.5s ease' }}>
      <div style={styles.inner}>
        <div style={styles.logoWrap}>
          <span style={styles.emoji}>🍛</span>
        </div>
        <h1 style={styles.brand}>Aroma Biriyani</h1>
        <p style={styles.tagline}>{messages[msgIndex]}</p>
        <div style={styles.dotsRow}>
          <span style={{ ...styles.dot, animationDelay: '0s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .dot-anim { animation: bounce 1.4s infinite ease-in-out both; }
      `}</style>
    </div>
  );
};

const styles = {
  container: { position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #d4580a, #ff8c00)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  inner: { textAlign: 'center' },
  logoWrap: { width: '100px', height: '100px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  emoji: { fontSize: '52px' },
  brand: { color: '#fff', fontSize: '32px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '1px' },
  tagline: { color: 'rgba(255,255,255,0.85)', fontSize: '16px', margin: '0 0 30px' },
  dotsRow: { display: 'flex', justifyContent: 'center', gap: '8px' },
  dot: { width: '12px', height: '12px', background: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both' },
};

export default Loader;
