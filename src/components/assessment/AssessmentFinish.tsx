import { Box, Button, Card, CardContent, Grid2, Typography } from '@mui/material'
import HeaderIcon from '@mui/icons-material/DoneAll'
import { useDispatch } from 'react-redux'
import { setScreenToDisplay } from '../../reducers/screenToDisplayReducer'

const AssessmentFinish = () => {
    const dispatch = useDispatch<any>()

    const returnToAssessmentList = () => {
        dispatch(setScreenToDisplay('AssessmentList'))
    }
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Card variant="outlined" sx={{ maxWidth: 700, padding: 2 }}>
                <CardContent>
                    <Grid2 container spacing={2}>
                        {/* Top-left: Icon */}
                        <Grid2 size={1} display="flex" alignItems="center" justifyContent="center">
                            <HeaderIcon sx={{ fontSize: 35, color: 'secondary.dark' }} />
                        </Grid2>
                        {/* Top-right: Instructions Title */}
                        <Grid2 size={11} display="flex" alignItems="center" justifyContent="left">
                            <Typography variant="h1" color="secondary.dark">
                                Test Submitted Successfully!
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
                                • You can now exit the test.
                                <br />• If you have any questions or need further assistance, please
                                contact us.
                            </Typography>
                            <Box display="flex" justifyContent="right">
                                <Button
                                    variant="contained"
                                    sx={{ padding: '12px' }}
                                    onClick={returnToAssessmentList}
                                >
                                    Return to Home Screen
                                </Button>
                            </Box>
                        </Grid2>{' '}
                    </Grid2>
                </CardContent>
            </Card>
        </Box>
    )
}

export default AssessmentFinish
