import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6F714B',
      light: '#8a8c6b',
      dark: '#4f5135',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FDFBE8',
      light: '#fefcf0',
      dark: '#b1afa2',
      contrastText: '#6F714B',
    },
    background: {
      default: '#FDFBE8',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#6F714B',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#6F714B',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#6F714B',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#6F714B',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#6F714B',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(111, 113, 75, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#6F714B',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6F714B',
            },
          },
        },
      },
    },
  },
});

export default theme;