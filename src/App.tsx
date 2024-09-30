import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
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
import Profile from './components/user/Profile.js'
import Register from './components/user/Register.js'
import { RootState } from './main.js'
import { retrieveUser } from './reducers/userReducer.js'
import { theme } from './theme/theme.js'

const AppRoutes = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)
    const screenToDisplay = useSelector((state: RootState) => state.screenToDisplay)
    const [loadingUser, setLoadingUser] = useState(true)

    useEffect(() => {
        dispatch(retrieveUser())
        setLoadingUser(false)
    }, [dispatch])

    const notTeacherUser = (!user || user.accountRole !== 'teacher') && !loadingUser

    const notLoggedIn = !user && !loadingUser

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
            element: notLoggedIn ? <Navigate replace to="/login" /> : assessmentRoutes(),
        },
        {
            path: '/profile',
            element: !user ? <Login /> : <Profile />,
        },
        {
            path: '/assessments-for-grading',
            element: notTeacherUser ? <Navigate replace to="/login" /> : <TeacherAssessmentList />,
        },
        {
            path: '/grading',
            element: notTeacherUser ? <Navigate replace to="/login" /> : <GradingScreen />,
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
                        maxWidth={false}
                        sx={{
                            mt: '140px',
                            mb: '40px',
                            flexGrow: 1,
                            alignItems: 'center',
                            maxWidth: {
                                xs: '100%',
                                sm: '100%',
                                md: '100%',
                                lg: '100%',
                                xl: '100%',
                            },
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
