import { createSlice } from '@reduxjs/toolkit'

import { Assessment } from '../models/interface'
import * as assessmentService from '../services/assessment'
import { convertKeysToCamelCase } from '../utils/helper'

interface AssessmentState {
    assessment: Assessment | null
    currentTestIndex: number | null
}

const initialState: AssessmentState = {
    assessment: null,
    currentTestIndex: null,
}

const assessmentReducer = createSlice({
    name: 'assessment',
    initialState: initialState,
    reducers: {
        createAssessment(state, action: { payload: Assessment }) {
            state.assessment = action.payload
            state.currentTestIndex = 0
        },
        nextTest(state) {
            if (state.currentTestIndex !== null) {
                state.currentTestIndex += 1
            }
        },
        resetAssessment(state) {
            state.assessment = null
            state.currentTestIndex = null
        },
    },
})

export const createAssessment = (assessmentTypeId: number, testTakerId: string) => {
    return async (dispatch: any) => {
        const data = await assessmentService.createAssessment(assessmentTypeId, testTakerId)
        const assessment = convertKeysToCamelCase(data)
        dispatch(assessmentReducer.actions.createAssessment(assessment))
    }
}

export default assessmentReducer.reducer
export const { nextTest, resetAssessment } = assessmentReducer.actions
