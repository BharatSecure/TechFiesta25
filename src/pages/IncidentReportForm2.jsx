import React, { useState } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import { Modal, Box, Button, Typography } from "@mui/material";
import { BarLoader } from "react-spinners";
import FloatingChatbot from "@/components/FloatingChatbot";
import { motion } from "framer-motion";
import { Camera, MapPin, AlertTriangle, FileText, Upload } from "lucide-react";
import MapModal from "@/components/about-components/MapModal";

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
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [formData, setFormData] = useState({
    incidentType: "",
    customIncidentType: "",
    location: {
      latitude: "",
      longitude: "",
    },
    description: "",
    // severity: "low", // Default severity
    reportAnonymously: false, // Initial checkbox value
  });

  const handleLocationSelect = (coords) => {
    setFormData({
      ...formData,
      location: {
        latitude: coords[0],
        longitude: coords[1],
      },
    });
  };

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
  // const handleCheckboxChange = (e) => {
  //   const { name, checked } = e.target;
  //   setFormData({ ...formData, [name]: checked });
  // };
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const handleSubmit = async (e) => {
    setLoadingSpinner(true);
    e.preventDefault();

    // Use custom incident type if selected
    const incidentType =
      formData.incidentType === "Other"
        ? formData.customIncidentType
        : formData.incidentType;

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
      // severity: severityMap[formData.severity] || "low", // Default to 'low' if undefined
      // reportAnonymously: formData.reportAnonymously,
      file: file ? file.name : null,
    };
    // console.log("Submitted Data:", submittedData);

    const formDataToSend = new FormData();
    formDataToSend.append("incidentType", submittedData.incidentType);
    formDataToSend.append("location", submittedData.location);
    formDataToSend.append("description", submittedData.description);
    // formDataToSend.append("severity", submittedData.severity);
    // formDataToSend.append("reportAnonymously", submittedData.reportAnonymously);

    if (file) {
      formDataToSend.append("file", file);
    }

    try {
      const token = localStorage.getItem("accessToken"); // Retrieve token from storage or context

      const response = await axios.post(
        "http://127.0.0.1:8000/api/report-incident/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        }
      );

      console.log("Server response:", response.data);
      console.log("Reported Incident:", submittedData);
      setLoadingSpinner(false);
      alert("Incident reported successfully!");

      // Reset form after successful submission
      setFormData({
        incidentType: "",
        customIncidentType: "",
        location: "",
        description: "",
        // severity: "Low",
      });
      setFile(null);
      // Try submitting any pending offline data
      // await submitPendingReports();
    } catch (error) {
      console.error(
        "Error reporting incident:",
        error.response?.data || error.message
      );
      setLoadingSpinner(false);
      alert("Failed to report incident");
    }
  };

  const handleModalClose = () => {
    setOfflineModalOpen(false); // Close the modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-black">
      <SimpleModal
        open={offlineModalOpen}
        handleClose={handleModalClose}
        message="You are offline. Your report has been saved and will be submitted automatically when you are back online."
      />

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_10px_cyan]">
            Report an Incident
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Help us maintain safety and security by reporting incidents. Your
            information will be handled with utmost confidentiality.
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-slate-900 rounded-2xl p-8 border border-cyan-500 shadow-[0_0_10px_cyan] transition-all duration-300 hover:shadow-[0_0_20px_cyan]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Incident Type Section */}
              <div className="relative">
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  <AlertTriangle className="w-4 h-4 inline-block mr-2 text-cyan-400" />
                  Incident Type
                </label>
                <select
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  className="w-full bg-slate-800 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-200"
                >
                  <option value="">Select an incident type</option>
                  <option value="Domestic Violence">Domestic Violence</option>
                  <option value="Child Abuse">Child Abuse</option>
                  <option value="Sexual Harassment">Sexual Harassment</option>
                  <option value="Stalking">Stalking</option>
                  <option value="Human Trafficking">Human Trafficking</option>
                  <option value="Fire">Fire</option>
                  <option value="Accident">Accident</option>
                  <option value="Theft">Theft</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Custom Incident Type */}
              {formData.incidentType === "Other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="relative"
                >
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    <FileText className="w-4 h-4 inline-block mr-2 text-cyan-400" />
                    Specify Incident Type
                  </label>
                  <input
                    type="text"
                    name="customIncidentType"
                    value={formData.customIncidentType}
                    onChange={handleChange}
                    className="w-full bg-slate-800 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                    placeholder="Enter the incident type"
                  />
                </motion.div>
              )}

              {/* Location Section */}
              <div className="relative">
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  <MapPin className="w-4 h-4 inline-block mr-2 text-cyan-400" />
                  Location of Incident
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    name="location"
                    value={
                      formData.location.latitude && formData.location.longitude
                        ? `Latitude: ${formData.location.latitude}, Longitude: ${formData.location.longitude}`
                        : ""
                    }
                    readOnly
                    className="flex-1 bg-slate-800 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                    placeholder="Select location on map"
                  />
                  <button
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20"
                  >
                    <MapPin className="w-4 h-4" />
                    Select on Map
                  </button>
                </div>

                {/* Map Modal */}
                <MapModal
                  isOpen={isMapOpen}
                  onClose={() => setIsMapOpen(false)}
                  onSelectLocation={handleLocationSelect}
                />
              </div>

              {/* Description Section */}
              <div className="relative">
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  <FileText className="w-4 h-4 inline-block mr-2 text-cyan-400" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-slate-800 text-gray-100 px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                  placeholder="Provide detailed description of the incident"
                />
              </div>

              {/* File Upload Section */}
              <div className="relative">
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  <Upload className="w-4 h-4 inline-block mr-2 text-cyan-400" />
                  Attach Evidence
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl hover:border-cyan-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-cyan-400 hover:text-cyan-300">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="file"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-cyan-500/20 transition-all duration-200"
              >
                Submit Report
              </motion.button>

              {loadingSpinner && (
                <div className="flex justify-center mt-4">
                  <BarLoader color="#06b6d4" />
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full mx-4"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Report Submitted!
              </h2>
              <p className="text-gray-400 mb-6">
                Your incident has been reported successfully. We'll process it
                right away.
              </p>
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
      <FloatingChatbot />
    </div>
  );
};

export default IncidentReportForm;
