import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Card, IconButton, InputAdornment, Link, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import React, { useState } from 'react'
import { login } from '../../reducers/userReducer'
import { FormInput, FormInputLabel, theme } from '../../theme/theme'

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().required('Password is required'),
})

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} {...props} />
})

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema), // Use Yup schema for validation
    })
    const [showPassword, setShowPassword] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')

    const onSubmit = async (data: any) => {
        try {
            await dispatch(login(data.email, data.password))

            // Handle successful login (e.g., navigate to a dashboard)
            console.log('Login successful')
        } catch (error: any) {
            // Catch and handle login failure
            console.error('Login failed:', error)

            // Update snackbar message and open it
            setSnackbarMessage(error.message || 'Login failed. Please try again.')
            setOpenSnackbar(true)
        }
    }

    const switchToRegister = () => {
        navigate('/register')
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card variant="outlined" sx={{ maxWidth: 600, padding: 2 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Typography variant="body1">
                        To start the assessment, please log in to your account. <br />
                        If you don&apos;t have an account, please register a new account to proceed.
                    </Typography>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <>
                                <FormInputLabel htmlFor="email">Email</FormInputLabel>
                                <FormInput {...field} id="email" type="email" />
                                {errors.email && (
                                    <Typography color="error" variant="caption">
                                        {errors.email.message}
                                    </Typography>
                                )}
                            </>
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <>
                                <FormInputLabel htmlFor="password">Password</FormInputLabel>
                                <FormInput
                                    {...field}
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {errors.password && (
                                    <Typography color="error" variant="caption">
                                        {errors.password.message}
                                    </Typography>
                                )}
                            </>
                        )}
                    />
                    <Button type="submit" variant="contained" sx={{ width: '100%', mt: 2 }}>
                        Login
                    </Button>
                </Box>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    New user?{' '}
                    <Link
                        style={{ color: theme.palette.secondary.main, cursor: 'pointer' }}
                        onClick={switchToRegister}
                    >
                        Register
                    </Link>
                </Typography>
            </Card>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Login
