import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductModal = ({ product, onClose }) => {
  const [addons, setAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get('/addons').then(({ data }) => setAddons(data)).catch(() => {});
  }, []);

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    addToCart({ ...product, selectedAddons });
    toast.success(`${product.title} added!`, { duration: 1500 });
    onClose();
  };

  const total = product.price + selectedAddons.reduce((s, a) => s + a.price, 0);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Image */}
        {product.image
          ? <img src={product.image} alt={product.title} style={styles.img} />
          : <div style={styles.imgPlaceholder}>🍛</div>
        }

        {/* Close */}
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        <div style={styles.body}>
          <span style={styles.category}>{product.category_name}</span>
          <h2 style={styles.title}>{product.title}</h2>
          {product.description && <p style={styles.desc}>{product.description}</p>}
          <p style={styles.price}>₹{product.price}</p>

          {/* Addons */}
          {addons.length > 0 && (
            <div style={styles.addonsSection}>
              <h4 style={styles.addonsTitle}>Add Extras (Optional)</h4>
              {addons.map((addon) => {
                const selected = selectedAddons.find((a) => a.id === addon.id);
                return (
                  <div key={addon.id}
                    style={{ ...styles.addonRow, background: selected ? 'rgba(212,88,10,0.12)' : '#222222', border: `1px solid ${selected ? '#d4580a' : '#2e2e2e'}` }}
                    onClick={() => toggleAddon(addon)}>
                    <div>
                      <span style={styles.addonName}>{addon.title}</span>
                      <span style={styles.addonPrice}> +₹{addon.price}</span>
                    </div>
                    <div style={{ ...styles.checkbox, background: selected ? '#d4580a' : '#1a1a1a', border: `2px solid ${selected ? '#d4580a' : '#444'}` }}>
                      {selected && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={styles.footer}>
            <span style={styles.totalPrice}>Total: ₹{total}</span>
            <button style={styles.addBtn} onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  modal: { background: '#1a1a1a', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', border: '1px solid #2e2e2e' },
  img: { width: '100%', height: '220px', objectFit: 'cover', borderRadius: '20px 20px 0 0' },
  imgPlaceholder: { width: '100%', height: '180px', background: '#222222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', borderRadius: '20px 20px 0 0' },
  closeBtn: { position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
  body: { padding: '20px' },
  category: { fontSize: '11px', color: '#d4580a', fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: '22px', fontWeight: '800', color: '#f5f5f5', margin: '6px 0' },
  desc: { color: '#aaaaaa', fontSize: '14px', lineHeight: 1.6, margin: '0 0 10px' },
  price: { color: '#d4580a', fontWeight: '800', fontSize: '22px', margin: '0 0 16px' },
  addonsSection: { marginBottom: '16px' },
  addonsTitle: { color: '#f5f5f5', fontWeight: '700', marginBottom: '10px', fontSize: '15px' },
  addonRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer' },
  addonName: { fontWeight: '600', fontSize: '14px', color: '#f5f5f5' },
  addonPrice: { color: '#d4580a', fontSize: '13px', fontWeight: '600' },
  checkbox: { width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2e2e2e', paddingTop: '16px' },
  totalPrice: { fontWeight: '800', fontSize: '20px', color: '#f5f5f5' },
  addBtn: { padding: '12px 28px', background: '#d4580a', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' },
};

export default ProductModal;
