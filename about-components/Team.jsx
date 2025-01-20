import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";

const dummy_address =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACUCAMAAABGFyDbAAAAMFBMVEXk5ueutLepsLPZ3N7n6erIzM7P0tTq7O2yuLvBxsje4eLV2NrR1da2u767wMPEycvljgLtAAADY0lEQVR4nO2byXLbMAxAuYDiou3//7akXLfxIosABciZ4bskMz3kDQiBC1ClOp1Op9PpdDqdTqfT6XR+DQDPv1wOeGUHF5dMjG6yX2EGaopaa6Nv5J8hWnWxGaR1vhv9x4ThWrGoX6VuXCcGbleqRGy8xAvSsut0I15hZQ+kcsDmJG41HVoVkuxCwrSfVQ9YSS8Y6qRKvAStxspYZYKcVwrVVlrPUsvoZ4SVNk7GC4b6JdwYRbSOC9YTQSJc/qi4v2AGfi+wyCXUMl8jOlgiWY/OrA1uLYj4Nczh4j7kAMVK64XZCrHt/IQ56YGQ8AUzsWop1L7zg8iaXLTvsOA5tYiplVeR0wocWctyakWiVc55xuTCnbQe4Nx/POZY+gjnp+ipqZXrfNfqWh+1vjTlv7NA0A6BBdZy+qWbT8NWzXuwIec868GGch3bgsV7DKQeIQzvOwTlTl3gvlcT6zxnjS/QSgT79ZV4yeD9DhUt6c3AbaVU+s6HJI/eF1n3w38kdLBE3nTRT7pCL/OwYLykHsAV7oFkYS8OdzBbkGBzRcFYrSXaG65+FRRt3NXGK4j30SF96J/fMItw8/XG0e4oVxkegOnjwIFwWv3wgjW8FzNBZB/cFUvuVcyYebp8ygZsnENW+Wukw+wuyfQXQNlxWMukVHTD+B2DUgXY8N5vP6+2UUXIg0o5WIPbGHK0bMqG132F+boxuvh6+y+TZcs62iQ+kQc+jW6ZjdmtW/mfstuQxMzyH7Ku/sC1jkqgWOR6sM77QXoXtxCZq1jO7oH2ksQ4xQh+3B8FPIzZwjMsCGp8MzOJIbjTxcBPqOvO+4jNZ4tZ4ivgM+HE1whIa3Ok7pjltGNY/TWnSuyUlQRFbhHsec3tAQO7c/5sovWUXz3IicO0DfDSezxHhBYtNqvsRU4waCzrnzHUE397Xf8MKV5Ab2nWQokXY17dwb99wXn7zScvZLioU21IsP081DB1ixdqUrahg4/1wiwh9uW9AcSMpdQSblQPM+K7Ok1Uv9uLWtVmPX3SjsZcFyvRzNK1TVDJz/DGXJNdDcNQREzN1kho+rayHic9OHGrqqQ/6f6MoeKAI/0dFiomcOgz3g1ax/dGmYPWE4eNY/qYXQuHlQsWcwWHBdVegcx/fut0Op1O5xfyBzfiKaWdaPkVAAAAAElFTkSuQmCC";

const teamMembers = [
  {
    id: 1,
    name: "Jacell Jamble",
    role: "UI/UX Designer",
    imageUrl: dummy_address,
    github: "https://github.com/JACELL100",
    linkedin: "https://linkedin.com/in/jacelljamble",
  },
  {
    id: 2,
    name: "Shane Dias",
    role: "Frontend Developer",
    imageUrl: dummy_address,
    github: "https://github.com/Shane-Dias",
    linkedin: "https://linkedin.com/in/shanedias",
  },
  {
    id: 3,
    name: "Serene Dmello",
    role: "Frontend Developer",
    imageUrl: dummy_address,
    github: "https://github.com/ubet123",
    linkedin: "https://linkedin.com/in/serenedmello",
  },
  {
    id: 4,
    name: "Mayank Methta",
    role: "Backend Developer",
    imageUrl: dummy_address,
    github: "https://github.com/code-runner1306",
    linkedin: "https://linkedin.com/in/mayankmethta",
  },
  {
    id: 5,
    name: "Mayank Bhuvad",
    role: "Backend Developer",
    imageUrl: dummy_address,
    github: "https://github.com/ImpactG1",
    linkedin: "https://linkedin.com/in/mayankbhuvad",
  },
];

const MeetTheTeam = () => {
  return (
    <Box sx={{ py: 6, px: 2 }}>
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
        Meet the Team
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {teamMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={member.id}>
            <Card
              sx={{
                textAlign: "center",
                boxShadow: 3,
                backgroundColor: "#f9f9f9",
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: "100%", height: 150, objectFit: "cover" }}
                image={member.imageUrl}
                alt={member.name}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <IconButton
                    href={member.github}
                    target="_blank"
                    sx={{ color: "inherit" }}
                  >
                    <GitHub />
                  </IconButton>
                  <IconButton
                    href={member.linkedin}
                    target="_blank"
                    sx={{ color: "inherit" }}
                  >
                    <LinkedIn />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MeetTheTeam;
