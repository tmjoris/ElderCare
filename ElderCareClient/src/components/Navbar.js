import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Menu as MenuIcon, AccountCircle, LocalHospital } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login page
    handleCloseMenu();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#4A90E2',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: '56px', // Reduced height
        transition: 'height 0.3s ease',
      }}
    >
      <Toolbar
        sx={{
          minHeight: '56px',
          paddingX: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Sidebar Toggle Button */}
        {isAuthenticated && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
            onClick={onToggleSidebar}
            sx={{
              mr: 2,
              transition: 'transform 0.2s ease',
              transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0)',
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* App Logo or Brand Name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospital sx={{ fontSize: '28px', marginRight: '8px' }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            ElderCare System
          </Typography>
        </Box>

        {/* User Menu */}
        {isAuthenticated && (
          <Box>
            <IconButton
              size="large"
              aria-label="User Account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
