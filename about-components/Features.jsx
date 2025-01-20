import React, { forwardRef } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardMedia,
  CssBaseline,
} from "@mui/material";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom theme with Ubuntu font
const theme = createTheme({
  typography: {
    fontFamily: "Ubuntu, sans-serif", // Set Ubuntu as the default font family
  },
});

const features = [
  {
    id: 1,
    title: "Incident Reporting",
    description:
      "Our Incident Reporting feature is designed to provide users with a seamless and efficient way to report various incidents, ensuring a comprehensive capture of all necessary details. Users can submit reports through multiple input methods, including text descriptions and image uploads, catering to different situations and preferences. The system intelligently processes the received information, automatically extracting key details such as location, time, and nature of the incident. This information is then systematically categorized and forwarded to the appropriate authorities or emergency services. By integrating real-time data collection and analysis, the feature not only speeds up the reporting process but also ensures that the response teams are well-informed and prepared to handle the incident promptly and effectively. Additionally, the platform offers users the ability to track the status of their reports, providing transparency and reassurance that their concerns are being addressed.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/10/17/14/10/financial-2860753_640.jpg",
    linkTo: "/report-incident",
  },
  {
    id: 2,
    title: "Heatmaps",
    description:
      "Our Heatmap feature is a powerful visualization tool that dynamically represents data, providing users with an intuitive and interactive way to understand incident trends and safety levels across various locations. By aggregating real-time data from reported incidents, the Heatmap displays these events geographically, using color gradients to indicate the density and frequency of occurrences. Areas with higher concentrations of incidents are highlighted in warmer colors (such as red or orange), while areas with fewer reports appear in cooler tones (like green or blue).This visual representation allows users to quickly identify hotspots of activity, assess the relative safety of different regions, and make informed decisions based on current data. For authorities and emergency responders, the Heatmap serves as a critical tool for situational awareness, enabling them to prioritize resources and respond more efficiently to areas with higher incident rates.The feature is interactive, allowing users to zoom in and out, filter data by specific time frames or types of incidents, and click on specific locations to view detailed reports. This functionality not only enhances user engagement but also empowers individuals and organizations to proactively address safety concerns, improving community well-being and responsiveness",
    imageUrl: "../heatmap.png",
    linkTo: "/heatmap",
  },
  {
    id: 3,
    title: "Voice Report",
    description:
      "The Voice Report feature allows users to report incidents hands-free using voice commands, making it ideal for situations where typing isn't possible, such as during emergencies or when the user is physically unable to type. By utilizing advanced voice recognition, the system captures and transcribes spoken details like the nature of the incident and location. This information is then forwarded to the appropriate authorities. The feature enhances accessibility, speeds up reporting, and can be used with smart devices for added convenience.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2021/03/27/08/49/mic-6127818_640.jpg",
    linkTo: "/voice-report",
  },
];

const Features = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Apply baseline styles */}
        <Box sx={{ py: 6, px: 2 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            Our Features
          </Typography>

          <Stack spacing={4}>
            {features.map((feature, index) => (
              <Box
                key={feature.id}
                sx={{
                  display: "flex",
                  flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Link to={feature.linkTo} style={{ textDecoration: "none" }}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      boxShadow: 3,
                      width: "100%",
                      backgroundColor: "#7CE5FF",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "scale(0.95)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: "40%",
                        objectFit: "contain",
                        height: "auto",
                        borderRadius: 2,
                      }}
                      image={feature.imageUrl}
                      alt={feature.title}
                    />
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        px: 4,
                        py: 3,
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", mb: 2 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Box>
            ))}
          </Stack>
        </Box>
      </ThemeProvider>
    </div>
  );
});

export default Features;
