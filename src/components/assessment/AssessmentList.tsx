import { Box, CardContent, Grid2, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { createAssessment } from '../../reducers/assessmentReducer'
import { fetchAssessmentTypes } from '../../reducers/assessmentTypeReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { StyledClickableCard } from '../../theme/theme'

const AssessmentList = () => {
    const dispatch = useDispatch<any>()
    const assessmentTypes = useSelector((state: RootState) => state.assessmentTypes)
    const user = useSelector((state: RootState) => state.user)

    useEffect(() => {
        dispatch(fetchAssessmentTypes())
    }, [])

    const startAssessment = (assessmentTypeId: number) => {
        if (user && user.accountId) {
            dispatch(createAssessment(assessmentTypeId, user.accountId))
            dispatch(setScreenToDisplay('AssessmentWelcome'))
        }
    }

    return (
        <Box sx={{ mx: 'auto', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                Please choose one of the assessments listed below to evaluate your English language
                skills.
            </Typography>
            <Grid2 container spacing={{ xs: 2, md: 3 }}>
                {assessmentTypes.map((assessmentType) => (
                    <Grid2 key={assessmentType.assessmentTypeId} size={{ xs: 12, sm: 12, md: 12 }}>
                        <StyledClickableCard
                            onClick={() => startAssessment(assessmentType.assessmentTypeId)}
                        >
                            <CardContent>
                                <Typography variant="h1" color="secondary.dark">
                                    {assessmentType.assessmentTypeName}
                                </Typography>
                            </CardContent>
                        </StyledClickableCard>
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    )
}

export default AssessmentList
