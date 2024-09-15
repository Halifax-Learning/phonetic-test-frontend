import { Box, Button, Card, Link, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { login } from '../../reducers/userReducer'
import { FormInput, FormInputLabel, theme } from '../../theme/theme'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const { handleSubmit, control } = useForm()

    const onSubmit = (data: any) => {
        dispatch(login(data.email, data.password))
    }

    const switchToRegister = () => {
        navigate('/register')
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card variant="outlined" sx={{ maxWidth: 700, padding: 2 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Typography variant="body1">
                        To start the assessment, please log in to your account. <br/>If you don't have an
                        account, please register a new account to proceed.
                    </Typography>
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
                        color="secondary"
                        sx={{ width: '100%', mt: 2, padding: '12px 24px' }}
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
        </Box>
    )
}

export default Login
