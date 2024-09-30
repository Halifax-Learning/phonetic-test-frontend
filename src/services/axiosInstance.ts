import axios from 'axios'
import { store } from '../main.js'

const baseUrl = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
    baseURL: baseUrl,
})

axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().user?.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosInstance
