import { Box, Button, CardContent, CircularProgress, Grid2, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { createAssessment, fetchInProgressAssessment } from '../../reducers/assessmentReducer'
import { fetchAssessmentTypes } from '../../reducers/assessmentTypeReducer'
import { setGradingAssessmentList } from '../../reducers/gradingAssessmentListReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { StyledClickableCard } from '../../theme/theme'

const AssessmentList = () => {
    const dispatch = useDispatch<any>()
    const assessmentTypes = useSelector((state: RootState) => state.assessmentTypes)
    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const isInProgress = useSelector((state: RootState) => state.assessment.isInProgress)
    const user = useSelector((state: RootState) => state.user)
    const [loading, setLoading] = useState(true)
    const [creatingAssessment, setCreatingAssessment] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true) // Set loading to true before fetching
        setError(null) // Reset error state
        try {
            if (!assessmentTypes.length) {
                await dispatch(fetchAssessmentTypes())
            }
            if (isInProgress === null) {
                await dispatch(fetchInProgressAssessment())
            }
        } catch (err) {
            console.error('Failed to fetch assessment types:', err)
            setError('Failed to load assessment types. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const startAssessment = async (assessmentTypeId: number) => {
        setCreatingAssessment(true) // Start loading for assessment creation
        try {
            await dispatch(createAssessment(assessmentTypeId))
            dispatch(setScreenToDisplay('AssessmentWelcome'))
            dispatch(setGradingAssessmentList(null))
        } catch (err) {
            console.error('Failed to create assessment:', err)
            // Handle error here (optional)
        } finally {
            setCreatingAssessment(false) // Stop loading
        }
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
                <Button variant="contained" onClick={fetchData}>
                    Retry
                </Button>
            </Box>
        )
    }

    return (
        <Box sx={{ mx: 'auto', maxWidth: 'md', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h1" color="secondary.dark" sx={{ mb: 4 }}>
                Hi, {user?.firstName}. Are you ready to start your assessment?
            </Typography>

            {assessment ? (
                <>
                    <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                        You have an assessment in progress. Please continue where you left off.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => dispatch(setScreenToDisplay('AssessmentWelcome'))}
                    >
                        Continue Assessment
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                        Please choose one of the assessments listed below to evaluate your English
                        language skills.
                    </Typography>
                    <Grid2 container spacing={{ xs: 2, md: 3 }}>
                        {assessmentTypes.map((assessmentType) => (
                            <Grid2
                                key={assessmentType.assessmentTypeId}
                                size={{ xs: 12, sm: 12, md: 12 }}
                            >
                                <StyledClickableCard
                                    onClick={() => startAssessment(assessmentType.assessmentTypeId)}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant="h1" color="secondary.dark">
                                            {assessmentType.assessmentTypeName}
                                        </Typography>
                                        {creatingAssessment && <CircularProgress size={24} />}
                                    </CardContent>
                                </StyledClickableCard>
                            </Grid2>
                        ))}
                    </Grid2>
                </>
            )}
        </Box>
    )
}

export default AssessmentList
