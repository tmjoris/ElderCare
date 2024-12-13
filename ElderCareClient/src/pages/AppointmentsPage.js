import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import { showSuccess, showError } from '../ToastConfig';
import FormInput from '../components/FormInput';
import axios from 'axios';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctorUsername: '',
    patientId: '',
    appointmentDate: '',
    location: '',
  });

const [errors, setErrors] = useState([]);

const doctorUsername = localStorage.getItem('username');

const fetchUserId = async (username) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/users/username/${username}`);
    return response.data.id;  
  } catch (error) {
    showError('Error fetching user data');
    throw error; 
  }
};

const fetchAppointments = async () => {
  try {
    const doctorId = await fetchUserId(doctorUsername);

    const appointmentsUrl = `http://localhost:8080/api/appointments/doctor/${doctorId}`;

    const response = await axios.get(appointmentsUrl);
    setAppointments(response.data);  
  } catch (error) {
    showError('Error fetching appointments');
  }
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

  const validateForm = () => {
    const { doctorUsername, patientId, appointmentDate, location } = newAppointment;
    const formErrors = {};
    if (!doctorUsername) formErrors.doctorUsername = 'Doctor username is required';
    if (!patientId) formErrors.patientId = 'Patient ID is required';
    if (!appointmentDate) formErrors.appointmentDate = 'Appointment date is required';
    if (!location) formErrors.location = 'Location is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSaveAppointment = async () => {
    if (!validateForm()) return;
  
  
    const formData = new FormData();
    formData.append('doctorUsername', doctorUsername);
    formData.append('patientId', newAppointment.patientId);
    formData.append('appointmentDate', newAppointment.appointmentDate);
    formData.append('location', newAppointment.location);
  
    try {
      await axios.post('http://localhost:8080/api/appointments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  
        },
      });
  
      setAppointments((prev) => [
        ...prev,
        { id: appointments.length + 1, ...newAppointment, doctorUsername },
      ]);
      showSuccess('Appointment added successfully');
      setOpen(false);
      setNewAppointment({ doctorUsername: '', patientId: '', appointmentDate: '', location: '' });
    } catch (error) {
      showError('Error saving appointment');
    }
  };
  
  

  const handleDeleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/appointments/${id}`);

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      showSuccess('Appointment deleted successfully');
    } catch (error) {
      showError('Error deleting appointment');
    }
  };

  useEffect(() => {
    fetchAppointments();
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
        Appointments
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ marginBottom: '20px' }}
      >
        Add Appointment
      </Button>
      <Paper
        sx={{
          padding: '20px',
          boxShadow: 3,
          borderRadius: '12px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Doctor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Appointment Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.doctorUsername}</TableCell>
                <TableCell>{appointment.patientId}</TableCell>
                <TableCell>{formatDate(appointment.appointmentDate)}</TableCell>
                <TableCell>{appointment.location}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setNewAppointment(appointment);
                      setOpen(true);
                    }}
                    sx={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInput
                label="Doctor Username"
                value={newAppointment.doctorUsername}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctorUsername: e.target.value })}
                error={errors.doctorUsername}
                helperText={errors.doctorUsername}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Patient ID"
                value={newAppointment.patientId}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                error={errors.patientId}
                helperText={errors.patientId}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Appointment Date"
                type="datetime-local"
                value={newAppointment.appointmentDate}
                onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })}
                error={errors.appointmentDate}
                helperText={errors.appointmentDate}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Location"
                value={newAppointment.location}
                onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                error={errors.location}
                helperText={errors.location}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleSaveAppointment}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AppointmentsPage;
