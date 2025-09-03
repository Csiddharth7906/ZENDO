import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        
        // Check for Google OAuth success redirect
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'success') {
          console.log('Google OAuth success detected');
          // Remove the auth parameter from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        const res = await api.get('/auth/me');
        
        if (res.data && res.data.data && res.data.data.user) {
          console.log('User authenticated:', res.data.data.user);
          setUser(res.data.data.user);
        } else if (res.data && res.data.user) {
          console.log('User authenticated (direct):', res.data.user);
          setUser(res.data.user);
        } else {
          console.log('No user data received. Response:', res.data);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error.response?.status, error.response?.data);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Sending login request...');
      const res = await api.post('/auth/login', { email, password });
      console.log('Login response status:', res.status);
      console.log('Login response data:', res.data);
      
      if (res.status === 200 && res.data) {
        if (res.data.data && res.data.data.user) {
          setUser(res.data.data.user);
          console.log('User state updated from login response:', res.data.data.user);
          
          return { 
            success: true, 
            user: res.data.data.user
          };
        } else {
          // Wait a moment for cookie to be set, then fetch user data
          console.log('Waiting for cookie to be set...');
          await new Promise(resolve => setTimeout(resolve, 100));
          
          console.log('Fetching user data after login...');
          const userRes = await api.get('/auth/me');
          
          if (userRes.data && userRes.data.data && userRes.data.data.user) {
            setUser(userRes.data.data.user);
            console.log('User state updated from /auth/me:', userRes.data.data.user);
            
            return { 
              success: true, 
              user: userRes.data.data.user
            };
          } else {
            throw new Error('No user data received after login');
          }
        }
      } else {
        throw new Error('Login failed - invalid response');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Failed to log in';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.status === 422) {
          errorMessage = 'Invalid input data';
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection.';
      }
      
      setUser(null);
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      console.log('Sending registration request...');
      const res = await api.post('/auth/register', { name, email, password });
      
      if (res.status === 200 || res.status === 201) {
        console.log('Registration response:', res.data);
        if (res.data && res.data.data && res.data.data.user) {
          setUser(res.data.data.user);
          return { success: true, user: res.data.data.user };
        } else if (res.data && res.data.user) {
          setUser(res.data.user);
          return { success: true, user: res.data.user };
        } else {
          // Fetch user data if not included in registration response
          const userRes = await api.get('/auth/me');
          if (userRes.data && userRes.data.data && userRes.data.data.user) {
            setUser(userRes.data.data.user);
            return { success: true, user: userRes.data.data.user };
          } else {
            setUser(userRes.data.user);
            return { success: true, user: userRes.data.user };
          }
        }
      } else {
        throw new Error('Registration failed - invalid response');
      }
      
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        if (error.response.status === 422) {
          errorMessage = 'Invalid input data or email already exists';
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection.';
      }
      
      setUser(null);
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out...');
      await api.post('/auth/logout');
      console.log('Logout request completed');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with cleanup even if logout request fails
    } finally {
      // Clear user data (backend will clear the cookie)
      setUser(null);
      console.log('User state cleared');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};