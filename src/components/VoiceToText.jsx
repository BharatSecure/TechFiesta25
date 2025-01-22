import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import Footer from "./Footer";

const VoiceInput = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isStopped, setIsStopped] = useState(false); // Tracks if recording is stopped
  const [language, setLanguage] = useState("hi-IN"); // Default to Hindi

  // Initialize SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true; // Keep listening until stopped
  recognition.interimResults = true; // Capture interim results
  recognition.lang = language; // Set the language dynamically

  // Start Listening
  const startListening = () => {
    setIsListening(true);
    setIsStopped(false);
    recognition.start();
  };

  // Stop Listening
  const stopListening = () => {
    setIsListening(false);
    setIsStopped(true);
    recognition.stop();
  };

  // Handle Results
  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(""); // Combine results
    setText(transcript);
  };

  recognition.onerror = (event) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6 flex items-center justify-center">
      <div className="p-12 bg-red-300 rounded-lg shadow-md max-w-2xl w-full -mt-12">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-2 flex justify-center items-center gap-3">
          Voice Incident Reporting
          <FaMicrophone />
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Use this form to report incidents using your voice. Choose your preferred language, start recording, and submit your report once you're done.
        </p>

        <div className="mb-4">
          <label htmlFor="language" className="block font-bold text-gray-600 mb-2">
            Select Language:
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="hi-IN">Hindi</option>
            <option value="en-US">English</option>
            <option value="mr-IN">Marathi</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
          </select>
        </div>

        <textarea
          className="w-full p-3 border rounded mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your voice input will appear here"
        />

        <div className="flex gap-4">
          {isListening ? (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition w-full"
              onClick={stopListening}
            >
              Stop Listening
            </button>
          ) : (
            !isStopped && (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition w-full"
                onClick={startListening}
              >
                Start Listening
              </button>
            )
          )}

          {isStopped && (
            <div className="flex gap-4 w-full">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-1/2"
                onClick={sendReport}
              >
                Send Report
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition w-1/2"
                onClick={reRecord}
              >
                Re-record
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    <Footer/>
    </>
  );
};

export default VoiceInput;
