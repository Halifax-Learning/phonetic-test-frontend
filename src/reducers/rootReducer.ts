import { combineReducers } from '@reduxjs/toolkit'

import assessementListReducer from './assessementListReducer'
import assessmentReducer from './assessmentReducer'
import assessmentTypeReducer from './assessmentTypeReducer'
import gradingAssessmentListReducer from './gradingAssessmentListReducer'
import gradingAssessmentReducer from './gradingAssessmentReducer'
import screenToDisplayReducer from './screenToDisplayReducer'
import userReducer from './userReducer'

const allReducers = combineReducers({
    screenToDisplay: screenToDisplayReducer,
    assessmentTypes: assessmentTypeReducer,
    assessment: assessmentReducer,
    assessmentList: assessementListReducer,
    gradingAssessment: gradingAssessmentReducer,
    gradingAssessmentList: gradingAssessmentListReducer,
    user: userReducer,
})

const rootReducer = (state: any, action: any) => {
    if (action.type === 'RESET_ROOT_STATE') {
        // reset all reducers to initial states
        state = undefined
        localStorage.clear()
    }
    return allReducers(state, action)
}

export default rootReducer
