import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControl,
    FormControlLabel,
    Grid2,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Stack,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonIcon from '@mui/icons-material/Person'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { RootState } from '../../main'
import {
    fetchAnswerAudio,
    fetchCorrectAnswerAudio,
    fetchQuestionAudio,
    setTeacherEvaluation,
    setTest,
    submitTeacherEvaluation,
} from '../../reducers/assessmentReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'

const GradingScreen = () => {
    const dispatch = useDispatch<any>()
    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const currentTestIndex = useSelector((state: RootState) => state.assessment.currentTestIndex)

    const [selectedTest, setSelectedTest] = useState(assessment?.tests[currentTestIndex!])
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [filterTestType, setFilterTestType] = useState<number | string>('')

    useEffect(() => {
        // Update selected test when currentTestIndex changes
        setSelectedTest(assessment?.tests[currentTestIndex!])
    }, [assessment, currentTestIndex])

    useEffect(() => {
        if (assessment?.tests.length && filterTestType === '') {
            setFilterTestType(0) // Only set initially if needed
        }
    }, [assessment])

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

    const handleBackToAssessments = () => {
        dispatch(setScreenToDisplay('AssessmentTypeList'))
    }

    const handleFilterChange = (event: SelectChangeEvent<string | number>) => {
        const selectedIndex = event.target.value as number // Get the selected index (number)

        setFilterTestType(selectedIndex) // Update the filter state

        onChooseTest(selectedIndex)
    }

    const columns: GridColDef[] = [
        { field: 'questionNo', headerName: 'No.', width: 50 },
        { field: 'questionText', headerName: 'Question Text', width: 150 },
        {
            field: 'questionAudio',
            headerName: 'Question Audio',
            width: 320,
            renderCell: (params) =>
                params.row.questionAudio ? (
                    <audio controls src={params.row.questionAudio} />
                ) : (
                    'N/A'
                ),
        },
        {
            field: 'correctAnswerAudio',
            headerName: 'Correct Answer Audio',
            width: 320,
            renderCell: (params) =>
                params.row.correctAnswerAudio ? (
                    <audio controls src={params.row.correctAnswerAudio} />
                ) : (
                    'N/A'
                ),
        },
        {
            field: 'studentAnswerAudio',
            headerName: 'Student Answer Audio',
            width: 320,
            renderCell: (params) =>
                params.row.studentAnswerAudio ? (
                    <audio controls src={params.row.studentAnswerAudio} />
                ) : (
                    'N/A'
                ),
        },
        {
            field: 'teacherEvaluation',
            headerName: 'Teacher Evaluation',
            width: 240,
            renderCell: (params) => (
                <Stack direction="row" sx={{ flexWrap: 'wrap', width: '100%' }}>
                    <FormControl>
                        <RadioGroup
                            value={selectedValues[params.row.index] || ''}
                            onChange={(event) => handleRadioChange(event, params.row.index)}
                            row
                        >
                            <FormControlLabel value="correct" control={<Radio />} label="Correct" />
                            <FormControlLabel
                                value="incorrect"
                                control={<Radio />}
                                label="Incorrect"
                            />
                        </RadioGroup>
                    </FormControl>
                </Stack>
            ),
        },
    ]

    const rows =
        selectedTest?.testQuestions.map((testQuestion, index) => ({
            id: testQuestion.testQuestionId,
            questionNo: index + 1,
            questionText: testQuestion.question.questionText,
            questionAudio: testQuestion.question.questionAudioBlobUrl,
            correctAnswerAudio: testQuestion.question.correctAnswerAudioBlobUrl,
            studentAnswerAudio: testQuestion.answerAudioBlobUrl,
            index,
        })) || []

    return (
        <>
            {selectedTest && (
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <Card>
                            <CardHeader title="Assessment Details" />
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 'bold', color: 'primary.main' }}
                                >
                                    Assessment: {assessment?.assessmentType.assessmentTypeName}
                                </Typography>
                                <Divider sx={{ marginY: 1 }} />
                                <Typography variant="subtitle1">
                                    <PersonIcon /> Student: {assessment?.testTaker.firstName}{' '}
                                    {assessment?.testTaker.lastName}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <AccessTimeIcon /> Submitted:{' '}
                                    {assessment?.assessmentSubmissionTime
                                        ? new Date(
                                              assessment.assessmentSubmissionTime
                                          ).toLocaleString()
                                        : 'Not submitted'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid2>
                    <Grid2 size={12}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="filter-test-type-label" sx={{ color: 'primary.main' }}>
                                Filter by Test Type
                            </InputLabel>
                            <Select
                                value={filterTestType}
                                onChange={handleFilterChange}
                                label="Filter by Test Type"
                                inputProps={{
                                    name: 'filter-test-type',
                                    id: 'filter-test-type',
                                }}
                            >
                                {assessment?.tests.map((test, index) => (
                                    <MenuItem key={test.testId} value={index}>
                                        {test.testType.testTypeName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={12}>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={rows || []}
                                columns={columns}
                                pagination
                                pageSizeOptions={[5, 10, 20, 100]}
                                disableRowSelectionOnClick
                            />
                        </div>
                    </Grid2>
                    <Grid2 container spacing={2} justifyContent="flex-end" size={12}>
                        <Grid2>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleBackToAssessments}
                                sx={{ padding: '12px' }}
                            >
                                Back to Assessments
                            </Button>
                        </Grid2>
                        <Grid2>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={onSaveGrading}
                                sx={{ padding: '12px' }}
                            >
                                Save
                            </Button>
                        </Grid2>
                    </Grid2>
                </Grid2>
            )}
        </>
    )
}

export default GradingScreen
