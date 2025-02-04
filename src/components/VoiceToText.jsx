import React, { useState, useRef, useCallback } from "react";
import { FaMicrophone } from "react-icons/fa";
import Footer from "./Footer";

const VoiceInput = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [language, setLanguage] = useState("hi-IN");
  const [token] = useState(localStorage.getItem("accessToken") || "");

  const recognitionRef = useRef(null);

  const initializeSpeechRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setText(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  }, [language]);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          (error) => {
            console.error("Location error:", error);
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });
  };

  const voicereport = async () => {
    try {
      if (!text.trim()) {
        alert("Please record a voice report first.");
        return;
      }

      const { latitude, longitude } = await getUserLocation();

      const response = await fetch("http://127.0.0.1:8000/api/voicereport/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: text,
          latitude: latitude,
          longitude: longitude,
        }),
      });

      if (!response.ok) throw new Error("Report submission failed");

      alert("Report submitted successfully!");
      setText("");
      setIsStopped(false);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit report.");
    }
  };

  const startListening = () => {
    initializeSpeechRecognition();
    setIsListening(true);
    setIsStopped(false);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setIsListening(false);
    setIsStopped(true);
    recognitionRef.current.stop();
    recognitionRef.current.abort();
  };

  const reRecord = () => {
    setText("");
    setIsStopped(false);
    startListening();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="p-12 bg-cyan-200 rounded-lg shadow-md max-w-2xl w-full -mt-12">
          <h1 className="text-center text-3xl font-bold text-gray-800 mb-2 flex justify-center items-center gap-3">
            Voice Incident Reporting
            <FaMicrophone />
          </h1>

          <div className="mb-4">
            <label
              htmlFor="language"
              className="block font-bold text-gray-600 mb-2"
            >
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
                  onClick={voicereport}
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
      <Footer />
    </>
  );
};

export default VoiceInput;
