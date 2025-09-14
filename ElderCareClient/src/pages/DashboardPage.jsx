import { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
} from '@mui/material';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { showError } from '../ToastConfig';
import apiUrl from '../config';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const doctorUsername = localStorage.getItem('username');

  const fetchUserId = async (username) => {
    try {
      const response = await axios.get(`${apiUrl}/api/users/username/${username}`);
      return response.data.id;
    } catch (error) {
      showError('Error fetching user data');
      throw error;
    }
  };

  const fetchAppointments = useCallback(async () => {
    try {
      const doctorId = await fetchUserId(doctorUsername);
      const appointmentsUrl = `${apiUrl}/api/appointments/doctor/${doctorId}`;
      const response = await axios.get(appointmentsUrl);
      setUpcomingAppointments(response.data);
    } catch (error) {
      showError('Error fetching appointments');
    }
  }, [doctorUsername]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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
        Doctor Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Patients Count */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              padding: '20px',
              textAlign: 'center',
              boxShadow: 3,
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 5,
              },
            }}
          >
            <Typography variant="h6">Total Patients</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/patients')}
              sx={{ marginTop: '10px' }}
            >
              View Patients
            </Button>
          </Card>
        </Grid>
        {/* Appointments Count */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              padding: '20px',
              textAlign: 'center',
              boxShadow: 3,
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 5,
              },
            }}
          >
            <Typography variant="h6">Appointments</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/appointments')}
              sx={{ marginTop: '10px' }}
            >
              View Appointments
            </Button>
          </Card>
        </Grid>
        {/* Medical Records Count */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              padding: '20px',
              textAlign: 'center',
              boxShadow: 3,
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 5,
              },
            }}
          >
            <Typography variant="h6">Medical Records</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/medical-records')}
              sx={{ marginTop: '10px' }}
            >
              View Records
            </Button>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: '40px' }}>
        <Typography variant="h5" gutterBottom>
          Upcoming Appointments
        </Typography>
        <Paper
          sx={{
            padding: '20px',
            boxShadow: 3,
            borderRadius: 2,
            marginBottom: '30px',
          }}
        >
          {upcomingAppointments.length > 0 ? (
            <List>
              {upcomingAppointments.map((appointment) => (
                <ListItem key={appointment.id}>
                  <ListItemText
                    primary={`Appointment with Patient ID: ${appointment.patientId}`}
                    secondary={`Date: ${formatDate(appointment.appointmentDate)} | Location: ${appointment.location}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">No upcoming appointments.</Typography>
          )}
        </Paper>

        <Typography variant="h5" gutterBottom>
          Appointment Calendar
        </Typography>
        <Paper sx={{ padding: '20px', boxShadow: 3, borderRadius: 2 }}>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
