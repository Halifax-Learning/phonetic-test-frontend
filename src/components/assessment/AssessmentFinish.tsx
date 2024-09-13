import { Box, Button, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'

const AssessmentFinish = () => {
    const dispatch = useDispatch<any>()

    const returnToAssessmentList = () => {
        dispatch(setScreenToDisplay('AssessmentList'))
    }
    return (
        <Box>
            <Typography>You have completed the assessment</Typography>
            <Button variant="contained" onClick={returnToAssessmentList}>
                Return to Home Screen
            </Button>
        </Box>
    )
}

export default AssessmentFinish
