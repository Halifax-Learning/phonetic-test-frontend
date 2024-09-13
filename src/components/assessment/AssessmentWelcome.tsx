import { Box, Button, List, ListItem, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'

const AssessmentWelcome = () => {
    const dispatch = useDispatch<any>()
    const assessment = useSelector((state: RootState) => state.assessment.assessment)

    const testTypes = assessment ? assessment.testTypes : []

    const onClickNext = () => {
        dispatch(setScreenToDisplay('TestWelcome'))
    }

    return (
        <>
            {assessment && (
                <Box>
                    <Typography variant="h4">
                        Welcome to the {assessment.assessmentType.assessmentTypeName}
                    </Typography>
                    <Typography variant="body1">
                        This assessment consists of the following sections:
                    </Typography>
                    <List>
                        {testTypes.map((testType) => (
                            <ListItem key={testType.testTypeId}>{testType.testTypeName}</ListItem>
                        ))}
                    </List>

                    <Button variant="contained" onClick={onClickNext}>
                        Next
                    </Button>
                </Box>
            )}
        </>
    )
}

export default AssessmentWelcome
