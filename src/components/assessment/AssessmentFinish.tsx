import HeaderIcon from '@mui/icons-material/DoneAll'
import HomeIcon from '@mui/icons-material/Home'
import { Box, Button, Card, CardContent, Grid2, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'

const AssessmentFinish = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const returnToHomeScreen = () => {
        navigate('/')
        dispatch(setScreenToDisplay('AssessmentTypeList'))
    }
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Card
                variant="outlined"
                sx={{
                    maxWidth: 'md',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: 3,
                    border: 'none', // Remove the default border
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        right: -5,
                        bottom: -5,
                        background: `
                                    repeating-linear-gradient(
                                        -45deg,
                                        rgba(139, 69, 19, 0.8) 0%,
                                        rgba(89, 43, 10, 1) 5px,
                                        rgba(189, 111, 55, 1) 5px,
                                        rgba(189, 111, 55,  0.8) 10px
                                    )
                                `,
                        zIndex: 2,
                        opacity: 0.8, // 50% opacity
                    },
                }}
            >
                {/* Background layer */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: 'calc(100% - 2rem)',
                        height: 'calc(100% - 2rem)',
                        background: '#fff8ed', // Light brown to dark brown
                        zIndex: 2,
                        top: '1rem',
                        left: '1rem',
                        opacity: 1, // 20% opacity
                        borderRadius: '8px',
                    }}
                />
                <CardContent sx={{ position: 'relative', zIndex: 2, margin: '2rem' }}>
                    <Grid2 container spacing={2}>
                        {/* Top-left: Icon */}
                        <Grid2 size={1} display="flex" alignItems="center" justifyContent="center">
                            <HeaderIcon sx={{ fontSize: 35, color: 'secondary.dark' }} />
                        </Grid2>
                        {/* Top-right: Instructions Title */}
                        <Grid2 size={11} display="flex" alignItems="center" justifyContent="left">
                            <Typography variant="h1" color="secondary.dark">
                                Assessment Submitted Successfully!
                            </Typography>
                        </Grid2>
                        {/* Bottom-left: Blank */}
                        <Grid2
                            size={1}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        />
                        {/* Bottom-right: Content and Button */}
                        <Grid2 size={11}>
                            <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                                Thank you for completing the assessment. Your responses have been
                                submitted.
                                <br />
                                <br />
                                <strong>What’s Next?</strong>
                                <br />
                                • Please wait for your teachers to grade your assessment.
                                <br />
                                • Your results will be sent to you once grading is complete.
                                <br />• If you have any questions or need further assistance, feel
                                free to contact us.
                            </Typography>
                            <Box display="flex" justifyContent="right">
                                <Button
                                    variant="contained"
                                    sx={{ fontSize: '1rem' }}
                                    onClick={returnToHomeScreen}
                                    startIcon={<HomeIcon />}
                                >
                                    Back to Home
                                </Button>
                            </Box>
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>
        </Box>
    )
}

export default AssessmentFinish
