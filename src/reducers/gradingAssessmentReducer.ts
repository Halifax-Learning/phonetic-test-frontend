import { createSlice } from '@reduxjs/toolkit'

import { Assessment, TeacherGradingHistory, Test, TestQuestion, User } from '../models/interface'
import * as assessmentService from '../services/assessment'
import * as testQuestionService from '../services/testQuestion'
import { convertKeysToCamelCase } from '../utils/helper'
import { handleSetAudioBlobUrls, setAudioBlobUrlsGrading } from './actions'
import { updateGradingAssessmentInList } from './gradingAssessmentListReducer'

interface AssessmentState {
    assessment: Assessment | null
    currentTestIndex: number | null
}

const initialState: AssessmentState = {
    assessment: null,
    currentTestIndex: null,
}

const CURRENT_GRADING_ASSESSMENT_ID: string = 'currentGradingAssessmentId'

const gradingAssessmentReducer = createSlice({
    name: 'gradingAssessment',
    initialState: initialState,
    reducers: {
        initializeGradingAssessment(state, action: { payload: Assessment }) {
            state.assessment = action.payload
            state.currentTestIndex = 0
            localStorage.setItem(CURRENT_GRADING_ASSESSMENT_ID, action.payload.assessmentId)
        },
        setGradingTest(state, action: { payload: number }) {
            state.currentTestIndex = action.payload
        },
        setTeacherEvaluation(
            state,
            action: {
                payload: {
                    evaluation: boolean | null
                    comment: string
                    testIndex: number
                    testQuestionIndex: number
                }
            }
        ) {
            if (state.assessment) {
                // update the latest teacher evaluation
                state.assessment.tests[action.payload.testIndex].testQuestions[
                    action.payload.testQuestionIndex
                ].latestTeacherEvaluation = action.payload.evaluation

                // update the latest teacher comment
                state.assessment.tests[action.payload.testIndex].testQuestions[
                    action.payload.testQuestionIndex
                ].latestTeacherComment = action.payload.comment
            }
        },
        resetOriginalTeacherEvaluation(state) {
            // set the original teacher evaluation and comment to the latest values in database
            if (state.assessment) {
                for (const test of state.assessment.tests) {
                    for (const testQuestion of test.testQuestions) {
                        testQuestion.originalTeacherEvaluation =
                            testQuestion.latestTeacherEvaluation
                        testQuestion.originalTeacherComment = testQuestion.latestTeacherComment
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
                        teacherEvaluation: testQuestion.latestTeacherEvaluation!,
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
        resetGradingAssessment(state) {
            state.assessment = null
            state.currentTestIndex = null
            localStorage.removeItem(CURRENT_GRADING_ASSESSMENT_ID)
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setAudioBlobUrlsGrading, handleSetAudioBlobUrls)
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

export const fetchGradingAssessment = (assessmentId: string) => {
    return async (dispatch: any) => {
        const data = await assessmentService.getAssessment(assessmentId)
        const assessment = convertKeysToCamelCase(data)
        dispatch(gradingAssessmentReducer.actions.initializeGradingAssessment(assessment))
        dispatch(gradingAssessmentReducer.actions.updateAssessmentProperties())

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
        dispatch(gradingAssessmentReducer.actions.resetOriginalTeacherEvaluation())
    }
}

export const retrieveGradingAssessmentFromLocalStorage = () => {
    return async (dispatch: any) => {
        const assessmentId = localStorage.getItem(CURRENT_GRADING_ASSESSMENT_ID)
        if (assessmentId) {
            await dispatch(fetchGradingAssessment(assessmentId))
            return assessmentId
        }
        return null
    }
}

export const submitTeacherEvaluation = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState()

        // get list of test questions that have evaluation changes or comment changes
        const testQuestions: TestQuestion[] = state.gradingAssessment.assessment?.tests.flatMap(
            (test: Test) =>
                test.testQuestions.filter(
                    (testQuestion) =>
                        testQuestion.latestTeacherEvaluation !==
                            testQuestion.originalTeacherEvaluation ||
                        (testQuestion.latestTeacherComment !==
                            testQuestion.originalTeacherComment &&
                            testQuestion.latestTeacherEvaluation !== null)
                )
        )

        if (testQuestions.length > 0) {
            const reqTestQuestions = testQuestions.map((testQuestion) => ({
                testQuestionId: testQuestion.testQuestionId,
                teacherEvaluation: testQuestion.latestTeacherEvaluation!,
                teacherComment: testQuestion.latestTeacherComment,
            }))
            try {
                await testQuestionService.createTeacherGradings({
                    testQuestions: reqTestQuestions,
                })
            } catch {
                throw Error('Fail to save grading. Please try again.')
            }

            dispatch(
                gradingAssessmentReducer.actions.updateGradingHistory({
                    user: state.user,
                    testQuestions,
                })
            )
            dispatch(gradingAssessmentReducer.actions.updateAssessmentProperties())
            const updatedState = getState()
            dispatch(
                updateGradingAssessmentInList(
                    updatedState.gradingAssessment.assessment as Assessment
                )
            )
        }

        // reset original teacher evaluation to reflect the latest changes in database
        dispatch(gradingAssessmentReducer.actions.resetOriginalTeacherEvaluation())

        if (testQuestions.length === 0) {
            throw Error('No grading changes were made.')
        }
    }
}

export default gradingAssessmentReducer.reducer
export const { setGradingTest, setTeacherEvaluation, resetGradingAssessment } =
    gradingAssessmentReducer.actions
