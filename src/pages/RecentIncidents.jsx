import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCommentDots } from "react-icons/fa";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

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
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-4">Comments</h3>
                    <ul className="space-y-4">
                      {incident.comments && incident.comments.length > 0 ? (
                        incident.comments.map((comment, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
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

// Comment form component
const AddCommentForm = ({ incidentId, onAddComment }) => {
  const [commentText, setCommentText] = useState("");
  const { isloggedin } = useAuth(); //not in use for now

  const handleSubmit = async (e) => {
    console.log("got inside fetch");
    e.preventDefault();
    if (true) {
      try {
        const token = localStorage.getItem("accessToken"); // Retrieve token from storage or context
        if (!token) {
          alert("Authorization token is missing. Please log in.");
          return;
        }
        console.log(token);
        const response = await axios.post(
          `http://127.0.0.1:8000/api/incidents/${incidentId}/comments/`,
          {
            comment: commentText,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        onAddComment(response.data);
        setCommentText("");
      } catch (error) {
        console.error("Error adding comment:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error headers:", error.response?.headers);
        alert("Failed to add comment. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border rounded-md p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Comment
        </button>
      </div>
    </form>
  );
};

export default RecentIncidents;
export { AddCommentForm };
