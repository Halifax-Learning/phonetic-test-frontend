import {
    AppBar,
    Box,
    Container,
    CssBaseline,
    ThemeProvider,
    Toolbar,
} from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, RouteObject, BrowserRouter as Router, useRoutes } from 'react-router-dom'

import AssessmentFinish from './components/assessment/AssessmentFinish.js'
import AssessmentList from './components/assessment/AssessmentList.js'
import AssessmentWelcome from './components/assessment/AssessmentWelcome.js'
import TestFinish from './components/test/TestFinish.js'
import TestQuestion from './components/test/TestQuestion.js'
import TestWelcome from './components/test/TestWelcome.js'
import Login from './components/user/Login.js'
import Register from './components/user/Register.js'
import { RootState } from './main.js'
import { clearUser, setUser } from './reducers/userReducer.js'
import { StyledLink, theme } from './theme/theme.js'

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
            element: <Navigate replace to="/login" />,
        },
    ]

    return useRoutes(routes)
}

const App = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Router>
                <AppBar sx={{ backgroundColor: 'white', height: '120px' }}>
                    <Toolbar>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexGrow: 1,
                                mt: 1,
                                mb: 1,
                                height: '100%',
                            }}
                        >
                            <img
                                src="src\assets\HFX_LEARNING_LOGO_WEB.webp"
                                alt="Logo"
                                style={{ height: '90%', width: 'auto' }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {!user ? (
                                <>
                                    <StyledLink to="/login">Login</StyledLink>
                                    <StyledLink to="/register">Register</StyledLink>
                                </>
                            ) : (
                                <StyledLink to="/login" onClick={() => dispatch(clearUser())}>
                                    Logout
                                </StyledLink>
                            )}{' '}
                        </Box>
                    </Toolbar>
                </AppBar>

                <Container
                    sx={{
                        mt: '140px',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <AppRoutes />
                </Container>
            </Router>
        </ThemeProvider>
    )
}

export default App
