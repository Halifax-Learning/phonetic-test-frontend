import { Box, Button, Card, CardContent, Grid2, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import HeaderIcon from '@mui/icons-material/RecordVoiceOver'

import { RootState } from '../../main'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { createTest } from '../../reducers/testReducer'
import { InstructionContent } from './TestInstructionDialog'

const TestWelcome = () => {
    const dispatch = useDispatch<any>()

    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const currentTestIndex = useSelector((state: RootState) => state.assessment.currentTestIndex)

    const testTypes = assessment ? assessment.testTypes : []

    const testTypeName = currentTestIndex !== null ? testTypes[currentTestIndex].testTypeName : ''
    const questionInstructionText =
        currentTestIndex !== null ? testTypes[currentTestIndex].questionInstructionText : ''

    const startTest = () => {
        if (assessment && currentTestIndex !== null) {
            dispatch(createTest(assessment.assessmentId, testTypes[currentTestIndex].testTypeId))
            dispatch(setScreenToDisplay('TestQuestion'))
        }
    }

    return (
        <>
            {assessment && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Card variant="outlined" sx={{ maxWidth: 700, padding: 2 }}>
                        <CardContent>
                            <Grid2 container spacing={2}>
                                {/* Top-left: Icon */}
                                <Grid2
                                    size={1}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <HeaderIcon sx={{ fontSize: 35, color: 'secondary.dark' }} />
                                </Grid2>
                                {/* Top-right: Instructions Title */}
                                <Grid2
                                    size={11}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="left"
                                >
                                    <Typography variant="h1" color="secondary.dark">
                                        Welcome to the {testTypeName} Section
                                    </Typography>
                                </Grid2>
                                {/* Bottom-left: Blank */}
                                <Grid2
                                    size={1}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                />
                                {/* Bottom-right: Content and Button */}
                                <Grid2 size={11}>
                                    <Box>
                                        <InstructionContent
                                            showAudioVersion={[
                                                'Synthesis',
                                                'Analysis',
                                                'Listening',
                                            ].includes(testTypeName)}
                                            customPoint1Text={questionInstructionText}
                                        />
                                    </Box>
                                    <Box display="flex" justifyContent="right" sx={{ mt: 3 }}>
                                        <Button
                                            onClick={() => startTest()}
                                            variant="contained"
                                            color="primary"
                                            sx={{ padding: '12px' }}
                                        >
                                            Start {testTypeName} Section
                                        </Button>
                                    </Box>
                                </Grid2>
                            </Grid2>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </>
    )
}

export default TestWelcome
