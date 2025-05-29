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
import { useMemo } from 'react';

const CaregiverDashboardPage = () => {
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newReminder, setNewReminder] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Preset reminders
  const presetReminders = useMemo(()=>[
    { id: 1, message: 'Administer medication', date: '2024-12-01T10:00:00' },
    { id: 2, message: 'Blood pressure check', date: '2024-12-02T14:00:00' },
  ], []);

  // Fetch reminders from localStorage or set preset ones if not available
  const fetchReminders = useCallback(() => {
    try {
      const savedReminders = localStorage.getItem('reminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
        showSuccess('Reminders loaded successfully');
      } else {
        // If no reminders are saved, set and save preset reminders to localStorage
        setReminders(presetReminders);
        localStorage.setItem('reminders', JSON.stringify(presetReminders));
        showSuccess('Preset reminders loaded successfully');
      }
    } catch (error) {
      showError('Error fetching reminders');
    }
  }, [presetReminders]);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle adding reminder
  const handleAddReminder = () => {
    if (!newReminder.trim() || !reminderTime.trim()) {
      showError('Please provide both a reminder message and time');
      return;
    }

    const newReminderObj = {
      id: reminders.length + 1,
      date: reminderTime,
      message: newReminder.trim(),
    };

    const updatedReminders = [...reminders, newReminderObj];
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));

    setNewReminder('');
    setReminderTime('');
    setDialogOpen(false);
    showSuccess('Reminder added successfully');
  };

  // Effect to load reminders from localStorage on component mount
  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

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
      <Grid>
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
          <TextField
            label="Time to be Reminded"
            type="datetime-local"
            fullWidth
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            sx={{ marginBottom: '20px' }}
            InputLabelProps={{
              shrink: true,
            }}
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
