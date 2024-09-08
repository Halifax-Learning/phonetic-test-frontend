// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#84B46D', // Primary green
    },
    secondary: {
      main: '#6A9FBF', // Primary blue
      light: '#4E97D5', // Tertiary blue
      dark: '#294290', // Secondary blue
    },
    background: {
      default: '#FFFFFF', // White
    },
    text: {
      primary: '#6B6A69', // Dark Grey
      secondary: '#D9D9D9', // Grey
      tertiary: 'E3E3E3', // Light grey
    },
    tertiary: {
      main: '#865FAB', // Primary purple
    },
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: [
      'Inter',
      'Alatsi',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Alatsi', // Title
      fontWeight: 400,
      fontSize: "1.875rem", // 30
    },
    h2: {
      fontFamily: 'Alatsi',
      fontWeight: 400,
      fontSize: "1.125rem", // 18
      textTransform: "uppercase",
    },
    h3: {
      fontFamily: 'Alatsi',
      fontWeight: 400,
      fontSize: "1rem", // 16
    },
    subtitle1: {
      fontFamily: 'Inter',
      fontWeight: 700,
      fontSize: "0.875rem", // 14
    },
    subtitle2: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: "0.875rem", // 14
      textTransform: "uppercase",
    },
    body1: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: "1rem", // 16
    },
    body2: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: "0.875rem", // 14
    },
    button: {
      fontFamily: 'Inter',
      fontWeight: 700,
      fontSize: "0.75rem", // 12
      textTransform: "uppercase",
    },
    caption: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: "0.75rem", // 12
    },
  },
});

export default theme;