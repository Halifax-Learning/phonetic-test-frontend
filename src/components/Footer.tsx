import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import XIcon from '@mui/icons-material/X'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Box, Grid2, Link, Typography } from '@mui/material'

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                padding: '40px',
                marginTop: 'auto',
                width: '100%',
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
                    <Typography variant="h2" color="inherit" sx={{ mb: 2 }}>
                        About
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        <Link href="#" color="inherit" underline="none">
                            The Company
                        </Link>
                    </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <Typography variant="h2" color="inherit" sx={{ mb: 2 }}>
                        For Students
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        <Link href="#" color="inherit" underline="none">
                            Speaking Skill Assessment
                        </Link>
                    </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <Typography variant="h2" color="inherit" sx={{ mb: 2 }}>
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
