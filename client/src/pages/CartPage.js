import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, setQuantity, remove, totals } = useCart();
  const navigate = useNavigate();

  if (!items.length) return <div>Your cart is empty.</div>;

  return (
    <div>
      <h2>Your Cart</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((it) => (
          <li key={it._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            {it.imageUrl && (
              <img
                src={`http://localhost:5000/${it.imageUrl}`}
                alt={it.name}
                width="80"
                style={{ marginRight: 12, border: '1px solid #ddd', padding: 2 }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div><strong>{it.name}</strong></div>
              <div>{it.amount}</div>
            </div>
            <span style={{ marginLeft: 8, opacity: 0.8 }}>Qty: 1</span>
            <button onClick={() => remove(it._id)} style={{ marginLeft: 8 }}>Remove</button>
          </li>
        ))}
      </ul>
      <p>
        <strong>Subtotal:</strong> {totals.subtotal.toFixed(2)}
      </p>
      <button onClick={() => navigate('/checkout')}>Checkout</button>
    </div>
  );
}
