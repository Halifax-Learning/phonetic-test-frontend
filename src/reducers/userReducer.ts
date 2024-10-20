import { createSlice } from '@reduxjs/toolkit'

import axios from 'axios'
import { User } from '../models/interface'
import * as userService from '../services/user'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils/helper'
import { resetRootState } from './actions'

const LOGGED_IN_USER = 'loggedInUser'

const userReducer = createSlice({
    name: 'user',
    initialState: null as User | null,
    reducers: {
        setUser(_state, action) {
            localStorage.setItem(LOGGED_IN_USER, JSON.stringify(action.payload))
            return action.payload
        },
        retrieveUser() {
            const storedUser = localStorage.getItem(LOGGED_IN_USER)
            if (storedUser) {
                return JSON.parse(storedUser)
            }
        },
        clearUser() {
            localStorage.removeItem(LOGGED_IN_USER)
            return null
        },
    },
})

export const register = (user: User, verificationCode: string | null) => {
    return async () => {
        const userSnakeCase = convertKeysToSnakeCase(user)
        await userService.register(userSnakeCase, verificationCode)
    }
}

export const login = (email: string, password: string) => {
    return async (dispatch: any) => {
        try {
            const response = await userService.login(email, password)
            const dataCamelCase = convertKeysToCamelCase(response.data)
            dispatch(userReducer.actions.setUser(dataCamelCase))
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.error || 'Login failed: Unknown error'
                throw new Error(errorMessage)
            } else {
                throw new Error('An unexpected error occurred')
            }
        }
    }
}

export const logout = () => {
    return async (dispatch: any) => {
        dispatch(resetRootState())
    }
}

export const sendVerificationEmail = (email: string) => {
    return async () => {
        await userService.sendVerificationEmail(email)
    }
}

export const verifyEmail = (verificationCode: string) => {
    return async () => {
        await userService.verifyEmail(verificationCode)
    }
}

export const sendTeacherInvitation = (email: string) => {
    return async () => {
        await userService.sendTeacherInvitation(email)
    }
}

export default userReducer.reducer
export const { retrieveUser } = userReducer.actions
