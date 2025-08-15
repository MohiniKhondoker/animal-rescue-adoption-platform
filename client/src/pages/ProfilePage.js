import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div>Not logged in.</div>;

  return (
    <div>
      <h2>My Profile</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><strong>Name:</strong> {user.name}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Role:</strong> {user.role}</li>
      </ul>
    </div>
  );
}
