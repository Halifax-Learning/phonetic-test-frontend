import HelpIcon from '@mui/icons-material/Help'
import EndSessionIcon from '@mui/icons-material/LastPage'
import MicIcon from '@mui/icons-material/Mic'
import MicNoneIcon from '@mui/icons-material/MicNone'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HeaderIcon from '@mui/icons-material/RecordVoiceOver'
import { Box, Button, Card, CardContent, CircularProgress, Grid2, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { useDispatch, useSelector } from 'react-redux'

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
import CustomSnackbar, { OnRequestProps, SimpleCustomSnackbar } from '../reusables/CustomSnackbar'
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
    const [microphoneAllowed, setMicrophoneAllowed] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [openInstructionDialog, setOpenInstructionDialog] = useState(false)
    const [openModalNoAnswerWarning, setOpenNoAnswerWarningModal] = useState<boolean>(false)

    const [onRecordWarning, setOnRecordWarning] = useState<OnRequestProps>({
        display: false,
        message: '',
        color: 'warning',
    })
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [onSubmit, setOnSubmit] = useState<OnRequestProps>({
        inProgress: false,
        display: false,
        message: '',
        color: 'info',
    })

    const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
        audio: true,
        mediaRecorderOptions: {
            mimeType: MediaRecorder.isTypeSupported('audio/mpeg') ? 'audio/mpeg' : 'audio/webm',
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
        const checkMicrophonePermission = async () => {
            try {
                const permissionStatus = await navigator.permissions.query({
                    name: 'microphone' as PermissionName,
                })
                if (permissionStatus.state === 'granted') {
                    setMicrophoneAllowed(true)
                } else {
                    try {
                        await navigator.mediaDevices.getUserMedia({ audio: true })
                        setMicrophoneAllowed(true)
                    } catch (error) {
                        setMicrophoneAllowed(false)
                        console.error('Microphone permission denied:', error)
                    }
                }

                permissionStatus.onchange = () => {
                    setMicrophoneAllowed(permissionStatus.state === 'granted')
                }
            } catch (error) {
                console.error('Error checking microphone permission:', error)
            }
        }
        checkMicrophonePermission()

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

    const showMicrophonePermissionWarning = (): boolean => {
        if (!microphoneAllowed) {
            setOnRecordWarning({
                display: true,
                message: 'Please allow microphone access to record your answer.',
                color: 'error',
            })
            return true
        }
        return false
    }

    const onStartRecording = () => {
        if (showMicrophonePermissionWarning()) {
            return
        }

        startRecording()
        setIsRecording(true)
        // Stop recording after 5 seconds
        timeoutRef.current = setTimeout(() => {
            onStopRecording()
            setOnRecordWarning({
                display: true,
                message: 'Maximum Recording Time is 5 seconds',
                color: 'warning',
            })
        }, 6000)
    }

    const onStopRecording = () => {
        stopRecording()
        setIsRecording(false)
        setIsQuestionWithoutAnswer(false)

        // Clear the timeout if the user stops recording before the 5 seconds limit
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

    const submitAnswer = async () => {
        try {
            setOnSubmit({
                inProgress: true,
                display: false,
                message: 'Saving your answer...',
                color: 'info',
            })

            await dispatch(submitTestQuestion())

            setOnSubmit({
                inProgress: false,
                display: true,
                message: 'Your answer has been saved successfully!',
                color: 'success',
            })
            setIsQuestionWithoutAnswer(true)
            pickRandomSticker()

            const isLastQuestionInTest = currentTestQuestionIndex === test!.testQuestions.length - 1
            if (isLastQuestionInTest) {
                dispatch(setScreenToDisplay('TestFinish'))
            } else {
                dispatch(nextQuestion())
            }
        } catch (error: any) {
            setOnSubmit({
                inProgress: false,
                display: true,
                message: error.message,
                color: 'error',
            })
        }
    }

    const onClickNextQuestion = async () => {
        if (showMicrophonePermissionWarning()) {
            return
        }
        if (isQuestionWithoutAnswer) {
            setOpenNoAnswerWarningModal(true)
        } else {
            await submitAnswer()
        }
    }

    const onFinishTest = async () => {
        if (showMicrophonePermissionWarning()) {
            return
        }
        if (isQuestionWithoutAnswer) {
            setOpenNoAnswerWarningModal(true)
        } else {
            await submitAnswer()
        }
    }

    const handleConfirmSkipQuestion = async () => {
        setOpenNoAnswerWarningModal(false)
        await submitAnswer()
    }

    const AnswerAudio = () => (
        <Box sx={{ mt: 2, mb: 2 }}>
            {isRecording && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        sx={{
                            width: '10px',
                            height: '10px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            animation: 'pulsate 1s infinite',
                            margin: '0px 15px',
                            '@keyframes pulsate': {
                                '0%': { transform: 'scale(1)', opacity: 1 },
                                '50%': { transform: 'scale(1.5)', opacity: 0.7 },
                                '100%': { transform: 'scale(1)', opacity: 1 },
                            },
                        }}
                    />
                    Recording Time: {recordingTime}s
                </div>
            )}
            {!isRecording && mediaBlobUrl && !isQuestionWithoutAnswer && (
                <>
                    <Typography variant="h6" color="secondary.dark" sx={{ marginBottom: 1 }}>
                        Your answer:
                    </Typography>
                    <audio controls src={mediaBlobUrl} style={{ width: '70%', maxWidth: 'sm' }} />
                </>
            )}
        </Box>
    )

    const Sticker = () => (
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
    )

    const IntructionButton = () => (
        <>
            <Button
                onClick={() => setOpenInstructionDialog(true)}
                variant="outlined"
                startIcon={<HelpIcon />}
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    minWidth: 'auto',
                    fontSize: '1rem',
                }}
            >
                Instruction
            </Button>

            <TestInstructionDialog
                open={openInstructionDialog}
                onClose={() => setOpenInstructionDialog(false)}
                showAudioVersion={test!.testType.hasQuestionAudio}
                instructionAudioBlobUrl={instructionAudioBlobUrl}
                customPoint1Text={test!.testType.questionType.questionInstructionText}
            />
        </>
    )

    const RecordButton = () => (
        <Box display="flex" flexDirection="column" alignItems="flex-end">
            {!isRecording && isQuestionWithoutAnswer && (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<MicIcon />}
                    sx={{ ml: 2, fontSize: '1rem' }}
                    onClick={onStartRecording}
                    disabled={isRecording || onSubmit.inProgress}
                >
                    Record Now
                </Button>
            )}
            {!isRecording && !isQuestionWithoutAnswer && (
                <Box display="flex" flexDirection="column" alignItems="end">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<MicIcon />}
                        sx={{ fontSize: '1rem' }}
                        onClick={onStartRecording}
                    >
                        Record Again
                    </Button>
                    <Typography
                        variant="body2"
                        color="warning"
                        sx={{ mt: 1, maxWidth: '200px', textAlign: 'end' }}
                    >
                        Note: If you record a new answer, your current answer will be lost.
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
    )

    const NextButton = () => (
        <Box display="flex" flexDirection="column" alignItems="flex-end">
            {currentTestQuestionIndex! < test!.testType.numQuestions - 1 ? (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<NavigateNextIcon />}
                    sx={{ ml: 2, fontSize: '1rem' }}
                    onClick={onClickNextQuestion}
                    disabled={isRecording || onSubmit.inProgress}
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
                    disabled={isRecording || onSubmit.inProgress}
                >
                    Finish Section
                </Button>
            )}
            {onSubmit.inProgress && (
                <Box display="flex" alignItems="center">
                    <CircularProgress size={24} style={{ marginRight: 8 }} />
                    <Typography variant="body2" color={onSubmit.color}>
                        {onSubmit.message}
                    </Typography>
                </Box>
            )}
            <ConfirmationModal
                open={openModalNoAnswerWarning}
                onClose={() => setOpenNoAnswerWarningModal(false)}
                onConfirm={handleConfirmSkipQuestion}
            />
        </Box>
    )

    if (!test || currentTestQuestionIndex === null) {
        return <></>
    }

    return (
        <Box sx={{ maxWidth: 'md', mx: 'auto', p: 2 }}>
            <SimpleCustomSnackbar
                display={test.testType.hasQuestionAudio && !questionAudioBlobUrl}
                message="Failed to fetch audio. Please try again."
                color="error"
            />
            <CustomSnackbar onRequest={onRecordWarning} setOnRequest={setOnRecordWarning} />
            <CustomSnackbar onRequest={onSubmit} setOnRequest={setOnSubmit} />
            <ProgressBar
                currentQuestionIndex={currentTestQuestionIndex}
                numQuestions={test?.testType.numQuestions}
            />
            <Card variant="outlined" sx={{ padding: 2, position: 'relative', overflow: 'hidden' }}>
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
                        <Grid2 size={1} display="flex" alignItems="center" justifyContent="center">
                            <HeaderIcon sx={{ fontSize: 35, color: 'secondary.dark' }} />
                        </Grid2>
                        {/* Top-right: Instructions Title */}
                        <Grid2 size={11} display="flex" alignItems="center" justifyContent="left">
                            <Typography variant="h1" color="secondary.dark">
                                {test.testType.testTypeName} Section - Question{' '}
                                {currentTestQuestionIndex + 1} / {test.testType.numQuestions}
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
                                    {/* Left side: Question and Answer Audio */}
                                    <Grid2 size={{ xs: 12, sm: 8 }}>
                                        <QuestionAudio
                                            {...{
                                                test,
                                                currentTestQuestionIndex,
                                                questionAudioBlobUrl,
                                            }}
                                        />
                                        <AnswerAudio />
                                    </Grid2>
                                    {/* Right side: Sticker */}
                                    <Grid2 size={{ xs: 0, sm: 4 }}>
                                        <Sticker />
                                    </Grid2>
                                </Grid2>
                                <Box sx={{ mt: 2 }}>
                                    <Grid2 container alignItems="flex-start" spacing={1}>
                                        {/* Left-aligned instruction button */}
                                        <Grid2 alignItems="flex-start" size={{ sm: 6, md: 'auto' }}>
                                            <IntructionButton />
                                        </Grid2>

                                        {/* Right-aligned record and next/finish buttons */}
                                        <Grid2
                                            alignItems="flex-end"
                                            size={{ xs: 12, sm: 6, md: 5 }}
                                        >
                                            <RecordButton />
                                        </Grid2>
                                        <Grid2
                                            alignItems="flex-end"
                                            size={{ xs: 12, sm: 12, md: 'auto' }}
                                        >
                                            <NextButton />
                                        </Grid2>
                                    </Grid2>
                                </Box>
                            </Box>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>
        </Box>
    )
}

// Extracted QuestionAudio component from outside of TestQuestion component to prevent
// the audio player from flickering when the state changes
const QuestionAudio = ({ test, currentTestQuestionIndex, questionAudioBlobUrl }: any) => (
    <>
        {test?.testType.hasQuestionAudio ? (
            <Box>
                <audio controls src={questionAudioBlobUrl} style={{ width: '70%', maxWidth: 'sm' }}>
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
                            {test!.testQuestions[currentTestQuestionIndex!].question.questionText}
                        </Typography>
                    </CardContent>
                </StyledSoundCard>
            </Box>
        )}
    </>
)

export default TestQuestion
