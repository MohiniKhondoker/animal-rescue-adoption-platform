import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [usersRes, productsRes, complaintsRes] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/admin/products'),
        axios.get('/admin/complaints'),
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setComplaints(complaintsRes.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function promoteUser(id) {
    try {
      await axios.post(`/admin/promote/${id}`);
      alert('User promoted to admin');
      fetchAll();
    } catch (err) {
      alert('Failed to promote user');
    }
  }

  async function deleteUser(id) {
    if (!window.confirm('Are you sure you want to delete this user? This will remove their products too.')) return;
    try {
      await axios.delete(`/admin/user/${id}`);
      alert('User deleted');
      fetchAll();
    } catch (err) {
      alert('Failed to delete user');
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/admin/product/${id}`);
      alert('Product deleted');
      fetchAll();
    } catch (err) {
      alert('Failed to delete product');
    }
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.name} <button onClick={logout}>Logout</button></p>

      <h3>Users</h3>
      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.name} ({u.email}) - Role: {u.role}{' '}
            {u.role !== 'admin' && <button onClick={() => promoteUser(u._id)}>Promote to Admin</button>}
            <button style={{marginLeft: '10px', color: 'red'}} onClick={() => deleteUser(u._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Products</h3>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p.name} - Amount: {p.amount} Taka<br />
            <small>Seller: {p.sellerId?.name || 'Unknown'}</small>
            <button style={{marginLeft: '10px', color: 'red'}} onClick={() => deleteProduct(p._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Complaints</h3>
      <ul>
        {complaints.map(c => (
          <li key={c._id}>
            From: {c.userId?.name || 'Unknown'} ({c.userId?.email || 'No email'}) <br />
            Message: {c.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
