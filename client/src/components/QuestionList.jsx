import React from 'react';
import { NavLink } from 'react-router-dom';
import { needsRevision } from '../utils/revisionCheck';

const styles = {
  list: {
    // flex: 1 and overflowY are GONE.
    padding: '10px 0',
  },
  navLink: {
    display: 'block',
    padding: '15px 20px',
    textDecoration: 'none',
    color: '#333',
    borderBottom: '1px solid #eee',
  },
  navLinkActive: {
    backgroundColor: '#eef2ff',
    color: '#007bff',
    fontWeight: 'bold',
  },
  navLinkAlert: {
    backgroundColor: '#fffbeb',
    color: '#b45309',
    fontWeight: 'bold',
  },
  header: {
    padding: '20px',
    borderBottom: '1Mpx solid #ccc',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff', // Add a solid background
    position: 'sticky', // Make the header stick to the top
    top: 0,
    zIndex: 1,
  },
  backButton: {
    marginRight: '10px',
    background: 'transparent',
    border: '1px solid #ccc',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

const QuestionList = ({ category, onBack }) => {
  if (!category) return null;

  const sortedQuestions = [...category.questions].sort((a, b) => {
    const aNeeds = needsRevision(a);
    const bNeeds = needsRevision(b);
    if (aNeeds && !bNeeds) return -1;
    if (!aNeeds && bNeeds) return 1;
    return 0;
  });

  return (
    // The 100% height wrapper is GONE. We use a Fragment.
    <>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>&larr;</button>
        <h3>{category.name}</h3>
      </div>
      <div style={styles.list}>
        {sortedQuestions.map((q) => {
          const isUnrevised = needsRevision(q);
          return (
            <NavLink
              key={q.id}
              to={`/${category.id}/${q.id}`}
              style={({ isActive }) => {
                let linkStyle = { ...styles.navLink };
                if (isActive) linkStyle = { ...linkStyle, ...styles.navLinkActive };
                if (isUnrevised && !isActive) {
                   linkStyle = { ...linkStyle, ...styles.navLinkAlert };
                }
                return linkStyle;
              }}
            >
              {q.title}
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default QuestionList;