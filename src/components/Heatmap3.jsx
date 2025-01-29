import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

// Heatmap layer component
const HeatMapLayer = ({ data }) => {
  const map = useMap();

  React.useEffect(() => {
    const heat = L.heatLayer(data, {
      radius: 25,
      blur: 20,
      maxZoom: 15,
      gradient: {
        0.3: "rgba(255, 255, 0, 1.0)", // Yellow (Low severity)
        0.6: "rgba(255, 165, 0, 1.0)", // Orange (Medium severity)
        1.0: "rgba(255, 0, 0, 1.0)", // Red (High severity)
      },
      max: 3.0, // Maximum intensity value based on severity
      minOpacity: 0.4,
      maxOpacity: 1,
      scaleRadius: true,
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
};

// Legend component for the heatmap
const Legend = () => {
  return (
    <div style={legendStyle}>
      <div style={legendItemStyle}>
        <span
          style={{
            ...colorBoxStyle,
            backgroundColor: "rgba(255, 255, 0, 1.0)", // Yellow (Low severity)
          }}
        ></span>
        Low
      </div>
      <div style={legendItemStyle}>
        <span
          style={{
            ...colorBoxStyle,
            backgroundColor: "rgba(255, 165, 0, 1.0)", // Orange (Medium severity)
          }}
        ></span>
        Medium
      </div>
      <div style={legendItemStyle}>
        <span
          style={{
            ...colorBoxStyle,
            backgroundColor: "rgba(255, 0, 0, 1.0)", // Red (High severity)
          }}
        ></span>
        High
      </div>
    </div>
  );
};

// Heatmap component
const HeatMap = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    // Fetch incidents from the Django backend
    const fetchIncidents = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/all_incidents/"
        );
        const incidents = await response.json();
        console.log("Fetched incidents:", incidents);

        // Map the incidents to the format [latitude, longitude, intensity]
        const mappedData = incidents.map((incident) => [
          incident.location_latitude,
          incident.location_longitude,
          severityToIntensity(incident.severity),
        ]);

        setHeatmapData(mappedData);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents();
  }, []);

  // Helper function to convert severity to intensity
  const severityToIntensity = (severity) => {
    switch (severity) {
      case "High":
        return 3; // High severity = intensity 3
      case "Medium":
        return 2; // Medium severity = intensity 2
      case "Low":
      default:
        return 1; // Low severity = intensity 1
    }
  };

  return (
    <MapContainer
      center={[22.1309, 78.6677]}
      zoom={7}
      style={{ height: "100vh", width: "100%" }} // Ensure map has height and width
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {heatmapData.length > 0 && <HeatMapLayer data={heatmapData} />}
      <Legend />
    </MapContainer>
  );
};

// Styles for the legend
const legendStyle = {
  position: "absolute",
  bottom: "20px",
  left: "20px",
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: 999,
  fontSize: "14px",
};

const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "5px",
};

const colorBoxStyle = {
  width: "20px",
  height: "20px",
  marginRight: "10px",
  borderRadius: "2px",
};

export default HeatMap;
