import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 0,
    achievements: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Set default axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch user data and stats
        const [userRes, statsRes] = await Promise.all([
          axios.get('https://zendo-1.onrender.com/api/auth/me'),
          axios.get('https://zendo-1.onrender.com/api/user/me')
        ]);

        setUser(userRes.data.data);
        if (statsRes.data.data) {
          setStats(statsRes.data.data);
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('https://zendo-1.onrender.com/api/auth/register', userData);
      const { token, data } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await axios.post('https://zendo-1.onrender.com/api/auth/login', credentials);
      const { token, data } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(data.user);
      
      // Fetch user stats after login
      const statsRes = await axios.get('https://zendo-1.onrender.com/api/user/me');
      if (statsRes.data.data) {
        setStats(statsRes.data.data);
      }
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset state
    setUser(null);
    setStats({
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      streak: 0,
      achievements: []
    });
    
    // Redirect to login
    navigate('/login');
  };

  // Update user stats
  const updateStats = (newStats) => {
    setStats(prev => ({
      ...prev,
      ...newStats
    }));
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        stats,
        loading, 
        error, 
        register, 
        login, 
        logout,
        updateStats
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
