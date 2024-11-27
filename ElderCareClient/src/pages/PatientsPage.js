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
  Typography,
  Box,
  Paper,
} from '@mui/material';
import axios from 'axios';
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

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data);
    } catch (error) {
      showError('Error fetching patients');
    }
  };

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

  const handleSavePatient = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/patients/${editingId}`, newPatient);
        showSuccess('Patient updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/patients', newPatient);
        showSuccess('Patient added successfully');
      }
      setOpen(false);
      setNewPatient({ firstName: '', lastName: '', dob: '', gender: '' });
      setIsEditing(false);
      fetchPatients();
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

  const handleDeletePatient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      showSuccess('Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      showError('Error deleting patient');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: (theme) => theme.palette.background.default,
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          marginBottom: '20px',
          padding: '10px',
          fontWeight: 'bold',
        }}
      >
        Add Patient
      </Button>
      <Paper
        sx={{
          padding: '20px',
          borderRadius: '12px',
          boxShadow: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date of Birth</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow
                key={patient.id}
                sx={{
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  transition: 'background-color 0.3s ease',
                }}
              >
                <TableCell>{patient.firstName}</TableCell>
                <TableCell>{patient.lastName}</TableCell>
                <TableCell>{patient.dob}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEditPatient(patient)}
                    sx={{
                      marginRight: '10px',
                      padding: '6px 12px',
                    }}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEditing ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent>
          <FormInput
            label="First Name"
            value={newPatient.firstName}
            onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
            error={errors.firstName}
            helperText={errors.firstName}
          />
          <FormInput
            label="Last Name"
            value={newPatient.lastName}
            onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
            error={errors.lastName}
            helperText={errors.lastName}
          />
          <FormInput
            label="Date of Birth"
            type="date"
            value={newPatient.dob}
            onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
            error={errors.dob}
            helperText={errors.dob}
          />
          <FormInput
            label="Gender"
            value={newPatient.gender}
            onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
            error={errors.gender}
            helperText={errors.gender}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSavePatient}
            sx={{
              marginTop: '20px',
              padding: '10px',
              fontWeight: 'bold',
              alignSelf: 'center',
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PatientsPage;
