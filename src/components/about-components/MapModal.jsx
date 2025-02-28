import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

const userLocationIcon = L.icon({
  iconUrl: "https://static.thenounproject.com/png/3859353-200.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const MapModal = ({ isOpen, onClose, onSelectLocation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [popupOpened, setPopupOpened] = useState(false);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    console.log("Updated coordinates:", userLocation);
  }, [userLocation]); // Logs the updated value whenever userLocation changes
  
  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (userLocation) {
        map.setView(userLocation, 15);
        if (!popupOpened && userMarkerRef.current) {
          userMarkerRef.current.openPopup();
          setPopupOpened(true);
        }
      }
    }, [userLocation, map, popupOpened]);

    useMapEvents({
      click(e) {
        setSelectedLocation([e.latlng.lat, e.latlng.lng]);
      },
    });

    return (
      <>
        {userLocation && (
          <Marker
            position={userLocation}
            icon={userLocationIcon}
            ref={userMarkerRef}
          >
            <Popup>📍 This is your current location.</Popup>
          </Marker>
        )}
        {selectedLocation && (
          <Marker position={selectedLocation}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}
      </>
    );
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
    }
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-[#1a2238] rounded-2xl p-8 shadow-[inset_-3px_-3px_12px_cyan,inset_3px_3px_12px_cyan]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Select Incident Location
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a2238] shadow-[inset_-4px_-4px_8px_#151b2d,inset_4px_4px_8px_#1f2943] text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            X
          </button>
        </div>

        {/* Map Container with Neuromorphic Border */}
        <div className="rounded-xl bg-[#1a2238] p-1 shadow-[inset_-8px_-8px_16px_#151b2d,inset_8px_8px_16px_#1f2943]">
          <MapContainer
            center={userLocation || [20, 78]}
            zoom={userLocation ? 15 : 5}
            className="h-96 w-full rounded-lg overflow-hidden"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300
              ${
                selectedLocation
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25"
                  : "bg-[#1a2238] text-gray-500 shadow-[inset_-4px_-4px_8px_#151b2d,inset_4px_4px_8px_#1f2943]"
              }`}
          >
            Confirm Location
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-semibold bg-[#1a2238] text-cyan-400 shadow-[inset_-4px_-4px_8px_#151b2d,inset_4px_4px_8px_#1f2943] hover:text-cyan-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default MapModal;
