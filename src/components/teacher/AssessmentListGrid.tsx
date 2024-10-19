import EditIcon from '@mui/icons-material/Edit'
import { Box, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import { Assessment, Test } from '../../models/interface'

interface AssessmentListGridProps {
    assessments: Assessment[]
    onChooseAssessment: (assessmentId: string) => void
}

const AssessmentListGrid: React.FC<AssessmentListGridProps> = ({
    assessments,
    onChooseAssessment,
}) => {
    const columns: GridColDef[] = [
        {
            field: 'assessmentTypeName',
            headerClassName: 'data-grid--header',
            headerName: 'Assessment Type',
            width: 250,
        },
        {
            field: 'studentName',
            headerClassName: 'data-grid--header',
            headerName: 'Student',
            width: 150,
        },
        {
            field: 'submissionTime',
            headerClassName: 'data-grid--header',
            headerName: 'Submission Time',
            width: 200,
        },
        {
            field: 'autoEvaluation',
            headerClassName: 'data-grid--header',
            headerName: 'Auto Evaluation',
            width: 200,
            renderCell: (params) => displayTestScores(params.value, false),
        },
        {
            field: 'teacherEvaluation',
            headerClassName: 'data-grid--header',
            headerName: 'Teacher Evaluation',
            width: 200,
            renderCell: (params) => displayTestScores(params.value, true),
        },
        {
            field: 'testsGraded',
            headerClassName: 'data-grid--header',
            headerName: 'Tests Graded',
            width: 150,
        },
        {
            field: 'actions',
            type: 'actions',
            headerClassName: 'data-grid--header',
            headerName: 'Actions',
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
                        '& .data-grid--header': {
                            color: 'primary.main',
                        },
                    }}
                />
            ) : (
                <Typography>No assessments available.</Typography>
            )}
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
