

const Sos = () => {

    const handleSOSClick = () => {
        alert("SOS Alert Triggered! Authorities have been notified.");
      };
    
      return (
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black py-12 rounded-2xl mx-9 my-6 h-110">
          <div className="flex flex-col items-center py-12 gap-5">
            {/* Title */}
            <h1 className="lg:text-5xl font-bold text-red-500 mb-4 sm:text-2xl ">
              Emergency SOS
            </h1>
    
            {/* SOS Button */}
            <button
              onClick={handleSOSClick}
              className="bg-red-600 text-white font-bold sm:text-2xl sm:px-14 sm:py-4 md:text-2xl md:py-4 md:px-20 lg:text-3xl lg:py-9 lg:px-40 rounded-full shadow-lg hover:bg-red-700 transition duration-300"
            >
              SOS
            </button>
    
            {/* Description */}
            <p className="text-white mt-4 text-center max-w-md  sm:text-sm ">
              Press the button to send an emergency alert. Your location and details
              will be shared with nearby authorities for immediate assistance.
            </p>
          </div>
        </div>
      );
}

export default Sos