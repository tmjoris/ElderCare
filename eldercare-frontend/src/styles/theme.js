import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4A90E2' },
    secondary: { main: '#99AAB5' },
    error: { main: '#FF5555' },
    success: { main: '#43B581' },
    background: {
      default: '#F9FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C2F33',
      secondary: '#546E7A',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 500 },
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 500 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4, color: '#546E7A' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0,0,0,0.15)',
          },
          '&:focus': {
            outline: '2px solid #4A90E2',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#4A90E2',
          color: '#FFFFFF',
          height: '64px', // Ensure consistent height
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 1400, // Ensure it stays above other elements
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2F3136',
          color: '#FFFFFF',
          width: '240px', // Consistent width for open state
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          '& .MuiListItem-root': {
            transition: 'background-color 0.2s ease',
          },
          '& .MuiListItem-root:hover': {
            backgroundColor: '#3B4149',
          },
          '& .MuiListItem-root.Mui-selected': {
            backgroundColor: '#4A90E2',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
          '& .MuiInputBase-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: '4px',
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4A90E2',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F5F7FA',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: '#2C2F33',
          fontWeight: 700,
        },
        h2: {
          color: '#2C2F33',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
