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
      <div className="max-w-2xl w-full mx-auto p-6 py-6 bg-[#001a2f] rounded-2xl relative overflow-hidden transition-all duration-300 shadow-[8px_8px_16px_#001527,_-8px_-8px_16px_#002f59] border border-[rgba(0,255,255,0.1)]">
      <h1 className="text-3xl font-bold text-center text-[#00ffff] mb-4 [text-shadow:_0_0_15px_rgba(0,255,255,0.5)]">
        Feedback Form
      </h1>

      {submitted ? (
        <div className="flex flex-col justify-center items-center text-center text-[#00ffff] min-h-[40vh]">
          <h2 className="text-xl font-semibold [text-shadow:_0_0_10px_rgba(0,255,255,0.3)]">
            Thank you for your feedback!
          </h2>
          <p className="text-lg mt-2">We appreciate your input.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-[#80ffff] text-lg mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-[rgba(0,255,255,0.2)] rounded-xl bg-[#002240] text-[#00ffff] shadow-[inset_3px_3px_6px_#001527,_inset_-3px_-3px_6px_#002f59] focus:outline-none focus:shadow-[inset_4px_4px_8px_#001527,_inset_-4px_-4px_8px_#002f59,_0_0_10px_rgba(0,255,255,0.3)] transition-all duration-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-[#80ffff] text-lg mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-[rgba(0,255,255,0.2)] rounded-xl bg-[#002240] text-[#00ffff] shadow-[inset_3px_3px_6px_#001527,_inset_-3px_-3px_6px_#002f59] focus:outline-none focus:shadow-[inset_4px_4px_8px_#001527,_inset_-4px_-4px_8px_#002f59,_0_0_10px_rgba(0,255,255,0.3)] transition-all duration-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="feedbackType" className="block text-[#80ffff] text-lg mb-2">
              Feedback Type
            </label>
            <select
              id="feedbackType"
              name="feedbackType"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full p-3 border border-[rgba(0,255,255,0.2)] rounded-xl bg-[#002240] text-[#00ffff] shadow-[inset_3px_3px_6px_#001527,_inset_-3px_-3px_6px_#002f59] focus:outline-none focus:shadow-[inset_4px_4px_8px_#001527,_inset_-4px_-4px_8px_#002f59,_0_0_10px_rgba(0,255,255,0.3)] transition-all duration-300"
            >
              <option value="General">General Feedback</option>
              <option value="Incident">Incident Report</option>
              <option value="Suggestion">Suggestion</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-[#80ffff] text-lg mb-2">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="4"
              className="w-full p-3 border border-[rgba(0,255,255,0.2)] rounded-xl bg-[#002240] text-[#00ffff] shadow-[inset_3px_3px_6px_#001527,_inset_-3px_-3px_6px_#002f59] focus:outline-none focus:shadow-[inset_4px_4px_8px_#001527,_inset_-4px_-4px_8px_#002f59,_0_0_10px_rgba(0,255,255,0.3)] transition-all duration-300"
            ></textarea>
          </div>

          {error && (
            <p className="text-red-400 mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#002240] text-[#00ffff] py-3 px-6 rounded-xl shadow-[5px_5px_10px_#001527,_-5px_-5px_10px_#002f59] border border-[rgba(0,255,255,0.1)] hover:shadow-[8px_8px_16px_#001527,_-8px_-8px_16px_#002f59,_0_0_20px_rgba(0,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 focus:outline-none"
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
