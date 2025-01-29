import React, { useState, useEffect,lazy,Suspense } from "react";
import axios from "axios";
import { FaCommentDots } from "react-icons/fa";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
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
      <div className="bg-blue-100">
        <h1 className="py-4 text-center text-sky-600 font-extrabold text-3xl sm:text-4xl lg:text-5xl">
          Recently Reported Incidents
        </h1>
        <div className="p-6 max-w-4xl mx-auto">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="mb-6 p-4 border rounded-lg shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">
                {incident.incidentType}
              </h2>
              <p className="text-gray-600 mb-1">{incident.description}</p>
              <p className="text-sm text-gray-500">
                Reported at: {new Date(incident.reported_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Location:{" "}
                {incident.location
                  ? `${incident.location.latitude}, ${incident.location.longitude}`
                  : "N/A"}
              </p>

              <button
                onClick={() => toggleComments(incident.id)}
                className="flex items-center gap-2 mt-4 text-blue-500 hover:text-blue-700"
              >
                <FaCommentDots className="text-lg" />
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
                      <h3 className="text-lg font-semibold mb-4">Comments</h3>
                      <ul className="space-y-4">
                        {incident.comments && incident.comments.length > 0 ? (
                          incident.comments.map((comment, index) => (
                            <li key={index} className="flex items-start gap-3">
                              {/* <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div> */}
                              <div className="w-10 h-10 rounded-full flex-shrink-0">
                                <img
                                  className="rounded-full"
                                  src="https://cdn.pfps.gg/pfps/2301-default-2.png"
                                  alt="pfp"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">
                                  {comment.commented_by.first_name}{" "}
                                  {comment.commented_by.last_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {comment.comment}
                                </p>
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
                                    comments: [
                                      ...(inc.comments || []),
                                      newComment,
                                    ],
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
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecentIncidents;
