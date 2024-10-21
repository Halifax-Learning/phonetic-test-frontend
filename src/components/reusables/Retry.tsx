import { Box, Button, Typography } from '@mui/material'

const Retry = ({ message, onClick }: { message: string; onClick: () => void }) => (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" color="error">
            {message}
        </Typography>
        <Button variant="contained" onClick={onClick}>
            Retry
        </Button>
    </Box>
)

export default Retry
