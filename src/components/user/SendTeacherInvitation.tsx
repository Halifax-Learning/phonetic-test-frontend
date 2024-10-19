import { Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { sendTeacherInvitation } from '../../reducers/userReducer'
import CustomSnackbar, { OnRequestProps } from '../reusables/CustomSnackbar'

const SendTeacherInvitation = () => {
    const dispatch = useDispatch<any>()
    const [email, setEmail] = useState('')
    const [sendingInProgress, setSendingInProgress] = useState(false)
    const [onSend, setOnSend] = useState<OnRequestProps>({
        display: false,
        message: '',
        color: 'info',
    })

    const onClickSend = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setOnSend({
                display: true,
                message: 'Invalid email format',
                color: 'error',
            })
            return
        }

        try {
            setSendingInProgress(true)
            setOnSend({ display: true, message: 'Sending...', color: 'info' })

            await dispatch(sendTeacherInvitation(email))

            setOnSend({
                display: true,
                message: 'Invitation has been sent successfully!',
                color: 'success',
            })
        } catch (error: any) {
            setOnSend({
                display: true,
                message: error.response.data.error || 'Failed to send invitation!',
                color: 'error',
            })
        } finally {
            setSendingInProgress(false)
        }
    }

    return (
        <Box sx={{ margin: 2 }}>
            <Typography>Send invitation to create teacher account</Typography>
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                sx={{ width: 500, marginTop: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <Button
                variant="contained"
                sx={{ marginTop: 2 }}
                onClick={onClickSend}
                disabled={sendingInProgress}
            >
                Send
            </Button>
            <CustomSnackbar onRequest={onSend} setOnRequest={setOnSend} />
        </Box>
    )
}

export default SendTeacherInvitation
