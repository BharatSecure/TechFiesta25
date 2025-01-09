import React, { useEffect } from "react";

const Home = () => {

  useEffect(() => {
    // Check if the user has already been asked
    const hasBeenAsked = localStorage.getItem("notificationsAsked");

    if (!hasBeenAsked) {
      // Check if notifications are supported
      if ("Notification" in window && "serviceWorker" in navigator) {
        // Check the notification permission status
        if (Notification.permission === "default") {
          // Ask for permission
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              subscribeUserToNotifications();
            }
            // Store in localStorage to avoid asking again
            localStorage.setItem("notificationsAsked", "true");
          });
        }
      }
    }
  }, []);

  const subscribeUserToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BE38RCKNK0Ig5qBWT0SpZ4ya9OV05THWXOnGhselt3IWPWgN__M3lNHULW1PjXV2SuZz96dWuNNFFaB1jiGsPyc", // Replace with your actual key
      });

      // Send subscription data to backend
      await fetch("http://localhost:8000/api/save-subscription/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      console.log("User subscribed to notifications:", subscription);
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
    }
  };
  
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
};

export default Home;
