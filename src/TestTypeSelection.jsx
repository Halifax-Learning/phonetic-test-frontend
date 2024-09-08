import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import theme from "./theme";

// Card Data
const cardData = [
  {
    title: "Synthesis",
    content:
      "It's a phoneme synthesis test where participants blend given sounds (phonemes) to form a word.",
    link: "/instructions/synthesis",
  },
  {
    title: "Analysis",
    content:
      "It's a phoneme analysis test where participants break down a given word into its individual sounds (phonemes).",
  },
  {
    title: "Listening",
    content:
      "It's a phoneme listening test where participants identify the middle vowel sound in a given syllable or word.",
  },
  {
    title: "Single Phoneme Recognition",
    content:
      "It's a single phoneme recognition test where participants identify a specific phoneme from visual sound cards.",
  },
];

function TestTypeSelection() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 3, sm: 8, md: 12 }}
        >
          {cardData.map((card, index) => (
            <Grid key={index} size={{ xs: 4, sm: 4, md: 4 }}>
              <Link to={card.link} style={{ textDecoration: "none" }}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h1" color="secondary.dark" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
                      {card.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default TestTypeSelection;
