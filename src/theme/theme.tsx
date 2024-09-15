import InputBase from '@mui/material/InputBase'
import InputLabel from '@mui/material/InputLabel'
import { alpha, createTheme, styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'

export const theme = createTheme({
    palette: {
        primary: {
            main: '#84B46D', // Primary green
            contrastText: '#fff',
        },
        secondary: {
            main: '#6A9FBF', // Primary blue
            light: '#4E97D5', // Tertiary blue
            dark: '#294290', // Secondary blue
            contrastText: '#fff',
        },
        background: {
            default: '#FFFFFF', // White
        },
        text: {
            primary: '#6B6A69', // Dark Grey
            secondary: '#D9D9D9', // Grey
        },
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: ['Inter', 'Alatsi', 'Arial', 'sans-serif'].join(','),
        h1: {
            fontFamily: 'Alatsi', // Title
            fontWeight: 400,
            fontSize: '1.875rem', // 30
        },
        h2: {
            fontFamily: 'Alatsi',
            fontWeight: 400,
            fontSize: '1.125rem', // 18
            textTransform: 'uppercase',
        },
        h3: {
            fontFamily: 'Alatsi',
            fontWeight: 400,
            fontSize: '1rem', // 16
        },
        subtitle1: {
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '0.875rem', // 14
        },
        subtitle2: {
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '0.875rem', // 14
            textTransform: 'uppercase',
        },
        body1: {
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '1rem', // 16
        },
        body2: {
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '0.875rem', // 14
        },
        button: {
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '0.75rem', // 12
            textTransform: 'uppercase',
        },
        caption: {
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '0.75rem', // 12
        },
    },
})

export const FormInputLabel = styled(InputLabel)(({ theme }) => ({
    ...theme.typography.subtitle1,
    color: theme.palette.secondary.main,
    marginTop: theme.spacing(2),
}))

export const FormInput = styled(InputBase)(({ theme }) => ({
    width: '100%',
    'label + &': {
        marginTop: theme.spacing(0),
    },
    '& .MuiInputBase-input': {
        ...theme.typography.body2,
        color: theme.palette.text.primary,
        borderRadius: theme.shape.borderRadius,
        position: 'relative',
        backgroundColor: theme.palette.background,
        border: '1px solid',
        borderColor: theme.palette.text.secondary,
        width: '100%',
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
        ...theme.applyStyles('dark', {
            backgroundColor: '#1A2027',
            borderColor: '#2D3843',
        }),
    },
}))

export const StyledLink  = styled(Link)(({ theme }) => ({
  ...theme.typography.h3,
  color: theme.palette.secondary.dark,
  textDecoration: 'none',
  padding: '8px 16px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'transparent',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  display: 'inline-block',
  '&:hover': {
      backgroundColor: theme.palette.text.secondary,
  },
  '&:focus': {
      backgroundColor: theme.palette.grey[300],
      outline: 'none',
  },
}));
