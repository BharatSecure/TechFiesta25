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
        const response = await axios.get("http://127.0.0.1:8000/api/latest-incidents/");
        
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
      <div className="bg-blue-100 min-h-screen flex flex-col items-center py-10">
        <h1 className="text-center text-sky-600 font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-8 drop-shadow-lg">
          Recently Reported Incidents 
        </h1>

        {/* Show loading or error message */}
        {loading ? (
          <p className="text-gray-600">Loading incidents...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="p-6 max-w-4xl mx-auto">
            {incidents.length === 0 ? (
              <p className="text-gray-500">No incidents reported yet.</p>
            ) : (
              incidents.map((incident) => {
                // Neumorphic styles
                let bgColor = "";
                let statusTag = "";
                let tagStyles = "";

                switch (incident.status) {
                  case "Resolved":
                    statusTag = "Completed";
                    tagStyles = "bg-green-200 text-green-800";
                    bgColor = "bg-green-200";
                    break;
                  case "processing":
                    statusTag = "Ongoing";
                    tagStyles = "bg-yellow-200 text-yellow-800";
                    bgColor = "bg-yellow-200";
                    break;
                  case "submitted":
                    statusTag = "Reported";
                    tagStyles = "bg-red-200 text-red-800";
                    bgColor = "bg-red-200";
                    break;
                  default:
                    statusTag = "Unknown";
                    tagStyles = "bg-gray-300 text-gray-700";
                }

                return (
                  <div
                    key={incident.id}
                    className={`mb-6 p-6 rounded-xl ${bgColor} shadow-[4px_4px_10px_#c1d5ff,-4px_-4px_10px_#ffffff] transition-transform hover:scale-105`}
                  >
                    {/* Incident Title & Status */}
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{incident.incidentType}</h2>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full shadow-md ${tagStyles}`}>
                        {statusTag}
                      </span>
                    </div>

                    {/* Incident Details */}
                    <p className="text-black mb-1">{incident.description}</p>
                    <p className="text-sm text-black font-semibold">
                      Reported at: {new Date(incident.reported_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-black font-semibold">
                      Location:{" "}
                      {incident.location ? `${incident.location.latitude}, ${incident.location.longitude}` : "N/A"}
                    </p>

                    {/* Comment Section */}
                    <button
                      onClick={() => toggleComments(incident.id)}
                      className="flex items-center gap-2 mt-4 text-blue-500 hover:text-blue-700 transition-all bg-blue-200 font-semibold  px-4 py-2 rounded-lg  hover:scale-105"
                    >
                      <FaCommentDots className="text-lg drop-shadow-sm" />
                      {openCommentSection[incident.id] ? "Hide Comments" : "Comments"}
                    </button>

                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        openCommentSection[incident.id] ? "max-h-screen" : "max-h-0"
                      }`}
                    >
                      {openCommentSection[incident.id] && (
                        <Suspense fallback={<p>Loading comments...</p>}>
                          <div className="mt-4 p-4 bg-blue-50 rounded-xl shadow-[inset_4px_4px_10px_#c1d5ff,inset_-4px_-4px_10px_#ffffff]">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Comments</h3>
                            <ul className="space-y-4">
                              {incident.comments && incident.comments.length > 0 ? (
                                incident.comments.map((comment, index) => (
                                  <li key={index} className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full flex-shrink-0 shadow-md">
                                      <img
                                        className="rounded-full"
                                        src="https://cdn.pfps.gg/pfps/2301-default-2.png"
                                        alt="pfp"
                                      />
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-3 rounded-lg shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff]">
                                      <p className="text-sm font-semibold text-gray-800">
                                        {comment.commented_by.first_name} {comment.commented_by.last_name}
                                      </p>
                                      <p className="text-sm text-gray-600">{comment.comment}</p>
                                    </div>
                                  </li>
                                ))
                              ) : (
                                <p className="text-gray-500">No comments yet.</p>
                              )}
                            </ul>
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
                          </div>
                        </Suspense>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <Footer />
      <FloatingChatbot />
    </>
  );
};

export default RecentIncidents;
