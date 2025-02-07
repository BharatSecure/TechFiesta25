import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { FaCommentDots } from "react-icons/fa";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import FloatingChatbot from "@/components/FloatingChatbot";
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
          console.log("Fetched Data:", response.data); // Log API response
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
    <>
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
  <h1 className="text-center text-sky-600 font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-8 drop-shadow-lg pt-7">
    Recently Reported Incidents
  </h1>

  <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
    {incidents.map((incident) => {
      let bgColor = "";
      let statusTag = "";
      let tagStyles = "";

      switch (incident.status) {
        case "Resolved":
          statusTag = "Completed";
          tagStyles = "bg-green-500 text-green-100";
          bgColor = "bg-green-800/50";
          break;
        case "processing":
          statusTag = "Ongoing";
          tagStyles = "bg-yellow-500 text-yellow-100";
          bgColor = "bg-yellow-800/50";
          break;
        case "submitted":
          statusTag = "Reported";
          tagStyles = "bg-red-500 text-red-100";
          bgColor = "bg-red-800/50";
          break;
        default:
          statusTag = "Unknown";
          tagStyles = "bg-gray-500 text-gray-100";
      }

      return (
        <div
          key={incident.id}
          className={`mb-6 p-6 rounded-xl ${bgColor}  opacity-85 shadow-[0_20px_40px_rgba(255,255,255,0.1),0_8px_16px_rgba(255,255,255,0.05)] transition-transform relative overflow-hidden hover:scale-105 hover:opacity-100 hover:shadow-[0_25px_50px_rgba(255,255,255,0.2),0_10px_20px_rgba(255,255,255,0.1)]`}
        >
          <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-50" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100">{incident.incidentType}</h2>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full shadow-md ${tagStyles}`}>
                {statusTag}
              </span>
            </div>

            <p className="text-gray-300 mb-1">{incident.description}</p>
            <p className="text-sm text-gray-400 font-semibold">Reported at: {new Date(incident.reported_at).toLocaleString()}</p>
            <p className="text-sm text-gray-400 font-semibold">
              Location: {incident.location ? `${incident.location.latitude}, ${incident.location.longitude}` : "N/A"}
            </p>

            <button
              onClick={() => setOpenCommentSection((prev) => ({ ...prev, [incident.id]: !(prev[incident.id] || false) }))}
              className="flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-500 transition-all bg-blue-800/60 font-semibold px-4 py-2 rounded-lg hover:scale-105"
            >
              <FaCommentDots className="text-lg drop-shadow-sm" />
              {openCommentSection[incident.id] ? "Hide Comments" : "Comments"}
            </button>

            {openCommentSection[incident.id] && (
              <div className="mt-4 p-4 bg-blue-900/50 rounded-xl shadow-[inset_4px_4px_10px_#222a3d,inset_-4px_-4px_10px_#101826]">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Comments</h3>
                <ul className="space-y-4">
                  {incident.comments && incident.comments.length > 0 ? (
                    incident.comments.map((comment, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 shadow-md">
                          <img className="rounded-full" src="https://cdn.pfps.gg/pfps/2301-default-2.png" alt="pfp" />
                        </div>
                        <div className="flex-1 bg-gray-800 p-3 rounded-lg shadow-[inset_4px_4px_8px_#1f2a3d,inset_-4px_-4px_8px_#101620]">
                          <p className="text-sm font-semibold text-gray-100">{comment.commented_by.first_name} {comment.commented_by.last_name}</p>
                          <p className="text-sm text-gray-400">{comment.comment}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No comments yet.</p>
                  )}
                </ul>
                <div className="mt-4 w-full max-w-md flex flex-wrap items-center gap-2 justify-center">
                  <input
                    type="text"
                    className="w-3/5 max-w-xs flex-grow px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Add a comment..."
                  />
                  <button className="w-16 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>

    </>
  );
};

export default RecentIncidents;
