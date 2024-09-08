import { Box, Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { Test } from '../models/interface'
import { nextQuestion, submitTest } from '../reducers/testReducer'

const TestQuestion = () => {
    const dispatch = useDispatch()
    const test = useSelector((state: { test: { test: Test } }) => state.test.test)
    const currentTestQuestionIndex = useSelector(
        (state: { test: { currentTestQuestionIndex: number } }) => state.test.currentTestQuestionIndex
    )

    const questionAudioB64Encode =
        test.testQuestions[currentTestQuestionIndex].question.questionAudioB64Encode
    // Create the data URI for the question audio file
    const questionAudioSrc = `data:audio/mp3;base64,${questionAudioB64Encode}`

    const onClickNextQuestion = () => {
        dispatch(nextQuestion())
    }

    const onSubmitTest = () => {
        dispatch(submitTest())
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

            {currentTestQuestionIndex < test.testType.numQuestions - 1 ? (
                <Button onClick={onClickNextQuestion}>Next Question</Button>
            ) : (
                <Button onClick={onSubmitTest}>Finish Test</Button>
            )}
        </Box>
    )
}

export default TestQuestion
