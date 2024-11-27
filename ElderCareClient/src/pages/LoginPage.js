import React, { useState } from 'react';
import { Button, Card, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth'; // Ensure this is correctly imported
import { showSuccess, showError } from '../ToastConfig';
import FormInput from '../components/FormInput';

const useMockAuthentication = true; // Toggle for mock authentication

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const formErrors = {};
    if (!email) formErrors.email = 'Email is required';
    if (!password) formErrors.password = 'Password is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    if (useMockAuthentication) {
      localStorage.setItem('mockToken', 'mock-token');
      const role = localStorage.getItem('mockRole') || 'doctor';
      showSuccess(`Mock login successful as ${role}`);
      setEmail('');
      setPassword('');
      navigate(role === 'doctor' ? '/dashboard' : '/caregiver-dashboard');
      return;
    }
  
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      showSuccess('Login successful!');
      setEmail('');
      setPassword('');
      navigate(response.role === 'doctor' ? '/dashboard' : '/caregiver-dashboard');
    } catch (err) {
      showError(err.message || 'Login failed');
    }
  };
  

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Card
        sx={{
          padding: '30px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: 3,
          borderRadius: '12px',
          textAlign: 'center',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate>
          <FormInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <FormInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: '10px 20px',
              marginTop: '10px',
            }}
          >
            Login
          </Button>
        </Box>
        <Typography variant="body2" sx={{ marginTop: '15px', color: 'text.secondary' }}>
          Don’t have an account?{' '}
          <a href="/signup" style={{ color: 'primary.main', textDecoration: 'none' }}>
            Sign Up
          </a>
        </Typography>
      </Card>
    </Container>
  );
};

export default LoginPage;
