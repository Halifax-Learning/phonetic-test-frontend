import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Card, IconButton, InputAdornment, Link, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useState } from 'react'
import { register } from '../../reducers/userReducer'
import { FormInput, FormInputLabel, theme } from '../../theme/theme'

const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long'),
})

const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const [showPassword, setShowPassword] = useState(false)

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = (data: any) => {
        dispatch(register(data))
    }

    const switchToLogin = () => {
        navigate('/login')
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card variant="outlined" sx={{ width: 600, padding: 2 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Typography variant="body1">Register</Typography>

                    <Controller
                        name="firstName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <>
                                <FormInputLabel htmlFor="firstName">First Name</FormInputLabel>
                                <FormInput {...field} id="firstName" type="text" />
                                {errors.firstName && (
                                    <Typography color="error" variant="caption">
                                        {errors.firstName.message}
                                    </Typography>
                                )}
                            </>
                        )}
                    />

                    <Controller
                        name="lastName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <>
                                <FormInputLabel htmlFor="lastName">Last Name</FormInputLabel>
                                <FormInput {...field} id="lastName" type="text" />
                                {errors.lastName && (
                                    <Typography color="error" variant="caption">
                                        {errors.lastName.message}
                                    </Typography>
                                )}
                            </>
                        )}
                    />
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
                                <FormInputLabel htmlFor="email">Password</FormInputLabel>
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
                        color="secondary"
                        sx={{ width: '100%', mt: 2 }}
                    >
                        Register
                    </Button>
                </Box>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Already have an account?{' '}
                    <Link
                        style={{ color: theme.palette.secondary.main, cursor: 'pointer' }}
                        onClick={switchToLogin}
                    >
                        Login
                    </Link>{' '}
                </Typography>
            </Card>
        </Box>
    )
}

export default Register
