import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { sendTeacherInvitation } from '../../reducers/userReducer'

const SendTeacherInvitation = () => {
    const dispatch = useDispatch<any>()
    const [email, setEmail] = useState('')
    const [sendingInProgress, setSendingInProgress] = useState(false)
    const [onSend, setOnSend] = useState<{
        message: string
        color: 'success' | 'error' | 'info' | 'warning'
        display: boolean
    }>({ message: '', color: 'info', display: false })

    const onClickSend = async () => {
        try {
            setSendingInProgress(true)
            setOnSend({ message: 'Sending...', color: 'info', display: true })

            await dispatch(sendTeacherInvitation(email))

            setOnSend({
                message: 'Invitation has been sent successfully!',
                color: 'success',
                display: true,
            })
        } catch (error: any) {
            setOnSend({ message: error.response.data.error, color: 'error', display: true })
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
            <Snackbar
                open={onSend.display}
                onClose={() => setOnSend({ ...onSend, display: false })}
            >
                <Alert
                    onClose={() => setOnSend({ ...onSend, display: false })}
                    severity={onSend.color}
                >
                    {onSend.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default SendTeacherInvitation
