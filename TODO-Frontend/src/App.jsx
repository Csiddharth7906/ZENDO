import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { TaskProvider } from './contexts/TaskContext';
import PrivateRoute from './components/PrivateRoute';
import ZendoDashboard from './pages/ZendoDashboard';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <TaskProvider>
            <div className="App">
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route index element={<ZendoDashboard />} />
              </Route>

              {/* Catch all other routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </div>
          </TaskProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
