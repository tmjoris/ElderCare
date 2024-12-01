import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { showSuccess } from '../ToastConfig';

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem('isDarkMode')) || false
  );
  const [settings, setSettings] = useState({
    fontSize: parseInt(localStorage.getItem('fontSize')) || 16,
    notifications: JSON.parse(localStorage.getItem('notifications')) || true,
  });

  const userRole = localStorage.getItem('mockRole') || 'guest'; // Role-based settings

  useEffect(() => {
    // Load initial settings for role if required
    const initialFontSize = userRole === 'caregiver' ? 18 : 16; // Example customization
    setSettings((prev) => ({
      ...prev,
      fontSize: parseInt(localStorage.getItem('fontSize')) || initialFontSize,
    }));
  }, [userRole]);

  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('isDarkMode', newMode);
    showSuccess(`Theme switched to ${newMode ? 'Dark' : 'Light'} Mode`);
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('fontSize', settings.fontSize);
    localStorage.setItem('notifications', settings.notifications);
    showSuccess('Settings updated successfully');
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Card
        sx={{
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <FormControlLabel
          control={<Switch checked={isDarkMode} onChange={handleThemeToggle} />}
          label="Dark Mode"
          sx={{ marginBottom: '20px' }}
        />
      </Card>
      <Card
        sx={{
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Preferences
        </Typography>
        <TextField
          label="Font Size"
          type="number"
          name="fontSize"
          value={settings.fontSize}
          onChange={handleSettingsChange}
          fullWidth
          margin="normal"
          sx={{ marginBottom: '20px' }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications}
              onChange={() =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: !prev.notifications,
                }))
              }
            />
          }
          label="Enable Notifications"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          sx={{
            marginTop: '20px',
            padding: '10px',
            fontWeight: 'bold',
            borderRadius: '8px',
            alignSelf: 'center',
          }}
        >
          Save Settings
        </Button>
      </Card>
    </Box>
  );
};

export default SettingsPage;
