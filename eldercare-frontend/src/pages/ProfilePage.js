import React, { useState, useEffect } from 'react';
import { Card, Typography, TextField, Button, Box } from '@mui/material';
import { showSuccess, showError } from '../ToastConfig';

const ProfilePage = () => {
  const mockProfiles = {
    'johndoe@gmail.com': { name: 'John Doe', email: 'johndoe@gmail.com', phone: '123456789', address: '123 Main Street' },
    'jane1@gmail.com': { name: 'Jane Smith', email: 'jane1@gmail.com', phone: '987654321', address: '456 Elm Street' },
    'smithrowe@gmail.com': { name: 'Smith Rowe', email: 'smithrowe@gmail.com', phone: '555123456', address: '789 Oak Avenue' },
  };

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const fetchProfile = async () => {
    try {
      // Mock data based on logged-in user
      const email = localStorage.getItem('mockUserEmail'); // Replace with actual user email from local storage
      const mockProfile = mockProfiles[email];

      if (mockProfile) {
        setProfile(mockProfile);
      } else {
        throw new Error('Profile not found');
      }
    } catch (error) {
      showError('Error fetching profile');
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      // Mock save action
      showSuccess('Profile updated successfully');
    } catch (error) {
      showError('Error updating profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: (theme) => theme.palette.background.default,
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Card
        sx={{
          padding: '30px',
          marginTop: '20px',
          boxShadow: 3,
          borderRadius: '12px',
          backgroundColor: (theme) => theme.palette.background.paper,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Box
          component="form"
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: 'background.paper' }}
          />
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: 'background.paper' }}
            disabled
          />
          <TextField
            label="Phone"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: 'background.paper' }}
          />
          <TextField
            label="Address"
            name="address"
            value={profile.address}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: 'background.paper' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveProfile}
            sx={{
              padding: '10px',
              fontWeight: 'bold',
              borderRadius: '8px',
              alignSelf: 'center',
              width: '150px',
            }}
          >
            Save Profile
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ProfilePage;
