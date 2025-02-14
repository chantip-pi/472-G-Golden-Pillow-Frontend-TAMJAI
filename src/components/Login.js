// frontend/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:13889/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log('Raw login response:', data); // Log the full response
  
      if (response.ok) {
        console.log('Login successful:', data); // Verify the structure
  
        const userId = data.user.user_id;
        console.log('User ID:', userId); // Ensure this is not null
  
        localStorage.setItem('userId', userId);
  
        // Redirect based on user role
        if (data.user.role === 'client') {
          navigate('/home');
        } else if (data.user.role === 'admin') {
          navigate(`/admin/${userId}`);
        } else if (data.user.role === 'owner') {
          navigate(`/owner/${userId}`);
        } else if (data.user.role === 'packaging staff') {
          navigate(`/packStaff/${userId}`)
        } else if (data.user.role === 'delivering staff') {
          navigate(`/deliverStaff/${userId}`)
        }
        
      } else {
        alert(data.message); // Show alert for invalid login
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="rectangle">
        <h1 className="golden-pillow">Golden Pillow</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-field"
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-field"
            required
          />

          <div className="sign-in-btn-container">
            <button type="submit" className="sign-in-btn">Sign In</button>
          </div>
        </form>
        <div className="link-container">
          Don’t have an account yet? <a href="/register">Register here</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
