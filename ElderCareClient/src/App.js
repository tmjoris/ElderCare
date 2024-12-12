import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import './styles/global.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CaregiverDashboardPage from './pages/CaregiverDashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientAppointments from './pages/PatientAppointments';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import ProgressReportPage from './pages/ProgressReportPage';
import PrescriptionsAndMedicationPage from './pages/PrescriptionsAndMedicationPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ToastNotification } from './ToastConfig';

function AppContent() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar starts collapsed

  const isAuthenticated = localStorage.getItem('mockToken');
  const userRole = localStorage.getItem('mockRole') || 'guest';

  const hideSidebarAndNavbar = ['/login', '/signup'].includes(location.pathname);

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={isAuthenticated && userRole === 'doctor' ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/caregiver-dashboard"
            element={isAuthenticated && userRole === 'caregiver' ? <CaregiverDashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/patient-dashboard"
            element={isAuthenticated && userRole === 'patient' ? <UserDashboardPage /> : <Navigate to="/login" />}
          />
          {/* Core Functionality Routes */}
          {isAuthenticated && (
            <>
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/patient-appointments" element={<PatientAppointments/>}/>
              <Route path="/medical-records" element={<MedicalRecordsPage />} />
              <Route path="/progress-report" element={<ProgressReportPage />} />
              <Route path="/prescriptions-medication" element={<PrescriptionsAndMedicationPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </>
          )}
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
