import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { LightbulbOutlined } from "@mui/icons-material";

const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        height: "70vh",
        backgroundImage:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScBKwakApO0OB_nhCmSd36rp6148VDXGqjQjF61wtgJF2WZE88iymiBtUgsKRpMTFzDWQ&usqp=CAU')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      {/* Overlay with opacity */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></Box>

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
            animation: "fadeIn 1s ease-in-out 1s",
          }}
        >
          About Us
        </Typography>

        <Typography
          variant="h6"
          sx={{
            maxWidth: "600px",
            margin: "0 auto",
            mb: 3,
            animation: "fadeIn 2s ease-in-out 2s",
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
          }}
        >
          <LightbulbOutlined
            sx={{ color: theme.palette.warning.main, fontSize: 40, mr: 1 }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Empowering Safety with Real-time Action
          </Typography>
        </Box>

        {/* Optional Call to Action Button */}
        <Button
          variant="contained"
          sx={{
            mt: 4,
            bgcolor: theme.palette.primary.main,
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Learn More
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
