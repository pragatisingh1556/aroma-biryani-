import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get('/media?tag=gallery').then(({ data }) => setImages(data)).catch(() => {});
  }, []);

  return (
    <div className="page-enter" style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 className="section-title" style={styles.title}>📸 Gallery</h2>
        <p style={styles.subtitle}>A visual feast — every frame tells a flavor story 🍛</p>
        {images.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '64px', marginBottom: '14px' }}>🖼️</div>
            <h3 style={{ color: '#f5f5f5', marginBottom: '8px' }}>Nothing here yet!</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Our chefs are busy — beautiful photos coming soon!</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {images.map((img) => (
              <div key={img.id} className="img-zoom card-hover" style={styles.imgWrap} onClick={() => setSelected(img.image_url)}>
                <img src={img.image_url} alt="gallery" style={styles.img}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Aroma'; }} />
                <div style={styles.imgOverlay}>
                  <span style={styles.viewIcon}>🔍</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Lightbox */}
      {selected && (
        <div style={styles.lightbox} onClick={() => setSelected(null)}>
          <img src={selected} alt="preview" style={styles.lightboxImg} />
          <button style={styles.closeBtn}>✕</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '24px 20px' },
  title: { color: '#f5f5f5', fontSize: '24px', fontWeight: '700', marginBottom: '6px' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' },
  imgWrap: {
    borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '1',
    background: '#1a1a1a', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', border: '1px solid #2e2e2e',
    position: 'relative',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  imgOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.3s ease', fontSize: '28px', opacity: 0,
  },
  viewIcon: { fontSize: '28px' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  lightbox: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, cursor: 'pointer' },
  lightboxImg: { maxWidth: '90vw', maxHeight: '90vh', borderRadius: '14px', objectFit: 'contain', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' },
  closeBtn: { position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: '50%', width: '44px', height: '44px', fontSize: '18px', cursor: 'pointer', fontWeight: '700', backdropFilter: 'blur(4px)' },
};

export default Gallery;
