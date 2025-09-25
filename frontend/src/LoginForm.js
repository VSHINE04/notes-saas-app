import React, { useState } from 'react';
import api from './api';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Notes SaaS Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f8fafc', 
        borderRadius: '6px',
        border: '1px solid #e2e8f0'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#2d3748', fontSize: '0.875rem' }}>Test Accounts</p>
        <div style={{ fontSize: '0.875rem', color: '#4a5568', lineHeight: '1.5' }}>
          <p style={{ margin: '0.25rem 0' }}><strong>ACME:</strong> admin@acme.test / password</p>
          <p style={{ margin: '0.25rem 0' }}>user@acme.test / password</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Globex:</strong> admin@globex.test / password</p>
          <p style={{ margin: '0.25rem 0' }}>user@globex.test / password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;