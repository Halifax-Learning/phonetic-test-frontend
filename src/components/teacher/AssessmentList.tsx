import { Box, Card, CardHeader, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { Assessment } from '../../models/interface'
import { fetchAssessments } from '../../reducers/assessmentListReducer'
import { fetchAssessment, resetAssessment } from '../../reducers/assessmentReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import AssessmentListGrid from './AssessmentListGrid'

const TeacherAssessmentList = () => {
    const dispatch = useDispatch<any>()
    const assessments = useSelector((state: RootState) => state.assessmentList as Assessment[])
    const [loading, setLoading] = useState(true)
    const [loadingAssessment, setLoadingAssessment] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            await dispatch(fetchAssessments())
            dispatch(resetAssessment())
            setLoading(false)
        }

        loadData()
    }, [dispatch])

    const onChooseAssessment = async (assessmentId: string) => {
        setLoadingAssessment(true) // Start loading
        await dispatch(fetchAssessment(assessmentId))
        dispatch(setScreenToDisplay('GradingScreen'))
        setLoadingAssessment(false) // End loading
    }

    return (
        <Box sx={{ mx: 'auto', alignItems: 'center', justifyContent: 'center' }}>
            <Card variant="outlined" sx={{ marginBottom: 2 }}>
                <CardHeader
                    title={
                        <Typography variant="h1" sx={{ color: 'secondary.dark' }}>
                            Grade Assessments
                        </Typography>
                    }
                />
            </Card>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="500px">
                    <CircularProgress />
                </Box>
            ) : loadingAssessment ? (
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
