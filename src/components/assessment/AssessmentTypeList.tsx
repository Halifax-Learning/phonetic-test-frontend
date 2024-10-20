import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Box, Button, CardContent, CircularProgress, Grid2, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../main'
import { createAssessment, fetchInProgressAssessment } from '../../reducers/assessmentReducer'
import { fetchAssessmentTypes } from '../../reducers/assessmentTypeReducer'
import { setGradingAssessmentList } from '../../reducers/gradingAssessmentListReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { StyledClickableCard } from '../../theme/theme'
import { logError } from '../../utils/logger'
import CustomSnackbar, { OnRequestProps } from '../reusables/CustomSnackbar'

const AssessmentList = () => {
    const dispatch = useDispatch<any>()
    const assessmentTypes = useSelector((state: RootState) => state.assessmentTypes)
    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const isAssessmentInProgress = useSelector((state: RootState) => state.assessment.isInProgress)
    const user = useSelector((state: RootState) => state.user)

    const [onLoading, setOnLoading] = useState<OnRequestProps>({
        inProgress: false,
        message: '',
    })

    const [onCreatingAssessment, setOnCreatingAssessment] = useState<OnRequestProps>({
        inProgress: false,
        display: false,
        message: '',
        color: 'info',
    })

    const fetchData = async () => {
        try {
            setOnLoading({ inProgress: true })

            if (!assessmentTypes.length) {
                await dispatch(fetchAssessmentTypes())
            }
            if (isAssessmentInProgress === null) {
                await dispatch(fetchInProgressAssessment())
            }

            setOnLoading({ inProgress: false })
        } catch (err) {
            setOnLoading({ inProgress: false, message: 'Failed to load. Please try again later.' })
            logError('Failed to fetch assessment types:', err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const startAssessment = async (assessmentTypeId: number) => {
        try {
            setOnCreatingAssessment({
                inProgress: true,
                display: true,
                message: 'Starting Assessment...',
                color: 'info',
            })

            await dispatch(createAssessment(assessmentTypeId))

            setOnCreatingAssessment({ inProgress: false })
            dispatch(setScreenToDisplay('AssessmentWelcome'))
            dispatch(setGradingAssessmentList(null))
        } catch (err) {
            setOnCreatingAssessment({
                inProgress: false,
                display: true,
                message: 'Failed to start assessment. Please try again later.',
                color: 'error',
            })
            logError('Failed to create assessment:', err)
        }
    }

    if (onLoading.inProgress) {
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

    if (onLoading.message) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body1" color="error">
                    {onLoading.message}
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
                Hi {user?.firstName}. Are you ready to start your assessment?
            </Typography>

            {assessment ? (
                <>
                    <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                        You have an assessment in progress. Please continue where you left off.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => dispatch(setScreenToDisplay('AssessmentWelcome'))}
                            sx={{ fontSize: '1rem' }}
                            startIcon={<PlayArrowIcon />}
                        >
                            Continue Assessment
                        </Button>
                    </Box>
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
                                    disabled={onCreatingAssessment.inProgress}
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
                                        {onCreatingAssessment.inProgress && (
                                            <CircularProgress size={24} />
                                        )}
                                    </CardContent>
                                </StyledClickableCard>
                            </Grid2>
                        ))}
                    </Grid2>
                </>
            )}

            <CustomSnackbar
                onRequest={onCreatingAssessment}
                setOnRequest={setOnCreatingAssessment}
            />
        </Box>
    )
}

export default AssessmentList
