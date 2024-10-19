import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, Card, IconButton, InputAdornment, Link, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { login } from '../../reducers/userReducer'
import { FormInput, FormInputLabel, theme } from '../../theme/theme'
import CustomSnackbar, { OnRequestProps } from '../reusables/CustomSnackbar'

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().required('Password is required'),
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

    const [loginInProgress, setLoginInProgress] = useState(false)
    const [onLogin, setOnLogin] = useState<OnRequestProps>({
        display: false,
        message: '',
        color: 'info',
    })

    const onSubmit = async (data: any) => {
        try {
            setLoginInProgress(true)
            await dispatch(login(data.email, data.password))
        } catch (error: any) {
            setOnLogin({
                display: true,
                message: error.message || 'Login failed. Please try again.',
                color: 'error',
            })
        } finally {
            setLoginInProgress(false)
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
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ width: '100%', mt: 2 }}
                        disabled={loginInProgress}
                    >
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

            <CustomSnackbar onRequest={onLogin} setOnRequest={setOnLogin} />
        </Box>
    )
}

export default Login
