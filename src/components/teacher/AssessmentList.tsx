import { Box, Card, CardHeader, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'
import { RootState } from '../../main'
import { Assessment } from '../../models/interface'
import { fetchGradingAssessments } from '../../reducers/gradingAssessmentListReducer'
import { fetchAssessment } from '../../reducers/gradingAssessmentReducer'
import AssessmentListGrid from './AssessmentListGrid'

const TeacherAssessmentList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const assessments = useSelector(
        (state: RootState) => state.gradingAssessmentList as Assessment[]
    )
    const [loading, setLoading] = useState(true)
    const [loadingAssessment, setLoadingAssessment] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            if (!assessments) {
                await dispatch(fetchGradingAssessments())
            }
            setLoading(false)
        }

        loadData()
    }, [dispatch])

    const onChooseAssessment = async (assessmentId: string) => {
        setLoadingAssessment(true) // Start loading
        await dispatch(fetchAssessment(assessmentId))
        navigate('/grading')
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
