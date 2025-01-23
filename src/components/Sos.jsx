import { useState } from "react";

const Sos = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleSOSClick = () => {
    alert("SOS Alert Triggered! Authorities have been notified.");
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-12 rounded-2xl mx-6 my-6 min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Title */}
        <h1 className="lg:text-6xl font-extrabold text-red-600 tracking-wide mb-6 sm:text-3xl animate-pulse">
          Emergency SOS
        </h1>

        {/* SOS Button */}
        <button
          onClick={handleSOSClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative bg-red-600 text-white font-bold text-3xl py-6 px-16 rounded-full shadow-lg transition-all duration-300 hover:bg-red-700 focus:ring-4 focus:ring-red-500 outline-none ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          style={{
            boxShadow: isHovered
              ? "0 0 30px rgba(255, 0, 0, 0.8)"
              : "0 0 10px rgba(255, 0, 0, 0.5)",
          }}
        >
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50"></span>
          SOS
        </button>

        {/* Description */}
        <p className="text-gray-300 text-center max-w-xl text-lg sm:text-base px-6">
          Press the button to send an emergency alert. Your location and details
          will be shared with nearby authorities for immediate assistance.
        </p>
      </div>
    </div>
  );
};

export default Sos;
