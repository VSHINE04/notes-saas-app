import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import Notes from './Notes';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8fafc',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#4a5568'
        }}>
          <h2 style={{ margin: 0, fontWeight: 400 }}>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        {!user ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <Notes user={user} onLogout={handleLogout} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;