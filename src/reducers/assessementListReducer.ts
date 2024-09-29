import { createSlice } from '@reduxjs/toolkit'

import { Assessment } from '../models/interface'
import * as assessmentService from '../services/assessment'
import { convertKeysToCamelCase } from '../utils/helper'

const assessmentListReducer = createSlice({
    name: 'assessmentList',
    initialState: null as Assessment[] | null,
    reducers: {
        setAssessmentList(_state, action: { payload: Assessment[] | null }) {
            return action.payload
        },
    },
})

export const fetchAssessments = () => {
    return async (dispatch: any) => {
        const data = await assessmentService.getAllAssessments()
        const assessments = convertKeysToCamelCase(data)
        dispatch(assessmentListReducer.actions.setAssessmentList(assessments))
    }
}

export default assessmentListReducer.reducer
export const { setAssessmentList } = assessmentListReducer.actions
