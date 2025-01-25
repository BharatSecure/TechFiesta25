import React, { useState } from "react";
import Footer from "../components/Footer";

const IncidentReportForm = () => {
  const [formData, setFormData] = useState({
    incidentType: "",
    customIncidentType: "",
    location: {
      latitude: "",
      longitude: "",
    },
    description: "",
    severity: "Low", // Default severity
  });

  const [file, setFile] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setFormData((prevData) => ({
          ...prevData,
          location: {
            latitude: latitude,
            longitude: longitude,
          },
        }));

        setLoadingLocation(false);
      },
      (error) => {
        alert("Unable to retrieve location.");
        console.error(error);
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const incidentType =
      formData.incidentType === "Other"
        ? formData.customIncidentType
        : formData.incidentType;

    const severityMap = {
      Low: 0.2,
      Medium: 0.6,
      High: 0.8,
    };

    const submittedData = {
      ...formData,
      incidentType,
      severity: severityMap[formData.severity],
      file: file ? file.name : "No file uploaded",
    };

    console.log("Reported Incident:", submittedData);
    setModalOpen(true);

    setFormData({
      incidentType: "",
      customIncidentType: "",
      location: "",
      description: "",
      severity: "Low",
    });
    setFile(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 flex flex-col items-center py-10 px-4">
        {/* Heading and Description */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sky-600 mb-2">
            Report an Incident
          </h1>
          <p className="text-gray-700 text-lg">
            Fill out the form below to report an incident. Your information will
            help authorities take swift action.
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-lg bg-red-300 p-8 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Incident Type */}
            <div className="mb-6">
              <label
                htmlFor="incidentType"
                className="block text-gray-600 font-medium mb-2"
              >
                Incident Type
              </label>
              <select
                id="incidentType"
                name="incidentType"
                value={formData.incidentType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="">Select an incident type</option>
                <option value="Fire">Fire</option>
                <option value="Accident">Accident</option>
                <option value="Theft">Theft</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Custom Incident Type */}
            {formData.incidentType === "Other" && (
              <div className="mb-6">
                <label
                  htmlFor="customIncidentType"
                  className="block text-gray-600 font-medium mb-2"
                >
                  Specify Incident Type
                </label>
                <input
                  type="text"
                  id="customIncidentType"
                  name="customIncidentType"
                  value={formData.customIncidentType}
                  onChange={handleChange}
                  placeholder="Enter the incident type"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            )}

            {/* Location */}
            <div className="mb-6">
              <label
                htmlFor="location"
                className="block text-gray-600 font-medium mb-2"
              >
                Location/Address
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={
                  typeof formData.location === "string"
                    ? formData.location
                    : formData.location.latitude && formData.location.longitude
                    ? `Latitude: ${formData.location.latitude}, Longitude: ${formData.location.longitude}`
                    : ""
                }
                onChange={handleChange}
                placeholder="Enter or fetch location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={getLocation}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
                disabled={loadingLocation}
              >
                {loadingLocation
                  ? "Fetching Location..."
                  : "Get Current Location"}
              </button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-gray-600 font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the incident"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            {/* Severity */}
            <div className="mb-6">
              <label
                htmlFor="severity"
                className="block text-gray-600 font-medium mb-2"
              >
                Severity Level
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label
                htmlFor="file"
                className="block text-gray-600 font-medium mb-2"
              >
                Attach Document/Evidence (Optional)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Submit
            </button>
          </form>
          {/* Modal */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Incident Reported!
                </h2>
                <p>Your incident has been reported successfully.</p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IncidentReportForm;
