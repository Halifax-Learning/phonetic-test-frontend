import HeaderIcon from '@mui/icons-material/RecordVoiceOver'
import { Box, Button, Card, CardContent, Grid2, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { useDispatch, useSelector } from 'react-redux'

import HelpIcon from '@mui/icons-material/Help'
import EndSessionIcon from '@mui/icons-material/LastPage'
import MicIcon from '@mui/icons-material/Mic'
import MicNoneIcon from '@mui/icons-material/MicNone'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import background from '../../assets/testQuestions/backgrounds/bg1.png'
import sticker1 from '../../assets/testQuestions/stickers/Animal1.gif'
import sticker10 from '../../assets/testQuestions/stickers/Animal10.gif'
import sticker2 from '../../assets/testQuestions/stickers/Animal2.gif'
import sticker3 from '../../assets/testQuestions/stickers/Animal3.gif'
import sticker4 from '../../assets/testQuestions/stickers/Animal4.gif'
import sticker5 from '../../assets/testQuestions/stickers/Animal5.gif'
import sticker6 from '../../assets/testQuestions/stickers/Animal6.gif'
import sticker7 from '../../assets/testQuestions/stickers/Animal7.gif'
import sticker8 from '../../assets/testQuestions/stickers/Animal8.gif'
import sticker9 from '../../assets/testQuestions/stickers/Animal9.gif'
import { RootState } from '../../main'
import {
    nextQuestion,
    setAnswerAudioBlobUrl,
    submitTestQuestion,
} from '../../reducers/assessmentReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { StyledSoundCard } from '../../theme/theme'
import ConfirmationModal from './ConfirmationModal'
import ProgressBar from './ProgressBar'
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
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    // Set up a message to display when student submits the answer
    // Additionally, if color is 'info', a request is in progress and the "Next" button is disabled
    const [onSubmitMsg, setOnSubmitMsg] = useState({ message: '', color: 'success' })

    const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
        audio: true,
        mediaRecorderOptions: {
            mimeType: MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : 'audio/web ',
        },
    })

    const test = assessment?.tests[currentTestIndex!]

    const instructionAudioBlobUrl = test?.testType.questionType.instructionAudioBlobUrl
    const questionAudioBlobUrl =
        test?.testQuestions[currentTestQuestionIndex!].question.questionAudioBlobUrl

    const stickers = [
        sticker1,
        sticker2,
        sticker3,
        sticker4,
        sticker5,
        sticker6,
        sticker7,
        sticker8,
        sticker9,
        sticker10,
    ]

    const [currentSticker, setCurrentSticker] = useState('Animal1.gif')
    const pickRandomSticker = () => {
        const randomIndex = Math.floor(Math.random() * stickers.length)
        setCurrentSticker(stickers[randomIndex])
    }

    useEffect(() => {
        pickRandomSticker()
    }, [])

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

    const submitAnswer = async () => {
        setOnSubmitMsg({ message: 'Saving your answer...', color: 'info' })

        const response = await dispatch(submitTestQuestion())
        if (response?.error) {
            setOnSubmitMsg({ message: response.error, color: 'error' })
            return
        }
        setIsQuestionWithoutAnswer(true)
        pickRandomSticker()
        setOnSubmitMsg({ message: '', color: 'success' })

        const isLastQuestionInTest = currentTestQuestionIndex === test!.testQuestions.length - 1
        if (isLastQuestionInTest) {
            dispatch(setScreenToDisplay('TestFinish'))
        } else {
            dispatch(nextQuestion())
        }
    }

    const onClickNextQuestion = async () => {
        if (isQuestionWithoutAnswer) {
            setModalOpen(true)
        } else {
            await submitAnswer()
        }
    }

    const onFinishTest = async () => {
        if (isQuestionWithoutAnswer) {
            setModalOpen(true)
        } else {
            await submitAnswer()
        }
    }

    const handleConfirmSkipQuestion = async () => {
        setModalOpen(false)
        await submitAnswer()
    }

    return (
        <>
            {test && currentTestQuestionIndex !== null && (
                <Box sx={{ maxWidth: 'md', mx: 'auto', p: 2 }}>
                    <ProgressBar
                        currentQuestionIndex={currentTestQuestionIndex}
                        numQuestions={test?.testType.numQuestions}
                    />
                    <Card
                        variant="outlined"
                        sx={{
                            padding: 2,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                backgroundImage: `url(${background})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'blur(1px)',
                                opacity: 0.3, // 20% opacity
                                zIndex: 1, // Behind the card content
                            }}
                        />
                        <CardContent sx={{ position: 'relative', zIndex: 3 }}>
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
                                        <Grid2 container spacing={0}>
                                            <Grid2 size={{ xs: 12, sm: 8 }}>
                                                {/* Left side: Grouped content (first two boxes) */}
                                                <Box>
                                                    {/* First Box: Question Audio or Text */}
                                                    {questionAudioBlobUrl ? (
                                                        <Box>
                                                            <audio
                                                                controls
                                                                src={questionAudioBlobUrl}
                                                                style={{
                                                                    width: '100%',
                                                                    maxWidth: 'sm',
                                                                }}
                                                            >
                                                                Your browser does not support the
                                                                audio element.
                                                            </audio>
                                                        </Box>
                                                    ) : (
                                                        <Box display="flex">
                                                            <StyledSoundCard>
                                                                <CardContent>
                                                                    <Typography
                                                                        variant="h1"
                                                                        sx={{
                                                                            fontFamily:
                                                                                'Inter, sans-serif',
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

                                                    {/* Second Box: Recording Section */}
                                                    <Box sx={{ mt: 2, mb: 2 }}>
                                                        {isRecording && (
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        width: '10px',
                                                                        height: '10px',
                                                                        backgroundColor: 'red',
                                                                        borderRadius: '50%',
                                                                        animation:
                                                                            'pulsate 1s infinite',
                                                                        margin: '0px 15px',
                                                                        '@keyframes pulsate': {
                                                                            '0%': {
                                                                                transform:
                                                                                    'scale(1)',
                                                                                opacity: 1,
                                                                            },
                                                                            '50%': {
                                                                                transform:
                                                                                    'scale(1.5)',
                                                                                opacity: 0.7,
                                                                            },
                                                                            '100%': {
                                                                                transform:
                                                                                    'scale(1)',
                                                                                opacity: 1,
                                                                            },
                                                                        },
                                                                    }}
                                                                />
                                                                Recording Time: {recordingTime}s
                                                            </div>
                                                        )}
                                                        {!isRecording &&
                                                            mediaBlobUrl &&
                                                            !isQuestionWithoutAnswer && (
                                                                <>
                                                                    <div>Your answer:</div>
                                                                    <audio
                                                                        controls
                                                                        src={mediaBlobUrl}
                                                                        style={{
                                                                            width: '100%',
                                                                            maxWidth: 'sm',
                                                                        }}
                                                                    />
                                                                </>
                                                            )}
                                                    </Box>
                                                </Box>
                                            </Grid2>
                                            {/* Right side: Sticker (third box) */}
                                            <Grid2 size={{ xs: 0, sm: 4 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center', // Optional, to center the image horizontally
                                                        alignItems: 'flex-end', // Aligns the image at the bottom of the box
                                                        height: '100%',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <img
                                                        src={currentSticker}
                                                        alt="Animal Sticker"
                                                        style={{
                                                            width: '100%', // Set width to 100% of the parent container
                                                            height: '100%', // Set height to 100% of the parent container
                                                            objectFit: 'contain', // Maintain aspect ratio while fitting within the container
                                                            maxWidth: '90%', // Optional: Limit the maximum width to 80% of its original size
                                                            maxHeight: '90%', // Optional: Limit the maximum height to 80% of its original size
                                                        }}
                                                    />
                                                </Box>
                                            </Grid2>
                                        </Grid2>

                                        <Typography color={onSubmitMsg.color}>
                                            {onSubmitMsg.message}
                                        </Typography>

                                        <Box sx={{ mt: 2 }}>
                                            <Grid2 container alignItems="flex-start" spacing={1}>
                                                <Grid2
                                                    alignItems="flex-start"
                                                    size={{ sm: 6, md: 'auto' }}
                                                >
                                                    {/* Left-aligned instruction button */}
                                                    <Button
                                                        onClick={() =>
                                                            setOpenInstructionDialog(true)
                                                        }
                                                        variant="outlined"
                                                        startIcon={<HelpIcon />}
                                                        sx={{
                                                            backgroundColor:
                                                                'rgba(255, 255, 255, 0.6)',
                                                            minWidth: 'auto',
                                                            fontSize: '1rem',
                                                        }}
                                                    >
                                                        Instruction
                                                    </Button>
                                                    {/* Test Instruction Dialog */}
                                                    <TestInstructionDialog
                                                        open={openInstructionDialog}
                                                        onClose={() =>
                                                            setOpenInstructionDialog(false)
                                                        }
                                                        showAudioVersion={
                                                            test.testType.hasQuestionAudio
                                                        }
                                                        instructionAudioBlobUrl={
                                                            instructionAudioBlobUrl
                                                        }
                                                        customPoint1Text={
                                                            test.testType.questionType
                                                                .questionInstructionText
                                                        }
                                                    />
                                                </Grid2>

                                                {/* Right-aligned next/finish buttons */}
                                                <Grid2
                                                    alignItems="flex-end"
                                                    size={{ xs: 12, sm: 6, md: 5 }}
                                                >
                                                    {/* Ensure the Record button takes the full width on xs */}
                                                    <Box
                                                        display="flex"
                                                        flexDirection="column"
                                                        alignItems="flex-end"
                                                    >
                                                        {!isRecording &&
                                                            isQuestionWithoutAnswer && (
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    startIcon={<MicIcon />}
                                                                    sx={{ ml: 2, fontSize: '1rem' }}
                                                                    onClick={onStartRecording}
                                                                >
                                                                    Record Now
                                                                </Button>
                                                            )}
                                                        {!isRecording &&
                                                            !isQuestionWithoutAnswer && (
                                                                <Box
                                                                    display="flex"
                                                                    flexDirection="column"
                                                                    alignItems="end"
                                                                >
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        startIcon={<MicIcon />}
                                                                        sx={{
                                                                            fontSize: '1rem',
                                                                        }}
                                                                        onClick={onStartRecording}
                                                                    >
                                                                        Record Again
                                                                    </Button>
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="warning"
                                                                        sx={{
                                                                            mt: 1,
                                                                            maxWidth: '200px',
                                                                            textAlign: 'end',
                                                                        }}
                                                                    >
                                                                        Note: If you record a new
                                                                        answer, your current answer
                                                                        will be lost.
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        {isRecording && (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                startIcon={<MicNoneIcon />}
                                                                sx={{ fontSize: '1rem' }}
                                                                onClick={onStopRecording}
                                                            >
                                                                Stop Recording
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Grid2>
                                                <Grid2
                                                    alignItems="flex-end"
                                                    size={{ xs: 12, sm: 12, md: 'auto' }}
                                                >
                                                    <Box
                                                        display="flex"
                                                        flexDirection="column"
                                                        alignItems="flex-end"
                                                    >
                                                        {currentTestQuestionIndex <
                                                        test.testType.numQuestions - 1 ? (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                startIcon={<NavigateNextIcon />}
                                                                sx={{ ml: 2, fontSize: '1rem' }}
                                                                onClick={onClickNextQuestion}
                                                                disabled={
                                                                    isRecording ||
                                                                    onSubmitMsg.color === 'info'
                                                                }
                                                            >
                                                                Next Question
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                startIcon={<EndSessionIcon />}
                                                                sx={{ ml: 2, fontSize: '1rem' }}
                                                                onClick={onFinishTest}
                                                                disabled={
                                                                    isRecording ||
                                                                    onSubmitMsg.color === 'info'
                                                                }
                                                            >
                                                                Finish Section
                                                            </Button>
                                                        )}
                                                        <ConfirmationModal
                                                            open={modalOpen}
                                                            onClose={() => setModalOpen(false)}
                                                            onConfirm={handleConfirmSkipQuestion}
                                                        />
                                                    </Box>
                                                </Grid2>
                                            </Grid2>
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
