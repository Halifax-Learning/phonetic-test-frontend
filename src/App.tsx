import {
    AppBar,
    Button,
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
    Toolbar,
} from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, RouteObject, BrowserRouter as Router, useRoutes } from 'react-router-dom'

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
        <ThemeProvider theme={createTheme({})}>
            <CssBaseline />

            <Router>
                <AppBar>
                    <Toolbar>
                        {!user ? (
                            <>
                                <Button>
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button>
                                    <Link to="/register">Register</Link>
                                </Button>
                            </>
                        ) : (
                            <Button>
                                <Link to="/login" onClick={() => dispatch(clearUser())}>
                                    Logout
                                </Link>
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>

                <Container sx={{ marginTop: 10 }}>
                    <AppRoutes />
                </Container>
            </Router>
        </ThemeProvider>
    )
}

export default App
