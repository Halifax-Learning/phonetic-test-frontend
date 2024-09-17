import { Box, Button, Card, CardContent, Grid2, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'

const AssessmentWelcome = () => {
    const dispatch = useDispatch<any>()
    const assessment = useSelector((state: RootState) => state.assessment.assessment)

    const testTypes = assessment ? assessment.testTypes : []

    const onClickNext = () => {
        dispatch(setScreenToDisplay('TestWelcome'))
    }

    return (
        <>
            {assessment && (
                <Box>
                    <Typography variant="h1" color="secondary.dark">
                        Welcome to the {assessment.assessmentType.assessmentTypeName}
                    </Typography>
                    <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                        This assessment consists of the following sections:
                    </Typography>
                    <Grid2 container spacing={{ xs: 2, md: 3 }}>
                        {testTypes.map((testType, index) => (
                            <Grid2 key={testType.testTypeId} size={{ xs: 6, sm: 6, md: 6 }}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="body1" color="text.primary">
                                            Section {index + 1} - {testType.testTypeName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <Box display="flex" justifyContent="right">
                                <Button
                                    variant="contained"
                                    sx={{ padding: '12px' }}
                                    onClick={onClickNext}
                                >
                                    Next
                                </Button>
                            </Box>
                        </Grid2>
                    </Grid2>
                </Box>
            )}
        </>
    )
}

export default AssessmentWelcome
