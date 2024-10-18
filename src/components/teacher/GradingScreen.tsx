import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DoneIcon from '@mui/icons-material/Done'
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
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { FocusEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../main'
import {
    AutoGradingHistory,
    ExportTestQuestion,
    TeacherGradingHistory,
} from '../../models/interface'
import { fetchAudios } from '../../reducers/actions'
import {
    retrieveGradingAssessmentFromLocalStorage,
    setGradingTest,
    setTeacherEvaluation,
    submitTeacherEvaluation,
} from '../../reducers/gradingAssessmentReducer'
import { theme } from '../../theme/theme'
import '../fonts/Inter-VariableFont_opsz,wght-normal.js'
import AudioPlayerWithIcon from '../test/AudioPlayerWithIcon'
import GradingHistoryDialog from './GradingHistoryDialog'
import SendEmailDialog from './SendEmailDialog'

const GradingScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const assessment = useSelector((state: RootState) => state.gradingAssessment.assessment)
    const currentTestIndex =
        useSelector((state: RootState) => state.gradingAssessment.currentTestIndex) || 0

    const [selectedTest, setSelectedTest] = useState(assessment?.tests[currentTestIndex!])
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [feedbackValues, setFeedbackValues] = useState<string[]>([])

    const [teacherGradingDialogOpen, setTeacherGradingDialog] = useState(false)
    const [emailDialogOpen, setEmailDialogOpen] = useState(false)
    const [gradingHistory, setGradingHistory] = useState<
        (TeacherGradingHistory | AutoGradingHistory)[]
    >([])
    const [rows, setRows] = useState<any[]>([])

    // Keep track of the request status to save grading
    const [onSave, setOnSave] = useState({ message: '', color: 'info' })
    const [savingInProgress, setSavingInProgress] = useState(false)

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

        setTeacherGradingDialog(true)
    }

    useEffect(() => {
        // Handle when user refreshes the page
        const reloadAssessment = async () => {
            if (assessment === null) {
                const assessmentId = await dispatch(retrieveGradingAssessmentFromLocalStorage())

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
        // Fetch audios when selectedTest changes and its audio has not been fetched
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
                questionNo: testQuestion.questionOrdinal,
                questionText: testQuestion.question.questionText,
                questionAudio: testQuestion.question.questionAudioBlobUrl,
                correctAnswerAudio: testQuestion.question.correctAnswerAudioBlobUrl,
                studentAnswerAudio: testQuestion.answerAudioBlobUrl,
                machineEvaluation:
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

    const onChooseTest = (event: SelectChangeEvent<number>) => {
        const index = event.target.value as number
        dispatch(setGradingTest(index))
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = event.target.value

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

    const onSaveGrading = async () => {
        try {
            setOnSave({ message: 'Saving...', color: 'info' })
            setSavingInProgress(true)

            await dispatch(submitTeacherEvaluation())

            setOnSave({
                message: 'Grading saved successfully!',
                color: 'success',
            })
        } catch (error: any) {
            setOnSave({ message: error.message, color: 'error' })
        } finally {
            setSavingInProgress(false)
        }
    }

    const handleBackToAssessments = () => {
        setOnSave({ message: '', color: 'info' })
        navigate('/assessments-for-grading')
    }

    const columns: GridColDef[] = [
        {
            field: 'questionNo',
            headerClassName: 'data-grid--header',
            headerName: 'No.',
            width: 50,
        },
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
            field: 'machineEvaluation',
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
                    <span>{params.row.machineEvaluation}</span>
                    {params.row.machineEvaluation !== 'N/A' && ( // Only show the icon if machineEvaluation is not 'N/A'
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
            disableExport: true,
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

    const exportToPdf = () => {
        setOnSave({ message: '', color: 'info' })
        const doc = new jsPDF({ orientation: 'landscape' })
        const assessmentName = assessment?.assessmentType.assessmentTypeName || 'Assessment'
        const studentName =
            assessment?.testTaker.firstName && assessment?.testTaker.lastName
                ? `${assessment.testTaker.firstName} ${assessment.testTaker.lastName}`
                : 'Student'
        const submissionTime = assessment?.assessmentSubmissionTime
            ? format(new Date(assessment.assessmentSubmissionTime), 'PPpp')
            : 'In Progress'

        doc.setFont('Inter-VariableFont_opsz,wght')
        doc.setFontSize(12)
        doc.setTextColor(theme.palette.text.primary)
        doc.setDrawColor(theme.palette.text.primary)
        doc.text(`Assessment: ${assessmentName}`, 15, 20)
        doc.text(`Student Name: ${studentName}`, 15, 28)
        doc.text(`Submission Time: ${submissionTime}`, 15, 36)

        // Add a line separator below the header
        doc.setLineWidth(0.5)
        doc.line(15, 40, doc.internal.pageSize.width - 15, 40) // Horizontal line

        const allTestQuestions =
            assessment?.tests?.reduce<ExportTestQuestion[]>((acc, test) => {
                const questionTypeName = test.testType?.questionType?.questionTypeName || 'N/A'

                // Concatenate each testQuestion with its corresponding testType
                const enrichedTestQuestions = test.testQuestions.map((testQuestion) => ({
                    ...testQuestion,
                    questionTypeName,
                }))

                return acc.concat(enrichedTestQuestions)
            }, []) || []

        const exportColumns = [
            { title: 'Question Type', dataKey: 'questionTypeName' },
            { title: 'No.', dataKey: 'questionOrdinal' },
            ...columns
                .filter(
                    (col) =>
                        !col.disableExport &&
                        col.field !== 'questionNo' &&
                        col.field !== 'machineEvaluation'
                )
                .map((col) => ({ title: col.headerName, dataKey: col.field })),
        ]

        const exportRows = allTestQuestions?.map((testQuestion, index) => {
            const rowData: Record<string, any> = {
                questionText: testQuestion.question.questionText,
                questionNo: index + 1,
                teacherEvaluation:
                    testQuestion.originalTeacherEvaluation !== null
                        ? testQuestion.originalTeacherEvaluation
                            ? 'Correct'
                            : 'Incorrect'
                        : 'N/A',
                feedback: testQuestion.latestTeacherComment || '',
                questionTypeName: testQuestion.questionTypeName || 'N/A',
                questionOrdinal: testQuestion.questionOrdinal,
            }

            return exportColumns.reduce(
                (acc, col) => {
                    acc[col.dataKey] = rowData[col.dataKey]
                    return acc
                },
                {} as Record<string, any>
            )
        })

        doc.autoTable({
            startY: 44,
            columns: exportColumns,
            body: exportRows,
            theme: 'grid',
            headStyles: {
                fillColor: theme.palette.primary.main,
                textColor: theme.palette.primary.contrastText,
                fontSize: 12,
                halign: 'center',
            },
            bodyStyles: {
                textColor: theme.palette.text.primary,
                fontSize: 10,
            },
            margin: { top: 10, left: 15, right: 15 },
            styles: {
                overflow: 'linebreak',
                cellPadding: 2,
                font: 'Inter-VariableFont_opsz,wght',
            },
        })

        // Add a footer (page number)
        const pageCount = doc.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width - 30,
                doc.internal.pageSize.height - 10
            )
        }

        const formattedSubmissionDate = assessment?.assessmentSubmissionTime
            ? format(new Date(assessment.assessmentSubmissionTime), 'yyyy-MM-dd')
            : 'In_Progress'

        const pdfFilename = `${assessmentName.replace(/ /g, '_')}_Feedback_for_${studentName.replace(/ /g, '_')}_${formattedSubmissionDate}.pdf`

        doc.save(pdfFilename)
    }

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
                                    value={currentTestIndex}
                                    onChange={onChooseTest}
                                    label="Filter by Test Type"
                                    inputProps={{
                                        name: 'filter-test-type',
                                        id: 'filter-test-type',
                                    }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color:
                                            selectedTest.numQuestionsGraded ===
                                            selectedTest.testType.numQuestions
                                                ? 'primary.main'
                                                : '',
                                    }}
                                >
                                    {assessment?.tests.map((test, index) => {
                                        const finishedGrading =
                                            test.numQuestionsGraded === test.testType.numQuestions
                                        return (
                                            <MenuItem
                                                key={test.testId}
                                                value={index}
                                                sx={{
                                                    color: finishedGrading ? 'primary.main' : '',
                                                }}
                                            >
                                                <Typography
                                                    component="span"
                                                    sx={{ display: 'inline-block', width: 250 }}
                                                >
                                                    {test.testType.testTypeName}
                                                </Typography>
                                                Graded: {test.numQuestionsGraded}/
                                                {test.testType.numQuestions}
                                                {finishedGrading && (
                                                    <DoneIcon sx={{ marginLeft: 1 }} />
                                                )}
                                            </MenuItem>
                                        )
                                    })}
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

                        <Typography color={onSave.color}>{onSave.message}</Typography>

                        <Grid2 container spacing={2} justifyContent="flex-end" size={12}>
                            <Grid2>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleBackToAssessments}
                                >
                                    Back
                                </Button>
                            </Grid2>
                            <Grid2>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={onSaveGrading}
                                    disabled={savingInProgress}
                                >
                                    Save
                                </Button>
                            </Grid2>
                            <Grid2>
                                <Button variant="contained" color="secondary" onClick={exportToPdf}>
                                    Export to PDF
                                </Button>
                            </Grid2>
                            <Grid2>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setEmailDialogOpen(true)
                                    }}
                                >
                                    Release Result
                                </Button>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                )}
            </Box>
            <GradingHistoryDialog
                open={teacherGradingDialogOpen}
                onClose={() => setTeacherGradingDialog(false)}
                history={gradingHistory}
            />
            {assessment && (
                <SendEmailDialog
                    open={emailDialogOpen}
                    onClose={() => setEmailDialogOpen(false)}
                    assessment={assessment}
                />
            )}
        </>
    )
}

export default GradingScreen
