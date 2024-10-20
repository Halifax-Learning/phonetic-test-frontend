import { Box, Card, CardHeader, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../main'
import { fetchGradingAssessments } from '../../reducers/gradingAssessmentListReducer'
import { logError } from '../../utils/logger'
import { OnRequestProps } from '../reusables/CustomSnackbar'
import Retry from '../reusables/Retry'
import AssessmentListGrid from './AssessmentListGrid'

const TeacherAssessmentList = () => {
    const dispatch = useDispatch<any>()
    const assessments = useSelector((state: RootState) => state.gradingAssessmentList)

    const [onLoading, setOnLoading] = useState<OnRequestProps>({
        inProgress: false,
        message: '',
    })

    useEffect(() => {
        loadData()
    }, [dispatch])

    const loadData = async () => {
        if (!assessments) {
            try {
                setOnLoading({ inProgress: true })

                await dispatch(fetchGradingAssessments())

                setOnLoading({ inProgress: false })
            } catch (err) {
                setOnLoading({
                    inProgress: false,
                    message: 'Failed to load. Please try again later.',
                })
                logError('Failed to fetch grading assessments:', err)
            }
        }
    }

    if (!onLoading.inProgress && onLoading.message) {
        return <Retry message={onLoading.message} onClick={loadData} />
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
            {onLoading.inProgress || !assessments ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="500px">
                    <CircularProgress />
                </Box>
            ) : (
                <AssessmentListGrid assessments={assessments} />
            )}
        </Box>
    )
}

export default TeacherAssessmentList
