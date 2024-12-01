import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Card, Typography, Box, Paper } from '@mui/material';
import { showError } from '../ToastConfig';

const UserDashboardPage = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [progressReport, setProgressReport] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);

  const mockMedicalRecords = [
    { id: 1, date: '2024-11-01', diagnosis: 'Flu', treatment: 'Rest and hydration' },
    { id: 2, date: '2024-10-20', diagnosis: 'High Blood Pressure', treatment: 'Medication prescribed' },
  ];
  const mockAppointments = [
    { id: 1, date: '2024-12-01', doctor: 'Dr. John Doe', location: 'Main Clinic' },
    { id: 2, date: '2024-12-10', doctor: 'Dr. Jane Smith', location: 'City Hospital' },
  ];
  const mockProgressReport = {
    overallHealth: 'Good',
    lastUpdated: '2024-11-28',
    notes: 'Maintaining stable blood pressure.',
  };
  const mockPrescriptions = [
    { id: 1, medication: 'Amlodipine', dosage: '5mg daily', duration: '30 days' },
    { id: 2, medication: 'Ibuprofen', dosage: '200mg as needed', duration: '10 days' },
  ];

  const fetchUserData = useCallback(async () => {
    try {
      // Simulate fetching user data (replace with API integration as needed)
      setMedicalRecords(mockMedicalRecords);
      setAppointments(mockAppointments);
      setProgressReport(mockProgressReport);
      setPrescriptions(mockPrescriptions);
    } catch (error) {
      showError('Error fetching user data');
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: (theme) => theme.palette.background.default,
        borderRadius: '12px',
        boxShadow: 3,
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Medical Records Section */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              padding: '20px',
              boxShadow: 3,
              borderRadius: '12px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 5,
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Medical Records
            </Typography>
            {medicalRecords.length > 0 ? (
              medicalRecords.map((record) => (
                <Typography key={record.id} variant="body1" sx={{ marginBottom: '10px' }}>
                  {record.date}: {record.diagnosis} - {record.treatment}
                </Typography>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No medical records available.
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Appointments Section */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              padding: '20px',
              boxShadow: 3,
              borderRadius: '12px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 5,
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <Typography key={appointment.id} variant="body1" sx={{ marginBottom: '10px' }}>
                  {appointment.date}: {appointment.doctor} at {appointment.location}
                </Typography>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No upcoming appointments.
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Progress Report Section */}
        <Grid item xs={12}>
          <Card
            sx={{
              padding: '20px',
              boxShadow: 3,
              borderRadius: '12px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 5,
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Progress Report
            </Typography>
            {progressReport.overallHealth ? (
              <>
                <Typography variant="body1">
                  Overall Health: {progressReport.overallHealth}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Updated: {progressReport.lastUpdated}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: '10px' }}>
                  Notes: {progressReport.notes}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No progress report available.
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Prescriptions Section */}
        <Grid item xs={12}>
          <Card
            sx={{
              padding: '20px',
              boxShadow: 3,
              borderRadius: '12px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 5,
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Prescriptions
            </Typography>
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <Typography key={prescription.id} variant="body1" sx={{ marginBottom: '10px' }}>
                  {prescription.medication} - {prescription.dosage} for {prescription.duration}
                </Typography>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No prescriptions available.
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboardPage;
