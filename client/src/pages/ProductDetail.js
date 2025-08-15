import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { add } = useCart();
  const p = state?.product;

  if (!p) return <div>Product not found.</div>;

  const addToCart = () => {
    add(p, 1);
    navigate('/cart');
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{p.name}</h2>
      {p.imageUrl && (
        <img src={`http://localhost:5000/${p.imageUrl}`} alt={p.name} width="250" />
      )}
      <p>{p.description}</p>
      <p><strong>Category:</strong> {p.category || 'General'}</p>
      <p><strong>Amount:</strong> {p.amount} Taka</p>
      <h3>Adopter/Seller info</h3>
      <p><strong>Name:</strong> {p.sellerId?.name || 'Unknown'}</p>
      <p><strong>Email:</strong> {p.sellerId?.email || 'N/A'}</p>
      
      {p.isSold ? (
        <div style={{ color: 'red', fontWeight: 'bold' }}>SOLD</div>
      ) : (
        <button onClick={addToCart}>Add to cart</button>
      )}
    </div>
  );
}
