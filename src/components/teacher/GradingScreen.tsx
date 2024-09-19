import {
    Box,
    Button,
    FormControlLabel,
    List,
    ListItemButton,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import {
    fetchAnswerAudio,
    fetchCorrectAnswerAudio,
    fetchQuestionAudio,
    setTeacherEvaluation,
    setTest,
    submitTeacherEvaluation,
} from '../../reducers/assessmentReducer'

const GradingScreen = () => {
    const dispatch = useDispatch<any>()
    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const currentTestIndex = useSelector((state: RootState) => state.assessment.currentTestIndex)

    const [selectedTest, setSelectedTest] = useState(assessment?.tests[currentTestIndex!])
    const [selectedValues, setSelectedValues] = useState<string[]>([])

    useEffect(() => {
        // Update selected test when currentTestIndex changes
        setSelectedTest(assessment?.tests[currentTestIndex!])
    }, [assessment, currentTestIndex])

    useEffect(() => {
        // Load all question audios
        const hasQuestionAudio = selectedTest?.testType.hasQuestionAudio
        if (hasQuestionAudio) {
            for (const [index, testQuestion] of selectedTest?.testQuestions.entries() || []) {
                const questionAudioBlobUrl = testQuestion.question.questionAudioBlobUrl
                if (!questionAudioBlobUrl) {
                    const questionId = testQuestion.question.questionId
                    dispatch(fetchQuestionAudio(questionId!, currentTestIndex!, index))
                }
            }
        }

        // Load all correct answer audios
        const hasCorrectAnswerAudio = selectedTest?.testType.hasCorrectAnswerAudio
        if (hasCorrectAnswerAudio) {
            for (const [index, testQuestion] of selectedTest?.testQuestions.entries() || []) {
                const correctAnswerAudioBlobUrl = testQuestion.question.correctAnswerAudioBlobUrl
                if (!correctAnswerAudioBlobUrl) {
                    const questionId = testQuestion.question.questionId
                    dispatch(fetchCorrectAnswerAudio(questionId!, currentTestIndex!, index))
                }
            }
        }

        // Load all student answer audios
        for (const [index, testQuestion] of selectedTest?.testQuestions.entries() || []) {
            const hasAnswerAudio = testQuestion.hasAnswerAudio
            const answerAudioBlobUrl = testQuestion.answerAudioBlobUrl
            if (hasAnswerAudio && !answerAudioBlobUrl) {
                const testQuestionId = testQuestion.testQuestionId
                dispatch(fetchAnswerAudio(testQuestionId, currentTestIndex!, index))
            }
        }
    }, [selectedTest])

    useEffect(() => {
        // Update selected values when selectedTest changes
        const updatedSelectedValues =
            selectedTest?.testQuestions.map((testQuestion) => {
                if (testQuestion.latestTeacherEvaluation === true) {
                    return 'correct'
                } else if (testQuestion.latestTeacherEvaluation === false) {
                    return 'incorrect'
                } else {
                    return ''
                }
            }) || []
        setSelectedValues(updatedSelectedValues)
    }, [selectedTest])

    const onChooseTest = (index: number) => {
        dispatch(setTest(index))
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = (event.target as HTMLInputElement).value

        setSelectedValues((prev) => {
            const newValues = [...prev]
            newValues[index] = value
            return newValues
        })

        dispatch(
            setTeacherEvaluation({
                evaluation: value === 'correct',
                testIndex: currentTestIndex!,
                testQuestionIndex: index,
            })
        )
    }

    const onSaveGrading = () => {
        dispatch(submitTeacherEvaluation())
    }

    return (
        <>
            {selectedTest && (
                <Box sx={{ marginLeft: -20, marginRight: -20 }}>
                    <Typography variant="h1">Tests</Typography>
                    <List>
                        {assessment?.tests.map((test, index) => (
                            <ListItemButton
                                key={test.testId}
                                onClick={() => onChooseTest(index)}
                                sx={{
                                    backgroundColor: index === currentTestIndex ? 'lightgray' : '',
                                }}
                            >
                                {test.testType.testTypeName}
                            </ListItemButton>
                        ))}
                    </List>

                    <Typography variant="h1">Questions</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Question No.</TableCell>
                                    <TableCell>Question Text</TableCell>
                                    <TableCell>Question Audio</TableCell>
                                    <TableCell>Correct Answer Audio</TableCell>
                                    <TableCell>Student Answer Audio</TableCell>
                                    <TableCell>Teacher Evaluation</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedTest?.testQuestions.map((testQuestion, index) => (
                                    <TableRow key={testQuestion.testQuestionId}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{testQuestion.question.questionText}</TableCell>
                                        <TableCell>
                                            {testQuestion.question.questionAudioBlobUrl && (
                                                <audio
                                                    controls
                                                    src={testQuestion.question.questionAudioBlobUrl}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {testQuestion.question.correctAnswerAudioBlobUrl && (
                                                <audio
                                                    controls
                                                    src={
                                                        testQuestion.question
                                                            .correctAnswerAudioBlobUrl
                                                    }
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {testQuestion.hasAnswerAudio && (
                                                <audio
                                                    controls
                                                    src={testQuestion.answerAudioBlobUrl}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <RadioGroup
                                                value={selectedValues[index] || ''}
                                                onChange={(event) =>
                                                    handleRadioChange(event, index)
                                                }
                                            >
                                                <FormControlLabel
                                                    value="correct"
                                                    control={<Radio />}
                                                    label="Correct"
                                                />
                                                <FormControlLabel
                                                    value="incorrect"
                                                    control={<Radio />}
                                                    label="Incorrect"
                                                />
                                            </RadioGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button variant="contained" color="primary" onClick={onSaveGrading}>
                        Save
                    </Button>
                </Box>
            )}
        </>
    )
}

export default GradingScreen
