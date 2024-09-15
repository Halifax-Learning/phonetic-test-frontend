import { Container } from '@mui/material'
import { useSelector } from 'react-redux'

import AssessmentFinish from './components/assessment/AssessmentFinish.js'
import AssessmentList from './components/assessment/AssessmentList.js'
import AssessmentWelcome from './components/assessment/AssessmentWelcome.js'
import TestFinish from './components/test/TestFinish.js'
import TestQuestion from './components/test/TestQuestion.js'
import TestWelcome from './components/test/TestWelcome.js'
import Login from './components/user/Login.js'
import Register from './components/user/Register.js'
import { RootState } from './main.js'

const App = () => {
    const user = useSelector((state: RootState) => state.user)
    const screenToDisplay = useSelector((state: RootState) => state.screenToDisplay)

    let displayComponent = <Login />
    if (screenToDisplay === 'Register') {
        displayComponent = <Register />
    }
    if (user) {
        displayComponent = <AssessmentList />
        if (screenToDisplay === 'AssessmentWelcome') {
            displayComponent = <AssessmentWelcome />
        } else if (screenToDisplay === 'TestWelcome') {
            displayComponent = <TestWelcome />
        } else if (screenToDisplay === 'TestQuestion') {
            displayComponent = <TestQuestion />
        } else if (screenToDisplay === 'TestFinish') {
            displayComponent = <TestFinish />
        } else if (screenToDisplay === 'AssessmentFinish') {
            displayComponent = <AssessmentFinish />
        }
    }

    return <Container>{displayComponent}</Container>
}

export default App
