import {
  Box,
  Button,
  Card,
  CardContent,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useDispatch, useSelector } from "react-redux";

import { Test } from "../models/interface";
import { nextQuestion, submitTest, updateTest } from "../reducers/testReducer";
import { theme } from "../theme/theme";

const TestQuestion = () => {
  const dispatch: any = useDispatch();
  const test = useSelector(
    (state: { test: { test: Test } }) => state.test.test
  );
  const currentTestQuestionIndex = useSelector(
    (state: { test: { currentTestQuestionIndex: number } }) =>
      state.test.currentTestQuestionIndex
  );

  const [isQuestionWithoutAnswer, setIsQuestionWithoutAnswer] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder(
    { audio: true }
  );

  useEffect(() => {
    // Initialize timer with a dummy interval
    let timer: NodeJS.Timeout = setInterval(() => {}, 0);
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    // whenever a new mediaBlobUrl is available, update the current test question with the new answer audio
    if (mediaBlobUrl) {
      const currentTestQuestion = test.testQuestions[currentTestQuestionIndex];

      // Create a new object with the updated properties
      const updatedTestQuestion = {
        ...currentTestQuestion,
        answerAudioBlobUrl: mediaBlobUrl,
      };

      dispatch(updateTest(updatedTestQuestion));
    }
  }, [mediaBlobUrl]);

  const questionAudioB64Encode =
    test.testQuestions[currentTestQuestionIndex].question
      .questionAudioB64Encode;
  // Create the data URI for the question audio file
  const questionAudioSrc = `data:audio/mp3;base64,${questionAudioB64Encode}`;

  const onStartRecording = () => {
    startRecording();
    setIsRecording(true);
  };

  const onStopRecording = () => {
    stopRecording();
    setIsRecording(false);
    setIsQuestionWithoutAnswer(false);
  };

  const onClickNextQuestion = () => {
    setIsQuestionWithoutAnswer(true);
    dispatch(nextQuestion());
  };

  const onSubmitTest = () => {
    dispatch(submitTest(test.testId, test.testQuestions));
  };

  return (
    <ThemeProvider theme={theme}>
      <Card variant="outlined" sx={{ maxWidth: 700, padding: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Top-left: Icon */}
            <Grid
              size={{ xs: 1 }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <ChatBubbleOutlineOutlinedIcon
                sx={{ fontSize: 35, color: "secondary.dark" }}
              />
            </Grid>
            {/* Top-right: Instructions Title */}
            <Grid
              size={{ xs: 11 }}
              display="flex"
              alignItems="center"
              justifyContent="left"
            >
              <Typography variant="h1" color="secondary.dark" sx={{ mb: 2 }}>
                {test.testType.name} - Question {currentTestQuestionIndex + 1}:{" "}
                {
                  test.testQuestions[currentTestQuestionIndex].question
                    .questionText
                }
              </Typography>
            </Grid>
            {/* Bottom-left: Blank */}
            <Grid
              size={{ xs: 1 }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            />
            {/* Bottom-right: Content and Button */}
            <Grid size={{ xs: 11 }}>
              <Box>
                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  {test.instructionText}
                </Typography>

                <Box>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ mb: 2 }}
                  >
                    <audio controls src={questionAudioSrc}>
                      Your browser does not support the audio element.
                    </audio>
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ mb: 2 }}
                  >
                    {isRecording && <div>Recording Time: {recordingTime}s</div>}
                    {!isRecording &&
                      mediaBlobUrl &&
                      !isQuestionWithoutAnswer && (
                        <>
                          <div>Your answer:</div>
                          <audio controls src={mediaBlobUrl} />
                        </>
                      )}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="right" sx={{ mt: 3 }}>
                  {!isRecording ? (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ padding: "12px 24px", mr: 2 }}
                      onClick={onStartRecording}
                    >
                      Record Your Answer
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ padding: "12px 24px", mr: 2 }}
                      onClick={onStopRecording}
                    >
                      Stop Recording
                    </Button>
                  )}

                  {currentTestQuestionIndex < test.testType.numQuestions - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ padding: "12px 24px" }}
                      onClick={onClickNextQuestion}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ padding: "12px 24px" }}
                      onClick={onSubmitTest}
                    >
                      Finish Test
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default TestQuestion;
