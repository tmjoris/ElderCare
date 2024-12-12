import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  IconButton,
} from '@mui/material';
import {
  Home,
  People,
  Event,
  History,
  Settings,
  Notifications,
  Assignment,
  Medication,
  ChevronRight,
  ChevronLeft,
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onToggleSidebar }) => {
  const location = useLocation();
  const userRole = localStorage.getItem('mockRole') || 'guest'; // Retrieve user role from mock authentication

  // Role-based sidebar item configuration
  const roleBasedItems = {
    doctor: [
      { text: 'Dashboard', icon: <Home />, path: '/dashboard' },
      { text: 'Patients', icon: <People />, path: '/patients' },
      { text: 'Appointments', icon: <Event />, path: '/appointments' },
      { text: 'Medical Records', icon: <History />, path: '/medical-records' },
      { text: 'Prescriptions & Medication', icon: <Medication />, path: '/prescriptions-medication' },
      { text: 'Progress Report', icon: <Assignment />, path: '/progress-report' },
      { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
      { text: 'Settings', icon: <Settings />, path: '/settings' },
    ],
    caregiver: [
      { text: 'Dashboard', icon: <Home />, path: '/caregiver-dashboard' },
      { text: 'Patients', icon: <People />, path: '/patients' },
      { text: 'Progress Report', icon: <Assignment />, path: '/progress-report' },
      { text: 'Prescriptions & Medication', icon: <Medication />, path: '/prescriptions-medication' },
      { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
      { text: 'Settings', icon: <Settings />, path: '/settings' },
    ],
    patient: [
      { text: 'Dashboard', icon: <Home />, path: '/user-dashboard' },
      { text: 'Appointments', icon: <Event />, path: '/patient-appointments' },
      { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
      { text: 'Settings', icon: <Settings />, path: '/settings' },
    ],
  };

  const sidebarItems = roleBasedItems[userRole] || []; // Default to an empty array for unknown roles

  return (
    <Box
      sx={{
        position: 'fixed', // Ensures Sidebar stays fixed
        height: '100vh', // Full viewport height
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1, // Below Navbar
      }}
    >
      {/* Sidebar Toggle Button */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: isOpen ? '240px' : '60px',
          transform: 'translateY(-50%)',
          zIndex: 1300,
          backgroundColor: '#1E2A38',
          color: '#FFFFFF',
          padding: '8px',
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'left 0.3s ease',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        }}
      >
        <IconButton
          onClick={() => onToggleSidebar(!isOpen)}
          sx={{
            padding: 0,
            fontSize: '20px',
            color: '#FFFFFF',
          }}
        >
          {isOpen ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
        </IconButton>
      </Box>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: isOpen ? 240 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isOpen ? 240 : 60,
            boxSizing: 'border-box',
            backgroundColor: '#1E2A38',
            color: '#FFFFFF',
            overflowX: 'hidden',
            transition: 'width 0.3s ease',
          },
        }}
      >
        <Divider sx={{ borderColor: '#2F3B47' }} />
        {/* Sidebar Items */}
        <List>
          {sidebarItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.text}
              style={{ textDecoration: 'none' }}
              aria-label={item.text}
            >
              <ListItem
                button
                selected={location.pathname === item.path}
                sx={{
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  paddingY: '12px',
                  paddingX: isOpen ? '16px' : '8px',
                  '&.Mui-selected': {
                    backgroundColor: '#2F3B47',
                    color: '#7289DA',
                  },
                  '&:hover': {
                    backgroundColor: '#2F3B47',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    justifyContent: 'center',
                    minWidth: isOpen ? '40px' : 'unset',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isOpen && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                      },
                    }}
                  />
                )}
              </ListItem>
            </NavLink>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
