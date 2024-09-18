import { createSlice } from '@reduxjs/toolkit'

import { Assessment } from '../models/interface'
import * as assessmentService from '../services/assessment'
import * as audioService from '../services/audio'
import * as testQuestionService from '../services/testQuestion'
import { convertKeysToCamelCase } from '../utils/helper'

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

const assessmentReducer = createSlice({
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
        setInstructionAudioBlobUrl(
            state,
            action: {
                payload: {
                    instructionAudioBlobUrl: string
                    testIndex: number
                }
            }
        ) {
            if (state.assessment) {
                // prettier-ignore
                state.assessment
                    .tests[action.payload.testIndex]
                    .testType
                    .questionType
                    .instructionAudioBlobUrl = action.payload.instructionAudioBlobUrl
            }
        },
        setQuestionAudioBlobUrl(
            state,
            action: {
                payload: {
                    questionAudioBlobUrl: string
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
                    .question
                    .questionAudioBlobUrl = action.payload.questionAudioBlobUrl
            }
        },
        setAnswerAudioBlobUrl(state, action: { payload: string }) {
            if (state.assessment) {
                // prettier-ignore
                state.assessment
                    .tests[state.currentTestIndex!]
                    .testQuestions[state.currentTestQuestionIndex!]
                    .answerAudioBlobUrl = action.payload
            }
        },
        resetAssessment(state) {
            state.assessment = null
            state.currentTestIndex = null
            state.currentTestQuestionIndex = null
        },
    },
})

export const createAssessment = (assessmentTypeId: number, testTakerId: string) => {
    return async (dispatch: any) => {
        const data = await assessmentService.createAssessment(assessmentTypeId, testTakerId)
        const assessment = convertKeysToCamelCase(data)
        dispatch(assessmentReducer.actions.initializeAssessment(assessment))
    }
}

export const fetchInstructionAudio = (
    audio_type: string,
    id: number | string,
    testIndex: number
) => {
    return async (dispatch: any) => {
        const audioUrl = await audioService.getAudio(audio_type, id)
        dispatch(
            assessmentReducer.actions.setInstructionAudioBlobUrl({
                instructionAudioBlobUrl: audioUrl,
                testIndex,
            })
        )
    }
}

export const fetchQuestionAudio = (
    audio_type: string,
    id: number | string,
    testIndex: number,
    testQuestionIndex: number
) => {
    return async (dispatch: any) => {
        const audioUrl = await audioService.getAudio(audio_type, id)
        dispatch(
            assessmentReducer.actions.setQuestionAudioBlobUrl({
                questionAudioBlobUrl: audioUrl,
                testIndex,
                testQuestionIndex,
            })
        )
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
export const { nextTest, nextQuestion, setAnswerAudioBlobUrl, resetAssessment } =
    assessmentReducer.actions
