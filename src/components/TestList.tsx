import { Box, List, ListItemButton, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { TestType } from '../models/interface'
import { createTest } from '../reducers/testReducer'
import { fetchTestTypes } from '../reducers/testTypeReducer'

const TestList = () => {
    const dispatch = useDispatch<any>()
    const testTypes = useSelector((state: { testTypes: TestType[] }) => state.testTypes)

    useEffect(() => {
        dispatch(fetchTestTypes())
    }, [])

    const startTest = (testType: TestType) => {
        if (testType.name === 'Synthesis') {
            dispatch(createTest(testType.testTypeId, '1'))
        }
    }

    return (
        <Box>
            <Typography variant="h4">Choose a Test</Typography>
            <List>
                {testTypes.map((testType) => (
                    <ListItemButton key={testType.testTypeId} onClick={() => startTest(testType)}>
                        {testType.name}
                    </ListItemButton>
                ))}
            </List>
        </Box>
    )
}

export default TestList
