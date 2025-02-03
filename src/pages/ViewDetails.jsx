import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [fullDetails, setFullDetails] = useState(null);

  useEffect(() => {
    const fetchIncidentDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/incident/${id}/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFullDetails(data);
        } else {
          console.error("Failed to fetch incident details");
          setFullDetails(null);
        }
      } catch (error) {
        console.error("Error fetching incident details:", error);
        setFullDetails(null);
      }
    };

    fetchIncidentDetails();
  }, [id]);

  if (!fullDetails) {
    return (
      <div className="text-center text-blue-500 font-bold mt-10">
        Loading...
      </div>
    );
  }

  const downloadPDF = () => {
    const input = document.getElementById("report-details");

    if (input) {
      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
          pdf.save(`Incident_Report_${fullDetails.id}.pdf`);
        })
        .catch((err) => console.error("Error generating PDF:", err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full border-l-8 border-blue-500">
        <div id="report-details">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Incident Report
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Report Details
            </h2>
            <hr className="mb-4" />
            <p className="text-gray-800 font-bold">
              Report ID: <span className="font-normal">{fullDetails.id}</span>
            </p>
            <p className="text-gray-800 font-bold">
              Severity:{" "}
              <span
                className={`px-3 py-1 text-md font-bold rounded-full ${
                  fullDetails.severity === "High"
                    ? "text-red-500"
                    : fullDetails.severity === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {fullDetails.severity}
              </span>
            </p>
            <p className="text-gray-800">
              <strong>Title:</strong> {fullDetails.incidentType}
            </p>
            <p className="text-gray-800">
              <strong>Description:</strong> {fullDetails.description}
            </p>
            <p className="text-gray-800">
              <strong>Location:</strong> {fullDetails.location?.latitude},{" "}
              {fullDetails.location?.longitude}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              User Details
            </h2>
            <hr className="mb-4" />
            <p className="text-gray-800">
              <strong>First Name:</strong> {fullDetails.reported_by?.first_name}
            </p>
            <p className="text-gray-800">
              <strong>Last Name:</strong> {fullDetails.reported_by?.last_name}
            </p>
            <p className="text-gray-800">
              <strong>Email:</strong> {fullDetails.reported_by?.email}
            </p>
            <p className="text-gray-800">
              <strong>Phone:</strong> {fullDetails.reported_by?.phone_number}
            </p>
            <p className="text-gray-800">
              <strong>Address:</strong> {fullDetails.reported_by?.address}
            </p>
            <p className="text-gray-800">
              <strong>Aadhar Number:</strong>{" "}
              {fullDetails.reported_by?.aadhar_number}
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center flex-col">
          <button
            className="lg:w-80 sm:w-56 md:w-56 my-5 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
            onClick={downloadPDF}
          >
            Download as PDF
          </button>

          <button
            className="w-48 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
            onClick={() => navigate("/admin")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
