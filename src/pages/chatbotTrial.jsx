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
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-3">Chatbot</h2>
      <div className="h-60 overflow-y-auto border p-3 rounded bg-gray-100">
        {chatHistory.map((message, index) => (
          <p
            key={index}
            className={
              message.startsWith("User:") ? "text-blue-600" : "text-green-600"
            }
          >
            {message}
          </p>
        ))}
      </div>
      <div className="mt-3 flex">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="border p-2 flex-1 rounded-l"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
