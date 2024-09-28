import { configureStore } from '@reduxjs/toolkit'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App.js'
import assessmentListReducer from './reducers/assessmentListReducer.js'
import assessmentReducer from './reducers/assessmentReducer.js'
import assessmentTypeReducer from './reducers/assessmentTypeReducer.js'
import gradingAssessmentReducer from './reducers/gradingAssessmentReducer.js'
import screenToDisplayReducer from './reducers/screenToDisplayReducer.js'
import userReducer from './reducers/userReducer.js'

export const store = configureStore({
    reducer: {
        screenToDisplay: screenToDisplayReducer,
        assessmentTypes: assessmentTypeReducer,
        assessmentList: assessmentListReducer,
        assessment: assessmentReducer,
        gradingAssessment: gradingAssessmentReducer,
        user: userReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('Root element not found')
}

createRoot(rootElement).render(
    <Provider store={store}>
        <StrictMode>
            <App />
        </StrictMode>
    </Provider>
)
