import { createSlice } from '@reduxjs/toolkit'

import { Assessment } from '../models/interface'
import * as assessmentService from '../services/assessment'
import * as testQuestionService from '../services/testQuestion'
import { convertKeysToCamelCase } from '../utils/helper'
import { handleSetAudioBlobUrls, setAudioBlobUrls } from './actions'

interface AssessmentState {
    assessment: Assessment | null
    currentTestIndex: number | null
    currentTestQuestionIndex: number | null
}

const initialState: AssessmentState = {
    assessment: null,
    currentTestIndex: null,
    currentTestQuestionIndex: null,
}

export const assessmentReducer = createSlice({
    name: 'assessment',
    initialState: initialState,
    reducers: {
        initializeAssessment(state, action: { payload: Assessment }) {
            state.assessment = action.payload
            state.currentTestIndex = 0
            state.currentTestQuestionIndex = 0
        },
        nextTest(state) {
            if (state.currentTestIndex !== null) {
                state.currentTestIndex += 1
                state.currentTestQuestionIndex = 0
            }
        },
        nextQuestion(state) {
            if (state.currentTestQuestionIndex !== null) {
                state.currentTestQuestionIndex += 1
            }
        },
        setAnswerAudioBlobUrl(
            state,
            action: {
                payload: {
                    answerAudioBlobUrl: string
                    testIndex: number
                    testQuestionIndex: number
                }
            }
        ) {
            if (state.assessment) {
                // prettier-ignore
                state.assessment
                    .tests[action.payload.testIndex]
                    .testQuestions[action.payload.testQuestionIndex]
                    .answerAudioBlobUrl = action.payload.answerAudioBlobUrl
            }
        },
        resetAssessment(state) {
            state.assessment = null
            state.currentTestIndex = null
            state.currentTestQuestionIndex = null
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setAudioBlobUrls, handleSetAudioBlobUrls)
    },
})

export const createAssessment = (assessmentTypeId: number) => {
    return async (dispatch: any) => {
        const data = await assessmentService.createAssessment(assessmentTypeId)
        const assessment = convertKeysToCamelCase(data)
        dispatch(assessmentReducer.actions.initializeAssessment(assessment))
    }
}

export const submitTestQuestion = () => {
    return async (_dispatch: any, getState: any) => {
        const state = getState()

        const testIdx = state.assessment.currentTestIndex
        const questionIdx = state.assessment.currentTestQuestionIndex

        const testQuestion =
            state.assessment.assessment?.tests[testIdx!].testQuestions[questionIdx!]

        if (testQuestion) {
            await testQuestionService.updateTestQuestion(
                testQuestion.testQuestionId,
                testQuestion.answerText,
                testQuestion.answerAudioBlobUrl
            )
        }
    }
}

export default assessmentReducer.reducer
export const { nextTest, nextQuestion, resetAssessment, setAnswerAudioBlobUrl } =
    assessmentReducer.actions
