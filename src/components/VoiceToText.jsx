import React, { useState, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-4 flex items-center justify-center">
  <div className="p-8 sm:p-12 bg-cyan-200 rounded-lg shadow-md w-full max-w-lg sm:max-w-2xl -mt-12">
    <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-800 mb-3 flex justify-center items-center gap-2">
      Voice Incident Reporting <FaMicrophone className="text-xl sm:text-2xl" />
    </h1>
    <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
      Use this form to report incidents using your voice. Choose your preferred language, start recording, and submit your report once you're done.
    </p>

    {/* Language Selection */}
    <div className="mb-4">
      <label htmlFor="language" className="block font-bold text-gray-600 mb-2">
        Select Language:
      </label>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
      >
        <option value="hi-IN">Hindi</option>
        <option value="en-US">English</option>
        <option value="mr-IN">Marathi</option>
        <option value="es-ES">Spanish</option>
        <option value="fr-FR">French</option>
      </select>
    </div>

    {/* Voice Input Textarea */}
    <textarea
      className="w-full p-3 border rounded mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
      rows="4"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Your voice input will appear here"
    />

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-4">
      {isListening ? (
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition w-full sm:w-auto"
          onClick={stopListening}
        >
          Stop Listening
        </button>
      ) : (
        !isStopped && (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition w-full sm:w-auto"
            onClick={startListening}
          >
            Start Listening
          </button>
        )
      )}

      {isStopped && (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full sm:w-1/2"
            onClick={sendReport}
          >
            Send Report
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition w-full sm:w-1/2"
            onClick={reRecord}
          >
            Re-record
          </button>
        </div>
      )}
    </div>
  </div>
</div>


      <Footer />
    </>
  );
};

export default VoiceInput;
