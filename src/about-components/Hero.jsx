import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { LightbulbOutlined } from "@mui/icons-material";

const Hero = ({ onLearnMore }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        height: "70vh",
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2019/11/19/22/24/watch-4638673_640.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      {/* Overlay with improved opacity for contrast */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.55)", // Darker overlay for better contrast
        }}
      ></Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 3, sm: 4, md: 6 },
        }}
      >
        {/* Hero Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 2,
            animation: "fadeIn 1s ease-in-out 0.5s",
            fontFamily: "Ubuntu, sans-serif",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, // Responsive font size
            color: "white",
            textShadow: "2px 2px 10px rgba(0, 0, 0, 0.6)", // Text shadow for more depth
          }}
        >
          About Us
        </Typography>

        {/* Description Text */}
        <Typography
          variant="h6"
          sx={{
            maxWidth: "700px",
            margin: "0 auto",
            mb: 3,
            animation: "fadeIn 2s ease-in-out 1s",
            fontFamily: "Ubuntu, sans-serif",
            color: "white",
            fontSize: { xs: "1rem", sm: "1.2rem" }, // Responsive font size
            textShadow: "1px 1px 8px rgba(0, 0, 0, 0.5)", // Text shadow for readability
          }}
        >
          Our Incident Reporting and Response System is designed to ensure
          safety and quick action during critical situations. We empower users
          to report incidents through text or voice input, enabling faster
          responses and better monitoring through real-time analytics.
        </Typography>

        {/* Icon and Empowering Safety text */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          <LightbulbOutlined
            sx={{
              color: theme.palette.warning.main,
              fontSize: 45, // Larger icon for more emphasis
              mr: 2,
              animation: "fadeIn 2s ease-in-out 1.5s", // Smooth animation for the icon
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              fontFamily: "Ubuntu, sans-serif",
              color: "white",
              animation: "fadeIn 2s ease-in-out 1.5s",
              textShadow: "1px 1px 8px rgba(0, 0, 0, 0.6)", // Ensure readability on background
            }}
          >
            Empowering Safety with Real-time Action
          </Typography>
        </Box>

        {/* Learn More Button */}
        <Button
          onClick={onLearnMore}
          variant="contained"
          sx={{
            mt: 4,
            bgcolor: theme.palette.primary.main,
            color: "white", // Ensuring the button text is white
            fontWeight: "bold",
            fontSize: "1.1rem",
            borderRadius: "25px", // Rounded button for a modern look
            padding: "12px 24px",
            boxShadow: 4,
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
              boxShadow: 8,
              transform: "scale(1.05)", // Slight scale effect on hover
            },
            animation: "fadeIn 3s ease-in-out 2s", // Animation for the button
          }}
        >
          Learn More
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
