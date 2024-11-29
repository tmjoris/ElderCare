import React, { useState, useEffect, useCallback } from 'react';
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
import { showError, showSuccess } from '../ToastConfig';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    patientsCount: 0,
    appointmentsCount: 0,
    medicalRecordsCount: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const presetMetrics = {
    patientsCount: 3,
    appointmentsCount: 3,
    medicalRecordsCount: 3,
  };

  const presetAppointments = [
    { id: 1, patientName: 'John Doe', doctorName: 'Dr. John', appointmentDate: '2024-12-01T10:00:00' },
    { id: 2, patientName: 'Jane Smith', doctorName: 'Dr. John', appointmentDate: '2024-12-02T14:00:00' },
    { id: 3, patientName: 'Alice Johnson', doctorName: 'Dr. John', appointmentDate: '2024-12-03T11:00:00' },
  ];

  const fetchMetrics = useCallback(() => {
    try {
      setMetrics(presetMetrics);
      showSuccess('Metrics loaded successfully');
    } catch (error) {
      showError('Error fetching dashboard metrics');
    }
  }, []);

  const fetchUpcomingAppointments = useCallback(() => {
    try {
      setUpcomingAppointments(presetAppointments);
    } catch (error) {
      showError('Error fetching upcoming appointments');
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    fetchUpcomingAppointments();
  }, [fetchMetrics, fetchUpcomingAppointments]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
            <Typography variant="h3">{metrics.patientsCount || 'N/A'}</Typography>
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
            <Typography variant="h3">{metrics.appointmentsCount || 'N/A'}</Typography>
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
            <Typography variant="h3">{metrics.medicalRecordsCount || 'N/A'}</Typography>
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
                    primary={`${appointment.patientName} with ${appointment.doctorName}`}
                    secondary={`Date: ${new Date(appointment.appointmentDate).toLocaleString()}`}
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
