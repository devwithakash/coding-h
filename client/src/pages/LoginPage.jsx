import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/api';

// Define our styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'sans-serif',
    backgroundColor: '#f4f7f6',
  },
  form: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    width: '350px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    margin: '8px 0 20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  googleButton: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#555',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
  divider: {
    margin: '30px 0',
    border: 0,
    borderTop: '1px solid #eee',
  },
  link: {
    marginTop: '20px',
    textAlign: 'center',
  },
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.accessToken);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>

        <hr style={styles.divider} />

       <a href={`${API_BASE_URL}/auth/google`} style={{ textDecoration: 'none' }}>
          <button style={styles.googleButton}>
            {/* Simple Google Icon */}
            {console.log(API_BASE_URL)}
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48">
              <g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g>
            </svg>
            Sign in with Google
          </button>
        </a>
        
        <div style={styles.link}>
          <Link to="/register">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;