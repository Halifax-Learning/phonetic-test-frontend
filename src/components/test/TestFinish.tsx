import { Box, Button, List, ListItem, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { nextTest, resetAssessment } from '../../reducers/assessmentReducer'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'

const TestFinish = () => {
    const dispatch = useDispatch<any>()

    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const currentTestIndex = useSelector((state: RootState) => state.assessment.currentTestIndex)

    const testTypes = assessment ? assessment.testTypes : []

    const onClickNextTest = () => {
        dispatch(nextTest())
        dispatch(setScreenToDisplay('TestWelcome'))
    }

    const onClickFinishAssessment = () => {
        dispatch(resetAssessment())
        dispatch(setScreenToDisplay('AssessmentFinish'))
    }

    return (
        <>
            {assessment && currentTestIndex !== null && (
                <Box>
                    <Typography> You have completed the following sections:</Typography>
                    <List>
                        {testTypes.map((testType, index) => (
                            <ListItem key={testType.testTypeId}>
                                {testType.testTypeName}: {index <= currentTestIndex ? 'Done' : ''}
                            </ListItem>
                        ))}
                    </List>

                    {currentTestIndex < testTypes.length - 1 ? (
                        <Button variant="contained" onClick={onClickNextTest}>
                            Next Section
                        </Button>
                    ) : (
                        <Button variant="contained" onClick={onClickFinishAssessment}>
                            Finish Assessment
                        </Button>
                    )}
                </Box>
            )}
        </>
    )
}

export default TestFinish
