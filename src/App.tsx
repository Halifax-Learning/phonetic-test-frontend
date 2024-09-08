import { Container } from '@mui/material'
import { useSelector } from 'react-redux'

import TestList from './components/TestList.js'
import TestQuestion from './components/TestQuestion.js'

const App = () => {
    const currentTestQuestionIndex = useSelector(
        (state: { test: { currentTestQuestionIndex: number } }) => state.test.currentTestQuestionIndex
    )

    return <Container>{currentTestQuestionIndex === null ? <TestList /> : <TestQuestion />}</Container>
}

export default App
