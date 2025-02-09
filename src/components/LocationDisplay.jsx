import React, { useEffect, useState } from "react";

const LocationDisplay = ({ location }) => {
  const [address, setAddress] = useState("Fetching...");

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      const timeout = setTimeout(() => {
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
        )
          .then((res) => res.json())
          .then((data) => {
            setAddress(
              data.display_name || `${location.latitude}, ${location.longitude}`
            );
          })
          .catch(() =>
            setAddress(`${location.latitude}, ${location.longitude}`)
          );
      }, 1000); // 1-second delay

      return () => clearTimeout(timeout); // Cleanup on unmount
    } else {
      setAddress("N/A");
    }
  }, [location]);

  return (
    <p className="text-sm text-gray-400 font-semibold">Location: {address} </p>
  );
};

export default LocationDisplay;
