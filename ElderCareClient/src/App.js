import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import './styles/global.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import CaregiverDashboardPage from './pages/CaregiverDashboardPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ToastNotification } from './ToastConfig';

const useMockAuthentication = true;

// Sidebar toggle state and authentication management
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideSidebarAndNavbar = ['/login', '/signup'].includes(location.pathname);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const userRole = useMockAuthentication
    ? localStorage.getItem('mockRole') || null
    : localStorage.getItem('role') || null;

  const isAuthenticated = userRole !== null;

  useEffect(() => {
    // Redirect to dashboard based on user role
    if (isAuthenticated && location.pathname === '/') {
      navigate(userRole === 'doctor' ? '/dashboard' : '/caregiver-dashboard', { replace: true });
    }
  }, [isAuthenticated, userRole, location.pathname, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Toast notifications for global messages */}
      <ToastNotification />

      {/* Conditional Navbar and Sidebar */}
      {!hideSidebarAndNavbar && isAuthenticated && (
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      )}
      {!hideSidebarAndNavbar && isAuthenticated && (
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      )}

      {/* Main content area */}
      <div
        style={{
          marginLeft: !hideSidebarAndNavbar && isAuthenticated && sidebarOpen ? '240px' : '0',
          padding: '20px',
          transition: 'margin-left 0.3s ease, padding 0.3s ease',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Role-Based Dashboards */}
          {isAuthenticated && userRole === 'doctor' && (
            <Route path="/dashboard" element={<DashboardPage />} />
          )}
          {isAuthenticated && userRole === 'caregiver' && (
            <Route path="/caregiver-dashboard" element={<CaregiverDashboardPage />} />
          )}

          {/* Core Functionality Routes */}
          {isAuthenticated && (
            <>
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/medical-records" element={<MedicalRecordsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </>
          )}

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </>
  );
};

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
