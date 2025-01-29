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
      <div style={legendItemWithLogoStyle}>
        <img
          src="https://tse1.mm.bing.net/th?id=OIP.oVCuLP_ERzy8yJFGJc4t4QHaHa&pid=Api&P=0&h=180" // Police logo URL
          alt="Police Logo"
          style={iconStyle}
        />
        Police
      </div>
      <div style={legendItemWithLogoStyle}>
        <img
          src="https://tse1.mm.bing.net/th?id=OIP.mK4UTLLTl9D2i8HOVQBaMAHaHa&pid=Api&P=0&h=180" // Medical logo URL
          alt="Medical Logo"
          style={iconStyle}
        />
        Medical
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
          incident.location.latitude,
          incident.location.longitude,
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
      case "high":
        return 3; // High severity = intensity 3
      case "medium":
        return 2; // Medium severity = intensity 2
      case "low":
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
  top: "60px", // Position it at the top
  right: "30px", // Position it on the right side
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: 999,
  fontSize: "14px",
  width: "150px", // Control the width of the legend for better alignment
};

// Styling for legend items without logos
const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "5px",
};

// Styling for legend items with logos (Police and Medical)
const legendItemWithLogoStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "5px",
};

// Styling for color boxes
const colorBoxStyle = {
  width: "20px",
  height: "20px",
  marginRight: "10px",
  borderRadius: "2px",
};

// Styling for the icons/logos
const iconStyle = {
  width: "20px",
  height: "20px",
  marginRight: "10px", // Space between logo and text
};

export default HeatMap;
