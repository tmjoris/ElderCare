import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../ToastConfig';
import FormInput from '../components/FormInput';
import axios from 'axios';
import apiUrl from '../config';
import { storeSession } from '../api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    setUserRole(role || 'guest');
    setIsAuthenticated(!!token);
  }, []);


  const validateForm = () => {
    const formErrors = {};
    if (!username) formErrors.username = 'Username is required';
    if (!password) formErrors.password = 'Password is required';
    else if (password.length < 6) formErrors.password = 'Password must be at least 6 characters long';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        const { role, message, token } = response.data;
        storeSession({ token, role, username });

        setUserRole(role);
        setIsAuthenticated(true);

        showSuccess(message);

        // The backend issues the role "nurse". The dashboard for that role is
        // named after the caregiver, so both names route to the same place.
        switch (role.toLowerCase()) {
          case 'doctor':
            navigate('/dashboard');
            break;
          case 'caregiver':
          case 'nurse':
            navigate('/caregiver-dashboard');
            break;
          case 'patient':
            navigate('/patient-dashboard');
            break;
          default:
            navigate('/patient-dashboard'); // Fallback
        }
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        showError('Incorrect username or password');
      } else if (err.request && !err.response) {
        showError('Could not reach the server. Check that the API is running.');
      } else {
        showError('Login failed');
      }
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
      margin: 5
    }}
    >
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
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
    </Box>
  );
};

export default LoginPage;
