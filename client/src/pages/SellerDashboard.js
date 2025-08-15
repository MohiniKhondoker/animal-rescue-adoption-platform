import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(''); // amount as string input
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const CATEGORY_OPTIONS = ['Cat', 'Dog', 'Bird', 'Rabbit', 'Fish', 'Reptile', 'Other'];
  const [error, setError] = useState('');
  const [complaintMsg, setComplaintMsg] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get('/products/mine');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !amount.trim()) {
      setError('Please enter valid product name and amount');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
  formData.append('amount', amount);
  if (category) formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      await axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setName('');
      setDescription('');
      setAmount('');
  setImage(null);
  setCategory('');
      setError('');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
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
      <h2>Seller Dashboard</h2>
  {/* Navbar handles logout and user greeting */}

      <h3>Add Product</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount in Taka (e.g. 5000)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <label>
          Category
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="">Select</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <button type="submit">Add Product</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>My Products</h3>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            <strong>{p.name}</strong> - {p.amount} Taka {p.category ? `| ${p.category}` : ''}<br />
            {p.imageUrl && (
              <img
                src={`http://localhost:5000/${p.imageUrl}`}
                alt={p.name}
                width="100"
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
