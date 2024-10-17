import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { verifyEmail } from '../../reducers/userReducer'

const EmailVerification = () => {
    const location = useLocation()
    const dispatch = useDispatch<any>()
    const [message, setMessage] = useState<string>('Loading...')

    const SUCCESS = 'Email verified successfully.'
    const FAIL = 'Email verification failed.'

    const getTokenFromQuery = () => {
        const searchParams = new URLSearchParams(location.search)
        return searchParams.get('token')
    }

    const token = getTokenFromQuery()

    useEffect(() => {
        if (!token) {
            setMessage(FAIL)
            return
        }
        const verify = async () => {
            try {
                await dispatch(verifyEmail(token))
                setMessage(SUCCESS)
            } catch (error: any) {
                console.error(error)
                setMessage(error.response.data.error || FAIL)
            }
        }

        verify()
    }, [token])

    return <Box sx={{ margin: 2 }}>{message}</Box>
}

export default EmailVerification
