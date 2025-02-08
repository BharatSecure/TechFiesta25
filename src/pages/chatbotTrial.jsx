import Footer from "@/components/Footer";
import React, { useState, useEffect, useRef } from "react";
import { AnimatedBackground } from "animated-backgrounds";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage = `User: ${userInput}`;
    setChatHistory((prev) => [...prev, newUserMessage]);
    setUserInput("");
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
        setChatHistory((prev) => [...prev, botMessage]);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
<<<<<<< HEAD
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://cdn.pixabay.com/photo/2020/09/28/16/29/leaves-5610361_1280.png')`,
      }}
    >
      {/* Dark Overlay with Animation */}
      <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
      <div className="absolute inset-0 z-0">
        <AnimatedBackground animationName="fireflies" blendMode="normal" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-400 drop-shadow-lg">
          🔵 Saathi AI - Safety Chatbot
        </h1>
        <p className="text-lg text-gray-300 mt-2 max-w-3xl mx-auto">
          Get real-time guidance, emotional support, and safety tips. Ask
          questions, seek help, or learn about your legal rights.
        </p>

        <div className="relative z-10 w-full max-w-xl sm:max-w-2xl mt-4 p-3 rounded-md bg-gray-800 text-gray-300 text-xs text-center">
          ⚠️ <strong>Disclaimer:</strong> Saathi AI offers general legal and
          safety information, but it is <strong>not</strong> a substitute for
          professional legal counsel. Please consult a licensed attorney for
          legal advice.
        </div>
      </div>

      {/* Chatbot Box */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl mt-6">
        <div className="w-full p-6 sm:p-8 rounded-3xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg">
          <h2 className="text-2xl font-bold text-sky-400 text-center mb-4">
            💬 Saathi AI Chat
          </h2>

          {/* Chat Display Section */}
          <div
            ref={chatContainerRef}
            className="h-72 sm:h-96 overflow-y-auto border border-gray-600 rounded-lg p-4 bg-gray-700"
          >
            {chatHistory.length === 0 ? (
              <p className="text-gray-400 text-center italic">
                No messages yet...
              </p>
            ) : (
              chatHistory.map((message, index) => {
                const formattedMessage = message
                  .replace("User:", "")
                  .replace("Saathi AI:", "");

                // Split message into parts based on asterisk sections
                const parts = formattedMessage
                  .split(/(\*\*.*?\*\*|\*.*?\*)/g)
                  .filter(Boolean);

                return (
                  <div
                    key={index}
                    className={`p-4 my-3 max-w-[85%] sm:max-w-[75%] text-sm sm:text-base break-words rounded-xl shadow-lg ${
                      message.startsWith("User:")
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-green-500 text-white mr-auto"
                    }`}
                  >
                    {parts.map((part, partIndex) => {
                      const isDoubleAsterisk =
                        part.startsWith("**") && part.endsWith("**");
                      const isSingleAsterisk =
                        part.startsWith("*") && part.endsWith("*");

                      if (isDoubleAsterisk) {
                        return (
                          <h2
                            key={partIndex}
                            className="text-lg font-bold mb-2 border-b border-white/20 pb-1"
                          >
                            {part.replace(/\*\*/g, "")}
                          </h2>
                        );
                      } else if (isSingleAsterisk) {
                        return (
                          <h3
                            key={partIndex}
                            className="text-base font-extrabold mb-1"
                          >
                            {part.replace(/\*/g, "")}
                          </h3>
                        );
                      } else {
                        return (
                          <span key={partIndex} className="inline-block mb-1">
                            {part}
                          </span>
                        );
                      }
                    })}
                  </div>
                );
              })
            )}
            {loading && (
              <p className="text-gray-400 text-center animate-pulse">
                Saathi AI is typing...
              </p>
            )}
          </div>

          {/* Input Field */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="border p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full mt-8">
        <Footer />
      </div>
    </div>
=======
    <>
      <div
        className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://cdn.pixabay.com/photo/2020/09/28/16/29/leaves-5610361_1280.png')`,
        }}
      >
        {/* Dark Overlay with Animation */}
        <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
        <div className="absolute inset-0 z-0">
          <AnimatedBackground animationName="fireflies" blendMode="normal" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-xl sm:max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-400 drop-shadow-lg">
            🔵 Saathi AI - Safety Chatbot
          </h1>
          <p className="text-lg text-gray-300 mt-2 max-w-3xl mx-auto">
            Get real-time guidance, emotional support, and safety tips. Ask
            questions, seek help, or learn about your legal rights.
          </p>
        </div>

        {/* Chatbot Box */}
        <div className="relative z-10 w-full max-w-xl sm:max-w-2xl mt-6">
          <div className="w-full p-6 sm:p-8 rounded-3xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg">
            <h2 className="text-2xl font-bold text-sky-400 text-center mb-4">
              💬 Saathi AI Chat
            </h2>

            {/* Chat Display Section */}
            <div
              ref={chatContainerRef}
              className="h-72 sm:h-96 overflow-y-auto border border-gray-600 rounded-lg p-4 bg-gray-700"
            >
              {chatHistory.length === 0 ? (
                <p className="text-gray-400 text-center italic">
                  No messages yet...
                </p>
              ) : (
                chatHistory.map((message, index) => {
                  const formattedMessage = message
                    .replace("User:", "")
                    .replace("Saathi AI:", "");

                  // Split message into parts based on asterisk sections
                  const parts = formattedMessage
                    .split(/(\*\*.*?\*\*|\*.*?\*)/g)
                    .filter(Boolean);

                  return (
                    <div
                      key={index}
                      className={`p-4 my-3 max-w-[85%] sm:max-w-[75%] text-sm sm:text-base break-words rounded-xl shadow-lg ${
                        message.startsWith("User:")
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-green-500 text-white mr-auto"
                      }`}
                    >
                      {parts.map((part, partIndex) => {
                        // Check for different formatting patterns
                        const isDoubleAsterisk =
                          part.startsWith("**") && part.endsWith("**");
                        const isSingleAsterisk =
                          part.startsWith("*") && part.endsWith("*");

                        if (isDoubleAsterisk) {
                          // Heading style
                          return (
                            <h2
                              key={partIndex}
                              className="text-lg font-bold mb-2 border-b border-white/20 pb-1"
                            >
                              {part.replace(/\*\*/g, "")}
                            </h2>
                          );
                        } else if (isSingleAsterisk) {
                          // Subheading/emphasis style
                          return (
                            <h3
                              key={partIndex}
                              className="text-base font-extrabold  mb-1"
                            >
                              {part.replace(/\*/g, "")}
                            </h3>
                          );
                        } else {
                          // Regular text
                          return (
                            <span key={partIndex} className="inline-block mb-1">
                              {part}
                            </span>
                          );
                        }
                      })}
                    </div>
                  );
                })
              )}
              {loading && (
                <p className="text-gray-400 text-center animate-pulse">
                  Saathi AI is typing...
                </p>
              )}
            </div>

            {/* Input Field */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="border p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 w-full mt-8">
          <Footer />
        </div>
      </div>
    </>
>>>>>>> parent of 8246456 (Merge branch 'backend1' of https://github.com/Shane-Dias/TechFiesta25 into backend1)
  );
};

export default Chatbot;
