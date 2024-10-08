import { createSlice } from '@reduxjs/toolkit'

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

export const register = (user: User) => {
    return async (dispatch: any) => {
        const userSnakeCase = convertKeysToSnakeCase(user)
        const data = await userService.register(userSnakeCase)
        const dataCamelCase = convertKeysToCamelCase(data)
        dispatch(userReducer.actions.setUser(dataCamelCase))
    }
}

export const login = (email: string, password: string) => {
    return async (dispatch: any) => {
        const data = await userService.login(email, password)
        const dataCamelCase = convertKeysToCamelCase(data)
        dispatch(userReducer.actions.setUser(dataCamelCase))
    }
}

export const logout = () => {
    return async (dispatch: any) => {
        dispatch(resetRootState())
    }
}

export default userReducer.reducer
export const { retrieveUser } = userReducer.actions
