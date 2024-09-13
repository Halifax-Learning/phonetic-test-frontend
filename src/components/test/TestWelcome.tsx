import { Box, Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../main'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'
import { createTest } from '../../reducers/testReducer'

const TestWelcome = () => {
    const dispatch = useDispatch<any>()

    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const currentTestIndex = useSelector((state: RootState) => state.assessment.currentTestIndex)

    const testTypes = assessment ? assessment.testTypes : []

    const testTypeName = currentTestIndex !== null ? testTypes[currentTestIndex].testTypeName : ''
    const questionInstructionText =
        currentTestIndex !== null ? testTypes[currentTestIndex].questionInstructionText : ''

    const startTest = () => {
        if (assessment && currentTestIndex !== null) {
            dispatch(createTest(assessment.assessmentId, testTypes[currentTestIndex].testTypeId))
            dispatch(setScreenToDisplay('TestQuestion'))
        }
    }

    return (
        <>
            {assessment && (
                <Box>
                    <Typography variant="h4">Welcome to the {testTypeName} Section</Typography>
                    <Typography variant="body1">Instruction: {questionInstructionText}</Typography>

                    <Button variant="contained" onClick={() => startTest()}>
                        Start {testTypeName} Section
                    </Button>
                </Box>
            )}
        </>
    )
}

export default TestWelcome
