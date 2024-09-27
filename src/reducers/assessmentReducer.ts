import { createSlice } from '@reduxjs/toolkit'

import { Assessment, TeacherGradingHistory, Test, TestQuestion, User } from '../models/interface'
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

const CURRENT_GRADING_ASSESSMENT_ID: string = 'currentGradingAssessmentId'

const assessmentReducer = createSlice({
    name: 'assessment',
    initialState: initialState,
    reducers: {
        initializeAssessment(state, action: { payload: Assessment }) {
            state.assessment = action.payload
            state.currentTestIndex = 0
            state.currentTestQuestionIndex = 0
            localStorage.setItem(CURRENT_GRADING_ASSESSMENT_ID, action.payload.assessmentId)
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
        setAudioBlobUrls(
            state,
            action: {
                payload: {
                    audioUrls: { [filename: string]: string }
                    testIndex: number
                }
            }
        ) {
            const audioUrls = action.payload.audioUrls
            const testIndex = action.payload.testIndex

            if (state.assessment) {
                const test = state.assessment.tests[testIndex]
                const numQuestions = test.testQuestions.length

                test.testType.questionType.instructionAudioBlobUrl = audioUrls['instruction.mp3']

                for (let i = 0; i < numQuestions; i++) {
                    test.testQuestions[i].question.questionAudioBlobUrl =
                        audioUrls[`question_${i}.mp3`]

                    test.testQuestions[i].question.correctAnswerAudioBlobUrl =
                        audioUrls[`correct_answer_${i}.mp3`]

                    test.testQuestions[i].answerAudioBlobUrl = audioUrls[`answer_${i}.mp3`]
                }

                test.hasFetchedAudio = true
            }
        },
        setTeacherEvaluation(
            state,
            action: {
                payload: {
                    evaluation: boolean
                    comment: string
                    testIndex: number
                    testQuestionIndex: number
                }
            }
        ) {
            if (state.assessment) {
                // update the latest teacher evaluation
                // prettier-ignore
                state.assessment
                    .tests[action.payload.testIndex]
                    .testQuestions[action.payload.testQuestionIndex]
                    .latestTeacherEvaluation = action.payload.evaluation

                // update the latest teacher comment
                // prettier-ignore
                state.assessment
                    .tests[action.payload.testIndex]
                    .testQuestions[action.payload.testQuestionIndex]
                    .latestTeacherComment = action.payload.comment
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
        updateGradingHistory(
            state,
            action: {
                payload: {
                    user: User
                    testQuestions: TestQuestion[]
                }
            }
        ) {
            if (state.assessment) {
                for (const testQuestion of action.payload.testQuestions) {
                    const gradingHistory: TeacherGradingHistory = {
                        teacherGradingHistoryId: new Date().toString(),
                        teacherAccount: action.payload.user,
                        teacherEvaluation: testQuestion.latestTeacherEvaluation,
                        teacherComment: testQuestion.latestTeacherComment,
                        createdAt: new Date().toISOString(),
                    }

                    for (const test of state.assessment.tests) {
                        for (const tq of test.testQuestions) {
                            if (tq.testQuestionId === testQuestion.testQuestionId) {
                                tq.teacherGradingHistory.unshift(gradingHistory)
                                break
                            }
                        }
                    }
                }
            }
        },
        updateAssessmentProperties(state) {
            if (state.assessment) {
                state.assessment = calculateAssessmentProperties(state.assessment)
            }
        },
        resetAssessment(state) {
            state.assessment = null
            state.currentTestIndex = null
            state.currentTestQuestionIndex = null
            localStorage.removeItem(CURRENT_GRADING_ASSESSMENT_ID)
        },
    },
})

/**
 * Update the assessment object after loading the assessment from the database
 * or after adding more teacher grading histories with number of questions graded for each test,
 * teacher score for each test, and if all the tests in the assessment have been graded by the teacher.
 */
const calculateAssessmentProperties = (assessment: Assessment) => {
    for (const test of assessment.tests) {
        test.numQuestionsGraded = test.testQuestions.filter(
            (testQuestion) => testQuestion.latestTeacherEvaluation !== null
        ).length

        if (test.numQuestionsGraded === test.testQuestions.length) {
            test.teacherScore = test.testQuestions.reduce(
                (acc, testQuestion) => acc + (testQuestion.latestTeacherEvaluation ? 1 : 0),
                0
            )
        }
    }

    assessment.isAllTestsGradedByTeacher = assessment.tests.every(
        (test) => test.numQuestionsGraded === test.testQuestions.length
    )

    return assessment
}

export const createAssessment = (assessmentTypeId: number) => {
    return async (dispatch: any) => {
        const data = await assessmentService.createAssessment(assessmentTypeId)
        const assessment = convertKeysToCamelCase(data)
        dispatch(assessmentReducer.actions.initializeAssessment(assessment))
    }
}

export const fetchAssessment = (assessmentId: string) => {
    return async (dispatch: any) => {
        const data = await assessmentService.getAssessment(assessmentId)
        const assessment = convertKeysToCamelCase(data)
        dispatch(assessmentReducer.actions.initializeAssessment(assessment))
        dispatch(assessmentReducer.actions.updateAssessmentProperties())

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

export const retrieveAssessmentFromLocalStorage = () => {
    return async (dispatch: any) => {
        const assessmentId = localStorage.getItem(CURRENT_GRADING_ASSESSMENT_ID)
        if (assessmentId) {
            await dispatch(fetchAssessment(assessmentId))
            return assessmentId
        }
        return null
    }
}

export const submitTeacherEvaluation = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState()

        // get list of test questions that have evaluation changes
        const testQuestions: TestQuestion[] = state.assessment.assessment?.tests.flatMap(
            (test: Test) =>
                test.testQuestions.filter(
                    (testQuestion) =>
                        testQuestion.latestTeacherEvaluation !==
                        testQuestion.originalTeacherEvaluation
                )
        )

        if (testQuestions.length > 0) {
            const reqTestQuestions = testQuestions.map((testQuestion) => ({
                testQuestionId: testQuestion.testQuestionId,
                teacherEvaluation: testQuestion.latestTeacherEvaluation,
                teacherComment: testQuestion.latestTeacherComment,
            }))
            await testQuestionService.createTeacherGradings({
                teacherAccountId: state.user.accountId,
                testQuestions: reqTestQuestions,
            })

            dispatch(
                assessmentReducer.actions.updateGradingHistory({ user: state.user, testQuestions })
            )
            dispatch(assessmentReducer.actions.updateAssessmentProperties())
        }

        // reset original teacher evaluation to reflect the latest changes in database
        dispatch(assessmentReducer.actions.resetOriginalTeacherEvaluation())
    }
}

// NOTE: not used in the current implementation
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

// NOTE: not used in the current implementation
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

// NOTE: not used in the current implementation
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

// NOTE: not used in the current implementation
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

export const fetchAudios = (testId: string, testIndex: number, includeAnswer: boolean = false) => {
    return async (dispatch: any) => {
        const audioUrls = await audioService.getAudios(testId, includeAnswer)
        dispatch(
            assessmentReducer.actions.setAudioBlobUrls({
                audioUrls,
                testIndex,
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
