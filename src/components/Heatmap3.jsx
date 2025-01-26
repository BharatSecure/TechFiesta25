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
        0.3: "rgba(255, 255, 0, 1.0)", // Yellow (Medium severity)
        0.6: "rgba(255, 165, 0, 1.0)", // Orange (Medium-high severity)
        1.0: "rgba(255, 0, 0, 1.0)", // Red (High severity)
      },
      max: 3.0, // Maximum intensity value based on severity (High = 3)
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
            backgroundColor: "rgba(255, 255, 0, 1.0)", // Yellow
          }}
        ></span>
        Low
      </div>
      <div style={legendItemStyle}>
        <span
          style={{
            ...colorBoxStyle,
            backgroundColor: "rgba(255, 165, 0, 1.0)", // Orange
          }}
        ></span>
        Medium
      </div>
      <div style={legendItemStyle}>
        <span
          style={{
            ...colorBoxStyle,
            backgroundColor: "rgba(255, 0, 0, 1.0)", // Red
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
        const response = await fetch("http://127.0.0.1:8000/api/incidents/");
        const incidents = await response.json();

        // Map the incidents to the format [latitude, longitude, intensity]
        const mappedData = incidents.map((incident) => {
          return [
            incident.location_latitude,
            incident.location_longitude,
            severityToIntensity(incident.severity),
          ];
        });

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
      center={[22.1309, 78.6677]} // Default center coordinates (adjust as needed)
      zoom={7}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <HeatMapLayer data={heatmapData} />
      <Legend /> {/* Add the Legend to the map */}
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
