import React, { useState } from 'react';
import api from '../api/api';

const AddQuestionForm = ({ categoryId, onQuestionAdded }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState(''); // <-- NEW
  const [notes, setNotes] = useState(''); // <-- NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      // Send all the new data to the backend
      await api.post('/questions', { 
        url, 
        categoryId, 
        title, 
        notes 
      });
      
      // Reset all fields
      setUrl('');
      setTitle('');
      setNotes('');
      onQuestionAdded(); // Tell the parent to refresh data
    } catch (err) {
      setError('Failed to add question.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '10px', borderTop: '1px solid #eee' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://leetcode.com/problem..."
          required
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Optional: Question Title (e.g., 'Two Sum')"
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional: Add your notes here..."
          rows={3}
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Link'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddQuestionForm;