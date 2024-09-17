import { Box, Button, Card, CardContent, Grid2, Typography } from '@mui/material'
import HeaderIcon from '@mui/icons-material/RecordVoiceOver'
import InstructionIcon from '@mui/icons-material/Info'
import { useEffect, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { nextQuestion, submitTest, updateTest } from '../../reducers/testReducer'
import TestInstructionDialog from './TestInstructionDialog'
import AudioPlayerWithIcon from './AudioPlayerWithIcon'
import { StyledSoundCard } from '../../theme/theme'

const TestQuestion = () => {
    const dispatch: any = useDispatch()

    const test = useSelector((state: RootState) => state.test.test)
    const currentTestQuestionIndex = useSelector(
        (state: RootState) => state.test.currentTestQuestionIndex
    )

    const [isQuestionWithoutAnswer, setIsQuestionWithoutAnswer] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true })
    const [open, setOpen] = useState(false)

    useEffect(() => {
        // Initialize timer with a dummy interval
        let timer: NodeJS.Timeout = setInterval(() => {}, 0)
        if (isRecording) {
            timer = setInterval(() => {
                setRecordingTime((time) => time + 1)
            }, 1000)
        } else {
            clearInterval(timer)
            setRecordingTime(0)
        }
        return () => clearInterval(timer)
    }, [isRecording])

    useEffect(() => {
        // whenever a new mediaBlobUrl is available, update the current test question with the new answer audio
        if (mediaBlobUrl && test && currentTestQuestionIndex !== null) {
            const currentTestQuestion = test.testQuestions[currentTestQuestionIndex]

            const updatedTestQuestion = {
                ...currentTestQuestion,
                answerAudioBlobUrl: mediaBlobUrl,
            }

            dispatch(updateTest(updatedTestQuestion))
        }
    }, [mediaBlobUrl])

    // Get the question audio base64 encoded string
    const questionAudioB64Encode =
        test &&
        currentTestQuestionIndex !== null &&
        test.testQuestions[currentTestQuestionIndex].question.questionAudioB64Encode

    // Create the data URI for the question audio file
    const questionAudioSrc = questionAudioB64Encode
        ? `data:audio/mp3;base64,${questionAudioB64Encode}`
        : null

    // Get the instruction audio base64 encoded string
    const instructionAudioB64Encode =
        test && test.instructionAudioB64Encode ? test.instructionAudioB64Encode : null

    // Create the data URI for the instruction audio file
    const instructionAudioSrc = `data:audio/mp3;base64,${instructionAudioB64Encode}`

    const onStartRecording = () => {
        startRecording()
        setIsRecording(true)
    }

    const onStopRecording = () => {
        stopRecording()
        setIsRecording(false)
        setIsQuestionWithoutAnswer(false)
    }

    const onClickNextQuestion = () => {
        setIsQuestionWithoutAnswer(true)
        dispatch(nextQuestion())
    }

    const onSubmitTest = () => {
        if (test) {
            dispatch(submitTest(test.testId, test.testQuestions))
            dispatch(setScreenToDisplay('TestFinish'))
        }
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            {test && currentTestQuestionIndex !== null && (
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
                                        {test.testType.testTypeName} Section - Question{' '}
                                        {currentTestQuestionIndex + 1}
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
                                        <Typography
                                            variant="body1"
                                            color="text.primary"
                                            sx={{ mb: 2 }}
                                        >
                                            {instructionAudioB64Encode && (
                                                <AudioPlayerWithIcon
                                                    instructionAudioSrc={instructionAudioSrc}
                                                />
                                            )}
                                            {test.questionInstructionText}

                                            {questionAudioSrc ? (
                                                <Box>
                                                    <audio controls src={questionAudioSrc}>
                                                        Your browser does not support the audio
                                                        element.
                                                    </audio>
                                                </Box>
                                            ) : (
                                                <Box display="flex">
                                                    <StyledSoundCard>
                                                        <CardContent>
                                                            <Typography
                                                                variant="h1"
                                                                sx={{
                                                                    fontFamily: 'Inter, sans-serif',
                                                                    fontSize: '2rem',
                                                                    fontWeight: 700,
                                                                    color: 'secondary.main',
                                                                }}
                                                            >
                                                                {
                                                                    test.testQuestions[
                                                                        currentTestQuestionIndex
                                                                    ].question.questionText
                                                                }
                                                            </Typography>
                                                        </CardContent>
                                                    </StyledSoundCard>
                                                </Box>
                                            )}

                                            <Box>
                                                {isRecording && (
                                                    <div>Recording Time: {recordingTime}s</div>
                                                )}
                                                {!isRecording &&
                                                    mediaBlobUrl &&
                                                    !isQuestionWithoutAnswer && (
                                                    <>
                                                        <div>Your answer:</div>
                                                        <audio controls src={mediaBlobUrl} />
                                                    </>
                                                )}
                                            </Box>
                                        </Typography>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ mt: 3 }}
                                        >
                                            {/* Left-aligned instruction button */}
                                            <Button
                                                onClick={handleClickOpen}
                                                sx={{ padding: '12px', minWidth: 'auto' }}
                                            >
                                                <InstructionIcon />
                                            </Button>

                                            {/* Test Instruction Dialog */}
                                            <TestInstructionDialog
                                                open={open}
                                                onClose={handleClose}
                                                showAudioVersion={[
                                                    'Synthesis',
                                                    'Analysis',
                                                    'Listening',
                                                ].includes(test.testType.testTypeName)}
                                                customPoint1Text={test.questionInstructionText}
                                            />

                                            {/* Right-aligned next/finish buttons */}
                                            <Box display="flex" justifyContent="right">
                                                <Box>
                                                    {!isRecording ? (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{ mr: 2, padding: '12px' }}
                                                            onClick={onStartRecording}
                                                        >
                                                            Record Now
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{ mr: 2, padding: '12px' }}
                                                            onClick={onStopRecording}
                                                        >
                                                            Stop Recording
                                                        </Button>
                                                    )}
                                                </Box>
                                                {currentTestQuestionIndex <
                                                test.testType.numQuestions - 1 ? (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{ padding: '12px' }}
                                                            onClick={onClickNextQuestion}
                                                        >
                                                            Next Question
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{ padding: '12px' }}
                                                            onClick={onSubmitTest}
                                                        >
                                                            Finish Section
                                                        </Button>
                                                    )}
                                            </Box>
                                        </Box>
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

export default TestQuestion
