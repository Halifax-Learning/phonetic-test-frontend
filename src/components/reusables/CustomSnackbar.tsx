import { Alert, Snackbar } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'

export interface OnRequestProps {
    display: boolean
    message: string
    color: 'success' | 'error' | 'info' | 'warning'
}

interface CustomSnackbarProps {
    onRequest: OnRequestProps
    setOnRequest: Dispatch<SetStateAction<OnRequestProps>>
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
    onRequest,
    setOnRequest,
}: CustomSnackbarProps) => {
    return (
        <Snackbar
            open={onRequest.display}
            onClose={() => setOnRequest({ ...onRequest, display: false })}
        >
            <Alert
                onClose={() => setOnRequest({ ...onRequest, display: false })}
                severity={onRequest.color}
            >
                {onRequest.message}
            </Alert>
        </Snackbar>
    )
}

export const SimpleCustomSnackbar: React.FC<OnRequestProps> = ({
    display,
    message,
    color,
}: OnRequestProps) => {
    const [open, setOpen] = useState(display)

    return (
        <Snackbar open={open} onClose={() => setOpen(false)}>
            <Alert severity={color} onClose={() => setOpen(false)}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default CustomSnackbar
