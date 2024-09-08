import { createSlice } from '@reduxjs/toolkit'

import { Test, TestQuestion } from '../models/interface'
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
        updateTest(state, action: { payload: TestQuestion }) {
            if (state.test) {
                const updatedTestQuestions = state.test.testQuestions.map((testQuestion) =>
                    testQuestion.testQuestionId === action.payload.testQuestionId
                        ? action.payload
                        : testQuestion
                )
                state.test.testQuestions = updatedTestQuestions
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

export const submitTest = (testId: string, testQuestion: TestQuestion[]) => {
    return async (dispatch: any) => {
        await testService.submitTest(testId, testQuestion)
        dispatch(testReducer.actions.submitTest())
    }
}

export default testReducer.reducer
export const { nextQuestion, updateTest } = testReducer.actions
