import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import './styles/global.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CaregiverDashboardPage from './pages/CaregiverDashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ToastNotification } from './ToastConfig';

function AppContent() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar starts collapsed

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('mockToken'));
  const [userRole, setUserRole] = useState(localStorage.getItem('mockRole') || 'guest');

  useEffect(() => {
    const role = localStorage.getItem('mockRole');
    const token = localStorage.getItem('mockToken');
    setUserRole(role || 'guest');
    setIsAuthenticated(!!token);
  }, []);

  const hideSidebarAndNavbar = ['/login', '/signup'].includes(location.pathname);

  const handleRoleRedirect = () => {
    if (!isAuthenticated) return '/login';
    switch (userRole) {
      case 'doctor':
        return '/dashboard';
      case 'caregiver':
        return '/caregiver-dashboard';
      case 'user':
        return '/user-dashboard';
      default:
        return '/login';
    }
  };

  return (
    <>
      <ToastNotification />
      {!hideSidebarAndNavbar && isAuthenticated && (
        <>
          <Navbar isSidebarOpen={sidebarOpen} />
          <Sidebar isOpen={sidebarOpen} onToggleSidebar={setSidebarOpen} />
        </>
      )}
      <div
        style={{
          marginTop: '64px',
          marginLeft: isAuthenticated && !hideSidebarAndNavbar && sidebarOpen ? '240px' : '60px',
          padding: '20px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          overflowX: 'hidden',
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<Navigate to={handleRoleRedirect()} replace />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={isAuthenticated && userRole === 'doctor' ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/caregiver-dashboard" element={isAuthenticated && userRole === 'caregiver' ? <CaregiverDashboardPage /> : <Navigate to="/login" />} />
          <Route path="/user-dashboard" element={isAuthenticated && userRole === 'user' ? <UserDashboardPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
