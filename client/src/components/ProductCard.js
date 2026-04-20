import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductModal from './ProductModal';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cartItem = cart.find((item) => item.id === product.id);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.title} added to cart! 🛒`, { duration: 1400 });
  };

  return (
    <>
      <div
        className="card-hover glow-card"
        style={styles.card}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="img-zoom" style={styles.imgWrap} onClick={() => setShowModal(true)}>
          {product.image
            ? <img src={product.image} alt={product.title} style={styles.img}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/260x160/1a1a1a/d4580a?text=%F0%9F%8D%9B'; }} />
            : <div style={styles.imgPlaceholder}>🍛</div>
          }
          <div style={{ ...styles.viewOverlay, opacity: hovered ? 1 : 0 }}>
            <span style={styles.viewText}>👁 View Details</span>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <span style={styles.category}>{product.category_name}</span>
          <h3 style={styles.title}>{product.title}</h3>
          {product.description && <p style={styles.desc}>{product.description}</p>}
          <div style={styles.footer}>
            <span style={styles.price}>₹{product.price}</span>
            {!cartItem ? (
              <button className="add-btn" style={styles.addBtn} onClick={handleAdd}>+ Add</button>
            ) : (
              <div style={styles.qtyRow}>
                <button className="qty-btn" style={styles.qtyBtn}
                  onClick={() => { if (cartItem.quantity === 1) removeFromCart(product.id); else updateQuantity(product.id, cartItem.quantity - 1); }}>−</button>
                <span style={styles.qty}>{cartItem.quantity}</span>
                <button className="qty-btn" style={styles.qtyBtn}
                  onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}>+</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && <ProductModal product={product} onClose={() => setShowModal(false)} />}
    </>
  );
};

const styles = {
  card: {
    background: '#1a1a1a',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #2e2e2e',
  },
  imgWrap: {
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
    height: '160px',
  },
  img: { width: '100%', height: '160px', objectFit: 'cover', display: 'block' },
  imgPlaceholder: {
    width: '100%', height: '160px', background: '#222222',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px',
  },
  viewOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    paddingBottom: '12px', transition: 'opacity 0.25s ease',
  },
  viewText: { color: '#fff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.3px' },
  content: { padding: '14px 16px' },
  category: {
    fontSize: '10px', color: '#d4580a', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '1px',
  },
  title: { margin: '5px 0 4px', fontSize: '15px', fontWeight: '700', color: '#f5f5f5', lineHeight: 1.3 },
  desc: {
    fontSize: '12px', color: '#777', margin: '0 0 10px', lineHeight: '1.5',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#ff8c00', fontWeight: '800', fontSize: '19px', letterSpacing: '-0.5px' },
  addBtn: {
    padding: '7px 18px', color: '#fff', border: 'none',
    borderRadius: '20px', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
  },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: {
    width: '30px', height: '30px', border: '2px solid #d4580a', borderRadius: '50%',
    background: 'transparent', color: '#d4580a', cursor: 'pointer',
    fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  qty: { fontWeight: '800', minWidth: '22px', textAlign: 'center', color: '#f5f5f5', fontSize: '15px' },
};

export default ProductCard;
