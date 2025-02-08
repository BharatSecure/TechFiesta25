import React, { useState } from "react";
import Footer from "@/components/Footer";
import FloatingChatbot from "@/components/FloatingChatbot";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("General");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/submit-feedback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          feedback_type: feedbackType,
          message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setError("");
        setName("");
        setEmail("");
        setFeedbackType("General");
        setMessage("");
      } else {
        const data = await response.json();
        setError(
          data.message || "Failed to submit feedback. Please try again."
        );
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="min-h-screen p-20 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
        <div
          className="max-w-2xl w-full mx-auto p-6 py-6 bg-gray-800 rounded-lg shadow-2xl relative overflow-hidden border border-gray-700 transition-transform transform "
          style={{ boxShadow: "0 0 20px rgba(0, 128, 255, 0.6)" }}
        >
          <h1 className="text-3xl font-bold text-center text-blue-400 mb-4">
            Feedback Form
          </h1>

          {submitted ? (
            <div className="flex flex-col justify-center items-center text-center text-green-400 min-h-[40vh]">
              <h2 className="text-xl font-semibold">
                Thank you for your feedback!
              </h2>
              <p className="text-lg mt-2">We appreciate your input.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-300 text-lg">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 text-lg">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="feedbackType"
                  className="block text-gray-300 text-lg"
                >
                  Feedback Type
                </label>
                <select
                  id="feedbackType"
                  name="feedbackType"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General">General Feedback</option>
                  <option value="Incident">Incident Report</option>
                  <option value="Suggestion">Suggestion</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-300 text-lg"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="4"
                  className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {error && (
                <p className="text-red-400 mb-4 text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
      <FloatingChatbot />
    </>
  );
};

export default FeedbackForm;
