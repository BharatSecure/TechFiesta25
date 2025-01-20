

const Sos = () => {

    const handleSOSClick = () => {
        alert("SOS Alert Triggered! Authorities have been notified.");
      };
    
      return (
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black py-12">
          <div className="flex flex-col items-center">
            {/* Title */}
            <h1 className="text-4xl font-bold text-red-500 mb-4">
              Emergency SOS
            </h1>
    
            {/* SOS Button */}
            <button
              onClick={handleSOSClick}
              className="bg-red-600 text-white font-bold text-3xl py-4 px-16 rounded-full shadow-lg hover:bg-red-700 transition duration-300"
            >
              SOS
            </button>
    
            {/* Description */}
            <p className="text-white mt-4 text-center max-w-md">
              Press the button to send an emergency alert. Your location and details
              will be shared with nearby authorities for immediate assistance.
            </p>
          </div>
        </div>
      );
}

export default Sos