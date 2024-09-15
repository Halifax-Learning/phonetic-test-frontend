import { Box, Button, Card, Link, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { register } from '../../reducers/userReducer'
import { FormInput, FormInputLabel, theme } from '../../theme/theme'

const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const { handleSubmit, control } = useForm()

    const onSubmit = (data: any) => {
        dispatch(register(data))
    }

    const switchToLogin = () => {
        navigate('/login')
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card variant="outlined" sx={{ maxWidth: 700, padding: 2 }}>
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
                                <FormInput {...field} type="password" />
                            </>
                        )}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ width: '100%', mt: 2, padding: '12px 24px' }}
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
