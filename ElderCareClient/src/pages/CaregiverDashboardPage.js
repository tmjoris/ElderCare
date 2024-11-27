import React, { useState, useEffect } from 'react';
import { Grid, Card, Typography, Button, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { showError, showSuccess } from '../ToastConfig';

const CaregiverDashboardPage = () => {
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchAssignedPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/caregiver/assigned-patients');
      setAssignedPatients(response.data);
    } catch (error) {
      showError('Error fetching assigned patients');
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/caregiver/reminders');
      setReminders(response.data);
    } catch (error) {
      showError('Error fetching reminders');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddReminder = async () => {
    try {
      const newReminder = {
        date: selectedDate.toISOString(),
        message: 'Administer medication',
      };
      await axios.post('http://localhost:5000/api/caregiver/reminders', newReminder);
      showSuccess('Reminder added successfully');
      fetchReminders();
    } catch (error) {
      showError('Error adding reminder');
    }
  };

  useEffect(() => {
    fetchAssignedPatients();
    fetchReminders();
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Caregiver Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Assigned Patients */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              padding: '20px',
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
              Assigned Patients
            </Typography>
            {assignedPatients.length > 0 ? (
              <List>
                {assignedPatients.map((patient) => (
                  <ListItem key={patient.id}>
                    <ListItemText
                      primary={patient.name}
                      secondary={`Age: ${patient.age}, Condition: ${patient.condition}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">No patients assigned yet.</Typography>
            )}
          </Card>
        </Grid>

        {/* Reminders */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              padding: '20px',
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
              Reminders
            </Typography>
            {reminders.length > 0 ? (
              <List>
                {reminders.map((reminder) => (
                  <ListItem key={reminder.id}>
                    <ListItemText
                      primary={reminder.message}
                      secondary={`Date: ${new Date(reminder.date).toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">No reminders set yet.</Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddReminder}
              sx={{ marginTop: '10px' }}
            >
              Add Reminder
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Calendar */}
      <Box sx={{ marginTop: '40px' }}>
        <Typography variant="h5" gutterBottom>
          Calendar
        </Typography>
        <Paper
          sx={{
            padding: '20px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
          }}
        >
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </Paper>
      </Box>
    </Box>
  );
};

export default CaregiverDashboardPage;

