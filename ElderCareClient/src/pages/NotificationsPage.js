import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Typography,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { showSuccess, showError } from '../ToastConfig';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  // Mock data
  const mockNotifications = [
    { id: 1, message: 'Appointment scheduled for tomorrow at 10 AM.' },
    { id: 2, message: 'Patient John Doe has a new medical report available.' },
    { id: 3, message: 'System maintenance scheduled for tonight at 2 AM.' },
  ];

  const fetchNotifications = async () => {
    try {
      // Uncomment this to use backend
      // const response = await axios.get('http://localhost:5000/api/notifications');
      // setNotifications(response.data);

      // Using mock data for now
      setNotifications(mockNotifications);
    } catch (error) {
      showError('Error fetching notifications');
    }
  };

  const handleDismiss = async (id) => {
    try {
      // Uncomment this to use backend
      // await axios.delete(`http://localhost:5000/api/notifications/${id}`);

      // Remove from mock data
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      showSuccess('Notification dismissed');
    } catch (error) {
      showError('Error dismissing notification');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: (theme) => theme.palette.background.default,
        borderRadius: '12px',
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      {notifications.length > 0 ? (
        <Grid container spacing={3}>
          {notifications.map((notification) => (
            <Grid item xs={12} sm={6} md={4} key={notification.id}>
              <Card
                sx={{
                  padding: '20px',
                  backgroundColor: (theme) => theme.palette.background.paper,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <Typography variant="body1" sx={{ marginBottom: '10px', color: 'text.primary' }}>
                  {notification.message}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDismiss(notification.id)}
                  sx={{ textTransform: 'none', marginTop: '10px' }}
                >
                  Dismiss
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          sx={{
            padding: '20px',
            marginTop: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            You have no notifications at the moment.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default NotificationsPage;
