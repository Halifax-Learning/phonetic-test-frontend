import { createSlice } from '@reduxjs/toolkit'
import jsPDF from 'jspdf'

import { Assessment } from '../models/interface'
import * as assessmentService from '../services/assessment'
import * as testQuestionService from '../services/testQuestion'
import { convertKeysToCamelCase } from '../utils/helper'
import { handleSetAudioBlobUrls, setAudioBlobUrlsRegular } from './actions'

interface AssessmentState {
    assessment: Assessment | null
    currentTestIndex: number | null
    currentTestQuestionIndex: number | null
    isInProgress: boolean | null
}

const initialState: AssessmentState = {
    assessment: null,
    currentTestIndex: null,
    currentTestQuestionIndex: null,
    isInProgress: null,
}

export const assessmentReducer = createSlice({
    name: 'assessment',
    initialState: initialState,
    reducers: {
        initializeAssessment(
            state,
            action: {
                payload: {
                    assessment?: Assessment
                    currentTestIndex?: number
                    currentTestQuestionIndex?: number
                    isInProgress?: boolean
                }
            }
        ) {
            state.assessment = action.payload.assessment ?? null
            state.currentTestIndex = action.payload.currentTestIndex ?? 0
            state.currentTestQuestionIndex = action.payload.currentTestQuestionIndex ?? 0
            state.isInProgress = action.payload.isInProgress ?? true
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
                state.assessment.tests[action.payload.testIndex].testQuestions[
                    action.payload.testQuestionIndex
                ].answerAudioBlobUrl = action.payload.answerAudioBlobUrl
            }
        },
        resetAssessment(state) {
            state.assessment = null
            state.currentTestIndex = null
            state.currentTestQuestionIndex = null
            state.isInProgress = false
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setAudioBlobUrlsRegular, handleSetAudioBlobUrls)
    },
})

export const createAssessment = (assessmentTypeId: number) => {
    return async (dispatch: any) => {
        const data = await assessmentService.createAssessment(assessmentTypeId)
        const assessment = convertKeysToCamelCase(data)
        dispatch(assessmentReducer.actions.initializeAssessment({ assessment }))
    }
}

export const fetchInProgressAssessment = () => {
    return async (dispatch: any) => {
        const data = await assessmentService.getInProgressAssessment()
        if (!data) {
            dispatch(assessmentReducer.actions.initializeAssessment({ isInProgress: false }))
        } else {
            const assessment = convertKeysToCamelCase(data)

            // Find the first test question in the assessment that has not been answered
            let currentTestIndex = 0
            let currentTestQuestionIndex = 0
            let found = false
            for (let i = 0; i < assessment.tests.length; i++) {
                if (assessment.tests[i].testSubmissionTime) {
                    continue
                }
                for (let j = 0; j < assessment.tests[i].testQuestions.length; j++) {
                    if (!assessment.tests[i].testQuestions[j].testQuestionSubmissionTime) {
                        currentTestIndex = i
                        currentTestQuestionIndex = j
                        found = true
                        break
                    }
                }
                if (found) {
                    break
                }
            }

            dispatch(
                assessmentReducer.actions.initializeAssessment({
                    assessment,
                    currentTestIndex,
                    currentTestQuestionIndex,
                })
            )
        }
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
            try {
                await testQuestionService.updateTestQuestion(
                    testQuestion.testQuestionId,
                    testQuestion.answerText,
                    testQuestion.answerAudioBlobUrl
                )
            } catch {
                throw new Error('Failed to submit the answer. Please try again.')
            }
        }
    }
}

export const sendAssessmentResult = (
    testTakerEmail: string,
    emailContent: string,
    doc: jsPDF | null
) => {
    return async () => {
        await assessmentService.sendAssessmentResult(testTakerEmail, emailContent, doc)
    }
}

export default assessmentReducer.reducer
export const { nextTest, nextQuestion, resetAssessment, setAnswerAudioBlobUrl } =
    assessmentReducer.actions
