import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on auth pages for a cleaner look
  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const cartCount = items.reduce((sum, it) => sum + (it.quantity || 1), 0);

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: 6,
  };

  const active = (path) => (location.pathname.startsWith(path) ? { background: '#1f6feb' } : {});

  return (
    <nav style={{ background: '#24292f', color: '#fff', padding: '10px 16px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 1200, margin: '0 auto' }}>
        <Link to="/products" style={{ ...linkStyle, fontWeight: 700, fontSize: 18 }}>PetAdopt</Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/products" style={{ ...linkStyle, ...active('/products') }}>Products</Link>
          <Link to="/orders" style={{ ...linkStyle, ...active('/orders') }}>My Orders</Link>
          <Link to="/cart" style={{ ...linkStyle, ...active('/cart') }}>Cart{cartCount ? ` (${cartCount})` : ''}</Link>
          {user?.role === 'seller' && (
            <Link to="/seller" style={{ ...linkStyle, ...active('/seller') }}>Seller</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ ...linkStyle, ...active('/admin') }}>Admin</Link>
          )}
        </div>
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
      <Link to="/profile" style={{ ...linkStyle, ...active('/profile') }}>Profile</Link>
      <span style={{ opacity: 0.85 }}>Hi, {user.name}</span>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{ background: '#c23b22', color: '#fff', border: 0, padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ ...linkStyle, ...active('/login') }}>Login</Link>
              <Link to="/register" style={{ ...linkStyle, ...active('/register') }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
