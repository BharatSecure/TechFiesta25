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
  const { isLoggedIn } = useAuth();

  // Fetch incidents from Django backend
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/latest-incidents/"
        );
        setIncidents(response.data);
        console.log(incidents);
      } catch (error) {
        console.error("Error fetching incidents:", error);
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
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10">
      <h1 className="text-center text-sky-600 font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-8 drop-shadow-lg">
        Recently Reported Incidents
      </h1>

      <div className="p-6 max-w-4xl w-full">
        {incidents.map((incident) => {
          // Neumorphic card styles
          let bgColor = "";
          let statusTag = "";
          let tagStyles = "";

          switch (incident.status) {
            case "Resolved":
              statusTag = "Resolved";
              tagStyles = "bg-green-400 text-green-800 shadow-inner";
              bgColor='bg-green-200';
              break;
            case "processing":
              statusTag = "Ongoing";
              tagStyles = "bg-yellow-400 text-yellow-800 shadow-inner";
              bgColor='bg-yellow-200';
              break;
            case "submitted":
              statusTag = "Reported";
              tagStyles = "bg-red-400 text-red-800 shadow-inner";
              bgColor='bg-red-200';
              break;
          }

          return (
            <div
              key={incident.id}
              className={`mb-6 p-6 rounded-xl ${bgColor} transition-transform hover:scale-105`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{incident.incidentType}</h2>
                {statusTag && (
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${tagStyles}`}>
                    {statusTag}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-1">{incident.description}</p>
              <p className="text-sm text-gray-500">
                Reported at: {new Date(incident.reported_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Location: {incident.location ? `${incident.location.latitude}, ${incident.location.longitude}` : "N/A"}
              </p>

              <button
                onClick={() => toggleComments(incident.id)}
                className="flex items-center gap-2 mt-4 text-blue-500 hover:text-blue-700 transition-all"
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
                    <div className="mt-4">
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
                    </div>
                  </Suspense>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
      <Footer />
      <FloatingChatbot />
    </>
  );
};

export default RecentIncidents;
