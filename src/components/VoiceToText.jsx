import React, { useState, useRef } from "react";
// import { FaMicrophone } from "react-icons/fa";
import { Mic, Send, Repeat, StopCircle } from "lucide-react";
import Footer from "./Footer";

const VoiceInput = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [language, setLanguage] = useState("hi-IN"); // Default to Hindi

  // Store recognition instance in useRef
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition
  if (!recognitionRef.current) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false; // Ensure recording stops when stopped
    recognitionRef.current.interimResults = false; // Only get final results
  }

  // Update language dynamically
  recognitionRef.current.lang = language;

  // Start Listening
  const startListening = () => {
    setIsListening(true);
    setIsStopped(false);
    recognitionRef.current.start();
  };

  // Stop Listening Completely
  const stopListening = () => {
    setIsListening(false);
    setIsStopped(true);
    recognitionRef.current.stop();
    recognitionRef.current.abort(); // Fully stop speech recognition
  };

  // Handle Results
  recognitionRef.current.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(""); // Combine results
    setText(transcript);
  };

  recognitionRef.current.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  // Handle Send Report
  const sendReport = () => {
    console.log("Report Sent:", text);
    alert("Your report has been submitted!");
    setText(""); // Clear the text
    setIsStopped(false);
  };

  // Handle Re-record
  const reRecord = () => {
    setText(""); // Clear the text
    setIsStopped(false);
    startListening(); // Restart listening
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-black p-6 ">
        <div className="max-w-2xl mx-auto border border-cyan-500 ">
          {/* Main Card */}
          <div className="max-w-2xl p-8 mx-auto border bg-gray-900 border-cyan-500 shadow-[0_0_15px_#00ffff] transition-all duration-300 hover:shadow-[0_0_25px_#00ffff]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_10px_cyan]">
                  Voice Incident Reporting
                </h1>
                <div
                  className={`p-3 rounded-full ${
                    isListening ? "bg-red-500/20 animate-pulse" : "bg-slate-700"
                  } shadow-inner`}
                >
                  <Mic
                    className={`w-6 h-6 ${
                      isListening ? "text-red-500" : "text-cyan-400"
                    }`}
                  />
                </div>
              </div>
              <p className="text-gray-400 max-w-lg mx-auto">
                Report incidents using your voice. Select your preferred
                language, start recording, and submit your report.
              </p>
            </div>

            {/* Language Selection */}
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">
                Select Language
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-900/50 text-gray-200 px-4 py-3 rounded-xl border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.3)] appearance-none transition-all duration-200"
                >
                  <option value="hi-IN">Hindi</option>
                  <option value="en-US">English</option>
                  <option value="mr-IN">Marathi</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Voice Input Display */}
            <div className="mb-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Your voice input will appear here..."
                className="w-full bg-slate-900/50 text-gray-200 px-4 py-3 rounded-xl border border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.3)] min-h-[120px] resize-none"
                rows="4"
              />
            </div>

            {/* Control Buttons */}
            <div className="space-y-4">
              {isListening ? (
                <button
                  onClick={stopListening}
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/20 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <StopCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Stop Recording
                </button>
              ) : (
                !isStopped && (
                  <button
                    onClick={startListening}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-green-500/20 transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Start Recording
                  </button>
                )
              )}

              {isStopped && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={sendReport}
                    className="py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-cyan-500/20 transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Send Report
                  </button>
                  <button
                    onClick={reRecord}
                    className="py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-amber-500/20 transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <Repeat className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Re-record
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default VoiceInput;
