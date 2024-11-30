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

const ProgressReportPage = () => {
  const [reports, setReports] = useState([]);
  const [open, setOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    patientId: '',
    notes: '',
    date: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loggedInUserRole = localStorage.getItem('mockRole');
  const loggedInUserId = localStorage.getItem('mockId');

  // Preset mock data for progress reports
  const mockProgressReports = [
    { id: 1, patientId: 'P123', notes: 'Improving condition', date: '2024-11-28', caregiverId: 'C123' },
    { id: 2, patientId: 'P124', notes: 'Stable condition', date: '2024-11-27', caregiverId: 'C124' },
    { id: 3, patientId: 'P125', notes: 'Condition worsening', date: '2024-11-26', caregiverId: 'C123' },
  ];

  useEffect(() => {
    // Filter progress reports based on role
    let filteredReports = [];
    if (loggedInUserRole === 'doctor') {
      // Doctors see all reports
      filteredReports = mockProgressReports;
    } else if (loggedInUserRole === 'caregiver') {
      // Caregivers see only reports for their assigned patients
      filteredReports = mockProgressReports.filter(
        (report) => report.caregiverId === loggedInUserId
      );
    } else if (loggedInUserRole === 'user') {
      // Users see only their own reports
      filteredReports = mockProgressReports.filter(
        (report) => report.patientId === loggedInUserId
      );
    }
    setReports(filteredReports);
  }, [loggedInUserRole, loggedInUserId]);

  const validateForm = () => {
    const { patientId, notes, date } = newReport;
    const formErrors = {};
    if (!patientId) formErrors.patientId = 'Patient ID is required';
    if (!notes) formErrors.notes = 'Progress notes are required';
    if (!date) formErrors.date = 'Date is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSaveReport = () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        // Update existing report
        const updatedReports = reports.map((report) =>
          report.id === editingId ? { ...newReport, id: editingId } : report
        );
        setReports(updatedReports);
        showSuccess('Progress report updated successfully');
      } else {
        // Add new report
        const newEntry = { ...newReport, id: Date.now(), caregiverId: loggedInUserId };
        setReports([...reports, newEntry]);
        showSuccess('Progress report added successfully');
      }
      setOpen(false);
      setNewReport({ patientId: '', notes: '', date: '' });
      setIsEditing(false);
    } catch (error) {
      showError('Error saving progress report');
    }
  };

  const handleEditReport = (report) => {
    setNewReport(report);
    setEditingId(report.id);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteReport = (id) => {
    try {
      const updatedReports = reports.filter((report) => report.id !== id);
      setReports(updatedReports);
      showSuccess('Progress report deleted successfully');
    } catch (error) {
      showError('Error deleting progress report');
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
        Progress Reports
      </Typography>
      {loggedInUserRole === 'doctor' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ marginBottom: '20px' }}
        >
          Add Progress Report
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
              <TableCell sx={{ fontWeight: 'bold' }}>Patient ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Notes</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              {loggedInUserRole === 'doctor' && (
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow
                key={report.id}
                sx={{
                  backgroundColor: '#FFFFFF',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  transition: 'background-color 0.3s ease',
                }}
              >
                <TableCell>{report.patientId}</TableCell>
                <TableCell>{report.notes}</TableCell>
                <TableCell>{report.date}</TableCell>
                {loggedInUserRole === 'doctor' && (
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEditReport(report)}
                      sx={{ marginRight: '10px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteReport(report.id)}
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
        <DialogTitle>{isEditing ? 'Edit Progress Report' : 'Add Progress Report'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInput
                label="Patient ID"
                value={newReport.patientId}
                onChange={(e) => setNewReport({ ...newReport, patientId: e.target.value })}
                error={errors.patientId}
                helperText={errors.patientId}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Notes"
                value={newReport.notes}
                onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
                error={errors.notes}
                helperText={errors.notes}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Date"
                type="date"
                value={newReport.date}
                onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                error={errors.date}
                helperText={errors.date}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleSaveReport}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProgressReportPage;
