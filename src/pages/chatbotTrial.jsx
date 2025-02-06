import Footer from "@/components/Footer";
import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!userInput.trim()) return; // Prevent empty messages

    const newUserMessage = `User: ${userInput}`;

    setChatHistory((prev) => [...prev, newUserMessage]); // Show user's message first
    setUserInput(""); // Clear input field
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
        const botMessage = `Saathi AI: ${data.bot_response}`;
        setChatHistory((prev) => [...prev, botMessage]); // Append bot response after request
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }

    setLoading(false);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <>
    {/* Page Background with Themed Image */}
  <div
    className="min-h-screen flex flex-col items-center justify-center p-6 relative"
    style={{
      backgroundImage: `url('https://cdn.pixabay.com/photo/2020/09/28/16/29/leaves-5610361_1280.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black opacity-80"></div>

    {/* Header Section (No Glow) */}
    <div className="relative z-10 text-center mb-6 px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-400 drop-shadow-lg">
        🔵 Saathi AI - Safety Chatbot
      </h1>
      <p className="text-lg text-gray-300 mt-2 max-w-3xl text-center">
        Get real-time guidance, emotional support, and safety tips.  
        Ask questions, seek help, or learn about your legal rights.
      </p>
    </div>

    {/* Chatbot Box with Glow */}
    <div className="relative z-10 w-full max-w-xl sm:max-w-2xl">
      <div className="w-full p-6 sm:p-8 rounded-3xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800 shadow-[0px_0px_25px_5px_rgba(0,225,255,0.5)] transition-all duration-300 hover:shadow-[0px_0px_40px_10px_rgba(0,225,255,0.7)]">
        
        {/* Chat Display Section */}
        <div className="w-full p-4 sm:p-6 rounded-xl border border-gray-600 bg-gradient-to-b from-gray-800 to-gray-700 shadow-inner">
          <h2 className="text-2xl font-bold text-sky-400 text-center mb-4">
            💬 Saathi AI Chat
          </h2>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="h-72 sm:h-96 w-full overflow-y-auto border border-gray-600 rounded-lg p-4 bg-gradient-to-b from-gray-700 to-gray-600 shadow-[inset_4px_4px_8px_rgba(255,255,255,0.1),inset_-4px_-4px_8px_rgba(0,0,0,0.5)]"
          >
            {chatHistory.length === 0 ? (
              <p className="text-gray-400 text-center italic">No messages yet...</p>
            ) : (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`relative p-4 my-3 max-w-[85%] sm:max-w-[75%] text-sm sm:text-base break-words shadow-lg rounded-xl ${
                    message.startsWith("User:")
                      ? "bg-blue-500 text-white ml-auto shadow-blue-500/60"
                      : "bg-green-500 text-white mr-auto shadow-green-500/60"
                  }`}
                >
                  {message.replace(/^(User:|Bot:)/, "")}

                  {/* Tail for Message Bubble */}
                  <div
                    className={`absolute bottom-0 w-3 h-3 ${
                      message.startsWith("User:")
                        ? "bg-blue-500 -right-1 transform rotate-45"
                        : "bg-green-500 -left-1 transform rotate-45"
                    }`}
                  />
                </div>
              ))
            )}

            {/* Typing Animation */}
            {loading && (
              <div className="relative p-3 my-2 max-w-[75%] text-sm sm:text-base break-words shadow-md bg-green-500 mr-auto rounded-xl animate-pulse">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 bg-gray-300 rounded mt-2"></div>
                <div className="absolute bottom-0 w-3 h-3 bg-green-500 -left-1 transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>

        {/* Input Field */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="border p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white shadow-md"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
      <Footer />
    </>
  );
};

export default Chatbot;
