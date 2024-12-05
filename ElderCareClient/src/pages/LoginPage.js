import React, { useState } from 'react';
import { Button, Card, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../ToastConfig';
import FormInput from '../components/FormInput';

const useMockAuthentication = true;

// Preloaded mock users
const mockUsers = [
  { email: 'johndoe@gmail.com', password: 'password12', role: 'doctor' },
  { email: 'johndoe2@gmail.com', password: 'password12', role: 'doctor' },
  { email: 'jane1@gmail.com', password: 'password123', role: 'caregiver' },
  { email: 'jane2@gmail.com', password: 'password123', role: 'caregiver' },
  { email: 'smithrowe@gmail.com', password: 'password1234', role: 'patient' },
  { email: 'smithrowe2@gmail.com', password: 'password1234', role: 'patient' },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const formErrors = {};
    if (!email) formErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = 'Invalid email format';
    if (!password) formErrors.password = 'Password is required';
    else if (password.length < 6) formErrors.password = 'Password must be at least 6 characters long';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    localStorage.removeItem('mockToken');
    localStorage.removeItem('mockRole');

    if (useMockAuthentication) {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        localStorage.setItem('mockToken', 'mock-token');
        localStorage.setItem('mockRole', user.role);
        showSuccess(`Login successful as ${user.role}`);
        navigate(
          user.role === 'doctor'
            ? '/dashboard'
            : user.role === 'caregiver'
            ? '/caregiver-dashboard'
            : '/user-dashboard'
        );
      } else {
        showError('Invalid email or password');
      }
      return;
    }

    // Backend integration logic (commented for mock)
    // try {
    //   const response = await loginUser({ email, password });
    //   localStorage.setItem('token', response.token);
    //   localStorage.setItem('role', response.role);
    //   showSuccess('Login successful!');
    //   navigate(
    //     response.role === 'doctor'
    //       ? '/dashboard'
    //       : response.role === 'caregiver'
    //       ? '/caregiver-dashboard'
    //       : '/user-dashboard'
    //   );
    // } catch (err) {
    //   showError(err.message || 'Login failed');
    // }
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
