import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { FaCommentDots } from "react-icons/fa";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import FloatingChatbot from "@/components/FloatingChatbot";
import { AnimatedBackground } from "animated-backgrounds";

// Lazy load comment form
const AddCommentForm = lazy(() => import("../components/AddCommentForm"));

const RecentIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [openCommentSection, setOpenCommentSection] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();

  // Fetch incidents from Django backend
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:8000/api/latest-incidents/"
        );

        if (response.status === 200) {
          setIncidents(response.data);
        } else {
          throw new Error(`Unexpected response: ${response.status}`);
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

  const toggleComments = (id) => {
    setOpenCommentSection((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a2238] relative overflow-hidden">
      <AnimatedBackground animationName="cosmicDust" blendMode="normal" />

      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* Page Title */}
        <h1
          className="
          text-center 
          font-extrabold 
          text-3xl sm:text-4xl lg:text-5xl 
          mb-12
          bg-gradient-to-r from-cyan-400 to-blue-500 
          bg-clip-text text-transparent
          drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]
        "
        >
          Recently Reported Incidents
        </h1>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      bgGradient: "from-green-400/20 to-green-600/20",
      textColor: "text-green-400",
      borderColor: "border-green-600/30",
    },
    processing: {
      tag: "Ongoing",
      bgGradient: "from-yellow-400/20 to-yellow-600/20",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-600/30",
    },
    submitted: {
      tag: "Reported",
      bgGradient: "from-red-400/20 to-red-600/20",
      textColor: "text-red-400",
      borderColor: "border-red-600/30",
    },
    default: {
      tag: "Unknown",
      bgGradient: "from-gray-400/20 to-gray-600/20",
      textColor: "text-gray-400",
      borderColor: "border-gray-600/30",
    },
  };

  const status = statusConfig[incident.status] || statusConfig.default;

  return (
    <div
      className={`
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
        <p className="text-sm text-gray-400">
          Location:{" "}
          {incident.location
            ? `${incident.location.latitude.toFixed(
                4
              )}, ${incident.location.longitude.toFixed(4)}`
            : "N/A"}
        </p>
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
        `}
      >
        <FaCommentDots />
        {openCommentSection[incident.id] ? "Hide Comments" : "View Comments"}
      </button>

      {/* Comments Section */}
      {openCommentSection[incident.id] && (
        <Suspense
          fallback={<p className="text-gray-500">Loading comments...</p>}
        >
          <CommentsSection incident={incident} setIncidents={setIncidents} />
        </Suspense>
      )}
    </div>
  );
};

const CommentsSection = ({ incident, setIncidents }) => (
  <div className="mt-4 space-y-4 bg-[#2a2f4a] rounded-lg p-4">
    <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2">
      Comments
    </h3>

    {incident.comments && incident.comments.length > 0 ? (
      <ul className="space-y-3">
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
      <p className="text-gray-500 text-center">No comments yet.</p>
    )}

    {/* Add Comment Form */}
    <Suspense fallback={<div className="text-gray-500">Loading form...</div>}>
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
