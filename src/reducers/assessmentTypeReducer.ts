import { createSlice } from '@reduxjs/toolkit'

import { AssessmentType } from '../models/interface'
import * as assessmentService from '../services/assessment'
import { convertKeysToCamelCase } from '../utils/helper'

const assessmentTypeReducer = createSlice({
    name: 'assessmentType',
    initialState: [] as AssessmentType[],
    reducers: {
        setAssessmentTypes(_state, action: { payload: AssessmentType[] }) {
            return action.payload
        },
    },
})

export const fetchAssessmentTypes = () => {
    return async (dispatch: any) => {
        const data = await assessmentService.getAssessmentTypes()
        const assessmentTypes = convertKeysToCamelCase(data)
        dispatch(assessmentTypeReducer.actions.setAssessmentTypes(assessmentTypes))
    }
}

export default assessmentTypeReducer.reducer
