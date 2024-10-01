import { Box, Button, Card, CardContent, Grid2, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { theme } from '../../theme/theme'

const AssessmentWelcome = () => {
    const dispatch = useDispatch<any>()
    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const currentTestIndex =
        useSelector((state: RootState) => state.assessment.currentTestIndex) || 0

    const user = useSelector((state: RootState) => state.user)

    const testTypes = assessment?.tests.map((test) => test.testType)

    const onClickNext = () => {
        dispatch(setScreenToDisplay('TestWelcome'))
    }

    return (
        <>
            {assessment && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        mx: 'auto',
                        maxWidth: 'md',
                    }}
                >
                    <Typography variant="h1" color="secondary.dark" sx={{ mb: 4 }}>
                        Hi, {user?.firstName}. Welcome to the{' '}
                        {assessment.assessmentType.assessmentTypeName}
                    </Typography>
                    <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                        This assessment consists of the following sections:
                    </Typography>
                    <Grid2 container spacing={{ xs: 2, md: 3 }}>
                        {testTypes?.map((testType, index) => (
                            <Grid2 key={testType.testTypeId} size={{ xs: 12, sm: 6, md: 6 }}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography
                                            variant="body1"
                                            color={
                                                index < currentTestIndex
                                                    ? theme.palette.primary.main
                                                    : theme.palette.text.primary
                                            }
                                        >
                                            Section {index + 1} - {testType.testTypeName}
                                            {index < currentTestIndex && ' (Complete)'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <Box display="flex" justifyContent="right">
                                <Button
                                    variant="contained"
                                    sx={{ fontSize: '1rem' }}
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
