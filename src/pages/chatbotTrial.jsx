import Footer from "@/components/Footer";
import React, { useState } from "react";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return; // Prevent empty messages

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat-t/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: userInput,
          chat_history: chatHistory,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setChatHistory(data.chat_history); // Update chat history from API response
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }

    setUserInput(""); // Clear input field
    setLoading(false);
  };

  return (
    <>
   <div className="text-center my-8 flex justify-center items-center flex-col px-4">
  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">🗣️ Safety & Support Chatbot</h1>
  <p className="text-base sm:text-lg text-gray-600 mt-2 max-w-4xl text-center">
    This chatbot provides guidance, emotional support, and safety advice  
    for women and children. Ask questions, seek counseling, or get help  
    with incident reporting and legal rights.
  </p>
</div>

<div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto p-6 border rounded-xl shadow-xl bg-gradient-to-r from-sky-200 to-sky-300 dark:bg-gray-900 transition-all duration-300 mt-6 mb-7">
  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
    💬 Chatbot
  </h2>

  {/* Chat Display */}
  <div className="h-72 sm:h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 transition-all duration-300 shadow-inner">
    {chatHistory.map((message, index) => (
      <div
        key={index}
        className={`p-3 my-2 rounded-lg max-w-[80%] sm:max-w-[75%] text-sm sm:text-base ${
          message.startsWith("User:")
            ? "bg-blue-500 text-white ml-auto"
            : "bg-green-500 text-white mr-auto"
        }`}
      >
        {message.replace(/^(User:|Bot:)/, "")}
      </div>
    ))}
  </div>

  {/* Input Field */}
  <div className="mt-4 flex flex-col sm:flex-row gap-3">
    <input
      type="text"
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      placeholder="Type your message..."
      className="border p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white w-full sm:w-auto"
    />
    <button
      onClick={sendMessage}
      className="bg-blue-500 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-600 active:scale-95 transition-all duration-200 disabled:bg-gray-400 w-full sm:w-auto"
      disabled={loading}
    >
      {loading ? "Sending..." : "Send"}
    </button>
  </div>
</div>

<Footer/>
  </>
  );
};

export default Chatbot;
