import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { RootState } from '../../main'
import { Assessment } from '../../models/interface'
import { fetchAssessments } from '../../reducers/assessmentListReducer'
import { fetchAssessment, resetAssessment } from '../../reducers/assessmentReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import AssessmentListGrid from './AssessmentListGrid'

const TeacherAssessmentList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const assessments = useSelector((state: RootState) => state.assessmentList as Assessment[])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            await dispatch(fetchAssessments())
            dispatch(resetAssessment())
            setLoading(false)
        }

        loadData()
    }, [dispatch])

    const onChooseAssessment = (assessmentId: string) => {
        dispatch(fetchAssessment(assessmentId))
        dispatch(setScreenToDisplay('GradingScreen'))
    }

    return (
        <Box sx={{ mx: 'auto', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h1">Assessments</Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="500px">
                    <CircularProgress />
                </Box>
            ) : (
                <AssessmentListGrid
                    assessments={assessments}
                    onChooseAssessment={onChooseAssessment}
                />
            )}
        </Box>
    )
}

export default TeacherAssessmentList
