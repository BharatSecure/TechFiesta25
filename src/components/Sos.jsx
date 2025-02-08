import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Sos = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const features = [
    {
      title: "Saathi AI",
      path: "/chatbot",
      description: "AI-powered medical & safety assistant",
    },
    {
      title: "Report Incident",
      path: "/report-incident",
      description: "Quick & efficient incident reporting",
    },
    {
      title: "Heatmap",
      path: "/heatmap",
      description: "Visualize high-risk areas",
    },
    {
      title: "Voice to Text",
      path: "/voice-report",
      description: "Accessible voice reporting",
    },
  ];

  const handleSOSClick = () => setShowConfirmation(true);
  const confirmSOS = () => {
    setShowAlert(true);
    setShowConfirmation(false);
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch("http://127.0.0.1:8000/api/update-location/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });
        },
        (error) => console.error("Error:", error.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      setTimeout(() => navigator.geolocation.clearWatch(watchId), 60000);
    }
  };

  const cancelSOS = () => setShowConfirmation(false);
  const closeAlertModal = () => setShowAlert(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          localStorage.setItem(
            "userCoordinates",
            JSON.stringify({ latitude, longitude })
          );
        },
        (error) => console.error("Error:", error.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  return (
    <div className="bg-slate-900 py-12 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Title */}
        <h1 className="text-3xl text-cyan-400 font-extrabold tracking-wide mb-16 lg:text-6xl drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          Emergency SOS
        </h1>

        {/* Central container with orbiting features */}
        <div className="relative w-96 h-96 flex items-center justify-center">
          {/* Orbiting Features */}
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              to={feature.path}
              className={`absolute w-48 h-48 animate-orbit-${
                index + 1
              } hover:pause`}
              style={{
                animation: `orbit ${20}s linear infinite`,
                animationDelay: `${index * -5}s`,
              }}
            >
              <div className="w-40 h-40 bg-slate-800 rounded-xl p-4 shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 flex flex-col items-center justify-center text-center transform hover:scale-105">
                <h3 className="text-cyan-400 font-bold mb-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-sm">{feature.description}</p>
              </div>
            </Link>
          ))}

          {/* SOS Button */}
          <button
            onClick={handleSOSClick}
            className="relative bg-cyan-600 text-white font-bold text-3xl py-6 px-16 rounded-full shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300 hover:scale-105 z-10"
          >
            <span className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-30"></span>
            SOS
          </button>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-center max-w-xl text-lg mt-16 px-6">
          Press the button to send an emergency alert. Your location and details
          will be shared with nearby authorities for immediate assistance.
        </p>

        {/* Modals */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-xl shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)]">
              <p className="text-xl text-cyan-400 font-semibold mb-4">
                Are you sure you want to send an SOS alert?
              </p>
              <div className="flex justify-around gap-4">
                <button
                  onClick={confirmSOS}
                  className="bg-cyan-600 text-white px-6 py-3 rounded-xl shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={cancelSOS}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-xl shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)]">
              <p className="text-xl text-cyan-400 font-semibold mb-4">
                SOS Alert Triggered! Authorities have been notified.
              </p>
              <button
                onClick={closeAlertModal}
                className="w-full bg-cyan-600 text-white px-6 py-3 rounded-xl shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(150px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(150px) rotate(-360deg);
          }
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Sos;
