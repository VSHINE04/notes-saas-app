import React, { useState, useEffect } from 'react';
import api from './api';

const InviteForm = ({ tenantSlug, onInvited }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post(`/tenants/${tenantSlug}/invite`, { email, role });
      setMessage('Invitation created. User can log in with password "password".');
      setEmail('');
      setRole('member');
      onInvited && onInvited();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ 
      background: '#f8fafc', 
      padding: '1rem', 
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      marginTop: '1rem'
    }}>
      {message && <div className="alert alert-warning">{message}</div>}
      <div className="form-group">
        <label>User Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" required />
      </div>
      <div className="form-group">
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' }}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Sending Invite...' : 'Send Invite'}
      </button>
    </form>
  );
};

const Notes = ({ user, onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      setError('Failed to fetch notes');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/notes', { title, content });
      setTitle('');
      setContent('');
      fetchNotes(); // Refresh notes list
    } catch (error) {
      if (error.response?.data?.limitReached) {
        setError(error.response.data.message);
      } else {
        setError('Failed to create note');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/notes/${noteId}`);
        fetchNotes(); // Refresh notes list
      } catch (error) {
        setError('Failed to delete note');
      }
    }
  };

  const handleUpgrade = async () => {
    if (window.confirm('Upgrade to Pro plan?')) {
      try {
        await api.post(`/tenants/${user.tenant.slug}/upgrade`);
        // Force a page reload to get updated user info from the server
        window.location.reload();
      } catch (error) {
        setError('Failed to upgrade. Only admins can upgrade subscriptions.');
      }
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
  };

  const canUpgrade = user.role === 'admin' && user.tenant.plan === 'free';
  const isFreePlanLimitReached = user.tenant.plan === 'free' && notes.length >= 3;

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Notes Dashboard</h1>
          <div className="tenant-info">
            {user.tenant.name} ({user.tenant.plan.toUpperCase()}) - {user.email} ({user.role})
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-danger" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
          Logout
        </button>
      </div>

      <div className="notes-container">
        {error && <div className="alert alert-danger">{error}</div>}

        {isFreePlanLimitReached && (
          <div className="alert alert-warning">
            <strong>Plan Limit Reached!</strong> Free plan allows maximum 3 notes. 
            {canUpgrade && (
              <button 
                onClick={handleUpgrade} 
                className="btn btn-success" 
                style={{ marginLeft: '0.5rem', width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                Upgrade to Pro
              </button>
            )}
            {!canUpgrade && ' Contact your admin to upgrade.'}
          </div>
        )}

        {user.role === 'admin' && (
          <div className="note-form">
            <h3>Invite User</h3>
            <InviteForm tenantSlug={user.tenant.slug} onInvited={fetchNotes} />
          </div>
        )}

        <div className="note-form">
          <h3>Create New Note</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="4"
                placeholder="Write your note content here..."
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem', resize: 'vertical', minHeight: '100px' }}
              />
            </div>
            
            <button type="submit" className="btn" disabled={loading || isFreePlanLimitReached}>
              {loading ? 'Creating...' : 'Create Note'}
            </button>
          </form>
        </div>

        <div>
          <h3>Your Notes ({notes.length}{user.tenant.plan === 'free' && notes.length > 0 ? '/3' : ''})</h3>
          {notes.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 1rem',
              color: '#6b7280'
            }}>
              <p>No notes yet. Create your first note above!</p>
            </div>
          ) : (
            <div className="note-grid">
              {notes.map(note => (
                <div key={note._id} className="note-item">
                  <h4>{note.title}</h4>
                  <p>{note.content}</p>
                  <small>Created: {new Date(note.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</small>
                  <div className="note-actions">
                    <button 
                      onClick={() => handleDelete(note._id)}
                      className="btn btn-danger"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: 'auto' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;