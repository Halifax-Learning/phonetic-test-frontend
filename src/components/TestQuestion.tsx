import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { useDispatch, useSelector } from 'react-redux'

import { Test } from '../models/interface'
import { nextQuestion, submitTest, updateTest } from '../reducers/testReducer'

const TestQuestion = () => {
    const dispatch: any = useDispatch()
    const test = useSelector((state: { test: { test: Test } }) => state.test.test)
    const currentTestQuestionIndex = useSelector(
        (state: { test: { currentTestQuestionIndex: number } }) => state.test.currentTestQuestionIndex
    )

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
        if (mediaBlobUrl) {
            const currentTestQuestion = test.testQuestions[currentTestQuestionIndex]

            // Create a new object with the updated properties
            const updatedTestQuestion = {
                ...currentTestQuestion,
                answerAudioBlobUrl: mediaBlobUrl,
            }

            dispatch(updateTest(updatedTestQuestion))
        }
    }, [mediaBlobUrl])

    const questionAudioB64Encode =
        test.testQuestions[currentTestQuestionIndex].question.questionAudioB64Encode
    // Create the data URI for the question audio file
    const questionAudioSrc = `data:audio/mp3;base64,${questionAudioB64Encode}`

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
        dispatch(submitTest(test.testId, test.testQuestions))
    }

    return (
        <Box>
            <Typography variant="h3">{test.testType.name}</Typography>
            <Typography style={{ marginBottom: 50 }}>{test.instructionText}</Typography>

            <Typography variant="h4">Question {currentTestQuestionIndex + 1} </Typography>
            <Typography>{test.testQuestions[currentTestQuestionIndex].question.questionText}</Typography>

            <Box>
                <audio controls src={questionAudioSrc}>
                    Your browser does not support the audio element.
                </audio>
            </Box>

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
                <Button onClick={onSubmitTest}>Finish Test</Button>
            )}
        </Box>
    )
}

export default TestQuestion
