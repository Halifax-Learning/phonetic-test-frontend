import HeaderIcon from '@mui/icons-material/RecordVoiceOver'
import { Box, Button, Card, CardContent, Grid2, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import {
    nextQuestion,
    setAnswerAudioBlobUrl,
    submitTestQuestion,
} from '../../reducers/assessmentReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { StyledSoundCard } from '../../theme/theme'
import TestInstructionDialog from './TestInstructionDialog'

const TestQuestion = () => {
    const dispatch: any = useDispatch()

    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const currentTestIndex = useSelector((state: RootState) => state.assessment.currentTestIndex)
    const currentTestQuestionIndex = useSelector(
        (state: RootState) => state.assessment.currentTestQuestionIndex
    )

    const [isQuestionWithoutAnswer, setIsQuestionWithoutAnswer] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [openInstructionDialog, setOpenInstructionDialog] = useState(false)

    const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true })

    const test = assessment?.tests[currentTestIndex!]

    const instructionAudioBlobUrl = test?.testType.questionType.instructionAudioBlobUrl
    const questionAudioBlobUrl =
        test?.testQuestions[currentTestQuestionIndex!].question.questionAudioBlobUrl

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isRecording) {
            timer = setInterval(() => {
                setRecordingTime((time) => time + 1)
            }, 1000)
        } else {
            clearInterval(timer!)
            setRecordingTime(0)
        }
        return () => clearInterval(timer)
    }, [isRecording])

    useEffect(() => {
        // whenever a new mediaBlobUrl is available, update the current test question with the new answer audio
        if (mediaBlobUrl && test && currentTestQuestionIndex !== null) {
            dispatch(
                setAnswerAudioBlobUrl({
                    answerAudioBlobUrl: mediaBlobUrl,
                    testIndex: currentTestIndex!,
                    testQuestionIndex: currentTestQuestionIndex!,
                })
            )
        }
    }, [mediaBlobUrl])

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
        dispatch(submitTestQuestion())
        dispatch(nextQuestion())
    }

    const onFinishTest = () => {
        dispatch(submitTestQuestion())
        dispatch(setScreenToDisplay('TestFinish'))
    }

    const onOnpenInstructionDialog = () => {
        setOpenInstructionDialog(true)
    }

    const onCloseInstructionDialog = () => {
        setOpenInstructionDialog(false)
    }

    return (
        <>
            {test && currentTestQuestionIndex !== null && (
                <Box sx={{ maxWidth: 700, mx: 'auto', p: 2 }}>
                    <Card variant="outlined" sx={{ padding: 2, position: 'relative' }}>
                        <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
                            <LinearProgress
                                variant="determinate"
                                value={
                                    ((currentTestQuestionIndex + 1) / test?.testType.numQuestions) *
                                    100
                                }
                            />
                        </Box>
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
                                        {currentTestQuestionIndex + 1} /{' '}
                                        {test.testType.numQuestions}
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
                                        {/* {instructionAudioBlobUrl && (
                                                <AudioPlayerWithIcon
                                                    instructionAudioSrc={instructionAudioBlobUrl}
                                                />
                                            )}
                                            {test.testType.questionType.questionInstructionText} */}

                                        {questionAudioBlobUrl ? (
                                            <Box>
                                                <audio controls src={questionAudioBlobUrl}>
                                                    Your browser does not support the audio element.
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

                                        <Box sx={{ mt: 2, mb: 2 }}>
                                            {isRecording && (
                                                <div>Recording Time: {recordingTime}s</div>
                                            )}
                                            {
                                                // prettier-ignore
                                                !isRecording &&
                                                    mediaBlobUrl &&
                                                    !isQuestionWithoutAnswer && (
                                                        <>
                                                            <div>Your answer:</div>
                                                            <audio
                                                                controls
                                                                src={mediaBlobUrl}
                                                            />
                                                        </>
                                                    )
                                            }
                                        </Box>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ mt: 3 }}
                                        >
                                            {/* Left-aligned instruction button */}
                                            <Button
                                                onClick={onOnpenInstructionDialog}
                                                variant="outlined"
                                                sx={{ padding: '12px', minWidth: 'auto' }}
                                            >
                                                Instruction
                                            </Button>

                                            {/* Test Instruction Dialog */}
                                            <TestInstructionDialog
                                                open={openInstructionDialog}
                                                onClose={onCloseInstructionDialog}
                                                showAudioVersion={[
                                                    'Synthesis',
                                                    'Analysis',
                                                    'Listening',
                                                ].includes(test.testType.testTypeName)}
                                                instructionAudioBlobUrl={instructionAudioBlobUrl}
                                                customPoint1Text={
                                                    test.testType.questionType
                                                        .questionInstructionText
                                                }
                                            />

                                            {/* Right-aligned next/finish buttons */}
                                            <Box display="flex" justifyContent="right">
                                                <Box>
                                                    {!isRecording && isQuestionWithoutAnswer && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{ mr: 2, padding: '12px' }}
                                                            onClick={onStartRecording}
                                                        >
                                                            Record Now
                                                        </Button>
                                                    )}
                                                    {!isRecording && !isQuestionWithoutAnswer && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{ mr: 2, padding: '12px' }}
                                                            onClick={onStartRecording}
                                                        >
                                                            Record Again
                                                        </Button>
                                                    )}
                                                    {isRecording && (
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
                                                {
                                                    // prettier-ignore
                                                    currentTestQuestionIndex <
                                                        test.testType.numQuestions - 1 ? (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{ padding: '12px' }}
                                                                onClick={onClickNextQuestion}
                                                                disabled={isRecording}
                                                            >
                                                                Next Question
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{ padding: '12px' }}
                                                                onClick={onFinishTest}
                                                                disabled={isRecording}
                                                            >
                                                                Finish Section
                                                            </Button>
                                                        )
                                                }
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
