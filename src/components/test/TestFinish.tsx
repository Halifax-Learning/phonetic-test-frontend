import { Box, Button, Card, CardContent, Grid2, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { nextTest, resetAssessment } from '../../reducers/assessmentReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { theme } from '../../theme/theme'

const TestFinish = () => {
    const dispatch = useDispatch<any>()

    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const currentTestIndex = useSelector((state: RootState) => state.assessment.currentTestIndex)

    const testTypes = assessment?.tests.map((test) => test.testType)

    const onClickNextTest = () => {
        dispatch(nextTest())
        dispatch(setScreenToDisplay('TestWelcome'))
    }

    const onClickFinishAssessment = () => {
        dispatch(resetAssessment())
        dispatch(setScreenToDisplay('AssessmentFinish'))
    }

    return (
        <>
            {assessment && currentTestIndex !== null && (
                <Box
                    sx={{
                        mx: 'auto',
                        maxWidth: 'md',
                    }}
                >
                    <Typography variant="h1" color="secondary.dark" sx={{ mb: 2 }}>
                        You have completed the following sections:
                    </Typography>
                    <Grid2 container spacing={{ xs: 2, md: 3 }}>
                        {testTypes?.map((testType, index) => (
                            <Grid2 key={testType.testTypeId} size={{ xs: 12, sm: 12, md: 6 }}>
                                <Card
                                    variant="outlined"
                                    sx={(theme) => ({
                                        height: '100%',
                                        borderColor:
                                            index <= currentTestIndex
                                                ? theme.palette.primary.main
                                                : theme.palette.text.secondary,
                                    })}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="body1"
                                            color={
                                                index <= currentTestIndex
                                                    ? theme.palette.primary.main
                                                    : theme.palette.text.primary
                                            }
                                        >
                                            Section {index + 1} - {testType.testTypeName}
                                            {index <= currentTestIndex && ' (Complete)'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <Box display="flex" justifyContent="right">
                                {currentTestIndex < (testTypes?.length ?? 0) - 1 ? (
                                    <Button
                                        variant="contained"
                                        sx={{ padding: '12px' }}
                                        onClick={onClickNextTest}
                                    >
                                        Next Section
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        sx={{ padding: '12px' }}
                                        onClick={onClickFinishAssessment}
                                    >
                                        Finish Assessment
                                    </Button>
                                )}
                            </Box>
                        </Grid2>
                    </Grid2>
                </Box>
            )}
        </>
    )
}

export default TestFinish
