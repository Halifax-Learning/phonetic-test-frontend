import {
    AppBar,
    Box,
    Button,
    Container,
    CssBaseline,
    Menu,
    MenuItem,
    ThemeProvider,
    Toolbar,
    Typography,
} from '@mui/material'
import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
} from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, RouteObject, BrowserRouter as Router, useRoutes, Link } from 'react-router-dom'

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
import { StyledLink, StyledUserIconButton, theme } from './theme/theme.js'
import Home from './components/Home.js'
import Footer from './components/Footer.js'

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
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const isMenuOpen = Boolean(anchorEl)

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        dispatch(clearUser())
        handleMenuClose()
    }

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
                            component={Link}
                            to="/"
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
                                    <StyledLink to="/">Home</StyledLink>
                                    <StyledLink to="/assessment">Assessment</StyledLink>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: theme.palette.secondary.main,
                                            color: 'inherit',
                                            padding: '8px 16px',
                                            marginLeft: '8px',
                                        }}
                                        component={Link}
                                        to="/login"
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: 'inherit',
                                            padding: '8px 16px',
                                            marginLeft: '8px',
                                        }}
                                        component={Link}
                                        to="/register"
                                    >
                                        Register
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <StyledLink to="/">Home</StyledLink>
                                    <StyledLink to="/assessment">Assessment</StyledLink>
                                    <StyledUserIconButton onClick={handleMenuOpen}>
                                        <Typography className="userName">
                                            {user.firstName} {user.lastName}
                                        </Typography>
                                        {isMenuOpen ? (
                                            <ArrowDropUpIcon
                                                sx={{
                                                    fontSize: '20px',
                                                    marginLeft: '8px',
                                                }}
                                            />
                                        ) : (
                                            <ArrowDropDownIcon
                                                sx={{
                                                    fontSize: '20px',
                                                    marginLeft: '8px',
                                                }}
                                            />
                                        )}
                                    </StyledUserIconButton>

                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem onClick={handleLogout}>
                                            <Link
                                                to="/login"
                                                style={{
                                                    ...theme.typography.h3,
                                                    textDecoration: 'none',
                                                    color: theme.palette.text.primary,
                                                }}
                                            >
                                                Logout
                                            </Link>
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>

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
