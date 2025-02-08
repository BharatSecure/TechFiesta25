import React, { useState, useEffect, lazy, Suspense, useRef } from "react";
import axios from "axios";
import { FaCommentDots } from "react-icons/fa";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import FloatingChatbot from "@/components/FloatingChatbot";
import { AnimatedBackground } from "animated-backgrounds";
import LocationDisplay from "@/components/LocationDisplay";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Lazy load comment form
const AddCommentForm = lazy(() => import("../components/AddCommentForm"));

const RecentIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [originalIncidents, setOriginalIncidents] = useState([]);
  const [openCommentSection, setOpenCommentSection] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  // Refs for map and data
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const incidentsRef = useRef(incidents);

  // Sync ref with incidents state
  useEffect(() => {
    incidentsRef.current = incidents;
  }, [incidents]);
  // Initialize map when modal opens
  useEffect(() => {
    if (!isMapModalOpen) return;

    const map = L.map("map").setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    mapRef.current = map;

    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
      markerRef.current = L.marker([lat, lng]).addTo(map);

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const filteredIncidents = originalIncidents.filter((incident) => {
          const distance = getDistanceFromLatLonInKm(
            lat, // previously: latitudeOrLat
            lng, // previously: longitudeOrLng
            incident.location.latitude,
            incident.location.longitude
          );
          return distance <= 10;
        });

        setIncidents(filteredIncidents);
      } catch (error) {
        console.error("Error fetching location data:", error);
        setError("Failed to get location data");
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMapModalOpen]);

  // Fetch incidents from backend
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:8000/api/latest-incidents/"
        );

        if (response.status === 200) {
          setIncidents(response.data);
          setOriginalIncidents(response.data);
          console.log(incidents);
        }
      } catch (error) {
        console.error("Error fetching incidents:", error);
        setError("Failed to load incidents. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  // Distance calculation helpers
  const deg2rad = (deg) => deg * (Math.PI / 180);

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Location filtering handler
  const handleLocationFilter = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const filteredIncidents = originalIncidents.filter((incident) => {
            const distance = getDistanceFromLatLonInKm(
              latitude,
              longitude,
              incident.location.latitude,
              incident.location.longitude
            );
            return distance <= 10;
          });
          setIncidents(filteredIncidents);
        } catch (error) {
          console.error("Error filtering incidents:", error);
          setError("Failed to filter incidents");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Please enable location services to use this feature");
      }
    );
  };

  const toggleComments = (id) => {
    setOpenCommentSection((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground animationName="cosmicDust" blendMode="normal" />

      <div className="container mx-auto px-4 py-10 relative z-10">
        <h1 className="text-center font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          Recently Reported Incidents
        </h1>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={handleLocationFilter}
            className="px-6 py-3 bg-slate-800 text-cyan-400 rounded-xl 
    shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.1)] 
    hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] 
    hover:text-cyan-300
    transition-all duration-300
    font-semibold
    border border-cyan-400/20"
          >
            Filter by My Location
          </button>

          <button
            onClick={() => setIsMapModalOpen(true)}
            className="px-6 py-3 bg-slate-800 text-cyan-400 rounded-xl 
    shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.1)] 
    hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] 
    hover:text-cyan-300
    transition-all duration-300
    font-semibold
    border border-cyan-400/20"
          >
            Pick Location on Map
          </button>
        </div>

        {isMapModalOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setIsMapModalOpen(false)
            }
          >
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
              <div id="map" style={{ height: "400px" }} />
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin text-cyan-400" size={48} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center">
            <div
              className="
              bg-[#2a2f4a] 
              p-6 
              rounded-xl 
              shadow-lg 
              flex 
              items-center 
              text-red-400
            "
            >
              <AlertTriangle className="mr-3" />
              {error}
            </div>
          </div>
        )}

        {/* Incidents Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {incidents.length === 0 ? (
              <div
                className="
                col-span-full 
                text-center 
                bg-[#2a2f4a] 
                p-6 
                rounded-xl 
                text-gray-400
                shadow-lg
              "
              >
                No incidents reported yet.
              </div>
            ) : (
              incidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  toggleComments={toggleComments}
                  openCommentSection={openCommentSection}
                  setIncidents={setIncidents}
                />
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
      <FloatingChatbot />
    </div>
  );
};

const IncidentCard = ({
  incident,
  toggleComments,
  openCommentSection,
  setIncidents,
}) => {
  // Status configuration
  const statusConfig = {
    Resolved: {
      tag: "Completed",
      bgGradient: "from-green-400/50 to-green-600/50",
      textColor: "text-green-400",
      borderColor: "border-green-600/50",
    },
    processing: {
      tag: "Ongoing",
      bgGradient: "from-yellow-400/50 to-yellow-600/50",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-600/50",
    },
    submitted: {
      tag: "Reported",
      bgGradient: "from-red-400/50 to-red-600/50",
      textColor: "text-red-400",
      borderColor: "border-red-600/50",
    },
    default: {
      tag: "Unknown",
      bgGradient: "from-gray-400/50 to-gray-600/50",
      textColor: "text-gray-400",
      borderColor: "border-gray-600/50",
    },
  };

  const status = statusConfig[incident.status] || statusConfig.default;

  return (
    <div
      className={`
        relative
        bg-gradient-to-br ${status.bgGradient}
        border ${status.borderColor}
        rounded-2xl 
        p-6 
        transform 
        transition-all 
        duration-300 
        hover:scale-105 
        hover:shadow-2xl
        shadow-[0_10px_25px_rgba(8,_112,_184,_0.2)]
        backdrop-blur-sm
      `}
    >
      {/* Incident Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-300">
          {incident.incidentType}
        </h2>
        <span
          className={`
          px-3 py-1 
          text-sm 
          font-semibold 
          rounded-full 
          ${status.textColor} 
          bg-[#1a2238]/50 
          border ${status.borderColor}
        `}
        >
          {status.tag}
        </span>
      </div>

      {/* Incident Details */}
      <div className="space-y-2 mb-4">
        <p className="text-gray-300 line-clamp-2">{incident.description}</p>
        <p className="text-sm text-gray-400">
          Reported: {new Date(incident.reported_at).toLocaleString()}
        </p>
        <LocationDisplay location={incident.location} />
      </div>

      {/* Comments Toggle */}
      <button
        onClick={() => toggleComments(incident.id)}
        className={`
          w-full 
          flex 
          items-center 
          justify-center 
          gap-2 
          py-2 
          rounded-lg 
          bg-[#1a2238]/50 
          text-cyan-400 
          hover:bg-cyan-500/20 
          transition-all 
          duration-300
          border 
          border-cyan-500/30
          hover:text-cyan-300
          relative
          z-20
        `}
      >
        <FaCommentDots />
        {openCommentSection[incident.id] ? "Hide Comments" : "View Comments"}
      </button>

      {/* Comments Section - Fixed Positioning */}
      {openCommentSection[incident.id] && (
        <div
          className="
            fixed 
            inset-0 
            bg-black/50 
            z-50 
            flex 
            items-center 
            justify-center 
            p-4
          "
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              toggleComments(incident.id);
            }
          }}
        >
          <div
            className="
              w-full 
              max-w-md 
              max-h-[80vh] 
              overflow-y-auto
            "
          >
            <Suspense
              fallback={<p className="text-gray-500">Loading comments...</p>}
            >
              <CommentsSection
                incident={incident}
                setIncidents={setIncidents}
                onClose={() => toggleComments(incident.id)}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

