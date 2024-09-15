import { createSlice } from '@reduxjs/toolkit'

import { User } from '../models/interface'
import * as userService from '../services/user'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils/helper'

const userReducer = createSlice({
    name: 'user',
    initialState: null as User | null,
    reducers: {
        setUser(_state, action) {
            return action.payload
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

export default userReducer.reducer
