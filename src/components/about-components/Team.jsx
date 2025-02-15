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
import shaneImage from "@/assets/Shane.jpeg"; 

const dummy_address =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACUCAMAAABGFyDbAAAAMFBMVEXk5ueutLepsLPZ3N7n6erIzM7P0tTq7O2yuLvBxsje4eLV2NrR1da2u767wMPEycvljgLtAAADY0lEQVR4nO2byXLbMAxAuYDiou3//7akXLfxIosABciZ4bskMz3kDQiBC1ClOp1Op9PpdDqdTqfT6XR+DQDPv1wOeGUHF5dMjG6yX2EGaopaa6Nv5J8hWnWxGaR1vhv9x4ThWrGoX6VuXCcGbleqRGy8xAvSsut0I15hZQ+kcsDmJG41HVoVkuxCwrSfVQ9YSS8Y6qRKvAStxspYZYKcVwrVVlrPUsvoZ4SVNk7GC4b6JdwYRbSOC9YTQSJc/qi4v2AGfi+wyCXUMl8jOlgiWY/OrA1uLYj4Nczh4j7kAMVK64XZCrHt/IQ56YGQ8AUzsWop1L7zg8iaXLTvsOA5tYiplVeR0wocWctyakWiVc55xuTCnbQe4Nx/POZY+gjnp+ipqZXrfNfqWh+1vjTlv7NA0A6BBdZy+qWbT8NWzXuwIec868GGch3bgsV7DKQeIQzvOwTlTl3gvlcT6zxnjS/QSgT79ZV4yeD9DhUt6c3AbaVU+s6HJI/eF1n3w38kdLBE3nTRT7pCL/OwYLykHsAV7oFkYS8OdzBbkGBzRcFYrSXaG65+FRRt3NXGK4j30SF96J/fMItw8/XG0e4oVxkegOnjwIFwWv3wgjW8FzNBZB/cFUvuVcyYebp8ygZsnENW+Wukw+wuyfQXQNlxWMukVHTD+B2DUgXY8N5vP6+2UUXIg0o5WIPbGHK0bMqG132F+boxuvh6+y+TZcs62iQ+kQc+jW6ZjdmtW/mfstuQxMzyH7Ku/sC1jkqgWOR6sM77QXoXtxCZq1jO7oH2ksQ4xQh+3B8FPIzZwjMsCGp8MzOJIbjTxcBPqOvO+4jNZ4tZ4ivgM+HE1whIa3Ok7pjltGNY/TWnSuyUlQRFbhHsec3tAQO7c/5sovWUXz3IicO0DfDSezxHhBYtNqvsRU4waCzrnzHUE397Xf8MKV5Ab2nWQokXY17dwb99wXn7zScvZLioU21IsP081DB1ixdqUrahg4/1wiwh9uW9AcSMpdQSblQPM+K7Ok1Uv9uLWtVmPX3SjsZcFyvRzNK1TVDJz/DGXJNdDcNQREzN1kho+rayHic9OHGrqqQ/6f6MoeKAI/0dFiomcOgz3g1ax/dGmYPWE4eNY/qYXQuHlQsWcwWHBdVegcx/fut0Op1O5xfyBzfiKaWdaPkVAAAAAElFTkSuQmCC";

const teamMembers = [
  {
    id: 1,
    name: "Jacell Jamble",
    role: "Team Lead",
    imageUrl: `https://avatars.githubusercontent.com/u/160160322?v=4`,
    github: "https://github.com/JACELL100",
    linkedin: "https://linkedin.com/in/jacell-jamble-8236ba286",
  },
  {
    id: 2,
    name: "Shane Dias",
    role: "Frontend Developer",
    imageUrl: shaneImage,
    github: "https://github.com/Shane-Dias",
    linkedin: "https://linkedin.com/in/shane-dias-28a112291",
  },
  {
    id: 3,
    name: "Serene Dmello",
    role: "Frontend Developer",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4E03AQEGB1vC5LwMkg/profile-displayphoto-shrink_400_400/B4EZQq45.WGYAg-/0/1735886348752?e=1743033600&v=beta&t=yI4YH5I9djbfBb0lNURIzm2B7B79A_2mQZ2YkhU4sfo",
    github: "https://github.com/ubet123",
    linkedin: "https://linkedin.com/in/serene-dmello-572605344",
  },
  {
    id: 4,
    name: "Mayank Methta",
    role: "Backend Developer",
    imageUrl: dummy_address,
    github: "https://github.com/code-runner1306",
    linkedin: "https://www.linkedin.com/in/mayank-mehta-4b94312a0/",
  },
  {
    id: 5,
    name: "Mayank Bhuvad",
    role: "Backend Developer",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4D03AQE_yJscow4VgQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1723180346508?e=1743638400&v=beta&t=jLvwhOlX9YK42kZ4mhe85gnmHue0VQVouJ3zeryWb-A",
    github: "https://github.com/ImpactG1",
    linkedin: "https://www.linkedin.com/in/mayank-bhuvad-29b808296/",
  },
];

const MeetTheTeam = () => {
  return (
    <Box sx={{ 
      py: 6, 
      px: 2,
      background: '#001a2f'
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
        Meet the Team
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {teamMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={member.id}>
            <Card
              sx={{
                textAlign: "center",
                background: '#002240',
                transition: 'all 0.3s ease',
                boxShadow: '8px 8px 16px #001527, -8px -8px 16px #002f59',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '12px 12px 24px #001527, -12px -12px 24px #002f59, 0 0 20px rgba(0, 255, 255, 0.2)'
                }
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  filter: 'brightness(0.9)',
                  transition: '0.3s',
                  '&:hover': {
                    filter: 'brightness(1.1)',
                  }
                }}
                image={member.imageUrl}
                alt={member.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = dummy_address;
                }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: "bold",
                  color: '#00ffff',
                  textShadow: '0 0 5px rgba(0, 255, 255, 0.3)'
                }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#80ffff' }}>
                  {member.role}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <IconButton
                    href={member.github}
                    target="_blank"
                    sx={{ 
                      color: '#00ffff',
                      '&:hover': {
                        color: '#80ffff',
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <GitHub />
                  </IconButton>
                  <IconButton
                    href={member.linkedin}
                    target="_blank"
                    sx={{ 
                      color: '#00ffff',
                      '&:hover': {
                        color: '#80ffff',
                        transform: 'scale(1.1)',
                      }
                    }}
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
