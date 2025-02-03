import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

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

export default AddCommentForm;