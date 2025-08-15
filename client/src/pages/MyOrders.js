import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get('/orders/mine');
        setOrders(res.data || []);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refresh = async () => {
    const res = await axios.get('/orders/mine');
    setOrders(res.data || []);
  };

  const cancelOrder = async (id) => {
    try {
      await axios.post(`/orders/${id}/cancel`);
      await refresh();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {orders.map((o) => (
          <li key={o._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 10 }}>
            <div><strong>Order ID:</strong> {o._id}</div>
            <div><strong>Status:</strong> {o.status}</div>
            <div><strong>Placed:</strong> {new Date(o.createdAt).toLocaleString()}</div>
            <div><strong>Items:</strong> {o.items?.length || 0}</div>
            <div><strong>Total:</strong> {Number(o.total || 0).toFixed(2)}</div>
            {Array.isArray(o.items) && o.items.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div><strong>Products</strong></div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {o.items.map((it, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      {it.imageUrl && (
                        <img
                          src={`http://localhost:5000/${it.imageUrl}`}
                          alt={it.name}
                          width="60"
                          style={{ marginRight: 10, border: '1px solid #ddd', padding: 2 }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div>{it.name}</div>
                        <div>{it.amount} × {it.quantity || 1}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link to={`/track/${o._id}`}>Track details</Link>
              {o.status !== 'cancelled' && (
                <button onClick={() => cancelOrder(o._id)} style={{ color: 'red' }}>Cancel order</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
