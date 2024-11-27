import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4A90E2' }, // Adjusted primary color
    secondary: { main: '#99AAB5' }, // Subtle secondary color
    error: { main: '#FF5555' },
    success: { main: '#43B581' },
    background: {
      default: '#F2F3F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C2F33',
      secondary: '#546E7A',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    button: { textTransform: 'none' },
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 500 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4, color: '#546E7A' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#7289DA',
          color: '#FFFFFF',
          height: '60px',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2F3136',
          color: '#FFFFFF',
          '& .MuiListItem-root:hover': {
            backgroundColor: '#3B4149',
          },
          '& .MuiListItem-root.Mui-selected': {
            backgroundColor: '#4A90E2',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '20px',
          '& .MuiInputBase-root': {
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
  },
});

export default theme;
