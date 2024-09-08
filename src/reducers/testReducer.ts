import { createSlice } from '@reduxjs/toolkit'

import { Test } from '../models/interface'
import * as testService from '../services/test'
import { convertKeysToCamelCase } from '../utils/helper'

interface TestState {
    test: Test | null
    currentTestQuestionIndex: number | null
}

const initialState: TestState = {
    test: null,
    currentTestQuestionIndex: null,
}

const testReducer = createSlice({
    name: 'test',
    initialState: initialState,
    reducers: {
        createTest(state, action: { payload: Test }) {
            state.test = action.payload
            state.currentTestQuestionIndex = 0
        },
        nextQuestion(state) {
            if (state.currentTestQuestionIndex !== null) {
                state.currentTestQuestionIndex += 1
            }
        },
        submitTest(state) {
            state.test = null
            state.currentTestQuestionIndex = null
        },
    },
})

export const createTest = (testTypeId: number, testTakerId: string) => {
    return async (dispatch: any) => {
        const data = await testService.createTest(testTypeId, testTakerId)
        const test = convertKeysToCamelCase(data)
        dispatch(testReducer.actions.createTest(test))
    }
}

export default testReducer.reducer
export const { nextQuestion, submitTest } = testReducer.actions
