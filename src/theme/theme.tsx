import { Box, Card } from '@mui/material'
import IconButton from '@mui/material/IconButton'
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
            color: '#294290', // Secondary blue
        },
        h2: {
            fontFamily: 'Alatsi',
            fontWeight: 400,
            fontSize: '1.125rem', // 18
            textTransform: 'uppercase',
            color: '#84B46D',
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
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '8px 16px',
                },
            },
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
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.text.secondary}`,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    'label + &': {
        marginTop: theme.spacing(0),
    },
    '&:focus-within': {
        borderColor: theme.palette.secondary.main,
        boxShadow: `${alpha(theme.palette.secondary.main, 0.25)} 0 0 0 0.2rem`,
    },
    '& .MuiInputBase-input': {
        ...theme.typography.body2,
        color: theme.palette.text.primary,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'transparent',
    },
    '& .MuiInputAdornment-root': {
        marginRight: theme.spacing(1),
    },
    '& .MuiIconButton-root': {
        padding: theme.spacing(1),
    },
}))

export const StyledLink = styled(Link)(({ theme }) => ({
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
        backgroundColor: theme.palette.text.secondary,
        outline: 'none',
    },
}))

export const StyledUserIconButton = styled(IconButton)(({ theme }) => ({
    padding: '8px 16px',
    margin: '0 8px',
    borderRadius: theme.shape.borderRadius,
    textDecoration: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
        backgroundColor: theme.palette.text.secondary,
        textDecoration: 'none',
    },
    '& .userName': {
        ...theme.typography.h3,
        color: theme.palette.primary.main,
        marginLeft: '8px',
    },
}))

export const StyledClickableCard = styled(Card)(({ theme }) => ({
    width: '100%',
    height: '100%',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    border: '1px solid',
    borderColor: theme.palette.text.secondary,
    padding: theme.spacing(2),
    cursor: 'pointer',
    boxShadow: 'none',
    transition: theme.transitions.create(['border-color', 'box-shadow', 'transform'], {
        duration: theme.transitions.duration.standard,
    }),
    '&:hover': {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 8px 2px`, // Shadow effect on hover
        borderColor: theme.palette.primary.main, // Border color change on hover
    },
}))

export const StyledSoundCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    border: '1px solid',
    borderColor: theme.palette.secondary.main,
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
}))

export const ButtonBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'right',
    marginTop: theme.spacing(2),
}))
