import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ProtectedRoute from './components/ProtectedRoute';

// --- We are replacing DashboardPage with this new Layout ---
import DashboardLayout from './pages/DashboardLayout';
import NoteEditor from './components/NoteEditor'; // <-- We'll use this

// Simple placeholder components for the main content area
const WelcomeMessage = () => (
  <div style={{ padding: '40px', textAlign: 'center', color: '#555' }}>
    <h2>Welcome!</h2>
    <p>Select a category from the sidebar to get started.</p>
  </div>
);
const QuestionSelectMessage = () => (
  <div style={{ padding: '40px', textAlign: 'center', color: '#555' }}>
    <h2>Select a Question</h2>
    <p>Choose a question from the list to view or edit its notes.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* --- New Protected Routes --- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* / */}
          <Route index element={<WelcomeMessage />} />
          
          {/* /:categoryId */}
          <Route path=":categoryId" element={<QuestionSelectMessage />} />
          
          {/* /:categoryId/:questionId */}
          <Route path=":categoryId/:questionId" element={<NoteEditor />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;