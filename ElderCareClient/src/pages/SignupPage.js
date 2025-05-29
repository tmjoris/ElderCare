import React, { useState } from 'react';
import {
  Card,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Container,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../ToastConfig';
import FormInput from '../components/FormInput';
import apiUrl from '../config';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    primaryLocation: '',
    role: '',
    privileges: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const formErrors = {};
    if (!formData.username) formErrors.username = 'Username is required';
    if (!formData.firstName) formErrors.firstName = 'First Name is required';
    if (!formData.secondName) formErrors.secondName = 'Second Name is required';
    if (!formData.email) formErrors.email = 'Email is required';
    if (!formData.password) formErrors.password = 'Password is required';
    if (!formData.primaryLocation)
      formErrors.primaryLocation = 'Primary Location is required';
    if (!formData.role) formErrors.role = 'Role is required';
    if (!formData.privileges) formErrors.privileges = 'Privileges are required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${apiUrl}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Signup failed');
      }

      showSuccess('Signup successful! Please login.');
      setFormData({
        username: '',
        firstName: '',
        secondName: '',
        email: '',
        password: '',
        primaryLocation: '',
        role: '',
        privileges: '',
      });
      navigate('/login');
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <Box
    sx={{
      height:'100vh',
      backgroundImage:'url(/homecare.jpg)',
      backgroundPosition:'center',
      backgroundRepeat:'no-repeat',
      backgroundSize: 'cover',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 7
    }}
    >

   
      <Card
        sx={{
          padding: '30px',
          boxShadow: 3,
          borderRadius: '12px',
          width: '30%',
          backgroundColor: (theme) => theme.palette.background.paper,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSignup}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          {[
            { label: 'Username', name: 'username' },
            { label: 'First Name', name: 'firstName' },
            { label: 'Second Name', name: 'secondName' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Primary Location', name: 'primaryLocation' },
          ].map((field) => (
            <FormInput
              key={field.name}
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              type={field.type || 'text'}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
            />
          ))}

          <FormControl fullWidth margin="normal" error={!!errors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="">
                <em>Select Role</em>
              </MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="caregiver">Caregiver</MenuItem>
              <MenuItem value="patient">Patient</MenuItem>
            </Select>
            {errors.role && (
              <Typography variant="body2" color="error" sx={{ marginTop: '5px' }}>
                {errors.role}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.privileges}>
            <InputLabel>Privileges</InputLabel>
            <Select
              name="privileges"
              value={formData.privileges}
              onChange={handleChange}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="">
                <em>Select Privileges</em>
              </MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="supervisor">Supervisor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>


            </Select>
            {errors.privileges && (
              <Typography variant="body2" color="error" sx={{ marginTop: '5px' }}>
                {errors.privileges}
              </Typography>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: '10px',
              fontWeight: 'bold',
              borderRadius: '8px',
            }}
          >
            Sign Up
          </Button>
        </Box>
        <Typography align="center" sx={{ marginTop: '20px', color: 'text.secondary' }}>
          Already have an account?{' '}
          <a
            href="/login"
            style={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Login
          </a>
        </Typography>
      </Card>
    </Box>
  );
};

export default SignupPage;
