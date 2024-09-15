import axios from 'axios'

import { User } from '../models/interface'

const baseUrl = 'http://localhost:8000/api'

export const register = async (user: User) => {
    const response = await axios.post(`${baseUrl}/register`, user)
    return response.data
}

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${baseUrl}/login`, { email, password })
    return response.data
}
