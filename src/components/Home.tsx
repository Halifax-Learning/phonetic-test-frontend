import ExpertGuidanceIcon from '@mui/icons-material/EmojiPeople'
import GoalOrientedIcon from '@mui/icons-material/Flag'
import AgeGroupsIcon from '@mui/icons-material/People'
import TailoredLearningIcon from '@mui/icons-material/School'
import TrackProgressIcon from '@mui/icons-material/ShowChart'
import PersonalizedResultsIcon from '@mui/icons-material/Star'

import { Box, Button, Card, Grid2, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../main'
import { theme } from '../theme/theme'

const Home = () => {
    const user = useSelector((state: RootState) => state.user)

    const FeatureCard = styled(Card)(({ theme }) => ({
        padding: theme.spacing(2),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: theme.shadows[2],
        transition: 'transform 0.3s',
        '&:hover': {
            transform: 'scale(1.05)',
        },

        // Styles for the icon container
        '& .iconContainer': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing(1),
            color: theme.palette.secondary.main,
        },

        // Styles for the icon itself
        '& .icon': {
            marginRight: theme.spacing(1),
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.5rem',
        },

        '& h2': {
            color: theme.palette.secondary.main,
        },
    }))

    const features = [
        {
            name: 'Personalized Results',
            description:
                'Get a detailed analysis of your English proficiency with personalized feedback.',
            icon: <PersonalizedResultsIcon />,
        },
        {
            name: 'For All Age Groups',
            description:
                'Whether you are a student or a parent, our assessment is tailored to suit your needs.',
            icon: <AgeGroupsIcon />,
        },
        {
            name: 'Expert Guidance',
            description:
                'Get recommendations from experts to help you improve and reach your full potential.',
            icon: <ExpertGuidanceIcon />,
        },
    ]

    const benefits = [
        {
            name: 'Track Progress',
            description:
                'Monitor your improvement over time as you assess and develop your skills effectively.',
            icon: <TrackProgressIcon />,
        },
        {
            name: 'Tailored Learning',
            description:
                'Receive learning materials based on your individual results to help you improve faster.',
            icon: <TailoredLearningIcon />,
        },
        {
            name: 'Goal-Oriented Approach',
            description:
                'Set clear learning goals and follow step-by-step strategies to achieve them.',
            icon: <GoalOrientedIcon />,
        },
    ]

    return (
        <Box
            sx={{
                display: 'block',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: 'white',
                    padding: '150px 20px',
                    background: `linear-gradient(180deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                }}
            >
                {user && (
                    <Typography variant="h1" sx={{ color: 'inherit', mb: 2 }}>
                        Hello, {user.firstName}!
                    </Typography>
                )}
                <Typography variant="h1" sx={{ color: 'inherit', mb: 2 }}>
                    {user?.accountRole === 'teacher'
                        ? 'Grade Your Students'
                        : 'Discover Your English Strengths'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'inherit', mb: 4 }}>
                    {user?.accountRole === 'teacher'
                        ? 'Evaluate and assess student performance to enhance their learning.'
                        : 'Comprehensive Skill Assessment for Students and Families to Identify Areas for Improvement'}
                </Typography>
                <Button
                    component={Link}
                    to={
                        user?.accountRole === 'teacher' ? '/assessments-for-grading' : '/assessment'
                    }
                    variant="contained"
                    sx={{
                        backgroundColor: theme.palette.secondary.main,
                        color: 'inherit',
                    }}
                >
                    {user?.accountRole === 'teacher'
                        ? 'GRADE ASSESSMENTS'
                        : 'TAKE THE ASSESSMENT NOW'}
                </Button>
            </Box>
            <Box sx={{ mt: 8, mb: 4, width: '100%', px: 2 }}>
                <Typography variant="h1" sx={{ mb: 4 }}>
                    Why Choose Our Assessment?
                </Typography>
                <Grid2 container spacing={4}>
                    {features.map((feature) => (
                        <Grid2 key={feature.name} size={{ xs: 12, md: 4 }}>
                            <FeatureCard variant="outlined">
                                <Box className="iconContainer">
                                    <Box className="icon">{feature.icon}</Box>
                                    <Typography variant="h2">{feature.name}</Typography>
                                </Box>
                                <Typography variant="body2">{feature.description}</Typography>
                            </FeatureCard>
                        </Grid2>
                    ))}
                </Grid2>
            </Box>
            {/* Benefits Section */}
            <Box sx={{ mt: 8, mb: 4, width: '100%', px: 2 }}>
                <Typography variant="h1" sx={{ mb: 4 }}>
                    What You Will Gain
                </Typography>
                <Grid2 container spacing={4}>
                    {benefits.map((benefit) => (
                        <Grid2 key={benefit.name} size={{ xs: 12, md: 4 }}>
                            <FeatureCard variant="outlined">
                                <Box className="iconContainer">
                                    <Box className="icon">{benefit.icon}</Box>
                                    <Typography variant="h2">{benefit.name}</Typography>
                                </Box>
                                <Typography variant="body2">{benefit.description}</Typography>
                            </FeatureCard>
                        </Grid2>
                    ))}
                </Grid2>
            </Box>

            {/* Call-to-Action Section */}
            <Box sx={{ mt: 8, mb: 4 }}>
                <Typography variant="h1" sx={{ mb: 4 }}>
                    Ready to Begin?
                </Typography>
                <Button
                    component={Link}
                    to="/assessment"
                    variant="contained"
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                    }}
                >
                    Start Your Assessment
                </Button>
            </Box>
        </Box>
    )
}

export default Home
