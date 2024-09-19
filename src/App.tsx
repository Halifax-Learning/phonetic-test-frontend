import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, RouteObject, BrowserRouter as Router, useRoutes } from 'react-router-dom'

import AssessmentFinish from './components/assessment/AssessmentFinish.js'
import AssessmentList from './components/assessment/AssessmentList.js'
import AssessmentWelcome from './components/assessment/AssessmentWelcome.js'
import Footer from './components/Footer.js'
import Header from './components/Header.js'
import Home from './components/Home.js'
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

    let displayComponent = <AssessmentList />
    if (user) {
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

    const routes: RouteObject[] = [
        { path: '/', element: <Home /> },
        {
            path: '/login',
            element: !user ? <Login /> : <Navigate replace to="/assessment" />,
        },
        {
            path: '/register',
            element: !user ? <Register /> : <Navigate replace to="/assessment" />,
        },
        {
            path: '/assessment',
            element: !user ? <Navigate replace to="/login" /> : displayComponent,
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
                <Header />

                <Container
                    sx={{
                        mt: '140px',
                        mb: '40px',
                        alignItems: 'center',
                    }}
                >
                    <AppRoutes />
                </Container>

                <Footer />
            </Router>
        </ThemeProvider>
    )
}

export default App
