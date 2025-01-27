import React, { useState } from "react";
import Footer from "@/components/Footer";

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
    <div className="bg-blue-200 min-h-screen">
      <div className="max-w-3xl mx-auto p-8 py-8 lg:bg-white rounded-lg shadow-xl sm:bg-blue-200 ">
        <h1 className="text-4xl font-bold text-center text-sky-700 lg:mb-6 mb-2">
          Feedback Form
        </h1>

        {submitted ? (
          <div className="flex flex-col justify-center items-center text-center text-green-600 min-h-[60vh]">
            <h2 className="text-2xl font-semibold">
              Thank you for your feedback!
            </h2>
            <p className="text-lg mt-2">We appreciate your input.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-800 text-lg">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 lg:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-800 text-lg">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 lg:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="feedbackType"
                className="block text-gray-800 text-lg"
              >
                Feedback Type
              </label>
              <select
                id="feedbackType"
                name="feedbackType"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full p-2 lg:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="General">General Feedback</option>
                <option value="Incident">Incident Report</option>
                <option value="Suggestion">Suggestion</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-800 text-lg">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows="6"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              ></textarea>
            </div>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackForm;
