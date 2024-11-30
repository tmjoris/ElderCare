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

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    patientId: '',
    doctorId: '',
    dateOfVisit: '',
    diagnosis: '',
    treatmentPlan: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loggedInUserRole = localStorage.getItem('mockRole'); // 'doctor' or 'patient'
  const loggedInUserId = localStorage.getItem('mockId'); // User's ID

  // Mock data
  const mockRecords = [
    {
      id: 1,
      patientId: 'P001',
      doctorId: 'D001',
      dateOfVisit: '2023-12-01',
      diagnosis: 'Flu',
      treatmentPlan: 'Rest and hydration',
    },
    {
      id: 2,
      patientId: 'P002',
      doctorId: 'D002',
      dateOfVisit: '2023-12-02',
      diagnosis: 'Cough',
      treatmentPlan: 'Cough syrup and steam inhalation',
    },
  ];

  const fetchRecords = async () => {
    try {
      // Filter mock data based on role
      const filteredRecords =
        loggedInUserRole === 'doctor'
          ? mockRecords.filter((record) => record.doctorId === loggedInUserId)
          : loggedInUserRole === 'patient'
          ? mockRecords.filter((record) => record.patientId === loggedInUserId)
          : mockRecords;

      setRecords(filteredRecords);

      // Uncomment for backend integration
      // const response = await axios.get('http://localhost:5000/api/medical-records');
      // setRecords(response.data);
    } catch (error) {
      showError('Error fetching medical records');
    }
  };

  const validateForm = () => {
    const { patientId, doctorId, dateOfVisit, diagnosis, treatmentPlan } = newRecord;
    const formErrors = {};
    if (!patientId) formErrors.patientId = 'Patient ID is required';
    if (!doctorId) formErrors.doctorId = 'Doctor ID is required';
    if (!dateOfVisit) formErrors.dateOfVisit = 'Date of visit is required';
    if (!diagnosis) formErrors.diagnosis = 'Diagnosis is required';
    if (!treatmentPlan) formErrors.treatmentPlan = 'Treatment plan is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSaveRecord = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        setRecords((prev) =>
          prev.map((record) => (record.id === editingId ? { ...newRecord, id: editingId } : record))
        );
        showSuccess('Medical record updated successfully');
      } else {
        setRecords((prev) => [...prev, { ...newRecord, id: Date.now() }]);
        showSuccess('Medical record added successfully');
      }
      setOpen(false);
      setNewRecord({
        patientId: '',
        doctorId: '',
        dateOfVisit: '',
        diagnosis: '',
        treatmentPlan: '',
      });
      setIsEditing(false);
    } catch (error) {
      showError('Error saving medical record');
    }
  };

  const handleEditRecord = (record) => {
    setNewRecord(record);
    setEditingId(record.id);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteRecord = async (id) => {
    try {
      setRecords((prev) => prev.filter((record) => record.id !== id));
      showSuccess('Medical record deleted successfully');
    } catch (error) {
      showError('Error deleting medical record');
    }
  };

  useEffect(() => {
    fetchRecords();
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
        Medical Records
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setIsEditing(false);
          setNewRecord({
            patientId: '',
            doctorId: '',
            dateOfVisit: '',
            diagnosis: '',
            treatmentPlan: '',
          });
          setOpen(true);
        }}
        sx={{ marginBottom: '20px' }}
      >
        Add Medical Record
      </Button>
      <Paper sx={{ padding: '20px', boxShadow: 3, borderRadius: '12px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Doctor ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date of Visit</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Diagnosis</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Treatment Plan</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.patientId}</TableCell>
                <TableCell>{record.doctorId}</TableCell>
                <TableCell>{record.dateOfVisit}</TableCell>
                <TableCell>{record.diagnosis}</TableCell>
                <TableCell>{record.treatmentPlan}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEditRecord(record)}
                    sx={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteRecord(record.id)}
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
        <DialogTitle>{isEditing ? 'Edit Medical Record' : 'Add Medical Record'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInput
                label="Patient ID"
                value={newRecord.patientId}
                onChange={(e) => setNewRecord({ ...newRecord, patientId: e.target.value })}
                error={errors.patientId}
                helperText={errors.patientId}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Doctor ID"
                value={newRecord.doctorId}
                onChange={(e) => setNewRecord({ ...newRecord, doctorId: e.target.value })}
                error={errors.doctorId}
                helperText={errors.doctorId}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Date of Visit"
                type="date"
                value={newRecord.dateOfVisit}
                onChange={(e) => setNewRecord({ ...newRecord, dateOfVisit: e.target.value })}
                error={errors.dateOfVisit}
                helperText={errors.dateOfVisit}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Diagnosis"
                value={newRecord.diagnosis}
                onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                error={errors.diagnosis}
                helperText={errors.diagnosis}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Treatment Plan"
                value={newRecord.treatmentPlan}
                onChange={(e) => setNewRecord({ ...newRecord, treatmentPlan: e.target.value })}
                error={errors.treatmentPlan}
                helperText={errors.treatmentPlan}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleSaveRecord}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MedicalRecordsPage;
