import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import apiUrl from "../config";

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    patientId: "",
    doctorId: "",
    dateOfVisit: "",
    location: "",
    diagnosis: "",
    treatmentPlan: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const username = localStorage.getItem('username');
  const loggedInUserRole = localStorage.getItem('mockRole');

  const fetchUserId = async (username) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/users/username/${username}`
      );
      return response.data.id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      throw new Error("User ID fetch failed");
    }
  };

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const userId = await fetchUserId(username);
        let appointmentsUrl;

        switch (loggedInUserRole) {
          case "doctor":
            appointmentsUrl = `${apiUrl}/api/medical-records/doctor/${userId}`;
            break;
          case "patient":
            appointmentsUrl = `${apiUrl}/api/medical-records/patient/${userId}`;
            break;
          case "caregiver":
            appointmentsUrl = `${apiUrl}/api/medical-records`;
            break;
          default:
            console.error("Invalid user role");
            return;
        }

        const response = await axios.get(appointmentsUrl);
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching medical records:", error);
      }
    };

    fetchMedicalRecords();
  }, [loggedInUserRole, username]);

  const validateForm = () => {
    const newErrors = {};
    if (!newRecord.patientId) newErrors.patientId = "Patient ID is required";
    if (!newRecord.doctorId) newErrors.doctorId = "Doctor ID is required";
    if (!newRecord.dateOfVisit) newErrors.dateOfVisit = "Date of visit is required";
    if (!newRecord.location) newErrors.location = "Location is required";
    if (!newRecord.diagnosis) newErrors.diagnosis = "Diagnosis is required";
    if (!newRecord.treatmentPlan)
      newErrors.treatmentPlan = "Treatment plan is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRecord = async () => {
    if (!validateForm()) return;

    try {
      let response;
      if (isEditing) {
        response = await axios.put(
          `${apiUrl}/api/medical-records/${editingId}`,
          newRecord
        );
        setRecords((prev) =>
          prev.map((record) =>
            record.id === editingId ? response.data : record
          )
        );
      } else {
        response = await axios.post(
          `${apiUrl}/api/medical-records`,
          newRecord
        );
        setRecords((prev) => [...prev, response.data]);
      }
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving medical record:", error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const handleEditRecord = (record) => {
    setIsEditing(true);
    setEditingId(record.id);
    setNewRecord(record);
    setOpen(true);
  };

  const handleDeleteRecord = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/medical-records/${id}`);
      setRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Error deleting medical record:", error);
    }
  };

  const resetForm = () => {
    setNewRecord({
      patientId: "",
      doctorId: "",
      dateOfVisit: "",
      location: "",
      diagnosis: "",
      treatmentPlan: "",
      notes: "",
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div>
      <h1>Medical Records</h1>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add New Record
      </Button>
  
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Doctor ID</TableCell>
              <TableCell>Date of Visit</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Treatment Plan</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.patientId}</TableCell>
                <TableCell>{record.doctorId}</TableCell>
                <TableCell>{formatDate(record.dateOfVisit)}</TableCell>
                <TableCell>{record.location}</TableCell>
                <TableCell>{record.diagnosis}</TableCell>
                <TableCell>{record.treatmentPlan}</TableCell>
                <TableCell>{record.notes}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditRecord(record)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteRecord(record.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEditing ? "Edit Record" : "Add New Record"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Patient ID"
            fullWidth
            margin="normal"
            value={newRecord.patientId}
            onChange={(e) =>
              setNewRecord({ ...newRecord, patientId: e.target.value })
            }
            error={!!errors.patientId}
            helperText={errors.patientId}
          />
          <TextField
            label="Doctor ID"
            fullWidth
            margin="normal"
            value={newRecord.doctorId}
            onChange={(e) =>
              setNewRecord({ ...newRecord, doctorId: e.target.value })
            }
            error={!!errors.doctorId}
            helperText={errors.doctorId}
          />
          <TextField
            label="Date of Visit"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newRecord.dateOfVisit}
            onChange={(e) =>
              setNewRecord({ ...newRecord, dateOfVisit: e.target.value })
            }
            error={!!errors.dateOfVisit}
            helperText={errors.dateOfVisit}
          />
          <TextField
            label="Location"
            fullWidth
            margin="normal"
            value={newRecord.location}
            onChange={(e) =>
              setNewRecord({ ...newRecord, location: e.target.value })
            }
            error={!!errors.location}
            helperText={errors.location}
          />
          <TextField
            label="Diagnosis"
            fullWidth
            margin="normal"
            value={newRecord.diagnosis}
            onChange={(e) =>
              setNewRecord({ ...newRecord, diagnosis: e.target.value })
            }
            error={!!errors.diagnosis}
            helperText={errors.diagnosis}
          />
          <TextField
            label="Treatment Plan"
            fullWidth
            margin="normal"
            value={newRecord.treatmentPlan}
            onChange={(e) =>
              setNewRecord({ ...newRecord, treatmentPlan: e.target.value })
            }
            error={!!errors.treatmentPlan}
            helperText={errors.treatmentPlan}
          />
          <TextField
            label="Notes"
            fullWidth
            margin="normal"
            value={newRecord.notes}
            onChange={(e) =>
              setNewRecord({ ...newRecord, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveRecord} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
  export default MedicalRecordsPage;
