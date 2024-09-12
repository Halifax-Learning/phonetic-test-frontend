import {
  Box,
  Button,
  Card,
  CardContent,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TestType } from "../models/interface";
import { createTest } from "../reducers/testReducer";
import { fetchTestTypes } from "../reducers/testTypeReducer";
import { theme } from "../theme/theme";

const TestList = () => {
  const dispatch = useDispatch<any>();
  const testTypes = useSelector(
    (state: { testTypes: TestType[] }) => state.testTypes
  );

  useEffect(() => {
    dispatch(fetchTestTypes());
  }, []);

  const startTest = (testType: TestType) => {
    if (testType.name === "Synthesis") {
      dispatch(createTest(testType.testTypeId, "1"));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card variant="outlined" sx={{ maxWidth: 700, padding: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Top-left: Icon */}
            <Grid size={{xs: 1}} display="flex" alignItems="center" justifyContent="center">
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 35, color: 'secondary.dark' }} />
            </Grid>
            {/* Top-right: Instructions Title */}
            <Grid size={{xs: 11}}  display="flex" alignItems="center" justifyContent="left">
              <Typography variant="h1" color="secondary.dark">
                Instruction
              </Typography>
            </Grid>
            {/* Bottom-left: Blank */}
            <Grid size={{xs: 1}}  display="flex" alignItems="center" justifyContent="center" />
            {/* Bottom-right: Content and Button */}
            <Grid size={{xs: 11}} >
              <Box>
                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  <strong>1. Listen to the Audio or Read the Sound Card:</strong>
                  <br />
                  For each question, you will either see a sound card or an audio file. Play the audio and listen carefully, or read the sound card.
                </Typography>

                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  <strong>2. Record Your Answer:</strong>
                  <br />
                  • When you're ready to answer, click the "Record Now" button.
                  <br />
                  • Speak your answer clearly.
                </Typography>

                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  <strong>3. Review Your Answer:</strong>
                  <br />
                  • After finishing, click "Stop Recording" to end your answer.
                  <br />
                  • You can listen to your recorded answer to ensure you're satisfied with it.
                </Typography>

                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  <strong>4. Revise Your Answer (Optional):</strong>
                  <br />
                  • If you'd like to change your answer, click "Record Again" to start a new recording.
                  <br />
                  • <em>Important:</em> If you record a new answer, your previous answer will be lost.
                </Typography>
              </Box>

              {testTypes.map((testType) => (
              <Box display="flex" justifyContent="right" sx={{ mt: 3 }}>
                <Button key={testType.testTypeId} onClick={() => startTest(testType)}  variant="contained" color="primary" sx={{ padding: '12px 24px' }}>
                  Start {testType.name} Test
                </Button>
              </Box>
          ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default TestList;
