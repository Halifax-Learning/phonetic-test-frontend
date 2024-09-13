import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { nextQuestion, submitTest, updateTest } from '../../reducers/testReducer'

const TestQuestion = () => {
    const dispatch: any = useDispatch()

    const test = useSelector((state: RootState) => state.test.test)
    const currentTestQuestionIndex = useSelector((state: RootState) => state.test.currentTestQuestionIndex)

    const [isQuestionWithoutAnswer, setIsQuestionWithoutAnswer] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true })

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

    return (
        <>
            {test && currentTestQuestionIndex !== null && (
                <Box>
                    <Typography variant="h3">{test.testType.testTypeName}</Typography>
                    <Typography>Instruction:</Typography>
                    <Typography style={{ marginBottom: 50 }}>{test.questionInstructionText}</Typography>
                    {instructionAudioB64Encode && (
                        <audio controls src={instructionAudioSrc}>
                            Your browser does not support the audio element.
                        </audio>
                    )}

                    <Typography variant="h4" sx={{ marginTop: 10 }}>
                        Question {currentTestQuestionIndex + 1}{' '}
                    </Typography>

                    {questionAudioSrc ? (
                        <Box>
                            <audio controls src={questionAudioSrc}>
                                Your browser does not support the audio element.
                            </audio>
                        </Box>
                    ) : (
                        <Typography>
                            {test.testQuestions[currentTestQuestionIndex].question.questionText}
                        </Typography>
                    )}

                    <Box>
                        <Box>
                            {!isRecording ? (
                                <Button onClick={onStartRecording}>Record Your Answer</Button>
                            ) : (
                                <Button onClick={onStopRecording}>Finish Your Answer</Button>
                            )}
                        </Box>
                        {isRecording && <div>Recording Time: {recordingTime}s</div>}
                        {!isRecording && mediaBlobUrl && !isQuestionWithoutAnswer && (
                            <audio controls src={mediaBlobUrl} />
                        )}
                    </Box>

                    {currentTestQuestionIndex < test.testType.numQuestions - 1 ? (
                        <Button onClick={onClickNextQuestion}>Next Question</Button>
                    ) : (
                        <Button onClick={onSubmitTest}>Finish Section</Button>
                    )}
                </Box>
            )}
        </>
    )
}

export default TestQuestion
