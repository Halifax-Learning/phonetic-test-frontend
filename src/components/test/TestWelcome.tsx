import HeaderIcon from '@mui/icons-material/RecordVoiceOver'
import { Box, Button, Card, CardContent, Grid2, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useEffect } from 'react'
import { RootState } from '../../main'
import { fetchAudios } from '../../reducers/actions'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { InstructionContent } from './TestInstructionDialog'

const TestWelcome = () => {
    const dispatch = useDispatch<any>()

    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const currentTestIndex = useSelector((state: RootState) => state.assessment.currentTestIndex)

    useEffect(() => {
        // Fetch instruction audio and question audios of the current test
        const test = assessment!.tests[currentTestIndex!]
        dispatch(fetchAudios(test!.testId, currentTestIndex!))
    }, [])

    const testTypes = assessment?.tests.map((test) => test.testType)

    const testTypeName = testTypes?.[currentTestIndex!].testTypeName
    const questionInstructionText =
        assessment?.tests[currentTestIndex!].testType.questionType.questionInstructionText

    const startTest = () => {
        if (assessment && currentTestIndex !== null) {
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
                    {/* Card with content */}
                    <Card
                        variant="outlined"
                        sx={{
                            maxWidth: 'md',
                            width: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            zIndex: 3,
                            border: 'none', // Remove the default border
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: -5,
                                left: -5,
                                right: -5,
                                bottom: -5,
                                background: `
                                    repeating-linear-gradient(
                                        -45deg,
                                        rgba(139, 69, 19, 0.8) 0%,
                                        rgba(89, 43, 10, 1) 5px,
                                        rgba(189, 111, 55, 1) 5px,
                                        rgba(189, 111, 55,  0.8) 10px
                                    )
                                `,
                                zIndex: 2,
                                opacity: 0.8, // 50% opacity
                            },
                        }}
                    >
                        {/* Background layer */}
                        <Box
                            sx={{
                                position: 'absolute',
                                width: 'calc(100% - 2rem)',
                                height: 'calc(100% - 2rem)',
                                background: '#fff8ed', // Light brown to dark brown
                                zIndex: 2,
                                top: '1rem',
                                left: '1rem',
                                opacity: 1, // 20% opacity
                                borderRadius: '8px',
                            }}
                        />
                        <CardContent sx={{ position: 'relative', zIndex: 2, margin: '2rem' }}>
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
                                            ].includes(testTypeName ?? '')}
                                            instructionAudioBlobUrl={
                                                assessment?.tests[currentTestIndex!].testType
                                                    .questionType.instructionAudioBlobUrl
                                            }
                                            customPoint1Text={questionInstructionText}
                                        />
                                    </Box>
                                    <Box display="flex" justifyContent="right" sx={{ mt: 3 }}>
                                        <Button
                                            onClick={() => startTest()}
                                            variant="contained"
                                            color="primary"
                                            sx={{ fontSize: '1rem' }}
                                            startIcon={<PlayArrowIcon />}
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
