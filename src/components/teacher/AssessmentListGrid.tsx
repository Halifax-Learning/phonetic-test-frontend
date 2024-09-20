import EditIcon from '@mui/icons-material/Edit'
import { Typography } from '@mui/material'
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
        { field: 'assessmentTypeName', headerName: 'Assessment Type', width: 250 },
        { field: 'studentName', headerName: 'Student', width: 200 },
        { field: 'submissionTime', headerName: 'Submission Time', width: 200 },
        { field: 'testsGraded', headerName: 'Tests Graded', width: 150 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => onChooseAssessment(id as string)}
                />,
            ],
        },
    ]

    const rows = assessments.map((assessment) => ({
        id: assessment.assessmentId,
        assessmentTypeName: assessment.assessmentType.assessmentTypeName,
        studentName: `${assessment.testTaker.firstName} ${assessment.testTaker.lastName}`,
        submissionTime: assessment.assessmentSubmissionTime
            ? new Date(assessment.assessmentSubmissionTime).toLocaleString()
            : 'In Progress',
        testsGraded: assessment.isAllTestsGradedByTeacher ? 'Yes' : 'No',
    }))

    return (
        <div style={{ height: 500, width: '100%' }}>
            {rows.length > 0 ? (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pagination
                    pageSizeOptions={[5, 10, 20, 100]}
                    disableRowSelectionOnClick
                />
            ) : (
                <Typography>No assessments available.</Typography>
            )}
        </div>
    )
}

export default AssessmentListGrid