const CommentsSection = ({ incident, setIncidents, onClose }) => (
  <div
    className="
      bg-[#2a2f4a] 
      rounded-lg 
      p-4 
      shadow-2xl 
      border 
      border-cyan-500/30
      relative
    "
  >
    <button
      onClick={onClose}
      className="
        absolute 
        top-2 
        right-2 
        text-cyan-400 
        hover:text-cyan-300 
        z-10
      "
    >
      ✕
    </button>

    <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2 pr-8">
      Comments
    </h3>

    {incident.comments && incident.comments.length > 0 ? (
      <ul className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-[#1a2238] scrollbar-thumb-cyan-500/50 mt-4">
        {incident.comments.map((comment, index) => (
          <li key={index} className="flex items-start gap-3">
            <img
              src="https://cdn.pfps.gg/pfps/2301-default-2.png"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-cyan-500/30"
            />
            <div className="flex-1 bg-[#1a2238]/50 p-3 rounded-lg">
              <p className="text-sm font-semibold text-cyan-400">
                {comment.commented_by.first_name}{" "}
                {comment.commented_by.last_name}
              </p>
              <p className="text-sm text-gray-300">{comment.comment}</p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-center mt-4">No comments yet.</p>
    )}

    {/* Add Comment Form */}
    <Suspense
      fallback={<div className="text-gray-500 mt-4">Loading form...</div>}
    >
      <AddCommentForm
        incidentId={incident.id}
        onAddComment={(newComment) => {
          setIncidents((prev) =>
            prev.map((inc) =>
              inc.id === incident.id
                ? {
                    ...inc,
                    comments: [...(inc.comments || []), newComment],
                  }
                : inc
            )
          );
        }}
      />
    </Suspense>
  </div>
);

export default RecentIncidents;
