import React, { useState } from 'react'
import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material'
import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser } from '../reducers/userReducer'
import { RootState } from '../main'
import { StyledLink, StyledUserIconButton, theme } from '../theme/theme'

const Header: React.FC = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const isMenuOpen = Boolean(anchorEl)

    const handleDrawerOpen = () => setDrawerOpen(true)
    const handleDrawerClose = () => setDrawerOpen(false)
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorEl(event.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)

    const handleLogout = () => {
        dispatch(clearUser())
        handleMenuClose()
        handleDrawerClose()
    }

    return (
        <>
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
                    {isSmallScreen ? (
                        <>
                            <IconButton
                                edge="start"
                                sx={{ color: theme.palette.secondary.dark }}
                                onClick={handleDrawerOpen}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
                                <Box
                                    sx={{
                                        width: '150px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '16px',
                                    }}
                                    role="presentation"
                                >
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleDrawerClose}
                                        sx={(theme) => ({
                                            position: 'absolute',
                                            right: 16,
                                            top: 16,
                                            color: theme.palette.primary.main,
                                        })}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <StyledLink
                                        sx={{
                                            width: '100%',
                                            mt: 8,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        to="/"
                                        onClick={handleDrawerClose}
                                    >
                                        Home
                                    </StyledLink>
                                    <StyledLink to="/assessment" onClick={handleDrawerClose}>
                                        Assessment
                                    </StyledLink>
                                    {!user ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    width: '100%',
                                                    backgroundColor: theme.palette.secondary.main,
                                                    padding: '8px 16px',
                                                    margin: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                                component={Link}
                                                to="/login"
                                                onClick={handleDrawerClose}
                                            >
                                                Login
                                            </Button>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    width: '100%',
                                                    backgroundColor: theme.palette.primary.main,
                                                    padding: '8px 16px',
                                                    margin: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                                component={Link}
                                                to="/register"
                                                onClick={handleDrawerClose}
                                            >
                                                Register
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    width: '100%',
                                                    backgroundColor: theme.palette.primary.main,
                                                    padding: '8px 16px',
                                                    margin: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                                component={Link}
                                                to="/login"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StyledLink to="/">Home</StyledLink>
                            <StyledLink to="/assessment">Assessment</StyledLink>
                            {!user ? (
                                <>
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
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
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
                    )}
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Header
