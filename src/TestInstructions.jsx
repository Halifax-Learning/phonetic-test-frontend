import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2'; // Import Grid2 from MUI v5
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function TestInstructions() {
  const { testType } = useParams();
  const navigate = useNavigate();

  const handleProceed = () => {
    if (testType) {
      navigate(`/${testType}`);
    } else {
      navigate('/');
    }
  };

  const formattedTestType = testType
    ? testType.charAt(0).toUpperCase() + testType.slice(1)
    : "General";

  return (
    <ThemeProvider theme={theme}>
      <Card variant="outlined" sx={{ maxWidth: 700, padding: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Top-left: Icon */}
            <Grid size={1}  display="flex" alignItems="center" justifyContent="center">
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 35, color: 'secondary.dark' }} />
            </Grid>
            {/* Top-right: Instructions Title */}
            <Grid size={11} display="flex" alignItems="center" justifyContent="left">
              <Typography variant="h1" color="secondary.dark">
                Instruction
              </Typography>
            </Grid>
            {/* Bottom-left: Blank */}
            <Grid size={1} display="flex" alignItems="center" justifyContent="center" />
            {/* Bottom-right: Content and Button */}
            <Grid size={11}>
              <Box>
                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  <strong>1. Listen to the Audio or Read the Sound Card:</strong><br />
                  For each question, you will either see a sound card or an audio file. Play the audio and listen carefully, or read the sound card.
                </Typography>

                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  <strong>2. Record Your Answer:</strong><br />
                  • When you're ready to answer, click the "Record Now" button.<br />
                  • Speak your answer clearly.
                </Typography>

                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  <strong>3. Review Your Answer:</strong><br />
                  • After finishing, click "Stop Recording" to end your answer.<br />
                  • You can listen to your recorded answer to ensure you're satisfied with it.
                </Typography>

                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  <strong>4. Revise Your Answer (Optional):</strong><br />
                  • If you'd like to change your answer, click "Record Again" to start a new recording.<br />
                  • <em>Important:</em> If you record a new answer, your previous answer will be lost.
                </Typography>
              </Box>

              <Box display="flex" justifyContent="right" sx={{ mt: 3 }}>
                <Button onClick={handleProceed} variant="contained" color="primary" sx={{ padding: '12px 24px' }}>
                  Start {formattedTestType} Test
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default TestInstructions;
