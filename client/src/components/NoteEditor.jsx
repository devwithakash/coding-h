import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useMediaQuery } from '../hooks/useMediaQuery'; // <-- Import the hook

// Styles for the new "Note" format
const styles = {
  editor: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  noteBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 30px',
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
    // height is now set dynamically
    fontSize: '16px',
    lineHeight: 1.6,
    border: 'none',
    outline: 'none',
    padding: '0',
    boxSizing: 'border-box',
    resize: 'none',
    fontFamily: 'inherit',
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
  const isMobile = useMediaQuery(); // <-- Use the hook

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestion = useCallback(async () => {
    if (!questionId) return;
    setLoading(true);
    try {
      const response = await api.get(`/questions/${questionId}`);
      setQuestion(response.data);
    } catch (err) {
      console.error(err);
      navigate(`/${categoryId}`);
    } finally {
      setLoading(false);
    }
  }, [questionId, categoryId, navigate]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleSave = async () => {
    try {
      await api.put(`/questions/${questionId}`, {
        title: question.title,
        url: question.url,
        notes: question.notes,
      });
      onDataChange();
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
      setQuestion(response.data);
      onDataChange();
    } catch (err) {
      console.error('Failed to update revision status:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion(prev => ({ ...prev, [name]: value }));
  };

  if (loading || !question) return <div>Loading notes...</div>;

  // --- Dynamic style for notes input ---
  const notesInputStyle = {
    ...styles.notesInput,
    height: isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 250px)',
  };

  return (
    <div style={styles.editor}>
      <div style={styles.noteBody}>
        <input
          type="text"
          name="title"
          value={question.title}
          onChange={handleChange}
          style={styles.titleInput}
          placeholder="Your Question Title"
        />
        <input
          type="text"
          name="url"
          value={question.url}
          onChange={handleChange}
          style={styles.urlInput}
          placeholder="https://your-link.com"
        />
        <hr style={styles.divider} />
        <textarea
          name="notes"
          value={question.notes}
          onChange={handleChange}
          style={notesInputStyle} // <-- Apply dynamic style
          placeholder="Start writing your notes here..."
        />
      </div>

      <div style={styles.buttonBar}>
        <div style={styles.buttonGroupLeft}>
          <button style={styles.saveButton} onClick={handleSave}>
            Save Changes
          </button>
          <button 
            style={styles.reviseButton(question.status)} 
            onClick={handleMarkRevised}
          >
            {question.status === 'revised' ? '✔ Revised' : 'Mark as Revised'}
          </button>
        </div>
        <button style={styles.deleteButton} onClick={handleDelete}>
          Delete Question
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;