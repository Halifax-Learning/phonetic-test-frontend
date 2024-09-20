import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, RouteObject, BrowserRouter as Router, useRoutes } from 'react-router-dom'

import AssessmentFinish from './components/assessment/AssessmentFinish.js'
import AssessmentTypeList from './components/assessment/AssessmentTypeList.js'
import AssessmentWelcome from './components/assessment/AssessmentWelcome.js'
import Footer from './components/Footer.js'
import Header from './components/Header.js'
import Home from './components/Home.js'
import TeacherAssessmentList from './components/teacher/AssessmentList.js'
import GradingScreen from './components/teacher/GradingScreen.js'
import TestFinish from './components/test/TestFinish.js'
import TestQuestion from './components/test/TestQuestion.js'
import TestWelcome from './components/test/TestWelcome.js'
import Login from './components/user/Login.js'
import Register from './components/user/Register.js'
import { RootState } from './main.js'
import { setUser } from './reducers/userReducer.js'
import { theme } from './theme/theme.js'

const AppRoutes = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)
    const screenToDisplay = useSelector((state: RootState) => state.screenToDisplay)

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser')
        if (storedUser) {
            dispatch(setUser(JSON.parse(storedUser)))
        }
    }, [dispatch])

    const assessmentRoutes = () => {
        let assessmentComponent = <AssessmentTypeList />

        if (screenToDisplay === 'AssessmentWelcome') {
            assessmentComponent = <AssessmentWelcome />
        } else if (screenToDisplay === 'TestWelcome') {
            assessmentComponent = <TestWelcome />
        } else if (screenToDisplay === 'TestQuestion') {
            assessmentComponent = <TestQuestion />
        } else if (screenToDisplay === 'TestFinish') {
            assessmentComponent = <TestFinish />
        } else if (screenToDisplay === 'AssessmentFinish') {
            assessmentComponent = <AssessmentFinish />
        }

        return assessmentComponent
    }

    const gradingRoutes = () => {
        let gradingComponent = <TeacherAssessmentList />

        if (screenToDisplay === 'GradingScreen') {
            gradingComponent = <GradingScreen />
        }

        return gradingComponent
    }

    const routes: RouteObject[] = [
        { path: '/', element: <Home /> },
        {
            path: '/login',
            element: !user ? <Login /> : <Navigate replace to="/" />,
        },
        {
            path: '/register',
            element: !user ? <Register /> : <Navigate replace to="/" />,
        },
        {
            path: '/assessment',
            element: !user ? <Navigate replace to="/login" /> : assessmentRoutes(),
        },
        {
            path: '/grading',
            element:
                !user || user.accountRole !== 'teacher' ? (
                    <Navigate replace to="/login" />
                ) : (
                    gradingRoutes()
                ),
        },
        {
            path: '*',
            element: <Navigate replace to="/" />,
        },
    ]

    return useRoutes(routes)
}

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Router>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                    }}
                >
                    <Header />

                    <Container
                        sx={{
                            mt: '140px',
                            mb: '40px',
                            flexGrow: 1,
                            alignItems: 'center',
                        }}
                    >
                        <AppRoutes />
                    </Container>

                    <Footer />
                </Box>
            </Router>
        </ThemeProvider>
    )
}

export default App
