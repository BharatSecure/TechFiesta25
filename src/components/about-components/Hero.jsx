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
      background: '#001a2f',
      backgroundImage: "url('https://cdn.pixabay.com/photo/2019/11/19/22/24/watch-4638673_640.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      textAlign: "center",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 26, 47, 0.75)",
        backdropFilter: "blur(5px)",
      }}
    />

    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        px: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          mb: 2,
          animation: "fadeIn 1s ease-in-out 0.5s",
          fontFamily: "Ubuntu, sans-serif",
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          color: "#00ffff",
          textShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
          transition: "0.3s",
          '&:hover': {
            textShadow: "0 0 30px rgba(0, 255, 255, 0.8)"
          }
        }}
      >
        About Us
      </Typography>

      <Typography
        variant="h6"
        sx={{
          maxWidth: "700px",
          margin: "0 auto",
          mb: 3,
          animation: "fadeIn 2s ease-in-out 1s",
          fontFamily: "Ubuntu, sans-serif",
          fontSize: { xs: "1rem", sm: "1.2rem" },
          color: "#80ffff",
          textShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
        }}
      >
        Our Incident Reporting and Response System is designed to ensure
        safety and quick action during critical situations. We empower users
        to report incidents through text or voice input, enabling faster
        responses and better monitoring through real-time analytics.
      </Typography>

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
            color: "#00ffff",
            fontSize: 45,
            mr: 2,
            animation: "fadeIn 2s ease-in-out 1.5s",
            filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))",
          }}
        />
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            fontFamily: "Ubuntu, sans-serif",
            color: "#00ffff",
            animation: "fadeIn 2s ease-in-out 1.5s",
            textShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
          }}
        >
          Empowering Safety with Real-time Action
        </Typography>
      </Box>

      <Button
        onClick={onLearnMore}
        variant="contained"
        sx={{
          mt: 4,
          bgcolor: "#002240",
          color: "#00ffff",
          fontWeight: "bold",
          fontSize: "1.1rem",
          borderRadius: "25px",
          padding: "12px 24px",
          boxShadow: '8px 8px 16px #001527, -8px -8px 16px #002f59',
          border: '1px solid rgba(0, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          animation: "fadeIn 3s ease-in-out 2s",
          "&:hover": {
            bgcolor: "#002240",
            boxShadow: '12px 12px 24px #001527, -12px -12px 24px #002f59, 0 0 20px rgba(0, 255, 255, 0.3)',
            transform: "scale(1.05)",
          },
        }}
      >
        Explore Features
      </Button>
    </Box>
  </Box>
  );
};

export default Hero;
