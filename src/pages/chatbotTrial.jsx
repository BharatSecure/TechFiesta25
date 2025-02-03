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
    <div className="bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 min-h-screen -mt-6">
      <div className="text-center my-8 flex justify-center items-center flex-col px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
          🗣️ Safety & Support Chatbot
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-4xl text-center">
          This chatbot provides guidance, emotional support, and safety advice
          for any users including women and children. Ask questions, seek counseling, or get help
          with incident reporting and legal rights.
        </p>
      </div>

      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto p-6 border rounded-xl shadow-xl bg-gradient-to-r from-sky-100 to-sky-200 dark:from-gray-800 dark:to-gray-900 transition-all duration-300 mt-6 mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
          💬 Saathi AI
        </h2>

        {/* Chat Display */}
        <div
          ref={chatContainerRef}
          className="h-72 sm:h-96 overflow-y-auto border rounded-lg p-4 bg-slate-100 dark:bg-gray-700 transition-all duration-300 shadow-inner"
        >
          {chatHistory.map((message, index) => (
           <div
           className={`relative p-3 my-2 max-w-[80%] sm:max-w-[75%] text-sm sm:text-base break-words mt-4 shadow-md ${
             message.startsWith("User:")
               ? "bg-blue-500 text-white ml-auto rounded-3xl rounded-br-sm"
               : "bg-green-500 text-white mr-auto rounded-3xl rounded-bl-sm"
           }`}
         >
           {/* Chat Message */}
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
         
         
          ))}
          {loading && (
           
            <div class="relative p-3 my-2 max-w-[80%] sm:max-w-[75%] text-sm sm:text-base break-words shadow-md 
                        bg-green-400 dark:bg-green-700 mr-auto rounded-3xl rounded-bl-sm animate-pulse">
              
              
              <div class="h-4 w-28 bg-white dark:bg-gray-600 rounded"></div>
              <div class="h-4 w-20 bg-white dark:bg-gray-600 rounded mt-2"></div>
            
              <div class="absolute bottom-0 w-3 h-3 bg-green-400 dark:bg-gray-700 -left-1 transform rotate-45"></div>
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for Enter key
            placeholder="Type your message..."
            className="border p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white w-full sm:w-auto"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-600 active:scale-95 transition-all duration-200 disabled:bg-gray-400 w-full sm:w-auto"
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
      <Footer />
    </>
  );
};

export default Chatbot;
