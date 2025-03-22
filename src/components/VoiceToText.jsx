import React, { useState, useRef, useEffect } from "react";
// import { FaMicrophone } from "react-icons/fa";
import { Mic, Send, Repeat, StopCircle } from "lucide-react";
import axios from "axios";
import { BarLoader } from "react-spinners";
import Footer from "./Footer";

const VoiceInput = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [language, setLanguage] = useState("hi-IN"); // Default to Hindi
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  // Store recognition instance in useRef
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition

  /*if (!recognitionRef.current) {
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
  };*/

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError("Speech recognition error. Please try again.");
      };
    } else {
      setError("Speech recognition is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError("Speech recognition error. Please try again.");
      };
    } else {
      setError("Speech recognition is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.lang = language;

    const handleEnd = () => {
      if (isListening && !isStopped) {
        setTimeout(() => recognitionRef.current.start(), 500); // Restart with a delay to prevent looping issues
      }
    };

    recognitionRef.current.onend = handleEnd;

    return () => {
      recognitionRef.current.onend = null;
    };
  }, [language, isListening, isStopped]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setIsListening(true);
    setIsStopped(false);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    setIsListening(false);
    setIsStopped(true);
    recognitionRef.current.stop();
  };

  const analyzeAndSubmit = async () => {
    if (!text) {
      setError("Please record an incident before submitting.");
      return;
    }

    setLoadingSpinner(true);
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const extractedData = {
        user_input: text,
        latitude: 19.086179097586797, //hard coded
        longitude: 72.83292917653831
      };

      await axios.post(
        "http://127.0.0.1:8000/api/voice-report/",
        extractedData
      );

      setSuccess(true);
      setText(""); // Reset transcript manually
      alert("Incident submitted successfully!");
    } catch (err) {
      setError("Failed to process the incident. Please try again.");
      console.error(err);
      setLoadingSpinner(false);
      // alert(err.response.data.error);
      alert("Please specify your location details too");
    }
    setLoadingSpinner(false);
    setLoading(false);
  };

  const reRecord = () => {
    setText(""); // Clear the text
    setIsStopped(false);
    startListening(); // Restart listening
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-black p-6  ">
        <div className="max-w-2xl mx-auto border border-cyan-500  ">
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
                  className="w-full bg-gradient-to-b from-slate-800 to-slate-900/90 text-gray-200 px-4 py-3 rounded-xl 
    border border-slate-600/50 hover:border-cyan-500/70
    focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 
    shadow-[inset_2px_2px_8px_rgba(0,0,0,0.3)] 
    appearance-none transition-all duration-200
    backdrop-blur-sm
    hover:bg-slate-800/90
    cursor-pointer
    text-lg font-medium"
                >
                  <option value="hi-IN" className="bg-slate-800">
                    Hindi
                  </option>
                  <option value="en-US" className="bg-slate-800">
                    English
                  </option>
                  <option value="mr-IN" className="bg-slate-800">
                    Marathi
                  </option>
                  <option value="es-ES" className="bg-slate-800">
                    Spanish
                  </option>
                  <option value="fr-FR" className="bg-slate-800">
                    French
                  </option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400/80 pointer-events-none transition-transform duration-200 group-hover:text-cyan-300">
                  <svg
                    className="w-5 h-5 transform group-hover:translate-y-0.5 transition-transform duration-200"
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
                placeholder="Please describe the incident clearly. Include details like the type of incident, location, time, and any relevant observations."
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
                    onClick={analyzeAndSubmit}
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
              {loadingSpinner && (
                <div className="flex justify-center mt-4">
                  <BarLoader color="#06b6d4" />
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
