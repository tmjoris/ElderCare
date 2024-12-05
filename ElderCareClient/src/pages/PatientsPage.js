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
  Grid,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { showSuccess, showError } from '../ToastConfig';
import FormInput from '../components/FormInput';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loggedInUserRole = localStorage.getItem('mockRole');
  const loggedInUserId = localStorage.getItem('mockId');

  // Preset data including caregiver assignments
  const mockPatients = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dob: '1990-05-15',
      gender: 'Male',
      assignedCaregiverId: 'C123', // Caregiver ID
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      dob: '1985-08-20',
      gender: 'Female',
      assignedCaregiverId: 'C123', // Caregiver ID
    },
    {
      id: 3,
      firstName: 'Alice',
      lastName: 'Brown',
      dob: '1975-01-10',
      gender: 'Female',
      assignedCaregiverId: 'C124',
    },
  ];

  useEffect(() => {
    // Filter patients based on user role
    let filteredPatients = [];
    if (loggedInUserRole === 'doctor') {
      // Doctors see all patients
      filteredPatients = mockPatients;
    } else if (loggedInUserRole === 'caregiver') {
      // Caregivers see only their assigned patients
      filteredPatients = mockPatients.filter(
        (patient) => patient.assignedCaregiverId === loggedInUserId
      );
    } else if (loggedInUserRole === 'user') {
      // Users see only their profile
      filteredPatients = mockPatients.filter((patient) => patient.id === parseInt(loggedInUserId));
    }
    setPatients(filteredPatients);
  }, [loggedInUserRole, loggedInUserId]);

  const validateForm = () => {
    const { firstName, lastName, dob, gender } = newPatient;
    const formErrors = {};
    if (!firstName) formErrors.firstName = 'First name is required';
    if (!lastName) formErrors.lastName = 'Last name is required';
    if (!dob) formErrors.dob = 'Date of birth is required';
    if (!gender) formErrors.gender = 'Gender is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSavePatient = () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        // Update patient in mock data
        setPatients((prev) =>
          prev.map((patient) => (patient.id === editingId ? { ...newPatient, id: editingId } : patient))
        );
        showSuccess('Patient updated successfully');
      } else {
        // Add new patient to mock data
        setPatients((prev) => [...prev, { ...newPatient, id: Date.now(), assignedCaregiverId: null }]);
        showSuccess('Patient added successfully');
      }
      setOpen(false);
      setNewPatient({ firstName: '', lastName: '', dob: '', gender: '' });
      setIsEditing(false);
    } catch (error) {
      showError('Error saving patient');
    }
  };

  const handleEditPatient = (patient) => {
    setNewPatient(patient);
    setEditingId(patient.id);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeletePatient = (id) => {
    try {
      setPatients((prev) => prev.filter((patient) => patient.id !== id));
      showSuccess('Patient deleted successfully');
    } catch (error) {
      showError('Error deleting patient');
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
        Patients
      </Typography>
      {loggedInUserRole === 'doctor' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsEditing(false);
            setNewPatient({ firstName: '', lastName: '', dob: '', gender: '' });
            setOpen(true);
          }}
          sx={{ marginBottom: '20px' }}
        >
          Add Patient
        </Button>
      )}
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
              <TableCell sx={{ fontWeight: 'bold', color: '#333333' }}>First Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333333' }}>Last Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333333' }}>Date of Birth</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333333' }}>Gender</TableCell>
              {loggedInUserRole === 'doctor' && (
                <TableCell sx={{ fontWeight: 'bold', color: '#333333' }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.firstName}</TableCell>
                <TableCell>{patient.lastName}</TableCell>
                <TableCell>{patient.dob}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                {loggedInUserRole === 'doctor' && (
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEditPatient(patient)}
                      sx={{ marginRight: '10px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeletePatient(patient.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInput
                label="First Name"
                value={newPatient.firstName}
                onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                error={errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Last Name"
                value={newPatient.lastName}
                onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                error={errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Date of Birth"
                type="date"
                value={newPatient.dob}
                onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
                error={errors.dob}
                helperText={errors.dob}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Gender"
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                error={errors.gender}
                helperText={errors.gender}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleSavePatient}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PatientsPage;

