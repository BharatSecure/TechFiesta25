import React, { useState } from "react";
import Footer from "../components/Footer";
import axios from "axios";

const IncidentReportForm = () => {

  const [formData, setFormData] = useState({
    incidentType: "",
    customIncidentType: "",
    location: {
      latitude: "",
      longitude: "",
    },
    description: "",
    severity: "low", // Default severity
  });

  const [file, setFile] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use custom incident type if selected
    const incidentType =
      formData.incidentType === "Other"
        ? formData.customIncidentType
        : formData.incidentType;

    // Map severity levels to numeric values
    const severityMap = {
      Low: "low",
      Medium: "medium",
      High: "high",
    };

    // Serialize location properly before sending
    let locationToSend;
    if (Array.isArray(formData.location)) {
      // Serialize the location array to a JSON string
      locationToSend = JSON.stringify(formData.location);
    } else if (typeof formData.location === "object") {
      // Serialize location object to JSON string
      locationToSend = JSON.stringify(formData.location);
    } else {
      // If location is already a string, send it as is
      locationToSend = formData.location;
    }

    // Prepare data with mapped severity and file handling
    const submittedData = {
      incidentType: incidentType,
      location: locationToSend, // Send serialized location
      description: formData.description,
      severity: severityMap[formData.severity] || "low", // Ensure a default value in case it's undefined
      file: file ? file.name : null,
    };

    const formDataToSend = new FormData();
    formDataToSend.append("incidentType", submittedData.incidentType);
    formDataToSend.append("location", submittedData.location); // Ensure location is serialized
    formDataToSend.append("description", submittedData.description);
    formDataToSend.append("severity", submittedData.severity); // Ensure mapped value is sent

    if (file) {
      formDataToSend.append("file", file);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/report-incident/",
        formDataToSend // Use FormData directly
        // Do not set Content-Type manually as FormData sets it automatically
      );

      console.log("Server response:", response.data);
      console.log("Reported Incident:", submittedData);
      alert("Incident reported successfully!");

      // Reset form after successful submission
      setFormData({
        incidentType: "",
        customIncidentType: "",
        location: "",
        description: "",
        severity: "Low",
      });
      setFile(null);
    } catch (error) {
      console.error(
        "Error reporting incident:",
        error.response?.data || error.message
      );
      alert("Failed to report incident");
    }
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
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IncidentReportForm;
