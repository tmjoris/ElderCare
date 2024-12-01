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
  Grid,
  Box,
  Paper,
} from '@mui/material';
import { showSuccess, showError } from '../ToastConfig';
import FormInput from '../components/FormInput';

const PrescriptionsAndMedicationPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medication, setMedication] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formType, setFormType] = useState(''); // 'prescription' or 'medication'

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    details: '',
  });

  const [errors, setErrors] = useState({});

  const loggedInUserRole = localStorage.getItem('mockRole');
  const loggedInUserId = localStorage.getItem('mockId');

  // Mock data for demonstration
  const mockPrescriptions = [
    { id: 1, patientId: 'P123', doctorId: 'D001', date: '2024-11-27', details: 'Amoxicillin 500mg' },
    { id: 2, patientId: 'P124', doctorId: 'D002', date: '2024-11-26', details: 'Paracetamol 1g' },
  ];

  const mockMedication = [
    { id: 1, patientId: 'P123', date: '2024-11-28', details: 'Took morning dose on time' },
    { id: 2, patientId: 'P124', date: '2024-11-27', details: 'Missed evening dose' },
  ];

  useEffect(() => {
    let filteredPrescriptions = [];
    let filteredMedication = [];

    if (loggedInUserRole === 'doctor') {
      filteredPrescriptions = mockPrescriptions.filter((item) => item.doctorId === loggedInUserId);
      filteredMedication = mockMedication; // Doctors see all medication
    } else if (loggedInUserRole === 'caregiver') {
      filteredPrescriptions = mockPrescriptions.filter((item) => item.patientId === loggedInUserId);
      filteredMedication = mockMedication.filter((item) => item.patientId === loggedInUserId);
    } else if (loggedInUserRole === 'user') {
      filteredPrescriptions = mockPrescriptions.filter((item) => item.patientId === loggedInUserId);
      filteredMedication = mockMedication.filter((item) => item.patientId === loggedInUserId);
    }

    setPrescriptions(filteredPrescriptions);
    setMedication(filteredMedication);
  }, [loggedInUserRole, loggedInUserId]);

  const validateForm = () => {
    const { patientId, doctorId, date, details } = formData;
    const formErrors = {};
    if (!patientId) formErrors.patientId = 'Patient ID is required';
    if (formType === 'prescription' && !doctorId) formErrors.doctorId = 'Doctor ID is required';
    if (!date) formErrors.date = 'Date is required';
    if (!details) formErrors.details = 'Details are required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newEntry = { ...formData, id: Date.now() };

    if (formType === 'prescription') {
      if (isEditing) {
        setPrescriptions((prev) =>
          prev.map((item) => (item.id === editingId ? { ...newEntry, id: editingId } : item))
        );
        showSuccess('Prescription updated successfully');
      } else {
        setPrescriptions((prev) => [...prev, newEntry]);
        showSuccess('Prescription added successfully');
      }
    } else if (formType === 'medication') {
      if (isEditing) {
        setMedication((prev) =>
          prev.map((item) => (item.id === editingId ? { ...newEntry, id: editingId } : item))
        );
        showSuccess('Medication record updated successfully');
      } else {
        setMedication((prev) => [...prev, newEntry]);
        showSuccess('Medication record added successfully');
      }
    }

    setOpen(false);
    setFormData({ patientId: '', doctorId: '', date: '', details: '' });
    setIsEditing(false);
    setFormType('');
  };

  const handleEdit = (item, type) => {
    setFormData(item);
    setEditingId(item.id);
    setIsEditing(true);
    setFormType(type);
    setOpen(true);
  };

  const handleDelete = (id, type) => {
    if (type === 'prescription') {
      setPrescriptions((prev) => prev.filter((item) => item.id !== id));
      showSuccess('Prescription deleted successfully');
    } else if (type === 'medication') {
      setMedication((prev) => prev.filter((item) => item.id !== id));
      showSuccess('Medication record deleted successfully');
    }
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f4f6f8', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Prescriptions and Medication
      </Typography>
      {loggedInUserRole === 'doctor' && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setFormType('prescription');
              setIsEditing(false);
              setOpen(true);
            }}
            sx={{ marginBottom: '10px', marginRight: '10px' }}
          >
            Add Prescription
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setFormType('medication');
              setIsEditing(false);
              setOpen(true);
            }}
            sx={{ marginBottom: '20px' }}
          >
            Add Medication
          </Button>
        </>
      )}

      {/* Prescription Table */}
      <Typography variant="h5" gutterBottom>
        Prescriptions
      </Typography>
      <Paper sx={{ padding: '20px', marginBottom: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Doctor ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
              {loggedInUserRole === 'doctor' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.patientId}</TableCell>
                <TableCell>{item.doctorId}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.details}</TableCell>
                {loggedInUserRole === 'doctor' && (
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEdit(item, 'prescription')}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(item.id, 'prescription')}
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

      {/* Medication Table */}
      <Typography variant="h5" gutterBottom>
        Medication
      </Typography>
      <Paper sx={{ padding: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
              {loggedInUserRole === 'doctor' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {medication.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.patientId}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.details}</TableCell>
                {loggedInUserRole === 'doctor' && (
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEdit(item, 'medication')}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(item.id, 'medication')}
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing
            ? `Edit ${formType === 'prescription' ? 'Prescription' : 'Medication'}`
            : `Add ${formType === 'prescription' ? 'Prescription' : 'Medication'}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInput
                label="Patient ID"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                error={errors.patientId}
                helperText={errors.patientId}
              />
            </Grid>
            {formType === 'prescription' && (
              <Grid item xs={12}>
                <FormInput
                  label="Doctor ID"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  error={errors.doctorId}
                  helperText={errors.doctorId}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormInput
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                error={errors.date}
                helperText={errors.date}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                error={errors.details}
                helperText={errors.details}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PrescriptionsAndMedicationPage;
