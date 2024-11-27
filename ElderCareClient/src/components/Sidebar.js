import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  Divider,
  Box,
} from '@mui/material';
import { Home, People, Event, History, Settings, Notifications, Menu, LocalHospital } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (onToggle) onToggle(!collapsed);
  };

  const sidebarItems = [
    { text: 'Dashboard', icon: <Home />, path: '/dashboard' },
    { text: 'Patients', icon: <People />, path: '/patients' },
    { text: 'Appointments', icon: <Event />, path: '/appointments' },
    { text: 'Medical Records', icon: <History />, path: '/medical-records' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 60 : 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 60 : 240,
          boxSizing: 'border-box',
          backgroundColor: '#2C2F33',
          color: '#FFFFFF',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '10px 0',
        }}
      >
        {/* Sidebar Toggle Button */}
        <IconButton
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          sx={{
            color: '#7289DA',
            transition: 'transform 0.3s ease',
          }}
        >
          <Menu />
        </IconButton>

        {/* App Name with Icon */}
        {!collapsed && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              margin: '20px 0',
              color: '#7289DA',
            }}
          >
            <LocalHospital sx={{ marginRight: '8px' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              ElderCare
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Sidebar Items */}
      <List>
        {sidebarItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.text}
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? '#7289DA' : '#FFFFFF',
            })}
            aria-label={item.text}
          >
            <ListItem
              button
              sx={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                paddingY: '12px',
                '&:hover': { backgroundColor: '#3B4149' },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      color: 'inherit',
                    },
                  }}
                />
              )}
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
