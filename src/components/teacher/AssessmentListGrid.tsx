import EditIcon from '@mui/icons-material/Edit'
import { Box, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Assessment, Test } from '../../models/interface'
import { fetchGradingAssessment } from '../../reducers/gradingAssessmentReducer'
import CustomSnackbar, { OnRequestProps } from '../reusables/CustomSnackbar'

const AssessmentListGrid = ({ assessments }: { assessments: Assessment[] }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()

    const [onLoadingAssessment, setOnLoadingAssessment] = useState<OnRequestProps>({
        inProgress: false,
        display: false,
        message: '',
        color: 'info',
    })

    const onChooseAssessment = async (assessmentId: string) => {
        try {
            setOnLoadingAssessment({
                inProgress: true,
                display: true,
                message: 'Loading...',
                color: 'info',
            })

            await dispatch(fetchGradingAssessment(assessmentId))

            navigate('/grading')

            setOnLoadingAssessment({ inProgress: false })
        } catch (err) {
            setOnLoadingAssessment({
                inProgress: false,
                display: true,
                message: 'Failed to load. Please try again later.',
                color: 'error',
            })
            console.error('Failed to fetch a specific grading assessment:', err)
        }
    }
    const columns: GridColDef[] = [
        {
            field: 'assessmentTypeName',
            headerClassName: 'data-grid--header',
            headerName: 'Assessment Type',
            headerAlign: 'center',
            width: 250,
        },
        {
            field: 'studentName',
            headerClassName: 'data-grid--header',
            headerName: 'Student',
            headerAlign: 'center',
            width: 150,
        },
        {
            field: 'submissionTime',
            headerClassName: 'data-grid--header',
            headerName: 'Submission Time',
            headerAlign: 'center',
            width: 200,
        },
        {
            field: 'autoEvaluation',
            headerClassName: 'data-grid--header',
            headerName: 'Auto Evaluation',
            headerAlign: 'center',
            width: 200,
            renderCell: (params) => displayTestScores(params.value, false),
        },
        {
            field: 'teacherEvaluation',
            headerClassName: 'data-grid--header',
            headerName: 'Teacher Evaluation',
            headerAlign: 'center',
            width: 200,
            renderCell: (params) => displayTestScores(params.value, true),
        },
        {
            field: 'testsGraded',
            headerClassName: 'data-grid--header',
            headerName: 'Graded by Teacher',
            headerAlign: 'center',
            width: 150,
            cellClassName: 'centered-cell',
        },
        {
            field: 'actions',
            type: 'actions',
            headerClassName: 'data-grid--header',
            headerName: 'Actions',
            headerAlign: 'center',
            width: 80,
            getActions: ({ row }) => {
                if (row.submissionTime === 'In Progress') {
                    return []
                }
                return [
                    <GridActionsCellItem
                        key={row.id}
                        icon={<EditIcon sx={{ color: 'primary.main' }} />}
                        label="Edit"
                        onClick={() => onChooseAssessment(row.id as string)}
                        disabled={onLoadingAssessment.inProgress}
                    />,
                ]
            },
        },
    ]

    const rows = assessments.map((assessment) => ({
        id: assessment.assessmentId,
        assessmentTypeName: assessment.assessmentType.assessmentTypeName,
        studentName: `${assessment.testTaker.firstName} ${assessment.testTaker.lastName}`,
        submissionTime: assessment.assessmentSubmissionTime
            ? new Date(assessment.assessmentSubmissionTime).toLocaleString()
            : 'In Progress',
        autoEvaluation: assessment.tests,
        teacherEvaluation: assessment.tests,
        testsGraded: assessment.isAllTestsGradedByTeacher ? 'Yes' : 'No',
    }))

    return (
        <Box
            sx={{
                width: '100%',
                height: '600px',
            }}
        >
            {rows.length > 0 ? (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pagination
                    pageSizeOptions={[5, 10, 20, 100]}
                    rowHeight={25 * assessments[0].tests.length}
                    disableRowSelectionOnClick
                    sx={{
                        '& .data-grid--header': { color: 'primary.main' },
                        '& .centered-cell': {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    }}
                />
            ) : (
                <Typography>No assessments available.</Typography>
            )}

            <CustomSnackbar onRequest={onLoadingAssessment} setOnRequest={setOnLoadingAssessment} />
        </Box>
    )
}

const displayTestScores = (tests: Test[], byTeacher: boolean) => {
    return (
        <>
            {tests.map((test, index) => {
                const score = byTeacher ? test.teacherScore : test.autoScore

                return (
                    <Box key={index}>
                        <Typography>
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ display: 'inline-block', width: 75 }}
                            >
                                {test.testType.testTypeName === 'Single Phoneme Recognition'
                                    ? 'SPR'
                                    : test.testType.testTypeName}
                            </Typography>

                            <Typography component="span" variant="body2">
                                {score !== null ? `: ${score}/${test.testType.numQuestions}` : ':'}
                            </Typography>
                        </Typography>
                    </Box>
                )
            })}
        </>
    )
}

export default AssessmentListGrid
