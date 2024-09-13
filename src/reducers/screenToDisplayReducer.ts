import { createSlice } from '@reduxjs/toolkit'

const screenToDisplayReducer = createSlice({
    name: 'screenToDisplay',
    initialState: 'AssessmentList',
    reducers: {
        setScreenToDisplay(_state, action) {
            return action.payload
        },
    },
})

export default screenToDisplayReducer.reducer
export const { setScreenToDisplay } = screenToDisplayReducer.actions
