import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
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
    address: '',
    phoneNumber: '',
    emergencyContact: '',
    emergencyContactPhone: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const loggedInUserRole = localStorage.getItem('mockRole');
  const loggedInUser = localStorage.getItem('username');
  const apiUrl = 'http://localhost:8080/api/patients';

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(apiUrl, {
          params: { username: loggedInUser },
        });
        setPatients(response.data);   
      } catch (error) {
        showError('Failed to fetch patients');
        console.error(error);
      }
    };

    fetchPatients();
  }, [loggedInUser]);

  const validateForm = () => {
    const { firstName, lastName, dob, gender, address, phoneNumber, emergencyContact, emergencyContactPhone } = newPatient;
    const formErrors = {};
    if (!firstName) formErrors.firstName = 'First name is required';
    if (!lastName) formErrors.lastName = 'Last name is required';
    if (!dob) formErrors.dob = 'Date of birth is required';
    if (!gender) formErrors.gender = 'Gender is required';
    if (!address) formErrors.address = 'Address is required';
    if (!phoneNumber) formErrors.phoneNumber = 'Phone number is required';
    if (!emergencyContact) formErrors.emergencyContact = 'Emergency contact is required';
    if (!emergencyContactPhone) formErrors.emergencyContactPhone = 'Emergency contact phone number is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSavePatient = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        showError('Editing patients is not yet implemented with the API');
      } else {
        const response = await axios.post(
          `${apiUrl}?username=${loggedInUser}`,
          newPatient
        );
        setPatients((prev) => [...prev, response.data]); 
        showSuccess('Patient added successfully');
      }
      setOpen(false);
      setNewPatient({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        address: '',
        phoneNumber: '',
        emergencyContact: '',
        emergencyContactPhone: '',
      });
      setIsEditing(false);
    } catch (error) {
      showError('Error saving patient');
      console.error(error);
    }
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
            setNewPatient({
              firstName: '',
              lastName: '',
              dob: '',
              gender: '',
              address: '',
              phoneNumber: '',
              emergencyContact: '',
              emergencyContactPhone: '',
            });
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
              <TableCell sx={{ fontWeight: 'bold', color: '#333333' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333333' }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333333' }}>Emergency Contact</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333333' }}>Emergency Contact Phone</TableCell>
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
                <TableCell>{patient.address}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>{patient.emergencyContact}</TableCell>
                <TableCell>{patient.emergencyContactPhone}</TableCell>
                {loggedInUserRole === 'doctor' && (
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => console.log('Edit functionality pending')}
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
            <Grid item xs={12}>
              <FormInput
                label="Address"
                value={newPatient.address}
                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                error={errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Phone Number"
                value={newPatient.phoneNumber}
                onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                error={errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Emergency Contact"
                value={newPatient.emergencyContact}
                onChange={(e) => setNewPatient({ ...newPatient, emergencyContact: e.target.value })}
                error={errors.emergencyContact}
                helperText={errors.emergencyContact}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Emergency Contact Phone"
                value={newPatient.emergencyContactPhone}
                onChange={(e) => setNewPatient({ ...newPatient, emergencyContactPhone: e.target.value })}
                error={errors.emergencyContactPhone}
                helperText={errors.emergencyContactPhone}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSavePatient} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientsPage;
