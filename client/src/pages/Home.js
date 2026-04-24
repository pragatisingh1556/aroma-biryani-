import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import BannerSlider from '../components/BannerSlider';
import CartBar from '../components/CartBar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

// Fallback What's New cards (shown when admin hasn't added enough entries)
const DEFAULT_WHATS_NEW = [
  {
    id: 'wn-d1',
    emoji: '🍱',
    title: 'Party Packs Available!',
    description: 'Planning a gathering? Order our Party Packs — serves 5 to 10 people. Perfect for every occasion!',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=460&h=160&fit=crop&q=80',
    bg: 'linear-gradient(135deg, #2d1000 0%, #4a1a00 100%)',
  },
  {
    id: 'wn-d2',
    emoji: '💳',
    title: 'Pay Online, Save More',
    description: 'Pay via UPI or card and get exclusive online-only discounts on every order!',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=460&h=160&fit=crop&q=80',
    bg: 'linear-gradient(135deg, #0d1a2d 0%, #1a2d4a 100%)',
  },
  {
    id: 'wn-d3',
    emoji: '🎟',
    title: 'First Order Discount',
    description: "New to Aroma? Use code WELCOME on your first order and get ₹50 off. Welcome to the family!",
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=460&h=160&fit=crop&q=80',
    bg: 'linear-gradient(135deg, #0d2d1a 0%, #1a4a2d 100%)',
  },
  {
    id: 'wn-d4',
    emoji: '⭐',
    title: 'Earn & Redeem Points',
    description: 'Every order earns you loyalty points. Collect enough and your next biriyani is on us!',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=460&h=160&fit=crop&q=80',
    bg: 'linear-gradient(135deg, #2d2200 0%, #4a3800 100%)',
  },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [banners, setBanners] = useState([]);
  const [whatsNew, setWhatsNew] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const params = {};
      if (selectedCategory) params.category_id = selectedCategory;
      if (search) params.search = search;
      const { data } = await API.get('/products', { params });
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products. Please try refreshing.');
    }
  }, [selectedCategory, search]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, bannerRes, blogRes] = await Promise.all([
          API.get('/categories'),
          API.get('/banners'),
          API.get('/blogs'),
        ]);
        setCategories(catRes.data);
        setBanners(bannerRes.data.filter(b => b.tag !== 'whats_new' && b.tag !== 'blog'));
        setWhatsNew(blogRes.data.filter(b => b.tag === 'whats_new'));
        setBlogs(blogRes.data.filter(b => b.tag === 'blog'));
        fetchProducts();
      } catch (err) {
        console.error(err);
        toast.error('Failed to load menu. Please try refreshing.');
      }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [fetchProducts]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Always show at least 4 What's New cards (fill gaps with defaults)
  const displayWhatsNew = whatsNew.length >= DEFAULT_WHATS_NEW.length
    ? whatsNew
    : [...whatsNew, ...DEFAULT_WHATS_NEW.slice(whatsNew.length)];

  return (
    <div className="page-enter" style={{ background: '#0d0d0d', minHeight: '100vh', paddingBottom: '90px' }}>
      <Navbar />

      {/* Sliding Banner or Hero */}
      {banners.length > 0
        ? <BannerSlider banners={banners} />
        : (
          <div style={styles.hero}>
            <div style={styles.heroInner}>
              <span style={styles.heroEmoji}>🍛</span>
              <h1 style={styles.heroTitle}>Aroma Biriyani</h1>
              <p style={styles.heroSubtitle}>Fresh, Flavorful & Delivered to Your Door 🚀</p>
            </div>
          </div>
        )
      }

      {/* Quick Action Buttons */}
      <div style={styles.activitiesRow}>
        <button className="btn-brand" style={styles.actBtnPrimary} onClick={() => navigate('/')}>
          🛒 Order Now
        </button>
        <button className="btn-outline" style={styles.actBtnSecondary} onClick={() => navigate('/orders')}>
          📦 Track My Order
        </button>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search biriyani, kebabs, curries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      {/* What's New */}
      <div style={styles.section}>
        <h2 className="section-title" style={styles.sectionTitle}>🆕 What's New</h2>
        <div style={styles.cardRow}>
          {displayWhatsNew.map((item) => (
            <div key={item.id} className="card-hover glow-card" style={styles.newsCard}>
              {item.image
                ? <div className="img-zoom" style={{ position: 'relative' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={styles.newsImg}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{ ...styles.newsImgPlaceholder, background: item.bg, display: 'none' }}>
                      {item.emoji || '🍛'}
                    </div>
                  </div>
                : <div style={{ ...styles.newsImgPlaceholder, background: item.bg || 'linear-gradient(135deg,#1a0800,#2d1000)' }}>
                    <span>{item.emoji || '🍛'}</span>
                  </div>
              }
              <div style={styles.newsContent}>
                <h4 style={styles.newsTitle}>{item.title}</h4>
                <p style={styles.newsDesc}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={styles.section}>
        <h2 className="section-title" style={styles.sectionTitle}>Categories</h2>
        <div style={styles.catRow}>
          <button
            className={`cat-pill${selectedCategory === null ? ' cat-pill-active' : ''}`}
            style={{ ...styles.catBtn, ...(selectedCategory === null ? styles.catBtnActive : {}) }}
            onClick={() => setSelectedCategory(null)}>All</button>
          {categories.map((cat) => (
            <button key={cat.id}
              className={`cat-pill${selectedCategory === cat.id ? ' cat-pill-active' : ''}`}
              style={{ ...styles.catBtn, ...(selectedCategory === cat.id ? styles.catBtnActive : {}) }}
              onClick={() => setSelectedCategory(cat.id)}>
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={styles.section}>
        <h2 className="section-title" style={styles.sectionTitle}>
          Our Menu {search && <span style={{ color: '#888', fontSize: '14px', fontWeight: '400' }}>— results for "{search}"</span>}
        </h2>
        {loading ? (
          <div style={styles.loadingGrid}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={styles.skeletonCard} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '52px' }}>🍽️</span>
            <p style={{ color: '#aaa', marginTop: '12px', fontSize: '16px' }}>No items found</p>
            <p style={{ color: '#666', fontSize: '13px' }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={styles.productGrid}>
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>

      {/* Blog Posts */}
      {blogs.length > 0 && (
        <div style={styles.section}>
          <h2 className="section-title" style={styles.sectionTitle}>📰 From Our Blog</h2>
          <div style={styles.cardRow}>
            {blogs.map((blog) => (
              <div key={blog.id} className="card-hover glow-card" style={styles.blogCard}>
                {blog.image && <div className="img-zoom"><img src={blog.image} alt={blog.title} style={styles.blogImg} /></div>}
                <div style={styles.blogContent}>
                  <h4 style={styles.blogTitle}>{blog.title}</h4>
                  <p style={styles.blogDesc}>{blog.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Sticky Cart Bar */}
      <CartBar />

    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a0800 0%, #2d0f00 50%, #1a0800 100%)',
    padding: '50px 20px',
    textAlign: 'center',
    borderBottom: '1px solid #2e2e2e',
    position: 'relative',
    overflow: 'hidden',
  },
  heroInner: { position: 'relative', zIndex: 1 },
  heroEmoji: { fontSize: '56px', display: 'block', marginBottom: '12px' },
  heroTitle: {
    color: '#fff', fontSize: '38px', fontWeight: '900', margin: '0 0 10px',
    background: 'linear-gradient(135deg, #d4580a, #ff8c00)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: { color: '#aaaaaa', fontSize: '16px', margin: 0, lineHeight: 1.6 },

  activitiesRow: { display: 'flex', gap: '12px', padding: '18px 20px', maxWidth: '1200px', margin: '0 auto' },
  actBtnPrimary: {
    padding: '14px 24px', color: '#fff', border: 'none',
    borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer',
    minWidth: '155px',
  },
  actBtnSecondary: {
    padding: '14px 24px', background: '#1a1a1a',
    border: '2px solid #2e2e2e', borderRadius: '12px',
    color: '#f5f5f5', fontWeight: '700', fontSize: '15px', cursor: 'pointer',
    minWidth: '175px',
  },

  searchContainer: { padding: '0 20px 20px', maxWidth: '1200px', margin: '0 auto' },
  searchWrap: {
    position: 'relative', display: 'flex', alignItems: 'center',
    background: '#1a1a1a', borderRadius: '40px', border: '1px solid #2e2e2e',
    padding: '0 18px', transition: 'border-color 0.2s, box-shadow 0.2s',
    maxWidth: '640px',
  },
  searchIcon: { fontSize: '16px', marginRight: '10px', flexShrink: 0 },
  searchInput: {
    flex: 1, padding: '13px 0', border: 'none', fontSize: '15px',
    background: 'transparent', color: '#f5f5f5', outline: 'none',
  },
  clearBtn: {
    background: '#2e2e2e', border: 'none', color: '#888', width: '22px', height: '22px',
    borderRadius: '50%', cursor: 'pointer', fontSize: '11px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  section: { padding: '10px 20px 28px', maxWidth: '1200px', margin: '0 auto' },
  sectionTitle: { color: '#f5f5f5', fontSize: '20px', margin: '0 0 16px', fontWeight: '700', lineHeight: 1.3 },

  catRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  catBtn: {
    padding: '8px 18px', borderRadius: '24px', border: '1.5px solid #2e2e2e',
    background: '#1a1a1a', color: '#aaaaaa', cursor: 'pointer', fontWeight: '600', fontSize: '13px',
  },
  catBtnActive: {
    background: 'linear-gradient(135deg, #d4580a, #ff7020)',
    borderColor: 'transparent', color: '#fff',
    boxShadow: '0 3px 10px rgba(212,88,10,0.3)',
  },

  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '18px' },
  loadingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '18px' },
  skeletonCard: {
    height: '280px', background: '#1a1a1a', borderRadius: '16px',
    border: '1px solid #2e2e2e',
    backgroundImage: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)',
    backgroundSize: '400px 100%',
    animation: 'shimmer 1.4s infinite',
  },
  emptyState: { textAlign: 'center', padding: '50px 20px' },

  cardRow: { display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' },
  newsCard: {
    width: '280px', minWidth: '280px', maxWidth: '280px', background: '#1a1a1a', borderRadius: '14px',
    overflow: 'hidden', border: '1px solid #2e2e2e', flexShrink: 0,
  },
  newsImg: { width: '100%', height: '150px', objectFit: 'cover', display: 'block' },
  newsImgPlaceholder: {
    width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '48px', background: 'linear-gradient(135deg, #1a0800 0%, #2d1000 100%)',
    borderBottom: '1px solid #2e2e2e',
  },
  newsContent: { padding: '12px 14px' },
  newsTitle: { fontSize: '14px', fontWeight: '700', color: '#f5f5f5', margin: '0 0 5px', lineHeight: 1.3 },
  newsDesc: { fontSize: '12px', color: '#777', margin: '0 0 8px', lineHeight: 1.5 },

  blogCard: {
    width: '250px', minWidth: '250px', maxWidth: '250px', background: '#1a1a1a', borderRadius: '14px',
    overflow: 'hidden', border: '1px solid #2e2e2e', flexShrink: 0,
  },
  blogImg: { width: '100%', height: '130px', objectFit: 'cover', display: 'block' },
  blogContent: { padding: '12px 14px' },
  blogTitle: { fontSize: '14px', fontWeight: '700', color: '#f5f5f5', margin: '0 0 5px', lineHeight: 1.3 },
  blogDesc: { fontSize: '12px', color: '#777', margin: '0 0 8px', lineHeight: 1.5 },
};

export default Home;
