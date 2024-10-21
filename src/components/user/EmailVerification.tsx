import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { verifyEmail } from '../../reducers/userReducer'
import { logError } from '../../utils/logger'

const EmailVerification = () => {
    const location = useLocation()
    const dispatch = useDispatch<any>()
    const [message, setMessage] = useState<string>('Loading...')

    const SUCCESS = 'Email verified successfully.'
    const FAIL = 'Email verification failed.'

    const getVerificationCodeFromQuery = () => {
        const searchParams = new URLSearchParams(location.search)
        return searchParams.get('verification_code')
    }

    const verificationCode = getVerificationCodeFromQuery()

    useEffect(() => {
        if (!verificationCode) {
            setMessage(FAIL)
            return
        }
        const verify = async () => {
            try {
                await dispatch(verifyEmail(verificationCode))
                setMessage(SUCCESS)
            } catch (error: any) {
                setMessage(error.response.data.error || FAIL)
                logError('Email verification failed:', error)
            }
        }

        verify()
    }, [])

    return <Box sx={{ margin: 2 }}>{message}</Box>
}

export default EmailVerification
