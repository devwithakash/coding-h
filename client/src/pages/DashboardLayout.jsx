import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/api';
import CategoryList from '../components/CategoryList';
import QuestionList from '../components/QuestionList';
import { needsRevision } from '../utils/revisionCheck';
import AddModal from '../components/AddModal';
import AddCategoryForm from '../components/AddCategoryForm';
import AddQuestionForm from '../components/AddQuestionForm';
import { useMediaQuery } from '../hooks/useMediaQuery';

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'sans-serif',
    backgroundColor: '#fff',
  },
  sidebar: {
    width: '300px',
    borderRight: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    display: 'flex', // Use flex to contain children
    flexDirection: 'column',
    position: 'relative', // This is the anchor for the FAB
    height: '100vh', // Full viewport height
  },
  // --- NEW: This div will hold the header+list and will scroll ---
  sidebarContent: {
    flex: 1, // Takes up all available space, pushing FAB down
    overflowY: 'auto', // ONLY this div will scroll
    position: 'relative', // In case of future relative children
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
  },
  fab: {
    position: 'absolute', // Positioned relative to 'sidebar'
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    fontSize: '28px',
    lineHeight: '50px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    zIndex: 10, // Make sure it's on top
  },
  // Mobile styles
  sidebarMobile: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    // height: '100vh',
  },
  mainContentMobile: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
};

const DashboardLayout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarView, setSidebarView] = useState('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isMobile = useMediaQuery();
  const location = useLocation();
  const isNoteView = location.pathname.split('/').filter(Boolean).length === 2;

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard');
      setAllCategories(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getGlobalRevisionData = () => {
    if (!allCategories.length) {
      return { needsRevisionCount: 0, totalCount: 0 };
    }
    const allQuestions = allCategories.flatMap(cat => cat.questions);
    const needsRevisionCount = allQuestions.filter(needsRevision).length;
    return {
      needsRevisionCount: needsRevisionCount,
      totalCount: allQuestions.length,
    };
  };

  const globalRevisionData = getGlobalRevisionData();
  const selectedCategory = allCategories.find(c => c.id === selectedCategoryId);

  const handleFormSuccess = () => {
    setIsAddModalOpen(false);
    fetchAllData();
  };

  if (loading) return <div>Loading...</div>;

  // --- Helper function to render the sidebar content ---
  // This avoids duplication in the mobile/desktop logic
  const renderSidebarContent = () => (
    <div style={styles.sidebarContent}>
      {sidebarView === 'categories' ? (
        <CategoryList
          categories={allCategories}
          globalRevisionData={globalRevisionData}
          onLogout={handleLogout}
          onCategorySelect={(categoryId) => {
            setSelectedCategoryId(categoryId);
            setSidebarView('questions');
            navigate(`/${categoryId}`);
          }}
        />
      ) : (
        <QuestionList
          category={selectedCategory}
          onBack={() => {
            setSidebarView('categories');
            setSelectedCategoryId(null);
            navigate('/');
          }}
        />
      )}
    </div>
  );

  // --- Helper function to render the FAB ---
  const renderFab = () => (
    <button
      style={styles.fab}
      title={sidebarView === 'categories' ? 'Add Category' : 'Add Question'}
      onClick={() => setIsAddModalOpen(true)}
    >
      +
    </button>
  );

  // --- Helper function to render the Add Modal ---
  const renderAddModal = () => (
    isAddModalOpen && (
      <AddModal
        title={sidebarView === 'categories' ? 'Add New Category' : 'Add New Question'}
        onClose={() => setIsAddModalOpen(false)}
      >
        {sidebarView === 'categories' ? (
          <AddCategoryForm onCategoryAdded={handleFormSuccess} />
        ) : (
          <AddQuestionForm
            categoryId={selectedCategoryId}
            onQuestionAdded={handleFormSuccess}
          />
        )}
      </AddModal>
    )
  );

  // --- MOBILE RENDER ---
  if (isMobile) {
    if (isNoteView) {
      // On mobile, if viewing a note, *only* show the note editor
      return (
        <div style={styles.mainContentMobile}>
          <Outlet context={{ onDataChange: fetchAllData }} />
        </div>
      );
    } else {
      // Otherwise, *only* show the sidebar (Categories or Questions)
      return (
        <div style={styles.sidebarMobile}>
          {renderSidebarContent()}
          {renderFab()}
          {renderAddModal()}
        </div>
      );
    }
  }

  // --- DESKTOP RENDER ---
  return (
    <div style={styles.layout}>
      {/* Sidebar (Always visible on desktop) */}
      <div style={styles.sidebar}>
        {renderSidebarContent()}
        {renderFab()}
      </div>

      {/* Main Content (Always visible on desktop) */}
      <div style={styles.mainContent}>
        <Outlet context={{ onDataChange: fetchAllData }} />
      </div>

      {/* Add Modal (Renders on top of everything) */}
      {renderAddModal()}
    </div>
  );
};

export default DashboardLayout;