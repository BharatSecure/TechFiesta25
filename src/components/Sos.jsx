import { useState } from "react";

const Sos = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // To control the SOS alert modal

  const handleSOSClick = () => {
    setShowConfirmation(true); // Show confirmation modal when SOS is clicked
  };

  const confirmSOS = () => {
    setShowAlert(true); // Show the SOS alert modal
    setShowConfirmation(false); // Close the confirmation modal
  };

  const cancelSOS = () => {
    setShowConfirmation(false); // Close confirmation modal if user cancels
  };

  const closeAlertModal = () => {
    setShowAlert(false); // Close the alert modal
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-12 rounded-2xl mx-6 my-6 min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Title */}
        <h1
          className="text-3xl text-red-600 font-extrabold tracking-wide animate-pulse mb-6 lg:text-6xl"
        >
          Emergency SOS
        </h1>

        {/* SOS Button */}
        <button
          onClick={handleSOSClick}
          className="relative bg-red-600 text-white font-bold text-3xl py-6 px-16 rounded-full shadow-lg transition-all duration-300 hover:bg-red-700 hover:scale-105 focus:ring-4 focus:ring-red-500 outline-none"
        >
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50"></span>
          SOS
        </button>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="absolute bg-black bg-opacity-50 inset-0 flex items-center justify-center z-10">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <p className="text-xl font-semibold mb-4">
                Are you sure you want to send an SOS alert?
              </p>
              <div className="flex justify-around">
                <button
                  onClick={confirmSOS}
                  className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={cancelSOS}
                  className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SOS Alert Modal */}
        {showAlert && (
          <div className="absolute bg-black bg-opacity-50 inset-0 flex items-center justify-center z-20">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <p className="text-xl font-semibold mb-4">
                SOS Alert Triggered! Authorities have been notified.
              </p>
              <button
                onClick={closeAlertModal}
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

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
