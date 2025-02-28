import { useEffect, useState } from "react";

const useUserLocation = () => {
  const [location, setLocation] = useState(() => {
    // Get stored location from localStorage
    const storedLocation = localStorage.getItem("userCoordinates");
    return storedLocation ? JSON.parse(storedLocation) : null;
  });

  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(coords);
          console.log(coords);
          localStorage.setItem("userCoordinates", JSON.stringify(coords));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    };

    // If location is not available in state, fetch again
    if (!location) {
      getLocation();
    }
  }, [location]); // Dependency ensures re-run if location is null

  return location;
};

export default useUserLocation;
