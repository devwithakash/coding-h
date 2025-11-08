import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  useEffect(() => {
    // Read the 'token' from the URL query parameter
    const token = searchParams.get('token');

    if (token) {
      // If a token is found, save it and redirect to the dashboard
      setToken(token);
      navigate('/');
    } else {
      // If no token, something went wrong, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate, setToken]);

  return <div>Loading...</div>;
};

export default AuthCallbackPage;