import AccessTimeIcon from '@mui/icons-material/AccessTime'
import HistoryIcon from '@mui/icons-material/History'
import PersonIcon from '@mui/icons-material/Person'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControl,
    FormControlLabel,
    Grid2,
    IconButton,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { FocusEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../main'
import { AutoGradingHistory, TeacherGradingHistory } from '../../models/interface'
import { fetchAudios } from '../../reducers/actions'
import {
    retrieveAssessmentFromLocalStorage,
    setGradingTest,
    setTeacherEvaluation,
    submitTeacherEvaluation,
} from '../../reducers/gradingAssessmentReducer'
import AudioPlayerWithIcon from '../test/AudioPlayerWithIcon'
import GradingHistoryDialog from './GradingHistoryDialog'

const GradingScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const assessment = useSelector((state: RootState) => state.gradingAssessment.assessment)
    const currentTestIndex =
        useSelector((state: RootState) => state.gradingAssessment.currentTestIndex) || 0

    const [selectedTest, setSelectedTest] = useState(assessment?.tests[currentTestIndex!])
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [feedbackValues, setFeedbackValues] = useState<string[]>([])
    const [filterTestType, setFilterTestType] = useState<number | string>(currentTestIndex!)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [gradingHistory, setGradingHistory] = useState<
        (TeacherGradingHistory | AutoGradingHistory)[]
    >([])
    const [rows, setRows] = useState<any[]>([])

    const handleShowGradingHistory = (index: number, isMachineHistory: boolean) => {
        console.log(
            'Show grading history for question:',
            index,
            'Machine History:',
            isMachineHistory
        )

        if (isMachineHistory) {
            // Handle machine grading history
            setGradingHistory(selectedTest?.testQuestions[index].autoGradingHistory || [])
        } else {
            // Handle teacher grading history
            setGradingHistory(selectedTest?.testQuestions[index].teacherGradingHistory || [])
        }

        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    useEffect(() => {
        // Handle when user refreshes the page
        const reloadAssessment = async () => {
            if (assessment === null) {
                const assessmentId = await dispatch(retrieveAssessmentFromLocalStorage())

                if (!assessmentId) {
                    navigate('/assessments-for-grading')
                }
            }
        }

        reloadAssessment()
    }, [])

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
        if (selectedTest && !selectedTest.hasFetchedAudio) {
            dispatch(fetchAudios(selectedTest.testId, currentTestIndex!, true))
        }
    }, [selectedTest])

    useEffect(() => {
        // Update selected values when selectedTest changes
        const updatedSelectedValues =
            selectedTest?.testQuestions.map((testQuestion) => {
                if (testQuestion.latestTeacherEvaluation === true) {
                    return 'Correct'
                } else if (testQuestion.latestTeacherEvaluation === false) {
                    return 'Incorrect'
                } else {
                    return ''
                }
            }) || []
        setSelectedValues(updatedSelectedValues)

        // Update feedback values when selectedTest changes
        const updatedFeedbackValues =
            selectedTest?.testQuestions.map((testQuestion) => testQuestion.latestTeacherComment) ||
            []
        setFeedbackValues(updatedFeedbackValues)

        // Update rows when selectedTest changes
        const newRows =
            selectedTest?.testQuestions.map((testQuestion, index) => ({
                id: testQuestion.testQuestionId,
                questionNo: index + 1,
                questionText: testQuestion.question.questionText,
                questionAudio: testQuestion.question.questionAudioBlobUrl,
                correctAnswerAudio: testQuestion.question.correctAnswerAudioBlobUrl,
                studentAnswerAudio: testQuestion.answerAudioBlobUrl,
                machinEvaluation:
                    testQuestion.latestAutoEvaluation === null
                        ? 'N/A'
                        : testQuestion.latestAutoEvaluation, // Show 'N/A' if null
                teacherEvaluation:
                    testQuestion.originalTeacherEvaluation !== null
                        ? testQuestion.originalTeacherEvaluation
                            ? 'Correct'
                            : 'Incorrect'
                        : 'N/A',
                index,
                grade: selectedValues[index],
                feedback: feedbackValues[index] || '',
            })) || []

        setRows(newRows)
    }, [selectedTest])

    const onChooseTest = (index: number) => {
        dispatch(setGradingTest(index))
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
                evaluation: value === 'Correct',
                comment: feedbackValues[index],
                testIndex: currentTestIndex!,
                testQuestionIndex: index,
            })
        )
    }

    const handleFeedbackChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ) => {
        const value = event.target.value

        setFeedbackValues((prev) => {
            const newValues = [...prev]
            newValues[index] = value // Update feedback for the specific question
            return newValues
        })
    }

    const dispatchFeedback = (
        event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
        index: number
    ) => {
        const value = event.target.value

        dispatch(
            setTeacherEvaluation({
                evaluation: selectedValues[index] === 'Correct',
                comment: value,
                testIndex: currentTestIndex!,
                testQuestionIndex: index,
            })
        )
    }

    const onSaveGrading = () => {
        dispatch(submitTeacherEvaluation())
    }

    const handleBackToAssessments = () => {
        navigate('/assessments-for-grading')
    }

    const handleFilterChange = (event: SelectChangeEvent<string | number>) => {
        const selectedIndex = event.target.value as number // Get the selected index (number)

        setFilterTestType(selectedIndex) // Update the filter state

        onChooseTest(selectedIndex)
    }

    const columns: GridColDef[] = [
        { field: 'questionNo', headerClassName: 'data-grid--header', headerName: 'No.', width: 50 },
        {
            field: 'questionText',
            headerClassName: 'data-grid--header',
            headerName: 'Question Text',
            width: 150,
        },
        {
            field: 'questionAudio',
            headerClassName: 'data-grid--header',
            headerName: 'Question Audio',
            width: 150,
            disableExport: true,
            renderCell: (params) =>
                params.row.questionAudio ? (
                    <AudioPlayerWithIcon instructionAudioSrc={params.row.questionAudio} />
                ) : (
                    'N/A'
                ),
        },
        {
            field: 'correctAnswerAudio',
            headerClassName: 'data-grid--header',
            headerName: 'Correct Answer Audio',
            width: 170,
            disableExport: true,
            renderCell: (params) =>
                params.row.correctAnswerAudio ? (
                    <AudioPlayerWithIcon instructionAudioSrc={params.row.correctAnswerAudio} />
                ) : (
                    'N/A'
                ),
        },
        {
            field: 'studentAnswerAudio',
            headerClassName: 'data-grid--header',
            headerName: 'Student Answer Audio',
            width: 170,
            disableExport: true,
            renderCell: (params) =>
                params.row.studentAnswerAudio ? (
                    <AudioPlayerWithIcon instructionAudioSrc={params.row.studentAnswerAudio} />
                ) : (
                    'N/A'
                ),
        },
        {
            field: 'machinEvaluation',
            headerClassName: 'data-grid--header',
            headerName: 'Machine Evaluation',
            width: 150,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <span>{params.row.machinEvaluation}</span>
                    {params.row.machinEvaluation !== 'N/A' && ( // Only show the icon if machinEvaluation is not 'N/A'
                        <Tooltip title="View Grading History">
                            <IconButton
                                size="small"
                                onClick={() => handleShowGradingHistory(params.row.index, true)} // Pass the question ID
                                sx={{ ml: 1 }} // Add some left margin
                            >
                                <HistoryIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            ),
        },
        {
            field: 'teacherEvaluation',
            headerClassName: 'data-grid--header',
            headerName: 'Teacher Evaluation',
            width: 150,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <span>{params.row.teacherEvaluation}</span>
                    <Tooltip title="View Grading History">
                        <IconButton
                            size="small"
                            onClick={() => handleShowGradingHistory(params.row.index, false)} // Pass the question ID
                            sx={{ ml: 1 }} // Add some left margin
                        >
                            <HistoryIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
        {
            field: 'grade',
            headerClassName: 'data-grid--header',
            headerName: 'Grade',
            width: 200,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center', // Align vertically
                        height: '100%', // Make sure it takes the full row height
                    }}
                >
                    <FormControl>
                        <RadioGroup
                            value={selectedValues[params.row.index] || ''}
                            onChange={(event) => handleRadioChange(event, params.row.index)}
                            row
                        >
                            <FormControlLabel
                                value="Correct"
                                control={<Radio sx={{ p: '2px' }} />}
                                label={
                                    <span
                                        style={{
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        Correct
                                    </span>
                                }
                                sx={{ typography: 'body2' }}
                            />
                            <FormControlLabel
                                value="Incorrect"
                                control={<Radio sx={{ p: '2px' }} />}
                                label={
                                    <span
                                        style={{
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        Incorrect
                                    </span>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>
            ),
        },
        {
            field: 'feedback',
            headerClassName: 'data-grid--header',
            headerName: 'Feedback',
            minWidth: 300,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center', // Align vertically
                        height: '100%', // Make sure it takes the full row height
                        width: '100%', // Make sure it takes the full cell width
                    }}
                >
                    <TextField
                        variant="outlined"
                        size="small"
                        value={feedbackValues[params.row.index] || ''}
                        onChange={(event) => handleFeedbackChange(event, params.row.index)}
                        onBlur={(event) => {
                            dispatchFeedback(event, params.row.index)
                        }}
                        onKeyDown={(event) => {
                            event.stopPropagation()
                        }}
                        fullWidth
                    />
                </Box>
            ),
        },
    ]

    return (
        <>
            <Box sx={{ mx: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                {selectedTest && (
                    <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                            <Card variant="outlined">
                                <CardHeader
                                    title={
                                        <Typography variant="h1" sx={{ color: 'secondary.dark' }}>
                                            Grade Assessments
                                        </Typography>
                                    }
                                />
                                <CardContent>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 'bold', color: 'primary.main' }}
                                    >
                                        Assessment: {assessment?.assessmentType.assessmentTypeName}
                                    </Typography>
                                    <Divider sx={{ marginY: 1 }} />

                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mt: 1,
                                        }}
                                    >
                                        <PersonIcon sx={{ mr: 1 }} /> Student:{' '}
                                        {assessment?.testTaker.firstName}{' '}
                                        {assessment?.testTaker.lastName}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mt: 1,
                                        }}
                                    >
                                        <AccessTimeIcon sx={{ mr: 1 }} /> Submitted:{' '}
                                        {assessment?.assessmentSubmissionTime
                                            ? format(
                                                  new Date(assessment.assessmentSubmissionTime),
                                                  'PPpp'
                                              )
                                            : 'In Progress'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2 size={12}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel
                                    id="filter-test-type-label"
                                    sx={{ color: 'primary.main' }}
                                >
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
                            <div style={{ height: 500, width: '100%' }}>
                                <DataGrid
                                    rows={rows || []}
                                    columns={columns}
                                    pagination
                                    pageSizeOptions={[5, 10, 20, 100]}
                                    disableRowSelectionOnClick
                                    slots={{
                                        toolbar: GridToolbar,
                                    }}
                                    sx={{
                                        '& .data-grid--header': {
                                            color: 'primary.main',
                                        },
                                    }}
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
                                    Back
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
            </Box>
            <GradingHistoryDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                history={gradingHistory}
            />
        </>
    )
}

export default GradingScreen
