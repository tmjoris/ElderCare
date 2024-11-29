import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { showError, showSuccess } from '../ToastConfig';

const CaregiverDashboardPage = () => {
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newReminder, setNewReminder] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const presetAssignedPatients = [
    { id: 1, name: 'John Doe', age: 67, condition: 'Diabetes' },
    { id: 2, name: 'Jane Smith', age: 72, condition: 'Hypertension' },
  ];

  const presetReminders = [
    { id: 1, message: 'Administer medication', date: '2024-12-01T10:00:00' },
    { id: 2, message: 'Blood pressure check', date: '2024-12-02T14:00:00' },
  ];

  const fetchAssignedPatients = useCallback(() => {
    try {
      setAssignedPatients(presetAssignedPatients);
      showSuccess('Assigned patients loaded successfully');
    } catch (error) {
      showError('Error fetching assigned patients');
    }
  }, []);

  const fetchReminders = useCallback(() => {
    try {
      setReminders(presetReminders);
      showSuccess('Reminders loaded successfully');
    } catch (error) {
      showError('Error fetching reminders');
    }
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddReminder = () => {
    if (!newReminder.trim()) {
      showError('Please provide a reminder message');
      return;
    }
    try {
      const newReminderObj = {
        id: reminders.length + 1,
        date: selectedDate.toISOString(),
        message: newReminder.trim(),
      };
      setReminders((prev) => [...prev, newReminderObj]);
      setNewReminder('');
      setDialogOpen(false);
      showSuccess('Reminder added successfully');
    } catch (error) {
      showError('Error adding reminder');
    }
  };

  useEffect(() => {
    fetchAssignedPatients();
    fetchReminders();
  }, [fetchAssignedPatients, fetchReminders]);

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: (theme) => theme.palette.background.default,
        borderRadius: '12px',
        boxShadow: 3,
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Caregiver Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Assigned Patients */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              padding: '20px',
              boxShadow: 3,
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 5,
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
              boxShadow: 3,
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 5,
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
              onClick={() => setDialogOpen(true)}
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
        <Paper sx={{ padding: '20px', boxShadow: 3, borderRadius: 2 }}>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </Paper>
      </Box>

      {/* Add Reminder Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Reminder</DialogTitle>
        <DialogContent>
          <TextField
            label="Reminder Message"
            fullWidth
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          <Button variant="contained" color="primary" onClick={handleAddReminder}>
            Save Reminder
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CaregiverDashboardPage;
