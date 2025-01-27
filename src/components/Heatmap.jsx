import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import Footer from "./Footer";
import ScaleInComponent from "@/lib/ScaleInComponent";
import { useEffect } from "react";

/*STATIC HEATMAP*/
const HeatMapLayer = ({ data, incidents }) => {
  const map = useMap();

  useEffect(() => {
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

    // Handling click event to display incident details
    heat.on("click", (event) => {
      const { lat, lng } = event.latlng; // Get clicked latitude and longitude
      const clickedIncident = incidents.find(
        (incident) =>
          incident.location_latitude === lat &&
          incident.location_longitude === lng
      );

      if (clickedIncident) {
        L.popup()
          .setLatLng([lat, lng])
          .setContent(
            `<b>Incident:</b> ${clickedIncident.title} <br />
            <b>Status:</b> ${clickedIncident.status} <br />
            <b>Severity:</b> ${clickedIncident.severity} <br />
            <b>Description:</b> ${clickedIncident.description}`
          )
          .openOn(map);
      }
    });

    // Optional: Handling mouse hover event to display a tooltip
    heat.on("mouseover", (event) => {
      const { lat, lng } = event.latlng;
      const hoveredIncident = incidents.find(
        (incident) =>
          incident.location_latitude === lat &&
          incident.location_longitude === lng
      );

      if (hoveredIncident) {
        L.tooltip()
          .setLatLng([lat, lng])
          .setContent(`<b>Severity:</b> ${hoveredIncident.severity}`)
          .addTo(map);
      }
    });

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data, incidents]);

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

const HeatMap = () => {
  // Sample data: [latitude, longitude, intensity]
  const heatmapData = [
    // Pune (High intensity, red)
    [18.5204, 73.8567, 1], // Pune
    [18.521, 73.858, 1],
    [18.5205, 73.8575, 0.9],
    [18.52, 73.8555, 0.8],
    [18.522, 73.86, 1],
    [18.522, 73.86, 1],
    [18.523, 73.855, 1],
    [18.5185, 73.854, 0.9],

    // Mumbai (Medium intensity, yellow)
    [19.076, 72.8777, 0.6], // Mumbai
    [19.0765, 72.878, 0.7], // Mumbai
    [19.077, 72.875, 0.5], // Mumbai
    [19.05, 72.85, 0.8], // Mumbai

    // Nagpur (Medium intensity, yellow)
    [21.1458, 79.0882, 0.5], // Nagpur
    [21.15, 79.1, 0.4], // Nagpur
    [21.16, 79.08, 0.3], // Nagpur
    [21.14, 79.1, 0.6], // Nagpur

    // Solapur (Low intensity, green)
    [17.6599, 75.9164, 0.4], // Solapur
    [17.6599, 75.9074, 0.3], // Solapur
    [17.6199, 75.9064, 0.2], // Solapur
    [17.799, 75.9064, 0.2], // Solapur

    // Aurangabad (Medium intensity, yellow)
    [19.8762, 75.3445, 0.5], // Aurangabad
    [19.88, 75.34, 0.4], // Aurangabad
    [19.87, 75.35, 0.6], // Aurangabad

    // Nashik (Medium intensity, yellow)
    [19.9975, 73.7898, 0.5], // Nashik
    [20.003, 73.79, 0.6], // Nashik
    [20.01, 73.785, 0.4], // Nashik

    // Akola (Low intensity, green)
    [20.7062, 77.0209, 0.3], // Akola
    [20.705, 77.02, 0.2], // Akola
    [20.71, 77.03, 0.4], // Akola

    // Kolhapur (Medium intensity, yellow)
    [16.701, 74.2437, 0.5], // Kolhapur
    [16.705, 74.24, 0.6], // Kolhapur
    [16.707, 74.238, 0.4], // Kolhapur

    // Thane (Medium intensity, yellow)
    [19.2183, 72.9786, 0.5], // Thane
    [19.22, 72.97, 0.4], // Thane
    [19.225, 72.98, 0.6], // Thane

    // Other regions with lower intensity (non-red areas)
    [19.4, 74.8, 0.5], // Ratnagiri (Medium intensity, yellow)
    [18.0, 75.0, 0.3], // Sangli (Low intensity, green)
    [17.8, 74.8, 0.7], // Jalgaon (High intensity, red)

    // Smaller towns and rural areas
    [20.2, 74.5, 0.4], // Chandrapur
    [20.9, 75.7, 0.6], // Washim
    [17.8, 74.0, 0.3], // Latur
    [18.5, 76.2, 0.4], // Nanded
    [19.3, 75.4, 0.5], // Wardha
    [19.1, 74.0, 0.3], // Beed
    [17.5, 74.5, 0.3], // Osmanabad
    [16.9, 74.3, 0.2], // Satara
    [20.4, 75.9, 0.5], // Yavatmal
    [19.7, 73.6, 0.4], // Palghar
    [20.1, 76.2, 0.6], // Buldhana
    [17.5, 75.0, 0.2], // Parbhani
    [19.6, 75.2, 0.3], // Hingoli
    [21.3, 78.0, 0.6], // Chanda (Chandrapur)
    [18.1, 75.4, 0.5], // Jalna

    // Additional regions

    // Bangalore (Medium intensity, yellow)
    [12.9716, 77.5946, 0.7], // Bangalore
    [12.975, 77.6, 0.8], // Bangalore
    [12.98, 77.58, 0.6], // Bangalore

    // Chennai (High intensity, red)
    [13.0827, 80.2707, 1], // Chennai
    [13.0835, 80.277, 0.9], // Chennai
    [13.085, 80.27, 0.8], // Chennai

    // Delhi (Medium intensity, yellow)
    [28.6139, 77.209, 0.6], // Delhi
    [28.62, 77.21, 0.7], // Delhi
    [28.6, 77.2, 0.5], // Delhi

    // Hyderabad (Medium intensity, yellow)
    [17.385, 78.4867, 0.5], // Hyderabad
    [17.39, 78.48, 0.6], // Hyderabad
    [17.38, 78.47, 0.4], // Hyderabad

    // Ahmedabad (Medium intensity, yellow)
    [23.0225, 72.5714, 0.6], // Ahmedabad
    [23.027, 72.575, 0.7], // Ahmedabad
    [23.021, 72.57, 0.5], // Ahmedabad

    // Jaipur (Low intensity, green)
    [26.9124, 75.7873, 0.3], // Jaipur
    [26.91, 75.79, 0.4], // Jaipur
    [26.91, 75.78, 0.2], // Jaipur

    // Lucknow (Medium intensity, yellow)
    [26.8467, 80.9462, 0.6], // Lucknow
    [26.85, 80.95, 0.5], // Lucknow
    [26.84, 80.94, 0.7], // Lucknow

    // Kanpur (Low intensity, green)
    [26.4499, 80.3319, 0.3], // Kanpur
    [26.45, 80.33, 0.4], // Kanpur
    [26.44, 80.33, 0.2], // Kanpur

    // Patna (Low intensity, green)
    [25.5941, 85.1376, 0.4], // Patna
    [25.59, 85.14, 0.3], // Patna
    [25.6, 85.13, 0.5], // Patna

    // Surat (Medium intensity, yellow)
    [21.1702, 72.8311, 0.6], // Surat
    [21.18, 72.83, 0.7], // Surat
    [21.17, 72.82, 0.5], // Surat

    // Pune (High intensity, red)
    [18.5204, 73.8567, 1], // Pune
    [18.52, 73.858, 0.9], // Pune
    [18.519, 73.8575, 1], // Pune

    [12.9716, 77.5946, 0.7], // Bangalore
    [12.975, 77.6, 0.8], // Bangalore
    [12.98, 77.58, 0.6], // Bangalore

    // Chennai (High intensity, red)
    [13.0827, 80.2707, 1], // Chennai
    [13.0835, 80.277, 0.9], // Chennai
    [13.085, 80.27, 0.8], // Chennai

    // Delhi (Medium intensity, yellow)
    [28.6139, 77.209, 0.6], // Delhi
    [28.62, 77.21, 0.7], // Delhi
    [28.6, 77.2, 0.5], // Delhi

    // Hyderabad (Medium intensity, yellow)
    [17.385, 78.4867, 0.5], // Hyderabad
    [17.39, 78.48, 0.6], // Hyderabad
    [17.38, 78.47, 0.4], // Hyderabad

    // Ahmedabad (Medium intensity, yellow)
    [23.0225, 72.5714, 0.6], // Ahmedabad
    [23.027, 72.575, 0.7], // Ahmedabad
    [23.021, 72.57, 0.5], // Ahmedabad

    // Jaipur (Low intensity, green)
    [26.9124, 75.7873, 0.3], // Jaipur
    [26.91, 75.79, 0.4], // Jaipur
    [26.91, 75.78, 0.2], // Jaipur

    // Lucknow (Medium intensity, yellow)
    [26.8467, 80.9462, 0.6], // Lucknow
    [26.85, 80.95, 0.5], // Lucknow
    [26.84, 80.94, 0.7], // Lucknow

    // Kanpur (Low intensity, green)
    [26.4499, 80.3319, 0.3], // Kanpur
    [26.45, 80.33, 0.4], // Kanpur
    [26.44, 80.33, 0.2], // Kanpur

    // Patna (Low intensity, green)
    [25.5941, 85.1376, 0.4], // Patna
    [25.59, 85.14, 0.3], // Patna
    [25.6, 85.13, 0.5], // Patna

    // Surat (Medium intensity, yellow)
    [21.1702, 72.8311, 0.6], // Surat
    [21.18, 72.83, 0.7], // Surat
    [21.17, 72.82, 0.5], // Surat

    // Pune (High intensity, red)
    [18.5204, 73.8567, 1], // Pune
    [18.52, 73.858, 0.9], // Pune
    [18.519, 73.8575, 1], // Pune

    // Additional Data points (100 points)
    [15.2993, 74.124, 0.4], // Mangalore
    [15.318, 74.227, 0.5], // Mangalore
    [15.325, 74.225, 0.6], // Mangalore
    [20.7987, 85.8311, 0.7], // Bhubaneswar
    [20.801, 85.832, 0.8], // Bhubaneswar
    [20.803, 85.834, 0.6], // Bhubaneswar
    [19.3191, 84.7913, 0.5], // Rourkela
    [19.325, 84.792, 0.4], // Rourkela
    [19.31, 84.785, 0.6], // Rourkela
    [25.4375, 81.8463, 0.5], // Varanasi
    [25.45, 81.85, 0.6], // Varanasi
    [25.46, 81.83, 0.7], // Varanasi
    [13.092, 80.217, 0.3], // Tirunelveli
    [13.085, 80.22, 0.4], // Tirunelveli
    [13.09, 80.23, 0.5], // Tirunelveli
    [28.4595, 77.0266, 0.8], // Noida
    [28.45, 77.03, 0.7], // Noida
    [28.47, 77.04, 0.6], // Noida
    [22.3039, 70.8022, 0.6], // Rajkot
    [22.31, 70.8, 0.5], // Rajkot
    [22.29, 70.78, 0.4], // Rajkot
    [15.3647, 73.931, 0.5], // Panaji
    [15.37, 73.94, 0.6], // Panaji
    [15.36, 73.93, 0.7], // Panaji
    [19.3002, 84.7915, 0.4], // Jamshedpur
    [19.305, 84.795, 0.5], // Jamshedpur
    [19.31, 84.79, 0.6], // Jamshedpur
    [17.9784, 77.5911, 0.5], // Secunderabad
    [17.97, 77.6, 0.6], // Secunderabad
    [17.96, 77.59, 0.7], // Secunderabad
    [26.3735, 80.264, 0.7], // Allahabad
    [26.36, 80.27, 0.8], // Allahabad
    [26.35, 80.26, 0.9], // Allahabad
    [15.787, 74.7535, 0.4], // Udupi
    [15.8, 74.75, 0.5], // Udupi
    [15.78, 74.74, 0.6], // Udupi
    [30.7333, 76.7794, 0.6], // Chandigarh
    [30.73, 76.78, 0.5], // Chandigarh
    [30.72, 76.77, 0.7], // Chandigarh
    [26.8206, 80.94, 0.5], // Gorakhpur
    [26.83, 80.93, 0.6], // Gorakhpur
    [26.82, 80.92, 0.7], // Gorakhpur
    [16.8315, 80.4397, 0.7], // Vijayawada
    [16.82, 80.45, 0.6], // Vijayawada
    [16.81, 80.43, 0.5], // Vijayawada
    [29.0588, 77.0433, 0.5], // Roorkee
    [29.06, 77.04, 0.6], // Roorkee
    [29.05, 77.05, 0.7], // Roorkee
    [12.9667, 77.75, 0.8], // Mysore
    [12.97, 77.76, 0.7], // Mysore
    [12.96, 77.74, 0.9], // Mysore
    [22.5726, 88.3639, 0.5], // Kolkata
    [22.58, 88.36, 0.6], // Kolkata
    [22.57, 88.35, 0.7], // Kolkata
    [26.824, 80.937, 0.6], // Lucknow
    [26.81, 80.93, 0.5], // Lucknow
    [26.79, 80.92, 0.7], // Lucknow
    [12.935, 77.615, 0.5], // Tumkur
    [12.93, 77.61, 0.4], // Tumkur
    [12.92, 77.61, 0.6], // Tumkur
    [28.692, 77.182, 0.5], // Ghaziabad
    [28.7, 77.18, 0.6], // Ghaziabad
    [28.69, 77.19, 0.7], // Ghaziabad
    [21.125, 72.697, 0.4], // Vadodara
    [21.13, 72.69, 0.5], // Vadodara
    [21.14, 72.7, 0.6], // Vadodara
    [28.6139, 77.209, 3], // Delhi
    [28.6, 77.21, 4],
    [28.62, 77.215, 2],
    [22.5726, 88.3639, 5], // Kolkata
    [22.58, 88.37, 4],
    [22.56, 88.355, 3],
    [28.6139, 77.209, 3],
    [28.6, 77.21, 4],
    [28.62, 77.215, 2],
    [30.7333, 76.7794, 4],
    [30.7358, 76.7862, 3],
    [26.9124, 75.7873, 5],
    [26.92, 75.8, 3],
    [22.5726, 88.3639, 5],
    [22.58, 88.37, 4],
    [22.56, 88.355, 3],
    [20.2961, 85.8189, 3],
    [20.3089, 85.8183, 2],
    [25.5941, 85.1376, 4],
    [25.6, 85.14, 3],
  ];

  return (
    <>
      <ScaleInComponent>
        <div className="min-h-screen bg-gray-100 p-6">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
            Heatmap Visualization
          </h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our interactive heatmap to identify high-risk areas based on
            real-time incident reports. The heatmap uses color-coded zones to
            highlight regions with frequent safety concerns, helping you stay
            informed and cautious. Stay safe by avoiding red zones or reporting
            any new incidents directly from the map.
          </p>
          <div className="max-w-4xl h-auto mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Geographic Heatmap
            </h2>
            <div className="relative h-[500px] overflow-hidden rounded-lg">
              <MapContainer
                role="region"
                aria-label="Heatmap of incidents"
                center={[22.1309, 78.6677]} //18.5204, 76.8567
                zoom={5} //7
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <HeatMapLayer data={heatmapData} />
                <Legend /> {/* Add the Legend to the map */}
              </MapContainer>
            </div>
          </div>
        </div>
      </ScaleInComponent>

      <Footer />
    </>
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
