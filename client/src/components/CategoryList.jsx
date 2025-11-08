import React from 'react';
import { needsRevision } from '../utils/revisionCheck';

const styles = {
  list: {
    // flex: 1 and overflowY are GONE.
    padding: '10px 0',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    textDecoration: 'none',
    color: '#333',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff', // Add a solid background
    position: 'sticky', // Make the header stick to the top
    top: 0,
    zIndex: 1,
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  revisionSummary: {
    fontSize: '14px',
    color: '#555',
    margin: '5px 0 0 0',
  },
  badge: {
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
};

const CategoryList = ({ categories, globalRevisionData, onLogout, onCategorySelect }) => {
  
  const getCategoryNeedsRevisionCount = (category) => {
    return category.questions.filter(needsRevision).length;
  };

  return (
    // The 100% height wrapper is GONE. We use a Fragment.
    <>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h2>Categories</h2>
          <p style={styles.revisionSummary}>
            <strong>{globalRevisionData.needsRevisionCount}</strong> to revise
          </p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </div>
      <div style={styles.list}>
        {categories.map((cat) => {
          const unrevisedCount = getCategoryNeedsRevisionCount(cat);
          return (
            <div
              key={cat.id}
              style={styles.listItem}
              onClick={() => onCategorySelect(cat.id)}
            >
              <span>{cat.name}</span>
              {unrevisedCount > 0 && (
                <span style={styles.badge}>{unrevisedCount}</span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CategoryList;