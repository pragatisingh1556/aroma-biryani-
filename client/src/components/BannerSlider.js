import React, { useEffect, useState } from 'react';

const BannerSlider = ({ banners }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % banners.length), 3500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.slide, backgroundImage: `url(${banners[current]?.image || banners[current]?.image_url || ''})` }}>
        <div style={styles.overlay}>
          {banners[current]?.title && <h2 style={styles.title}>{banners[current].title}</h2>}
          {banners[current]?.description && <p style={styles.desc}>{banners[current].description}</p>}
        </div>
      </div>
      {/* Dots */}
      <div style={styles.dots}>
        {banners.map((_, i) => (
          <span key={i} style={{ ...styles.dot, background: i === current ? '#d4580a' : '#444' }} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { position: 'relative', marginBottom: '8px' },
  slide: { height: '220px', background: 'linear-gradient(135deg,#d4580a,#ff8c00) center/cover no-repeat', display: 'flex', alignItems: 'flex-end', transition: 'background-image 0.5s ease' },
  overlay: { width: '100%', padding: '20px 24px', background: 'linear-gradient(transparent, rgba(0,0,0,0.55))' },
  title: { color: '#fff', fontSize: '22px', fontWeight: '800', margin: '0 0 4px' },
  desc: { color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 },
  dots: { display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px 0' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.3s' },
};

export default BannerSlider;
