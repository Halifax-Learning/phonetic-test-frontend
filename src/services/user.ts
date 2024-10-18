import axios from 'axios'

import { User } from '../models/interface'

const baseUrl = import.meta.env.VITE_API_URL

export const register = async (user: User) => {
    const response = await axios.post(`${baseUrl}/register`, user)
    return response.data
}

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${baseUrl}/login`, { email, password })
    return response
}

export const sendVerificationEmail = async (email: string) => {
    const response = await axios.post(`${baseUrl}/send_verification_email`, { email })
    return response.data
}

export const verifyEmail = async (verificationCode: string) => {
    const response = await axios.post(`${baseUrl}/verify_email`, {
        verification_code: verificationCode,
    })
    return response.data
}
