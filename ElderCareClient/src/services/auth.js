import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const useMockAuthentication = true; // Toggle for mock authentication

// Mock data for authentication
const mockUsers = [
  { email: 'johndoe@gmail.com', password: 'password12', role: 'doctor' },
  { email: 'janedoe@gmail.com', password: 'password123', role: 'caregiver' },
  { email: 'smithrowe@gmail.com', password: 'password1234', role: 'user' },
];

const mockData = {
  login: (user) => ({
    token: 'mock-token',
    role: user.role,
    message: `Mock login successful as ${user.role}`,
  }),
  register: { message: 'Mock signup successful' },
};

const mockDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Authentication services

/**
 * Log in a user.
 */
export const loginUser = async (data) => {
  // Clear any existing session data
  localStorage.removeItem('mockToken');
  localStorage.removeItem('mockRole');

  if (useMockAuthentication) {
    await mockDelay(1000);
    const user = mockUsers.find(
      (u) => u.email === data.email && u.password === data.password
    );
    if (!user) throw new Error('Invalid email or password');
    localStorage.setItem('mockToken', 'mock-token');
    localStorage.setItem('mockRole', user.role);
    return mockData.login(user);
  }
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

/**
 * Register a new user.
 */
export const registerUser = async (data) => {
  if (useMockAuthentication) {
    await mockDelay(1000);
    const existingUser = mockUsers.find((u) => u.email === data.email);
    if (existingUser) throw new Error('User with this email already exists');
    mockUsers.push({
      email: data.email,
      password: data.password,
      role: data.role,
    });
    return mockData.register;
  }
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Signup failed';
    throw new Error(errorMessage);
  }
};

/**
 * Fetch the profile of the currently logged-in user.
 */
export const fetchProfile = async () => {
  if (useMockAuthentication) {
    await mockDelay(1000);
    const role = localStorage.getItem('mockRole');
    if (!role) throw new Error('No role found in session');
    return {
      name: `Mock ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: `mock${role}@example.com`,
      role,
    };
  }
  try {
    const response = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
    throw new Error(errorMessage);
  }
};

/**
 * Update the profile of the currently logged-in user.
 */
export const updateProfile = async (data) => {
  if (useMockAuthentication) {
    await mockDelay(1000);
    return { ...mockData.profile, ...data, message: 'Profile updated successfully' };
  }
  try {
    const response = await axios.put(`${BASE_URL}/users/me`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update profile';
    throw new Error(errorMessage);
  }
};

/**
 * Log out the current user.
 */
export const logoutUser = async () => {
  if (useMockAuthentication) {
    localStorage.clear(); // Clear all session data
    return { message: 'Mock logout successful' };
  }
  try {
    await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    localStorage.clear(); // Clear all session data
    return { message: 'Logout successful' };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Logout failed';
    throw new Error(errorMessage);
  }
};

// Export all functions together for convenience
export default {
  loginUser,
  registerUser,
  fetchProfile,
  updateProfile,
  logoutUser,
};
