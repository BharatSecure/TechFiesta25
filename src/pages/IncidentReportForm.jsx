import React, { useState } from "react";

const IncidentReportForm = () => {
  const [formData, setFormData] = useState({
    incidentType: "",
    customIncidentType: "",
    location: "",
    description: "",
    severity: "Low", // Display "Low", "Medium", "High"
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
        setFormData({
          ...formData,
          location: `Latitude: ${latitude}, Longitude: ${longitude}`,
        });
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

    // Map the string severity to its corresponding numeric value
    const severityMap = {
      Low: 0.2,
      Medium: 0.6,
      High: 0.8,
    };

    const submittedData = {
      ...formData,
      incidentType,
      severity: severityMap[formData.severity], // Map the severity here
      file: file ? file.name : "No file uploaded",
    };

    // Save to localStorage
    let incidents = JSON.parse(localStorage.getItem("incidents")) || [];
    incidents.push({
      location: formData.location, // store the incident location
      severity: formData.severity,
    });
    localStorage.setItem("incidents", JSON.stringify(incidents));

    console.log("Reported Incident:", submittedData);
    alert("Incident reported successfully!");

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
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#333",
        }}
      >
        Report an Incident
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="incidentType"
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Incident Type:
          </label>
          <select
            id="incidentType"
            name="incidentType"
            value={formData.incidentType}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
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
        {formData.incidentType === "Other" && (
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="customIncidentType"
              style={{ display: "block", marginBottom: "5px", color: "#555" }}
            >
              Specify Incident Type:
            </label>
            <input
              type="text"
              id="customIncidentType"
              name="customIncidentType"
              value={formData.customIncidentType}
              onChange={handleChange}
              placeholder="Enter the incident type"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              required
            />
          </div>
        )}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="location"
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Location/Address:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter or fetch location"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
            required
          />
          <button
            type="button"
            onClick={getLocation}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#28A745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={loadingLocation}
          >
            {loadingLocation ? "Fetching Location..." : "Get Current Location"}
          </button>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="description"
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the incident"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              minHeight: "80px",
            }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="severity"
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Severity Level:
          </label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="file"
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Attach Document/Evidence (Optional):
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default IncidentReportForm;
