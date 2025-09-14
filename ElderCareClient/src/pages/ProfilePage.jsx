import React, { useState, useEffect } from 'react';
import { Card, Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { showSuccess, showError } from '../ToastConfig';
import apiUrl from '../config';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    id: '',
    username: '',
    firstName: '',
    secondName: '',
    email: '',
    primaryLocation: '',
    secondaryLocation: '',
    phoneNumber: '',
    role: '',
    privileges: '',
    createdAt: '',
  });

  const fetchProfile = async () => {
    try {
      const username = localStorage.getItem('username'); // Replace with actual logic to get the logged-in user's username
      const response = await axios.get(`${apiUrl}/api/users/username/${username}`);
      const userData = response.data;

      setProfile({
        id: userData.id || '',
        username: userData.username || '',
        firstName: userData.firstName || '',
        secondName: userData.secondName || '',
        email: userData.email || '',
        primaryLocation: userData.primaryLocation || '',
        secondaryLocation: userData.secondaryLocation || '',
        phoneNumber: userData.phoneNumber || '',
        role: userData.role || '',
        privileges: userData.privileges || '',
        createdAt: userData.createdAt || '',
      });

      showSuccess('Profile loaded successfully');
    } catch (error) {
      console.error('Error fetching profile:', error);
      showError('Error fetching profile');
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = {
        id: profile.id,
        username: profile.username,
        firstName: profile.firstName,
        secondName: profile.secondName,
        email: profile.email,
        primaryLocation: profile.primaryLocation,
        secondaryLocation: profile.secondaryLocation,
        phoneNumber: profile.phoneNumber,
        role: profile.role,
        privileges: profile.privileges,
        createdAt: profile.createdAt,
      };

      await axios.put(`${apiUrl}/api/users/username/${profile.username}`, updatedProfile);
      showSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
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
            label="ID"
            name="id"
            value={profile.id}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
            disabled
          />
          <TextField
            label="Username"
            name="username"
            value={profile.username}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
            disabled
          />
          <TextField
            label="First Name"
            name="firstName"
            value={profile.firstName}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Second Name"
            name="secondName"
            value={profile.secondName}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
            disabled
          />
          <TextField
            label="Primary Location"
            name="primaryLocation"
            value={profile.primaryLocation}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Secondary Location"
            name="secondaryLocation"
            value={profile.secondaryLocation}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Role"
            name="role"
            value={profile.role}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
            disabled
          />
          <TextField
            label="Privileges"
            name="privileges"
            value={profile.privileges}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
            disabled
          />
          <TextField
            label="Created At"
            name="createdAt"
            value={profile.createdAt}
            onChange={handleProfileChange}
            fullWidth
            variant="outlined"
            disabled
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
