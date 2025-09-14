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

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctorUsername: '',
    patientId: '',
    appointmentDate: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Preset mock data
  const mockAppointments = [
    {
      id: 1,
      doctorUsername: 'johndoe',
      patientId: 'P001',
      appointmentDate: '2024-12-01T10:00',
      location: 'Room 101',
    },
    {
      id: 2,
      doctorUsername: 'janesmith',
      patientId: 'P002',
      appointmentDate: '2024-12-02T14:00',
      location: 'Room 202',
    },
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
        try {
          // Uncomment this when integrating the backend
          // const response = await axios.get('http://localhost:5000/api/appointments');
          // setAppointments(response.data);
    
          // Using mock data
          setAppointments(mockAppointments);
        } catch (error) {
          showError('Error fetching appointments');
        }
      };

    fetchAppointments();
  });

  

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

    try {
      if (isEditing) {
        // Uncomment this for backend integration
        // await axios.put(`http://localhost:5000/api/appointments/${editingId}`, newAppointment);

        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === editingId ? { ...appt, ...newAppointment } : appt
          )
        );
        showSuccess('Appointment updated successfully');
      } else {
        // Uncomment this for backend integration
        // await axios.post('http://localhost:5000/api/appointments', newAppointment);

        setAppointments((prev) => [
          ...prev,
          { id: appointments.length + 1, ...newAppointment },
        ]);
        showSuccess('Appointment added successfully');
      }
      setOpen(false);
      setNewAppointment({ doctorUsername: '', patientId: '', appointmentDate: '', location: '' });
      setIsEditing(false);
    } catch (error) {
      showError('Error saving appointment');
    }
  };

  const handleEditAppointment = (appointment) => {
    setNewAppointment(appointment);
    setEditingId(appointment.id);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteAppointment = async (id) => {
    try {
      // Uncomment this for backend integration
      // await axios.delete(`http://localhost:5000/api/appointments/${id}`);

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      showSuccess('Appointment deleted successfully');
    } catch (error) {
      showError('Error deleting appointment');
    }
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
                <TableCell>{appointment.appointmentDate}</TableCell>
                <TableCell>{appointment.location}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEditAppointment(appointment)}
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
        <DialogTitle>{isEditing ? 'Edit Appointment' : 'Add Appointment'}</DialogTitle>
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

export default PatientAppointments;
