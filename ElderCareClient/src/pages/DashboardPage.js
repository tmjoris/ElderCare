import React, { useState, useEffect } from 'react';
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
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { showError } from '../ToastConfig';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({
    patientsCount: 0,
    appointmentsCount: 0,
    medicalRecordsCount: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchMetrics = async () => {
    try {
      const patientsResponse = await axios.get('http://localhost:5000/api/patients');
      const appointmentsResponse = await axios.get('http://localhost:5000/api/appointments');
      const medicalRecordsResponse = await axios.get('http://localhost:5000/api/medical-records');

      setMetrics({
        patientsCount: patientsResponse.data.length,
        appointmentsCount: appointmentsResponse.data.length,
        medicalRecordsCount: medicalRecordsResponse.data.length,
      });
    } catch (error) {
      showError('Error fetching dashboard metrics');
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments/upcoming');
      setUpcomingAppointments(response.data);
    } catch (error) {
      showError('Error fetching upcoming appointments');
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchUpcomingAppointments();
  }, []);

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
      }}
    >
      <Typography variant="h4" gutterBottom>
        Dashboard
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
            <Typography variant="h3">{metrics.patientsCount}</Typography>
            <Button
              variant="contained"
              color="primary"
              href="/patients"
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
            <Typography variant="h3">{metrics.appointmentsCount}</Typography>
            <Button
              variant="contained"
              color="primary"
              href="/appointments"
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
            <Typography variant="h3">{metrics.medicalRecordsCount}</Typography>
            <Button
              variant="contained"
              color="primary"
              href="/medical-records"
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
                    secondary={`Date: ${new Date(
                      appointment.appointmentDate
                    ).toLocaleString()}`}
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
