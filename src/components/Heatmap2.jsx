import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import Legend from "./Legend";

// Custom marker icon for police stations
const policeStationIcon = new L.Icon({
  iconUrl:
    "https://tse1.mm.bing.net/th?id=OIP.oVCuLP_ERzy8yJFGJc4t4QHaHa&pid=Api&P=0&h=180",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Custom marker icon for user location
const userLocationIcon = new L.Icon({
  iconUrl: "https://static.thenounproject.com/png/3859353-200.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Component to handle marker visibility based on zoom level
const PoliceStations = ({ policeStations }) => {
  const [isVisible, setIsVisible] = useState(false);
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      const zoomLevel = map.getZoom();
      setIsVisible(zoomLevel > 12); // Markers visible only when zoom is > 12
    };

    map.on("zoomend", handleZoom);
    handleZoom(); // Initialize visibility on component mount

    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map]);

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setUserLocation([
  //           position.coords.latitude,
  //           position.coords.longitude,
  //         ]);
  //       },
  //       (error) => console.error("Error fetching location:", error),
  //       { enableHighAccuracy: true }
  //     );
  //   }
  // }, []);

  return (
    <>
      {isVisible &&
        policeStations.map((station, index) => (
          <Marker
            key={index}
            position={[station.lat, station.lng]}
            icon={policeStationIcon}
          >
            <Popup>{station.name}</Popup>
          </Marker>
        ))}
    </>
  );
};

// Heatmap layer component
const HeatMapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    const heat = L.heatLayer(data, {
      radius: 25,
      blur: 20,
      maxZoom: 15,
      gradient: {
        0.3: "rgba(255, 255, 0, 1.0)", // Yellow (Low severity)
        0.6: "rgba(255, 165, 0, 1.0)", // Orange (Medium severity)
        1.0: "rgba(255, 0, 0, 1.0)", // Red (High severity)
      },
      max: 1.0,
      minOpacity: 0.4,
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
};

// Main Heatmap component
const HeatMap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);

  // Get coordinates from localStorage or use default
  const getCoordinates = () => {
    try {
      const coordinates = JSON.parse(localStorage.getItem("userCoordinates"));
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        return [coordinates.latitude, coordinates.longitude];
      }
    } catch (error) {
      console.error("Error parsing user coordinates from localStorage:", error);
    }
    // Default coordinates (e.g., Pune)
    return [18.4576, 73.8507];
  };

  const userCoordinates = getCoordinates();

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
  // Fetch police stations from Overpass API (within 10km radius of user coordinates)
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[%22amenity%22=%22police%22](around:10000,${userCoordinates[0]},${userCoordinates[1]});out;`;
  useEffect(() => {
    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        const stations = data.elements.map((element) => ({
          lat: element.lat,
          lng: element.lon,
          name: element.tags.name || "Police Station",
        }));
        setPoliceStations(stations);
      })
      .catch((error) =>
        console.error("Error fetching police stations:", error)
      );
  }, [userCoordinates]);

  return (
    <MapContainer
      center={userCoordinates} // Use coordinates from localStorage or default
      zoom={15} // Default zoom level
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={userCoordinates} icon={userLocationIcon}>
        <Popup>You are here!</Popup>
      </Marker>
      <HeatMapLayer data={heatmapData} />
      <PoliceStations policeStations={policeStations} />
      <Legend />
    </MapContainer>
  );
};

export default HeatMap;
