import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import ProgressReportPage from './pages/ProgressReportPage';
import PrescriptionsAndMedicationPage from './pages/PrescriptionsAndMedicationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ToastNotification } from './ToastConfig';

function AppContent() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar starts collapsed
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Determine when to hide the sidebar and navbar
  const hideSidebarAndNavbar = ['/login', '/signup'].includes(location.pathname);

  // Sidebar toggle handler
  const toggleSidebar = (state) => setSidebarOpen(state);

  // Fetch user role and authentication status
  useEffect(() => {
    const initialize = async () => {
      try {
        const mockRole = localStorage.getItem('mockRole') || 'guest'; // Fallback to 'guest'
        setUserRole(mockRole);
        setIsAuthenticated(!!localStorage.getItem('mockToken')); // Set auth status based on token
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    initialize();
  }, []);

  // Redirect based on role
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
          <Sidebar isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        </>
      )}

      {/* Main Content Area */}
      <div
        style={{
          marginTop: '64px', // Space below the Navbar
          marginLeft: isAuthenticated && !hideSidebarAndNavbar && sidebarOpen ? '240px' : '60px', // Adjust content based on sidebar state
          padding: '20px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          overflowX: 'hidden',
        }}
      >
        <Routes>
          {/* Authentication Routes */}
          <Route
            path="/"
            element={<Navigate to={handleRoleRedirect()} replace />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Role-Based Dashboards */}
          {isAuthenticated && userRole === 'doctor' && <Route path="/dashboard" element={<DashboardPage />} />}
          {isAuthenticated && userRole === 'caregiver' && (
            <Route path="/caregiver-dashboard" element={<CaregiverDashboardPage />} />
          )}
          {isAuthenticated && userRole === 'user' && <Route path="/user-dashboard" element={<UserDashboardPage />} />}

          {/* Core Functionality Routes */}
          {isAuthenticated && (
            <>
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/medical-records" element={<MedicalRecordsPage />} />
              <Route path="/progress-report" element={<ProgressReportPage />} />
              <Route path="/prescriptions-medication" element={<PrescriptionsAndMedicationPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </>
          )}

          {/* Fallback Route */}
          <Route
            path="*"
            element={<Navigate to={handleRoleRedirect()} replace />}
          />
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
