import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

/*NOT IN USE */

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
      max: 2.0,
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

// Heatmap component
const HeatMap = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  //DONT USE THIS CODE

  // useEffect(() => {
  //   // Fetch incidents from the Django backend
  //   const fetchIncidents = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:8000/api/incidents/");
  //       const incidents = await response.json();

  //       // Map the incidents to the format [latitude, longitude, intensity]
  //       const mappedData = incidents.map((incident) => {
  //         return [
  //           incident.location_latitude,
  //           incident.location_longitude,
  //           incident.severity,
  //         ];
  //       });

  //       setHeatmapData(mappedData);
  //     } catch (error) {
  //       console.error("Error fetching incidents:", error);
  //     }
  //   };

  //   fetchIncidents();
  // }, []);

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
    </MapContainer>
  );
};

export default HeatMap;
