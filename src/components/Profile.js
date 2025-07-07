import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const users = await response.json();
      setUser(users[0]); 
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading user profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">Error: {error}</div>
        <button onClick={handleBackToDashboard} className="back-button">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={handleBackToDashboard} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>User Profile</h1>
      </div>
      
      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="profile-info">
          <div className="info-group">
            <label>User ID:</label>
            <span>{user.id}</span>
          </div>
          
          <div className="info-group">
            <label>Name:</label>
            <span>{user.name}</span>
          </div>
          
          <div className="info-group">
            <label>Username:</label>
            <span>{user.username}</span>
          </div>
          
          <div className="info-group">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          
          <div className="info-group">
            <label>Phone:</label>
            <span>{user.phone}</span>
          </div>
          
          <div className="info-group">
            <label>Website:</label>
            <span>{user.website}</span>
          </div>
          
          <div className="info-group">
            <label>Address:</label>
            <span>
              {user.address.street}, {user.address.suite}<br />
              {user.address.city}, {user.address.zipcode}
            </span>
          </div>
          
          <div className="info-group">
            <label>Company:</label>
            <span>{user.company.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;