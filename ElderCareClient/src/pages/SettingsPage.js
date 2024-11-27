import React, { useState } from 'react';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 16,
    notifications: true,
  });

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    showSuccess(`Theme switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode`);
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSaveSettings = () => {
    // Save settings logic (could involve API calls)
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
                setSettings({ ...settings, notifications: !settings.notifications })
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
