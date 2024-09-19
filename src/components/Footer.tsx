import { Box, Typography, Grid2, Link } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                padding: '40px',
                marginTop: 'auto',
            }}
        >
            <Grid2 container spacing={4} justifyContent="center">
                <Grid2 size={{ xs: 12, sm: 12, md: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                        <Link href="#" color="inherit">
                            <XIcon sx={{ fontSize: 35 }} />
                        </Link>
                        <Link href="#" color="inherit">
                            <InstagramIcon sx={{ fontSize: 35 }} />
                        </Link>
                        <Link href="#" color="inherit">
                            <YouTubeIcon sx={{ fontSize: 35 }} />
                        </Link>
                        <Link href="#" color="inherit">
                            <LinkedInIcon sx={{ fontSize: 35 }} />
                        </Link>
                    </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        About
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        <Link href="#" color="inherit" underline="none">
                            The Company
                        </Link>
                    </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        For Students
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        <Link href="#" color="inherit" underline="none">
                            Speaking Skill Assessment
                        </Link>
                    </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                        Resources
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        <Link href="#" color="inherit" underline="none">
                            Support
                        </Link>
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>
    )
}

export default Footer
