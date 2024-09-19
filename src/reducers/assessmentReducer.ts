import { createSlice } from '@reduxjs/toolkit'

import { Assessment, Test } from '../models/interface'
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
        setTest(state, action: { payload: number }) {
            state.currentTestIndex = action.payload
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
        setCorrectAnswerAudioBlobUrl(
            state,
            action: {
                payload: {
                    correctAnswerAudioBlobUrl: string
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
                    .correctAnswerAudioBlobUrl = action.payload.correctAnswerAudioBlobUrl
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
        setTeacherEvaluation(
            state,
            action: {
                payload: {
                    evaluation: boolean
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
                    .latestTeacherEvaluation = action.payload.evaluation
            }
        },
        resetOriginalTeacherEvaluation(state) {
            if (state.assessment) {
                for (const test of state.assessment.tests) {
                    for (const testQuestion of test.testQuestions) {
                        testQuestion.originalTeacherEvaluation =
                            testQuestion.latestTeacherEvaluation
                    }
                }
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

export const fetchAssessment = (assessmentId: string) => {
    return async (dispatch: any) => {
        const data = await assessmentService.getAssessment(assessmentId)
        const assessment = convertKeysToCamelCase(data)
        dispatch(assessmentReducer.actions.initializeAssessment(assessment))

        /**
         * For each testQuestion, the value of originalTeacherEvaluation is the same as the value of
         * latestTeacherEvaluation stored in the database.
         * So when the user changes the latestTeacherEvaluation in the frontend, we can compare it
         * with the originalTeacherEvaluation to determine if the user has made any changes compared
         * to the latestTeacherEvaluation stored in the database.
         * When the user submits the teacher evaluation, we will only consider the test questions
         * that have actual changes.
         * This is to prevent situations where the user submits the teacher evaluation without
         * making any actual changes.
         */
        dispatch(assessmentReducer.actions.resetOriginalTeacherEvaluation())
    }
}

export const submitTeacherEvaluation = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState()

        // get list of test questions that have evaluation changes
        const testQuestions = state.assessment.assessment?.tests.flatMap((test: Test) =>
            test.testQuestions
                .filter(
                    (testQuestion) =>
                        testQuestion.latestTeacherEvaluation !==
                        testQuestion.originalTeacherEvaluation
                )
                .map((testQuestion) => ({
                    testQuestionId: testQuestion.testQuestionId,
                    teacherEvaluation: testQuestion.latestTeacherEvaluation,
                }))
        )

        if (testQuestions.length > 0) {
            await testQuestionService.createTeacherGradings({
                teacherAccountId: state.user.accountId,
                testQuestions: testQuestions,
            })
        }

        // reset original teacher evaluation to reflect the latest changes in database
        dispatch(assessmentReducer.actions.resetOriginalTeacherEvaluation())
    }
}

export const fetchInstructionAudio = (id: number | string, testIndex: number) => {
    return async (dispatch: any) => {
        const audioUrl = await audioService.getAudio('instruction', id)
        dispatch(
            assessmentReducer.actions.setInstructionAudioBlobUrl({
                instructionAudioBlobUrl: audioUrl,
                testIndex,
            })
        )
    }
}

export const fetchQuestionAudio = (
    id: number | string,
    testIndex: number,
    testQuestionIndex: number
) => {
    return async (dispatch: any) => {
        const audioUrl = await audioService.getAudio('question', id)
        dispatch(
            assessmentReducer.actions.setQuestionAudioBlobUrl({
                questionAudioBlobUrl: audioUrl,
                testIndex,
                testQuestionIndex,
            })
        )
    }
}

export const fetchCorrectAnswerAudio = (
    id: number | string,
    testIndex: number,
    testQuestionIndex: number
) => {
    return async (dispatch: any) => {
        const audioUrl = await audioService.getAudio('correct_answer', id)
        dispatch(
            assessmentReducer.actions.setCorrectAnswerAudioBlobUrl({
                correctAnswerAudioBlobUrl: audioUrl,
                testIndex,
                testQuestionIndex,
            })
        )
    }
}

export const fetchAnswerAudio = (
    id: number | string,
    testIndex: number,
    testQuestionIndex: number
) => {
    return async (dispatch: any) => {
        const audioUrl = await audioService.getAudio('answer', id)
        dispatch(
            assessmentReducer.actions.setAnswerAudioBlobUrl({
                answerAudioBlobUrl: audioUrl,
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
export const {
    setTest,
    nextTest,
    nextQuestion,
    setAnswerAudioBlobUrl,
    setTeacherEvaluation,
    resetAssessment,
} = assessmentReducer.actions
