import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({ name: '', email: '', address: '', city: '', country: '', postalCode: '' });
  const [loading, setLoading] = useState(false);

  if (!items.length) return <div>Nothing to checkout.</div>;

  const placeOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i._id, quantity: i.quantity || 1 })),
        shipping,
      };
      const res = await axios.post('/orders', payload);
      clear();
      navigate(`/track/${res.data._id}`);
    } catch (e) {
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <div style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
        {['name','email','address','city','country','postalCode'].map((k) => (
          <input key={k} placeholder={k}
            value={shipping[k]}
            onChange={(e) => setShipping({ ...shipping, [k]: e.target.value })}
          />
        ))}
      </div>
      <button disabled={loading} onClick={placeOrder}>{loading ? 'Placing...' : 'Place Order'}</button>
    </div>
  );
}
