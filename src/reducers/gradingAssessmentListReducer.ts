import { createSlice } from '@reduxjs/toolkit'

import { Assessment } from '../models/interface'
import * as assessmentService from '../services/assessment'
import { convertKeysToCamelCase } from '../utils/helper'

const gradingAssessmentListReducer = createSlice({
    name: 'gradingAssessmentList',
    initialState: null as Assessment[] | null,
    reducers: {
        setGradingAssessmentList(_state, action: { payload: Assessment[] | null }) {
            return action.payload
        },
        updateGradingAssessmentInList(state, action: { payload: Assessment }) {
            const updatedAssessment = action.payload

            const assessmentToUpdate = state?.find(
                (assessment) => assessment.assessmentId === updatedAssessment.assessmentId
            )

            if (assessmentToUpdate) {
                assessmentToUpdate.isAllTestsGradedByTeacher =
                    updatedAssessment.isAllTestsGradedByTeacher

                for (let i = 0; i < assessmentToUpdate.tests.length; i++) {
                    assessmentToUpdate.tests[i].numQuestionsGraded =
                        updatedAssessment.tests[i].numQuestionsGraded
                    assessmentToUpdate.tests[i].teacherScore =
                        updatedAssessment.tests[i].teacherScore
                }
            }
        },
    },
})

export const fetchGradingAssessments = () => {
    return async (dispatch: any) => {
        const data = await assessmentService.getAllAssessments()
        const assessments = convertKeysToCamelCase(data)
        dispatch(gradingAssessmentListReducer.actions.setGradingAssessmentList(assessments))
    }
}

export default gradingAssessmentListReducer.reducer
export const { setGradingAssessmentList, updateGradingAssessmentInList } =
    gradingAssessmentListReducer.actions
