import React, { useEffect, useState } from "react";

const LocationDisplay = ({ location }) => {
  const [address, setAddress] = useState("Fetching...");

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name || "Address not found");
        })
        .catch(() => setAddress("Error fetching address"));
    } else {
      setAddress("N/A");
    }
  }, [location]);

  return (
    <p className="text-sm text-gray-400 font-semibold">Location: {address}</p>
  );
};

export default LocationDisplay;
