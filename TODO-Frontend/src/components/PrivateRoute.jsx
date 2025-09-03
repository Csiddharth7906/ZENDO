import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute() {
  const { user, loading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Debug logging
  console.log('PrivateRoute - User:', user);
  console.log('PrivateRoute - Is Authenticated:', !!user);
  
  // Check if user is authenticated (no localStorage check needed with cookies)
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}