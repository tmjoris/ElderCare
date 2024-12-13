import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../ToastConfig';
import FormInput from '../components/FormInput';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('mockRole');
    const token = localStorage.getItem('mockToken');
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
      const response = await axios.post('http://localhost:8080/api/users/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const { role, message, token } = response.data;
        localStorage.setItem('mockRole', role);
        localStorage.setItem('mockToken', token);
        localStorage.setItem('username', username);
        
        setUserRole(role);
        setIsAuthenticated(true);

        showSuccess(message);
        
        // Navigate based on role
        switch (role.toLowerCase()) {
          case 'doctor':
            navigate('/dashboard');
            break;
          case 'caregiver':
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
      showError('Login failed'); // Show error message from API response
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
  );
};

export default LoginPage;
