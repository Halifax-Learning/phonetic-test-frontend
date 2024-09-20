import EditIcon from '@mui/icons-material/Edit'
import { Box, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import { Assessment } from '../../models/interface'

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
            field: 'machineEvaluation',
            headerClassName: 'data-grid--header',
            headerName: 'Machine Evaluation',
            width: 150,
        },
        {
            field: 'teacherEvaluation',
            headerClassName: 'data-grid--header',
            headerName: 'Teacher Evaluation',
            width: 150,
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
        machineEvaluation: '0',
        teacherEvaluation: '0',
        testsGraded: assessment.isAllTestsGradedByTeacher ? 'Yes' : 'No',
    }))

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
            }}
        >
            {rows.length > 0 ? (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pagination
                    pageSizeOptions={[5, 10, 20, 100]}
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

export default AssessmentListGrid
