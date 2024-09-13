import { Box, List, ListItemButton } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { createAssessment } from '../../reducers/assessmentReducer'
import { fetchAssessmentTypes } from '../../reducers/assessmentTypeReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'

const AssessmentList = () => {
    const dispatch = useDispatch<any>()
    const assessmentTypes = useSelector((state: RootState) => state.assessmentTypes)

    useEffect(() => {
        dispatch(fetchAssessmentTypes())
    }, [])

    const startAssessment = (assessmentTypeId: number) => {
        dispatch(createAssessment(assessmentTypeId, '1'))
        dispatch(setScreenToDisplay('AssessmentWelcome'))
    }

    return (
        <Box>
            <List>
                {assessmentTypes.map((assessmentType) => (
                    <ListItemButton
                        key={assessmentType.assessmentTypeId}
                        onClick={() => startAssessment(assessmentType.assessmentTypeId)}
                    >
                        {assessmentType.assessmentTypeName}
                    </ListItemButton>
                ))}
            </List>
        </Box>
    )
}

export default AssessmentList
