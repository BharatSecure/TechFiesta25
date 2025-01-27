import React, { useState } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import { Modal, Box, Button, Typography } from "@mui/material";

const SimpleModal = ({ open, handleClose, message }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" id="simple-modal-title">
          Notification
        </Typography>
        <Typography
          variant="body2"
          id="simple-modal-description"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ mt: 3, display: "block", marginLeft: "auto" }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

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
    reportAnonymously: false, // Initial checkbox value
  });

  const [file, setFile] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
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

  // Utility to save form data in IndexedDB
  // const saveOffline = (data) => {
  //   if (!("indexedDB" in window)) {
  //     console.warn("IndexedDB is not supported in your browser.");
  //     return;
  //   }

  //   const request = indexedDB.open("IncidentReportsDB", 1);

  //   request.onupgradeneeded = (event) => {
  //     const db = event.target.result;
  //     if (!db.objectStoreNames.contains("pendingReports")) {
  //       db.createObjectStore("pendingReports", {
  //         keyPath: "id",
  //         autoIncrement: true,
  //       });
  //     }
  //   };

  //   request.onsuccess = (event) => {
  //     const db = event.target.result;
  //     const transaction = db.transaction("pendingReports", "readwrite");
  //     const store = transaction.objectStore("pendingReports");
  //     store.add(data);
  //     console.log("Saved offline:", data);
  //   };

  //   request.onerror = (event) => {
  //     console.error("IndexedDB error:", event.target.error);
  //   };
  // };

  // // Listen for network changes
  // window.addEventListener("online", async () => {
  //   console.log("Back online, attempting to submit offline data...");
  //   await submitPendingReports();
  // });

  // const submitPendingReports = () => {
  //   return new Promise((resolve, reject) => {
  //     if (!("indexedDB" in window)) {
  //       console.warn("IndexedDB is not supported in your browser.");
  //       resolve();
  //       return;
  //     }

  //     const request = indexedDB.open("IncidentReportsDB", 1);

  //     request.onsuccess = (event) => {
  //       const db = event.target.result;
  //       const transaction = db.transaction("pendingReports", "readwrite");
  //       const store = transaction.objectStore("pendingReports");

  //       const getAll = store.getAll();
  //       getAll.onsuccess = async () => {
  //         const pendingReports = getAll.result;

  //         for (const report of pendingReports) {
  //           try {
  //             // Resubmit each report
  //             const formDataToSend = new FormData();
  //             for (const [key, value] of Object.entries(report)) {
  //               formDataToSend.append(key, value);
  //             }

  //             const token = localStorage.getItem("accessToken");
  //             if (!token) {
  //               console.error("Authorization token is missing.");
  //               reject();
  //               return;
  //             }

  //             await axios.post(
  //               "http://127.0.0.1:8000/api/report-incident/",
  //               formDataToSend,
  //               {
  //                 headers: {
  //                   Authorization: `Bearer ${token}`,
  //                 },
  //               }
  //             );

  //             console.log("Successfully submitted offline report:", report);
  //             // Remove successfully submitted report from IndexedDB
  //             store.delete(report.id);
  //           } catch (error) {
  //             console.error(
  //               "Failed to resubmit offline report:",
  //               error.response?.data || error.message
  //             );
  //           }
  //         }
  //         resolve();
  //       };

  //       getAll.onerror = (event) => {
  //         console.error("Failed to retrieve offline data:", event.target.error);
  //         reject();
  //       };
  //     };

  //     request.onerror = (event) => {
  //       console.error("IndexedDB error:", event.target.error);
  //       reject();
  //     };
  //   });
  // };

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
      locationToSend = JSON.stringify(formData.location); // Serialize the location array
    } else if (typeof formData.location === "object") {
      locationToSend = JSON.stringify(formData.location); // Serialize location object
    } else {
      locationToSend = formData.location; // If already a string
    }

    // Prepare data with mapped severity and file handling
    const submittedData = {
      incidentType: incidentType,
      location: locationToSend, // Serialized location
      description: formData.description,
      severity: severityMap[formData.severity] || "low", // Default to 'low' if undefined
      reportAnonymously: formData.reportAnonymously,
      file: file ? file.name : null,
    };
    // console.log("Submitted Data:", submittedData);

    // If offline, save form data locally
    // if (!navigator.onLine) {
    //   saveOffline(submittedData);
    //   setOfflineModalOpen(true); // Show the modal when offline
    //   return;
    // }

    const formDataToSend = new FormData();
    formDataToSend.append("incidentType", submittedData.incidentType);
    formDataToSend.append("location", submittedData.location);
    formDataToSend.append("description", submittedData.description);
    formDataToSend.append("severity", submittedData.severity);
    formDataToSend.append("reportAnonymously", submittedData.reportAnonymously);

    if (file) {
      formDataToSend.append("file", file);
    }

    try {
      const token = localStorage.getItem("accessToken"); // Retrieve token from storage or context
      if (!token) {
        alert("Authorization token is missing. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/report-incident/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        }
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
      // Try submitting any pending offline data
      // await submitPendingReports();
    } catch (error) {
      console.error(
        "Error reporting incident:",
        error.response?.data || error.message
      );
      alert("Failed to report incident");
    }
  };

  const handleModalClose = () => {
    setOfflineModalOpen(false); // Close the modal
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 flex flex-col items-center py-10 px-4">
        {/* Heading and Description */}
        <SimpleModal
          open={offlineModalOpen}
          handleClose={handleModalClose}
          message="You are offline. Your report has been saved and will be submitted automatically when you are back online."
        />
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

            {/* Report Anonymously */}
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="reportAnonymously"
                  checked={formData.reportAnonymously || false}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-sky-600"
                />
                <span className="ml-2 text-gray-600">Report Anonymously</span>
              </label>
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
