import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
/* HEATMAP USING LOCAL STORAGE */
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
      max: 2.0, // Increase this value to allow higher intensity levels
      minOpacity: 0.4, // Make lower intensity points more visible
      maxOpacity: 1, // Fully opaque for high-intensity points
      scaleRadius: true,
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
};

// Heatmap component
const HeatMap = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    // Retrieve incidents from localStorage
    const incidents = JSON.parse(localStorage.getItem("incidents")) || [];

    // Map the incidents to the format [latitude, longitude, intensity]
    const mappedData = incidents.map((incident) => {
      const { latitude, longitude } = incident.location;
      const intensity = incident.severity; // Use the numeric severity for intensity
      return [latitude, longitude, intensity];
    });

    setHeatmapData(mappedData);
  }, []);

  return (
    <MapContainer
      center={[18.5204, 76.8567]} // Default center coordinates (can be adjusted)
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <HeatMapLayer data={heatmapData} />
    </MapContainer>
  );
};

export default HeatMap;
