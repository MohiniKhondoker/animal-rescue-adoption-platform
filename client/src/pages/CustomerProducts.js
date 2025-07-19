import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [complaintMsg, setComplaintMsg] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get('/products/all');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

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
      <p>
        Welcome, {user?.name}{' '}
        <button onClick={handleLogout}>Logout</button>
      </p>
      {products.length === 0 && <p>No products available.</p>}
      <ul>
        {products.map(p => (
          <li key={p._id} style={{ marginBottom: '20px' }}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>
              <strong>Amount:</strong> {p.amount} Taka
            </p>
            <p><strong>Seller:</strong> {p.sellerId?.name || 'Unknown'}</p>
            {p.imageUrl && (
              <img
                src={`http://localhost:5000/${p.imageUrl}`}
                alt={p.name}
                width="150"
                style={{ border: '1px solid #ccc', padding: '5px' }}
              />
            )}
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
