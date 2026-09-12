import axios from 'axios';

/**
 * Global axios configuration, imported once from main.jsx.
 *
 * The backend now runs behind a Spring Security filter chain, so every request
 * other than register and login needs a bearer token. The pages call axios
 * directly, so attaching the token here covers all of them rather than each
 * call site remembering to do it.
 */

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getRole = () => localStorage.getItem(ROLE_KEY);

export const storeSession = ({ token, role, username }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem('username', username);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem('username');
};

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401 means the token is missing, expired or not ours. Anything cached in
    // localStorage is now useless, so clear it and send the user back to login
    // rather than leaving a dashboard that fails every request.
    if (status === 401 && !window.location.pathname.startsWith('/login')) {
      clearSession();
      window.location.assign('/login');
    }

    return Promise.reject(error);
  }
);

export default axios;
