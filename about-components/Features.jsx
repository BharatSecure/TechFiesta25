import React from "react";
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
      "Our Incident Reporting feature allows users to quickly report any incident via text or image uploads. The system captures all relevant details and forwards the report to the appropriate authorities, ensuring a swift response.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/10/17/14/10/financial-2860753_640.jpg",
    linkTo: "/report-incident",
  },
  {
    id: 2,
    title: "Heatmaps",
    description:
      "Our Heatmap feature helps visualize data in a dynamic way. It shows real-time locations of incidents reported, giving users an interactive view of safety in different areas and helping authorities respond effectively.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2019/11/19/22/24/watch-4638673_640.jpg",
    linkTo: "/heatmap",
  },
  {
    id: 3,
    title: "Voice Report",
    description:
      "With the Voice Report feature, users can report incidents hands-free using voice commands. This feature is especially useful for individuals in emergency situations or those unable to type, making it easier to report critical incidents.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2019/11/19/22/24/watch-4638673_640.jpg",
    linkTo: "/voice-report",
  },
];

const Features = () => {
  return (
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
                      objectFit: "cover",
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
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
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
  );
};

export default Features;
