import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Send, AlertCircle } from "lucide-react";

const AddCommentForm = ({ incidentId, onAddComment }) => {
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isloggedin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setError(null);

    // Validate comment
    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Authorization token is missing. Please log in.");
        setIsLoading(false);
        return;
      }

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

      // Success handling
      onAddComment(response.data);
      setCommentText("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError(
        error.response?.data?.detail ||
          "Failed to add comment. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-2 z-10">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center space-x-2"
      >
        {/* Neuromorphic Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              setError(null);
            }}
            className="
              w-full 
              px-4 
              py-3 
              rounded-xl 
              bg-[#1a2238] 
              text-gray-200
              border 
              border-cyan-500/20
              focus:outline-none 
              focus:ring-2 
              focus:ring-cyan-500/50
              shadow-[inset_-4px_-4px_8px_#151b2d,inset_4px_4px_8px_#1f2943]
              transition-all 
              duration-300
            "
          />
          {/* Floating Error Message */}
          {error && (
            <div
              className="
              absolute 
              top-full 
              left-0 
              mt-1 
              flex 
              items-center 
              text-red-400 
              text-sm 
              bg-[#2a2f4a] 
              px-3 
              py-1 
              rounded-lg 
              shadow-lg
              z-10
            "
            >
              <AlertCircle className="mr-2 w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            px-4 
            py-3 
            rounded-xl 
            text-white 
            font-semibold 
            transition-all 
            duration-300 
            flex 
            items-center 
            justify-center
            ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
            }
            shadow-[0_4px_14px_rgba(34,211,238,0.4)]
            hover:shadow-[0_6px_18px_rgba(34,211,238,0.5)]
            focus:outline-none 
            focus:ring-2 
            focus:ring-cyan-500/50
          `}
        >
          {isLoading ? (
            <div className="animate-pulse">Sending...</div>
          ) : (
            <>
              <Send className="mr-2 w-5 h-5" />
              Comment
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddCommentForm;
