import Footer from "@/components/Footer";
import React, { useState, useEffect, useRef } from "react";
import { AnimatedBackground } from "animated-backgrounds";
import PageTransition from '@/components/PageTransition';

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const[micClick,setMicClick]=useState(false)
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);



    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
  
    const handleSend = () => {
      if (input.trim() === "") return;
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    };
  
    const handleVoiceInput = () => {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.start();
      
       setMicClick(!micClick)
       
    
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
      };
    
      recognition.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
      };
    
      recognition.onend = () => {
        console.log("Voice recognition ended.");
      };
    };

    
    
    

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
    <PageTransition>
    <>
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-black"
      style={{
        backgroundImage: `url('https://cdn.pixabay.com/photo/2020/09/28/16/29/leaves-5610361_1280.png')`,
      
      }}>
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-80 z-0">
        <div className="absolute inset-0">
          <AnimatedBackground animationName="fireflies" blendMode="normal" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_10px_cyan]">
          🔵 Saathi AI
        </h1>
        <p className="text-lg bg-gradient-to-r from-blue-200 to-cyan-100 bg-clip-text text-transparent font-medium mb-4">
          Get real-time guidance, emotional support, and safety tips. Ask
          questions, seek help, or learn about your legal rights.
        </p>

        <div className="relative w-full max-w-xl sm:max-w-2xl mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 ">
          <p className="text-blue-200 text-sm">
            ⚠️ <strong>Disclaimer:</strong> Saathi AI offers general legal and
            safety information, but it is <strong>not</strong> a substitute for
            professional legal counsel. Please consult a licensed attorney for
            legal advice.
          </p>
        </div>
      </div>

      {/* Chatbot Box */}
<div className="relative z-10 w-full max-w-xl sm:max-w-2xl mt-6">
  <div className="w-full p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-b from-gray-900/90 to-black/90  shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,255,0.2)] hover:border-blue-400/40 ">
    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent text-center mb-6 ">
      💬 Chat with Saathi AI
    </h2>

    {/* Chat Display */}
    <div
      ref={chatContainerRef}
      className="h-72 sm:h-96 overflow-y-auto rounded-xl p-4 bg-gradient-to-b from-gray-900/80 to-black/80 border border-blue-500/20 transition-all duration-300 hover:border-blue-400/30"
    >
      {chatHistory.length === 0 ? (
        <p className="text-blue-300/60 text-center italic">
          Start a conversation...
        </p>
      ) : (
        chatHistory.map((message, index) => {
          const formattedMessage = message
            .replace("User:", "")
            .replace("Saathi AI:", "");
          const parts = formattedMessage
            .split(/(\*\*.*?\*\*|\*.*?\*)/g)
            .filter(Boolean);

          return (
            <div
              key={index}
              className={`p-4 my-3 max-w-[85%] sm:max-w-[75%] text-sm sm:text-base break-words rounded-xl shadow-lg transition-all duration-300 ${
                message.startsWith("User:")
                  ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white ml-auto hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]"
                  : "bg-gradient-to-r from-purple-500 to-blue-500 text-white mr-auto hover:shadow-[0_0_15px_rgba(147,51,234,0.15)]  animate-fadeIn"
              }`}
              style={{
                animationDelay: message.startsWith("Saathi AI:") ? "300ms" : "0ms",
              }}
            >
              {parts.map((part, partIndex) => {
                const isDoubleAsterisk = part.startsWith("**") && part.endsWith("**");
                const isSingleAsterisk = part.startsWith("*") && part.endsWith("*");

                if (isDoubleAsterisk) {
                  return (
                    <h2 key={partIndex} className="text-lg font-bold mb-2 border-b border-white/20 pb-1 animate-slideIn">
                      {part.replace(/\*\*/g, "")}
                    </h2>
                  );
                } else if (isSingleAsterisk) {
                  return (
                    <h3 key={partIndex} className="text-base font-extrabold mb-1 animate-slideIn">
                      {part.replace(/\*/g, "")}
                    </h3>
                  );
                } else {
                  return (
                    <span key={partIndex} className="inline-block mb-1 animate-fadeIn">
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
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
            <div className="flex flex-col space-y-2">
              <div className="h-2 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded animate-pulse"></div>
              <div className="h-2 w-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded animate-pulse"></div>
            </div>
          </div>
          <p className="text-blue-300/60 text-center animate-pulse">
            Saathi AI is thinking...
          </p>
        </div>
      )}
    </div>

    {/* Input Section */}
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="border border-blue-500/30 p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-900/80 text-white placeholder-blue-300/50 transition-all duration-300 hover:border-blue-400/40"
        disabled={loading}
      />
      <button
        onClick={sendMessage}
        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-500 shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.05]"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
      <button className={`${micClick===true?'bg-green-500 rounded-lg px-2 py-2':'bg-white px-2 py-2 rounded-lg'}`} onClick={handleVoiceInput}>🎤</button>
    </div>
  </div>
</div>

<style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .animate-slideIn {
    animation: slideIn 0.5s ease-out forwards;
  }
`}</style>

      
    </div>
    {/* Footer */}
    <div className="relative z-10">
        <Footer />
      </div>
  </>
  </PageTransition>
  );
};

export default Chatbot;
