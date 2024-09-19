import { Box, List, ListItemButton, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { RootState } from '../../main'
import { fetchAssessments } from '../../reducers/assessmentListReducer'
import { fetchAssessment, resetAssessment } from '../../reducers/assessmentReducer'

const TeacherAssessmentList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const assessments = useSelector((state: RootState) => state.assessmentList)

    useEffect(() => {
        dispatch(fetchAssessments())
        dispatch(resetAssessment())
    }, [])

    const onChooseAssessment = (assessmentId: string) => {
        dispatch(fetchAssessment(assessmentId))
        navigate('/grading')
    }

    return (
        <Box>
            <Typography variant="h1">Assessments</Typography>
            <List>
                {assessments?.map((assessment) => (
                    <ListItemButton
                        key={assessment.assessmentId}
                        onClick={() => onChooseAssessment(assessment.assessmentId)}
                        sx={{ color: assessment.isAllTestsGradedByTeacher ? 'green' : 'red' }}
                    >
                        {assessment.assessmentType.assessmentTypeName} --- Student:{' '}
                        {assessment.testTaker.firstName} {assessment.testTaker.lastName} {' --- '}
                        {assessment.assessmentSubmissionTime ? (
                            <>
                                Submit:{' '}
                                {new Date(assessment.assessmentSubmissionTime).toLocaleString()}
                            </>
                        ) : (
                            'In Progress '
                        )}
                        - Tests Graded: {assessment.isAllTestsGradedByTeacher ? 'Yes' : 'No'}
                    </ListItemButton>
                ))}
            </List>
        </Box>
    )
}

export default TeacherAssessmentList
