import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const StoreLocator = () => {
  const [stores, setStores]   = useState([]);
  const [search, setSearch]   = useState('');
  const [checking, setChecking] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);

  useEffect(() => {
    API.get('/stores').then(({ data }) => setStores(data)).catch(() => {});
  }, []);

  const filtered = stores.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  );

  const checkMyLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    setChecking(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data } = await API.get(`/stores/check-delivery?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
          setDeliveryResult(data);
        } catch { setDeliveryResult({ can_deliver: false, message: "Couldn't check delivery" }); }
        setChecking(false);
      },
      () => {
        setDeliveryResult({ can_deliver: false, message: "Location access denied. Please select your city manually." });
        setChecking(false);
      }
    );
  };

  return (
    <div className="page-enter" style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 className="section-title" style={styles.title}>🏪 Store Locator</h2>
        <p style={styles.subtitle}>Find your nearest Aroma Biriyani store 📍</p>

        {/* Delivery Check */}
        <div style={styles.deliveryBox}>
          <h3 style={styles.deliveryTitle}>Can we deliver to you? 🚚</h3>
          <p style={{ color: '#666', fontSize: '13px', margin: '0 0 14px' }}>Allow location access and we'll check instantly</p>
          <button className="btn-brand" style={styles.locationBtn} onClick={checkMyLocation} disabled={checking}>
            {checking ? '📍 Checking...' : '📍 Use My Location'}
          </button>
          {deliveryResult && (
            <div style={{ ...styles.resultBox, background: deliveryResult.can_deliver ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)', border: `1px solid ${deliveryResult.can_deliver ? 'rgba(76,175,80,0.4)' : 'rgba(244,67,54,0.4)'}` }}>
              {deliveryResult.can_deliver ? (
                <div>
                  <p style={{ color: '#66bb6a', fontWeight: '700', margin: '0 0 4px', fontSize: '14px' }}>✅ Great news! We deliver to your location</p>
                  <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>Nearest store: <strong style={{ color: '#f5f5f5' }}>{deliveryResult.store?.title}</strong> ({deliveryResult.store?.distance} km away)</p>
                </div>
              ) : (
                <p style={{ color: '#ef5350', fontWeight: '600', margin: 0, fontSize: '14px' }}>❌ {deliveryResult.message || "Sorry, we don't deliver to this location yet"}</p>
              )}
            </div>
          )}
        </div>

        {/* Search */}
        <input style={styles.search} placeholder="🔍 Search by store name or city..."
          value={search} onChange={e => setSearch(e.target.value)} />

        {/* Store List */}
        <h3 style={styles.listTitle}>Our Stores ({filtered.length})</h3>
        {filtered.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>No stores found</p>
        ) : (
          filtered.map(store => (
            <div key={store.id} className="card-hover glow-card" style={styles.storeCard}>
              <div style={styles.storeTop}>
                <div>
                  <h4 style={styles.storeName}>{store.title}</h4>
                  <p style={styles.storeCity}>📍 {store.address ? `${store.address}, ` : ''}{store.city}</p>
                  {store.phone && <p style={styles.storePhone}>📞 {store.phone}</p>}
                  <p style={styles.storeRange}>🚚 Delivery range: {store.delivery_range_km} km</p>
                </div>
                <span style={{ ...styles.liveBadge, background: store.is_live ? '#4caf50' : '#f44336' }}>
                  {store.is_live ? '🟢 Open' : '🔴 Closed'}
                </span>
              </div>
              {store.lat && store.lng && (
                <a href={`https://www.google.com/maps?q=${store.lat},${store.lng}`} target="_blank" rel="noreferrer" style={styles.mapLink}>
                  🗺 Open in Google Maps
                </a>
              )}
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '24px 20px' },
  title: { color: '#f5f5f5', fontSize: '24px', fontWeight: '700', marginBottom: '6px' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '20px' },
  deliveryBox: { background: '#1a1a1a', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', border: '1px solid #2e2e2e' },
  deliveryTitle: { color: '#f5f5f5', fontWeight: '700', margin: '0 0 6px', fontSize: '16px' },
  locationBtn: { padding: '11px 22px', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' },
  resultBox: { marginTop: '12px', padding: '12px 16px', borderRadius: '10px' },
  search: { width: '100%', padding: '12px 18px', borderRadius: '25px', border: '2px solid #2e2e2e', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box', background: '#222222', color: '#f5f5f5' },
  listTitle: { color: '#f5f5f5', fontWeight: '700', fontSize: '16px', marginBottom: '12px' },
  storeCard: { background: '#1a1a1a', borderRadius: '14px', padding: '18px', marginBottom: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', border: '1px solid #2e2e2e' },
  storeTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  storeName: { color: '#f5f5f5', fontWeight: '700', fontSize: '16px', margin: '0 0 6px' },
  storeCity: { color: '#aaaaaa', fontSize: '13px', margin: '2px 0' },
  storePhone: { color: '#aaaaaa', fontSize: '13px', margin: '2px 0' },
  storeRange: { color: '#888', fontSize: '12px', margin: '4px 0 0' },
  liveBadge: { padding: '4px 12px', borderRadius: '20px', color: '#fff', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  mapLink: { display: 'inline-block', marginTop: '10px', color: '#d4580a', fontWeight: '600', fontSize: '13px', textDecoration: 'none' },
};

export default StoreLocator;
