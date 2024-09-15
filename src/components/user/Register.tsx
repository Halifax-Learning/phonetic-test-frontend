import { Box, Button, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { register } from '../../reducers/userReducer'

const Register = () => {
    const dispatch = useDispatch<any>()
    const { handleSubmit, control } = useForm()

    const onSubmit = (data: any) => {
        dispatch(register(data))
    }

    const switchToLogin = () => {
        dispatch(setScreenToDisplay('Login'))
    }

    return (
        <Box>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Register
                </Typography>

                <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="First Name"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Last Name"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                        />
                    )}
                />

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Register
                </Button>
            </Box>
            Already have an account? <Button onClick={switchToLogin}>Login</Button>
        </Box>
    )
}

export default Register
