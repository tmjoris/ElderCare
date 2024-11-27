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

  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medical-records');
      setRecords(response.data);
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
        await axios.put(`http://localhost:5000/api/medical-records/${editingId}`, newRecord);
        showSuccess('Medical record updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/medical-records', newRecord);
        showSuccess('Medical record added successfully');
      }
      setOpen(false);
      setNewRecord({ patientId: '', doctorId: '', dateOfVisit: '', diagnosis: '', treatmentPlan: '' });
      setIsEditing(false);
      fetchRecords();
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
      await axios.delete(`http://localhost:5000/api/medical-records/${id}`);
      showSuccess('Medical record deleted successfully');
      fetchRecords();
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
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Medical Records
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
        Add Medical Record
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
              <TableRow
                key={record.id}
                sx={{
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  transition: 'background-color 0.3s ease',
                }}
              >
                <TableCell>{record.patientId}</TableCell>
                <TableCell>{record.doctorId}</TableCell>
                <TableCell>{record.dateOfVisit}</TableCell>
                <TableCell>{record.diagnosis}</TableCell>
                <TableCell>{record.treatmentPlan}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEditRecord(record)}
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEditing ? 'Edit Medical Record' : 'Add Medical Record'}</DialogTitle>
        <DialogContent>
          <FormInput
            label="Patient ID"
            value={newRecord.patientId}
            onChange={(e) => setNewRecord({ ...newRecord, patientId: e.target.value })}
            error={errors.patientId}
            helperText={errors.patientId}
          />
          <FormInput
            label="Doctor ID"
            value={newRecord.doctorId}
            onChange={(e) => setNewRecord({ ...newRecord, doctorId: e.target.value })}
            error={errors.doctorId}
            helperText={errors.doctorId}
          />
          <FormInput
            label="Date of Visit"
            type="date"
            value={newRecord.dateOfVisit}
            onChange={(e) => setNewRecord({ ...newRecord, dateOfVisit: e.target.value })}
            error={errors.dateOfVisit}
            helperText={errors.dateOfVisit}
          />
          <FormInput
            label="Diagnosis"
            value={newRecord.diagnosis}
            onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
            error={errors.diagnosis}
            helperText={errors.diagnosis}
          />
          <FormInput
            label="Treatment Plan"
            value={newRecord.treatmentPlan}
            onChange={(e) => setNewRecord({ ...newRecord, treatmentPlan: e.target.value })}
            error={errors.treatmentPlan}
            helperText={errors.treatmentPlan}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveRecord}
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

export default MedicalRecordsPage;
