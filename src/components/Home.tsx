import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { theme } from '../theme/theme'

const Home = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                color: 'white',
                padding: '200px 20px',
                background: `linear-gradient(180deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
            }}
        >
            <Typography variant="h1" sx={{ color: 'inherit', mb: 2 }}>
                Discover Your English Strengths
            </Typography>
            <Typography variant="body1" sx={{ color: 'inherit', mb: 4 }}>
                Comprehensive Skill Assessment for Students and Families to Identify Areas for
                Improvement
            </Typography>
            <Button
                component={Link}
                to="/assessment"
                variant="contained"
                sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: 'inherit',
                }}
            >
                TAKE THE ASSESSMENT NOW
            </Button>
        </Box>
    )
}

export default Home
