import React from "react";
import { Box, Typography, Container } from "@mui/material";
import ScaleInComponent from "@/lib/ScaleInComponent";

const Video = () => {
  return (
    <Container sx={{ py: 6, background: "#f0f0f0" }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 4,
          fontFamily: "ubuntu",
          color: "#003366",
        }}
      >
        See It in Action
      </Typography>
      <Typography
        variant="body1"
        align="center"
        sx={{ mb: 4, fontSize: "1.1rem", color: "#666" }}
      >
        Watch the video below to understand how our website works and how to use
        it!
      </Typography>
      <ScaleInComponent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            component="video"
            sx={{
              width: "100%",
              maxWidth: "900px",
              height: "550px",
              border: "none",
              boxShadow: 3,
              backgroundColor: "#000",
            }}
            controls
          >
            {/* Replace with your local video URL or hosted video URL */}
            <source src="/forestfire1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </Box>
        </Box>
      </ScaleInComponent>
    </Container>
  );
};

export default Video;
