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
import FadeInComponent from "@/lib/FadeInComponent";

// Custom theme with Ubuntu font
const theme = createTheme({
  typography: {
    fontFamily: "Ubuntu, sans-serif", // Set Ubuntu as the default font family
    h3: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "#333", // Darker for better contrast
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      color: "#444", // Slightly darker for better readability
    },
    body1: {
      color: "#555", // Slightly lighter text for body content
      fontSize: "1rem",
    },
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
    title: "Saathi AI",
    description:
      "Saathi AI is your trusted AI-powered companion, dedicated to providing real-time support for medical emergencies, safety concerns, emotional well-being, and legal guidance. Designed to be a safe space, Saathi AI encourages women and children to speak up without fear, ensuring they receive the right help at the right time. Whether you need immediate assistance, mental health support, or legal advice, Saathi AI listens, understands, and guides you with empathy and accuracy. In times of uncertainty, you're never alone—Saathi AI is here to support, empower, and protect you.",
    imageUrl:
      "https://botnation.ai/site/wp-content/uploads/2022/02/meilleur-chatbot.jpg",
    linkTo: "/chatbot",
  },
  {
    id: 3,
    title: "Heatmaps",
    description:
      "Our Heatmap feature is a powerful visualization tool that dynamically represents data, providing users with an intuitive and interactive way to understand incident trends and safety levels across various locations. By aggregating real-time data from reported incidents, the Heatmap displays these events geographically, using color gradients to indicate the density and frequency of occurrences. Areas with higher concentrations of incidents are highlighted in warmer colors (such as red or orange), while areas with fewer reports appear in cooler tones (like green or blue).This visual representation allows users to quickly identify hotspots of activity, assess the relative safety of different regions, and make informed decisions based on current data. For authorities and emergency responders, the Heatmap serves as a critical tool for situational awareness, enabling them to prioritize resources and respond more efficiently to areas with higher incident rates.The feature is interactive, allowing users to zoom in and out, filter data by specific time frames or types of incidents, and click on specific locations to view detailed reports. This functionality not only enhances user engagement but also empowers individuals and organizations to proactively address safety concerns, improving community well-being and responsiveness",
    imageUrl: "../heatmap.png",
    linkTo: "/heatmap",
  },
  {
    id: 4,
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
        <Box
          sx={{ py: 6, px: 2, backgroundColor: "#f9f9f9", overflow: "hidden" }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 4,
              color: "#003366", // Dark blue for a more professional look
            }}
          >
            Our Features
          </Typography>

          <Stack spacing={6}>
            {features.map((feature, index) => (
              <Box
                key={feature.id}
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column", // Column layout for small screens
                    sm: index % 2 === 0 ? "row" : "row-reverse", // Row layout for medium+ screens
                  },
                  alignItems: "center",
                  gap: 2,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <FadeInComponent>
                  <Link to={feature.linkTo} style={{ textDecoration: "none" }}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: {
                          xs: "column", // Column layout for mobile
                          sm: "row", // Row layout for larger screens
                        },
                        boxShadow: 5,
                        width: "100%",
                        backgroundColor: "#ffffff",
                        borderRadius: 3,
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "scale(0.95)",
                          boxShadow: 10,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: { xs: "100%", sm: "40%" }, // Full width on mobile
                          objectFit: "cover",
                          height: { xs: "auto", sm: "100%" },
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
                          px: { xs: 2, sm: 4 }, // Adjust padding for mobile
                          py: { xs: 2, sm: 3 },
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "#0066cc",
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#666" }}>
                          {feature.description}
                        </Typography>
                        <button
                          className="mt-3 w-full sm:w-1/2 self-center rounded-md bg-gradient-to-r from-sky-500 to-sky-700 py-2 px-6 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-sky-700 hover:to-sky-900 transition-all"
                          type="button"
                        >
                          Try Now
                        </button>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeInComponent>
              </Box>
            ))}
          </Stack>
        </Box>
      </ThemeProvider>
    </div>
  );
});

export default Features;
