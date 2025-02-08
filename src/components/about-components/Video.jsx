import React from "react";
import { Box, Typography, Container } from "@mui/material";
import ScaleInComponent from "@/lib/ScaleInComponent";

const Video = () => {
  return (
    <Box sx={{
      py: 6,
      background: '#001a2f',
      boxShadow: 'inset 20px 20px 60px #00152a, inset -20px -20px 60px #001f34'
    }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 4,
          fontFamily: "ubuntu",
          color: "#00ffff",
          textShadow: '0 0 10px #00ffff',
          transition: '0.3s',
          '&:hover': {
            textShadow: '0 0 20px #00ffff'
          }
        }}
      >
        See It in Action
      </Typography>
      <Typography
        variant="body1"
        align="center"
        sx={{ 
          mb: 4, 
          fontSize: "1.1rem", 
          color: "#80ffff"
        }}
      >
        Watch the video below to understand how our website works and how to use it!
      </Typography>
      <ScaleInComponent>
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: 3
        }}>
          <Box
            component="video"
            sx={{
              width: "100%",
              maxWidth: "900px",
              height: "auto",
              borderRadius: "15px",
              backgroundColor: "#001a2f",
              transition: 'all 0.3s ease',
              filter: 'brightness(1.2) drop-shadow(0 0 8px rgba(0, 255, 255, 0.4))',
              '@keyframes videoGlow': {
                '0%': { filter: 'brightness(1.2) drop-shadow(0 0 8px rgba(0, 255, 255, 0.4))' },
                '50%': { filter: 'brightness(1.3) drop-shadow(0 0 12px rgba(0, 255, 255, 0.6))' },
                '100%': { filter: 'brightness(1.2) drop-shadow(0 0 8px rgba(0, 255, 255, 0.4))' }
              },
              animation: 'videoGlow 3s infinite'
            }}
            controls
          >
            <source src="/forestfire1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </Box>
        </Box>
      </ScaleInComponent>
    </Box>
  );
};

export default Video;
