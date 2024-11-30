import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { AccountCircle, LocalHospital } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = !!localStorage.getItem('mockToken'); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem('mockToken');
    localStorage.removeItem('mockRole');
    localStorage.removeItem('mockId');
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
        zIndex: (theme) => theme.zIndex.drawer + 2, // Ensure Navbar stays on top of Sidebar
        transition: 'width 0.3s ease, margin-left 0.3s ease',
        marginLeft: isSidebarOpen ? '240px' : '60px', // Adjust margin to align with Sidebar
        width: isSidebarOpen ? 'calc(100% - 240px)' : 'calc(100% - 60px)', // Dynamically adjust width
      }}
    >
      <Toolbar
        sx={{
          minHeight: '64px',
          paddingX: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* App Name or Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospital sx={{ fontSize: '28px', marginRight: '8px', color: '#FFFFFF' }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            ElderCare System
          </Typography>
        </Box>

        {/* Profile Menu */}
        {isAuthenticated && (
          <Box>
            <IconButton
              size="large"
              aria-label="User Account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenMenu}
              color="inherit"
              sx={{
                marginLeft: 'auto',
              }}
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
