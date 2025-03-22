import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useUserLocation from "@/lib/UserLocation";

const Sos = () => {
  const location = useUserLocation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [particles, setParticles] = useState([]);
  // const [ripples, setRipples] = useState([]);

  const features = [
    {
      title: "Report Incident",
      path: "/report-incident",
      description: "Quick & efficient incident reporting",
    },
    {
      title: "Saathi AI",
      path: "/chatbot",
      description: "AI-powered legal guidance & safety assistant",
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

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          localStorage.setItem(
            "userCoordinates",
            JSON.stringify({ latitude, longitude })
          );
          console.log(`${latitude}, ${longitude}`);
        },
        (error) => console.error("Error:", error.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Background effects setup
  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
      }))
    );
  }, []);

  // useEffect(() => {
  //   const generateRipples = () => {
  //     return Array.from({ length: 3 }, (_, i) => ({
  //       id: i,
  //       scale: 1,
  //       opacity: 0.8,
  //       delay: i * 1,
  //     }));
  //   };
  //   setRipples(generateRipples());
  //   const interval = setInterval(() => setRipples(generateRipples()), 3000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    // Load particles.js script dynamically
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
    script.async = true;
    script.onload = () => {
        if (typeof particlesJS !== "undefined") {
            particlesJS("particles-js", {
                "particles": {
                    "number": { "value": 80, "density": { "enable": true, "value_area": 800 }},
                    "color": { "value": ["#00E0C7", "#8C52FF"] },
                    "shape": { "type": "circle" },
                    "opacity": { "value": 1, "random": true },
                    "size": { "value": 3, "random": true },
                    "line_linked": { "enable": true, "distance": 150, "color": "#00E0C7", "opacity": 0.15, "width": 1 },
                    "move": { "enable": true, "speed": 2, "random": true, "out_mode": "out" }
                },
                "interactivity": {
                    "events": {
                        "onhover": { "enable": true, "mode": "grab" },
                        "onclick": { "enable": true, "mode": "push" }
                    },
                    "modes": {
                        "grab": { "distance": 140, "line_linked": { "opacity": 0.8 }},
                        "push": { "particles_nb": 4 }
                    }
                },
                "retina_detect": true
            });
        }
    };
    document.body.appendChild(script);
    
    return () => {
        document.body.removeChild(script);
    };
}, []);

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

  return (
    <div className="bg-slate-900 h-[90vh] flex items-center justify-center overflow-hidden relative">
      {/* Background Effects */}
      {/* <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute w-full h-full"
            style={{
              animation: `ripple 3s ease-out infinite`,
              animationDelay: `${ripple.delay}s`,
              border: "2px solid rgba(0, 48, 130, 0.5)",
              borderRadius: "50%",
              transform: "scale(0)",
              opacity: 0.8,
            }}
          />
        ))}
      </div> */}

      <div className="absolute inset-0 overflow-hidden"id="particles-js">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-100"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `moveToCenter ${particle.duration}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center">
        {/* <h1 className="text-3xl text-cyan-400 font-extrabold tracking-wide mb-20 lg:text-6xl drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          Emergency SOS
        </h1> */}

        {/* Features Grid Layout */}
        <div className="relative grid grid-cols-3 w-[800px] h-[600px] place-items-center">
          {/* Top Feature */}
          <div className="col-start-2">
            <FeatureCard feature={features[0]} />
          </div>

          {/* Middle Row Features */}
          <div className="col-start-1 row-start-2">
            <FeatureCard feature={features[1]} />
          </div>

          {/* Center SOS Button */}
          <div className="col-start-2 row-start-2">
            <button
              onClick={handleSOSClick}
              className="relative bg-red-500 text-white font-bold text-3xl py-6 px-16 rounded-full shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-105 z-10"
            >
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30"></span>
              SOS
            </button>
          </div>

          <div className="col-start-3 row-start-2">
            <FeatureCard feature={features[2]} />
          </div>

          {/* Bottom Feature */}
          <div className="col-start-2 row-start-3">
            <FeatureCard feature={features[3]} />
          </div>
        </div>

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
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
            border-width: 20px;
          }
          50% {
            opacity: 2;
            border-width: 40px;
          }
          100% {
            transform: scale(3);
            opacity: 3;
            border-width: 80px;
          }
        }

        @keyframes moveToCenter {
          0% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(0.5) translate(-50%, -50%);
            opacity: 0.5;
          }
          100% {
            transform: scale(1) translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ feature }) => (
  <Link to={feature.path}>
    <div className="w-52 h-52 bg-slate-800 rounded-xl p-4 shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 flex flex-col items-center justify-center text-center transform hover:scale-105 overflow-hidden">
      <div className="absolute inset-0 rounded-xl p-[2px]">
        <div className="absolute inset-0 bg-[conic-gradient(from_var(--shimmer-angle),#0F172A_0%,#0ea5e9_10%,#0F172A_20%)] animate-border-rotate [--shimmer-angle:0deg]">
          <div className="absolute inset-[2px] rounded-[inherit] bg-slate-800"></div>
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-cyan-400 text-2xl font-bold mb-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
          {feature.title}
        </h3>
        <p className="text-slate-300">{feature.description}</p>
      </div>
    </div>
  </Link>
);

export default Sos;