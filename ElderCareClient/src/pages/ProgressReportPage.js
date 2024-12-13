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
    caregiverId: '', 
    date: '',
    summary: '', 
    recommendations: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [userId, setUserId] = useState(null); 

  const loggedInUserRole = localStorage.getItem('mockRole');
  const username = localStorage.getItem('username');

  const fetchUserId = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/username/${username}`
      );
      return response.data.id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      throw new Error("User ID fetch failed");
    }
  };

  useEffect(() => {
    const fetchUserAndReports = async () => {
      try {
        const fetchedUserId = await fetchUserId(username);
        setUserId(fetchedUserId); 
        let url = 'http://localhost:8080/api/progress-reports';
        if (loggedInUserRole === 'doctor') {
          url = 'http://localhost:8080/api/progress-reports';
        } else if (loggedInUserRole === 'caregiver') {
          url = `http://localhost:8080/api/progress-reports/caregiver/${fetchedUserId}`;
        } else if (loggedInUserRole === 'user') {
          url = `http://localhost:8080/api/progress-reports/patient/${fetchedUserId}`;
        }

        const response = await axios.get(url);
        setReports(response.data); 
      } catch (error) {
        console.error('Error fetching progress reports:', error);
        showError('Error fetching progress reports');
      }
    };

    fetchUserAndReports();
  }, [loggedInUserRole, username]); 

  const validateForm = () => {
    const { patientId, caregiverId, date, summary, recommendations } = newReport;
    const formErrors = {};
    if (!patientId) formErrors.patientId = 'Patient ID is required';
    if (!caregiverId) formErrors.caregiverId = 'Caregiver ID is required';
    if (!date) formErrors.date = 'Date is required';
    if (!summary) formErrors.summary = 'Summary is required';
    if (!recommendations) formErrors.recommendations = 'Recommendations are required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSaveReport = async () => {
    if (!validateForm()) return;

    try {
      const reportData = {
        patientId: newReport.patientId,
        caregiverId: newReport.caregiverId,
        date: newReport.date,
        summary: newReport.summary,
        recommendations: newReport.recommendations,
      };

      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/progress-reports/${editingId}`,
          reportData
        );
        setReports(
          reports.map((report) =>
            report.id === editingId ? { ...newReport, id: editingId } : report
          )
        );
        showSuccess('Progress report updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/progress-reports', reportData);
        setReports([...reports, { ...newReport, id: Date.now() }]);
        showSuccess('Progress report added successfully');
      }

      setOpen(false);
      setNewReport({ patientId: '', caregiverId: '', date: '', summary: '', recommendations: '' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving progress report:', error);
      showError('Error saving progress report');
    }
  };

  const handleEditReport = (report) => {
    setNewReport(report);
    setEditingId(report.id);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteReport = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/progress-reports/${id}`);
      const updatedReports = reports.filter((report) => report.id !== id);
      setReports(updatedReports);
      showSuccess('Progress report deleted successfully');
    } catch (error) {
      console.error('Error deleting progress report:', error);
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
      {loggedInUserRole === 'doctor' || 'caregiver' && (
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
              <TableCell sx={{ fontWeight: 'bold' }}>Progress Report ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Caregiver Id</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Summary</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Recommendations</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>              
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
                <TableCell>{report.reportId}</TableCell>
                <TableCell>{report.patientId}</TableCell>
                <TableCell>{report.caregiverId}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.summary}</TableCell>
                <TableCell>{report.recommendations}</TableCell>
                <TableCell>{report.createdAt}</TableCell>
                <TableCell>{report.patientId}</TableCell>
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
                label="Caregiver ID"
                value={newReport.caregiverId}
                onChange={(e) => setNewReport({ ...newReport, caregiverId: e.target.value })}
                error={errors.caregiverId}
                helperText={errors.caregiverId}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Date"
                type="datetime-local"
                value={newReport.date}
                onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                error={errors.date}
                helperText={errors.date}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Summary"
                value={newReport.summary}
                onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                error={errors.summary}
                helperText={errors.summary}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                label="Recommendations"
                value={newReport.recommendations}
                onChange={(e) => setNewReport({ ...newReport, recommendations: e.target.value })}
                error={errors.recommendations}
                helperText={errors.recommendations}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveReport}
                sx={{ marginTop: '20px' }}
              >
                {isEditing ? 'Update Report' : 'Save Report'}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProgressReportPage;
