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

const useMockAuthentication = true; // Toggle for mock functionality

const mockUsers = []; // Array to simulate a mock user database

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const formErrors = {};
    if (!formData.name) formErrors.name = 'Name is required';
    if (!formData.email) formErrors.email = 'Email is required';
    if (!formData.password) formErrors.password = 'Password is required';
    if (!formData.role) formErrors.role = 'Role is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (useMockAuthentication) {
      // Mock signup logic
      const isDuplicate = mockUsers.some((user) => user.email === formData.email);
      if (isDuplicate) {
        showError('User already exists!');
        return;
      }

      // Add user to mock database
      mockUsers.push(formData);
      showSuccess('Mock signup successful! Please login.');

      // Clear form and redirect to login
      setFormData({ name: '', email: '', password: '', role: '' });
      navigate('/login');
      return;
    }

    try {
      // Backend signup logic (commented out)
      // await registerUser(formData);
      showSuccess('Signup successful! Please login.');
      setFormData({ name: '', email: '', password: '', role: '' });
      navigate('/login');
    } catch (err) {
      showError(err.message || 'Signup failed');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Card
        sx={{
          padding: '30px',
          boxShadow: 3,
          borderRadius: '12px',
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
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <FormInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            error={!!errors.email}
            helperText={errors.email}
          />
          <FormInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            error={!!errors.password}
            helperText={errors.password}
          />
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
    </Container>
  );
};

export default SignupPage;
