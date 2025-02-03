import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import FloatingChatbot from "@/components/FloatingChatbot";

function IncidentList() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/latest-incidents/");
        console.log("Fetched Incidents:", response.data); // Debugging
        setIncidents(response.data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    }

    fetchIncidents();
  }, []);

  return (
    <>
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#003366",
          mb: 4,
        }}
      >
        Latest Incidents
      </Typography>

      <Grid container spacing={4}>
        {incidents.map((incident, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card
              sx={{
                boxShadow: 4,
                borderRadius: 3,
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{ height: "200px", objectFit: "cover" }}
                image={incident.image || "https://via.placeholder.com/200"}
                alt={incident.title || "Incident"}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#003366", mb: 1 }}
                >
                  {incident.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Reported by {incident.reporter} on {incident.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {incident.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    <FloatingChatbot/>
    </>
  );
}

export default IncidentList;
