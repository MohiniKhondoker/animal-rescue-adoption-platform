import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [complaintMsg, setComplaintMsg] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { add } = useCart();
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory, query);
  }, [selectedCategory, query]);

  async function fetchProducts(category, q) {
    try {
      const params = {};
      if (category) params.category = category;
      if (q && q.trim()) params.q = q.trim();
      const res = await axios.get('/products/all', { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get('/products/categories');
      setCategories(res.data);
    } catch (e) {
      // ignore
    }
  }

  // Logout handled via Navbar only

  const submitComplaint = async () => {
    if (!complaintMsg.trim()) {
      alert('Please enter a complaint message');
      return;
    }
    try {
      await axios.post('/complaints', { message: complaintMsg });
      alert('Complaint sent!');
      setComplaintMsg('');
    } catch (err) {
      alert('Failed to send complaint');
    }
  };

  return (
    <div>
      <h2>Available Products</h2>
      <div style={{ marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
        <label>
          Category:{' '}
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <input
          type="text"
          placeholder="Search by name or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
  {/* Navbar handles user info & logout */}
      {products.length === 0 && <p>No products available.</p>}
      <ul>
        {products.map(p => (
          <li key={p._id} style={{ marginBottom: '20px' }}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>
              <strong>Amount:</strong> {p.amount} Taka
            </p>
            <p><strong>Category:</strong> {p.category || 'General'}</p>
            <p><strong>Seller:</strong> {p.sellerId?.name || 'Unknown'}</p>
            {p.imageUrl && (
              <img
                src={`http://localhost:5000/${p.imageUrl}`}
                alt={p.name}
                width="150"
                style={{ border: '1px solid #ccc', padding: '5px' }}
              />
            )}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => navigate('/product', { state: { product: p } })}>
                View Details
              </button>
              {p.isSold ? (
                <span style={{ marginLeft: 12, color: 'red', fontWeight: 'bold' }}>SOLD</span>
              ) : (
                <button onClick={() => add(p, 1)} style={{ marginLeft: 8 }}>Add to Cart</button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <h3>Submit a Complaint</h3>
      <input
        type="text"
        value={complaintMsg}
        onChange={e => setComplaintMsg(e.target.value)}
        placeholder="Your complaint"
      />
      <button onClick={submitComplaint}>Submit Complaint</button>
    </div>
  );
}
