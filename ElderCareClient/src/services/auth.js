import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const useMockAuthentication = true;

// Mock data for authentication
const mockData = {
  login: (role) => ({
    token: 'mock-token',
    role,
    message: `Mock login successful as ${role}`,
  }),
  register: { message: 'Mock signup successful' },
  profile: {
    name: 'Mock User',
    email: 'mockuser@example.com',
    role: localStorage.getItem('mockRole') || 'caregiver',
  },
};

const mockDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginUser = async (data) => {
  if (useMockAuthentication) {
    await mockDelay(1000);
    const role = data.role || 'doctor'; // Default to doctor if role isn't specified
    localStorage.setItem('mockToken', 'mock-token');
    localStorage.setItem('mockRole', role);
    return mockData.login(role);
  }
  try {
    const response = await axios.post(`${BASE_URL}/login`, data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
  }
};


export const registerUser = async (data) => {
  if (useMockAuthentication) {
    await mockDelay(1000);
    return mockData.register;
  }
  try {
    const response = await axios.post(`${BASE_URL}/register`, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Signup failed';
    throw new Error(errorMessage);
  }
};

export const fetchProfile = async () => {
  if (useMockAuthentication) {
    await mockDelay(1000);
    return mockData.profile;
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
