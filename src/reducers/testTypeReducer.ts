import { createSlice } from '@reduxjs/toolkit'

import { TestType } from '../models/interface'
import * as testService from '../services/test'
import { convertKeysToCamelCase } from '../utils/helper'

const testTypeReducer = createSlice({
    name: 'testType',
    initialState: [] as TestType[],
    reducers: {
        setAllTestTypes(_state, action: { payload: TestType[] }) {
            return action.payload
        },
    },
})

export const fetchTestTypes = () => {
    return async (dispatch: any) => {
        const data = await testService.getTestTypes()
        const testTypes = convertKeysToCamelCase(data)
        dispatch(testTypeReducer.actions.setAllTestTypes(testTypes))
    }
}

export default testTypeReducer.reducer
