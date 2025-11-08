import React, { useState } from 'react';
import api from '../api/api';

const AddCategoryForm = ({ onCategoryAdded }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.post('/categories', { name });
      setName('');
      setError('');
      onCategoryAdded(); // Tell the parent to refresh data
    } catch (err) {
      setError('Failed to add category.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add New Category</h4>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        required
      />
      <button type="submit">Add Category</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddCategoryForm;