import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useMediaQuery } from '../hooks/useMediaQuery';

// --- Import the new Markdown libraries ---
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import { Katex } from 'react-katex';
import remarkGfm from 'remark-gfm';

const styles = {
  editor: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  mobileHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    background: 'transparent',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '5px 10px',
    marginRight: '15px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  noteBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 30px',
  },
  // --- New style for the Markdown View ---
  markdownView: {
    fontSize: '16px',
    lineHeight: 1.6,
  },
  titleInput: {
    width: '100%',
    fontSize: '28px',
    fontWeight: 'bold',
    border: 'none',
    outline: 'none',
    padding: '10px 0',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  urlInput: {
    width: '100%',
    fontSize: '14px',
    color: '#007bff',
    border: 'none',
    outline: 'none',
    padding: '0',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    marginBottom: '10px',
  },
  notesInput: {
    width: '100%',
    fontSize: '16px',
    lineHeight: 1.6,
    border: '1px solid #ddd', // Add a border for edit mode
    borderRadius: '4px',
    outline: 'none',
    padding: '10px',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'monospace', // Better for code
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #eee',
    margin: '10px 0',
  },
  buttonBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 30px',
    borderTop: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  buttonGroupLeft: {
    display: 'flex',
    gap: '10px',
  },
  // --- New/Updated Button Styles ---
  editButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  reviseButton: (status) => ({
    backgroundColor: status === 'revised' ? '#17a2b8' : '#6b7280',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  }),
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

const NoteEditor = () => {
  const { questionId, categoryId } = useParams();
  const { onDataChange } = useOutletContext();
  const navigate = useNavigate();
  const isMobile = useMediaQuery();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- New state for View/Edit mode ---
  const [isEditing, setIsEditing] = useState(false);
  // Temporary state to hold edits
  const [editCache, setEditCache] = useState({ title: '', url: '', notes: '' });

  const fetchQuestion = useCallback(async () => {
    if (!questionId) return;
    setLoading(true);
    setIsEditing(false); // Default to View mode on load
    try {
      const response = await api.get(`/questions/${questionId}`);
      setQuestion(response.data);
      // Set the cache for when user clicks edit
      setEditCache({
        title: response.data.title,
        url: response.data.url,
        notes: response.data.notes,
      });
    } catch (err) {
      console.error(err);
      navigate(`/${categoryId}`);
    } finally {
      setLoading(false);
    }
  }, [questionId, categoryId, navigate]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]); // Re-fetch when questionId changes

  const handleSave = async () => {
    try {
      await api.put(`/questions/${questionId}`, editCache);
      onDataChange(); // Refresh sidebar
      setQuestion(prev => ({ ...prev, ...editCache })); // Update local state
      setIsEditing(false); // Switch back to View mode
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/questions/${questionId}`);
        onDataChange();
        navigate(`/${categoryId}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMarkRevised = async () => {
    try {
      const response = await api.put(`/revise/${questionId}`);
      setQuestion(response.data); // Update status locally
      onDataChange(); // Refresh sidebar
    } catch (err) {
      console.error('Failed to update revision status:', err);
    }
  };

  // Update the edit cache as the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditCache(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle canceling an edit
  const handleCancelEdit = () => {
    setEditCache({ // Reset cache to original
      title: question.title,
      url: question.url,
      notes: question.notes,
    });
    setIsEditing(false); // Switch to View mode
  };

  if (loading || !question) return <div>Loading notes...</div>;

  const notesInputStyle = {
    ...styles.notesInput,
    height: isMobile ? 'calc(100vh - 350px)' : 'calc(100vh - 300px)',
  };

  return (
    <div style={styles.editor}>
      {isMobile && (
        <div style={styles.mobileHeader}>
          <button style={styles.backButton} onClick={() => navigate(`/${categoryId}`)}>
            &larr; Back to List
          </button>
        </div>
      )}

      {/* --- Main Content: View or Edit --- */}
      <div style={styles.noteBody}>
        {isEditing ? (
          // --- EDIT MODE ---
          <>
            <input
              type="text"
              name="title"
              value={editCache.title}
              onChange={handleChange}
              style={styles.titleInput}
            />
            <input
              type="text"
              name="url"
              value={editCache.url}
              onChange={handleChange}
              style={styles.urlInput}
            />
            <hr style={styles.divider} />
            <textarea
              name="notes"
              value={editCache.notes}
              onChange={handleChange}
              style={notesInputStyle}
            />
            <p style={{fontSize: '12px', color: '#555'}}>
              Markdown and LaTeX math are supported. e.g., `**bold**`, ` `code` `, `$\sum_i i$`
            </p>
          </>
        ) : (
          // --- VIEW MODE (Default) ---
          <>
            <h1 style={styles.titleInput}>{question.title}</h1>
            <a href={question.url} target="_blank" rel="noopener noreferrer" style={styles.urlInput}>
              {question.url}
            </a>
            <hr style={styles.divider} />
            <div style={styles.markdownView}>
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                components={{
                  math: ({ value }) => <Katex math={value} />,
                  inlineMath: ({ value }) => <Katex math={value} />
                }}
              >
                {question.notes || "*No notes for this question yet. Click 'Edit' to add some!*"}
              </ReactMarkdown>
            </div>
          </>
        )}
      </div>

      {/* --- Button Bar --- */}
      <div style={styles.buttonBar}>
        <div style={styles.buttonGroupLeft}>
          {isEditing ? (
            // --- Buttons for Edit Mode ---
            <>
              <button style={styles.saveButton} onClick={handleSave}>
                Save Changes
              </button>
              <button style={{...styles.reviseButton('cancel')}} onClick={handleCancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            // --- Buttons for View Mode ---
            <>
              <button style={styles.editButton} onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button 
                style={styles.reviseButton(question.status)} 
                onClick={handleMarkRevised}
              >
                {question.status === 'revised' ? '✔ Revised' : 'Mark as Revised'}
              </button>
            </>
          )}
        </div>
        <button style={styles.deleteButton} onClick={handleDelete}>
          Delete Question
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;