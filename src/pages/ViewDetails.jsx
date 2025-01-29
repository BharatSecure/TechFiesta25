import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const reportId = parseInt(id); 

  const [fullDetails, setFullDetails] = useState(null); 

  const [incidents, setIncidents] = useState([
    {
      id: 3319,
      user: {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "+91 9876543210",
        address: "123 Main Street, Mumbai",
        aadhar: "1234-5678-9101",
      },
      title: "Broken Streetlight",
      description: "A streetlight is broken near the park.",
      severity: "Medium",
      location: "Latitude: 19.185664, Longitude: 72.8367104",
      status: "Resolved",
      accept: true,
    },
    {
      id: 1269,
      user: {
        firstName: "Jane",
        lastName: "Smith",
        email: "janesmith@example.com",
        phone: "+91 9876543211",
        address: "456 Elm Street, Pune",
        aadhar: "5678-1234-9102",
      },
      title: "Pothole on Road",
      description: "A big pothole on the main road.",
      severity: "High",
      location: "Latitude: 19.185664, Longitude: 72.8367104",
      status: "Under Process",
      accept: true,
    },
    {
      id: 1012,
      user: {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michaelj@example.com",
        phone: "+91 9876543212",
        address: "789 Pine Road, Delhi",
        aadhar: "9102-5678-1234",
      },
      title: "Flooding in Basement",
      description: "Water leakage in the building basement.",
      severity: "Low",
      location: "Latitude: 19.185664, Longitude: 72.8367104",
      status: "Under Process",
      accept: true,
    },
    {
      id: 4321,
      user: {
        firstName: "Alice",
        lastName: "Cooper",
        email: "alicecooper@example.com",
        phone: "+91 9876543213",
        address: "246 Maple Avenue, Bengaluru",
        aadhar: "1122-3344-5566",
      },
      title: "Leaking Water Pipe",
      description: "A water pipe is leaking in the neighborhood.",
      severity: "Low",
      location: "Latitude: 19.0825223, Longitude: 72.7411012",
      status: "Under Process",
      accept: false,
    },
    {
      id: 5478,
      user: {
        firstName: "Bob",
        lastName: "Taylor",
        email: "bobtaylor@example.com",
        phone: "+91 9876543214",
        address: "789 Oak Street, Kolkata",
        aadhar: "7788-9900-1122",
      },
      title: "Collapsed Tree",
      description: "A tree has fallen on the sidewalk.",
      severity: "Medium",
      location: "Latitude: 19.2057984, Longitude: 72.8397031",
      status: "Under Process",
      accept: true,
    },
    {
      id: 6789,
      user: {
        firstName: "Emily",
        lastName: "Clark",
        email: "emilyclark@example.com",
        phone: "+91 9876543215",
        address: "123 Cedar Lane, Chennai",
        aadhar: "2233-4455-6677",
      },
      title: "Graffiti on Wall",
      description: "Graffiti spotted on the wall of the local park.",
      severity: "Low",
      location: "Latitude: 19.217123, Longitude: 72.845982",
      status: "Under Process",
      accept: true,
    },
    {
      id: 7890,
      user: {
        firstName: "Nathan",
        lastName: "Lee",
        email: "nathanlee@example.com",
        phone: "+91 9876543216",
        address: "654 Birch Street, Hyderabad",
        aadhar: "3344-5566-7788",
      },
      title: "Overflowing Garbage Bin",
      description: "Garbage bin near the market is overflowing.",
      severity: "High",
      location: "Latitude: 19.197654, Longitude: 72.824567",
      status: "Under Process",
      accept: true,
    },
    {
      id: 8901,
      user: {
        firstName: "Sophia",
        lastName: "Brown",
        email: "sophiabrown@example.com",
        phone: "+91 9876543217",
        address: "987 Walnut Avenue, Ahmedabad",
        aadhar: "5566-7788-9900",
      },
      title: "Damaged Road Sign",
      description: "A road sign near the traffic signal is damaged.",
      severity: "Medium",
      location: "Latitude: 19.209876, Longitude: 72.821234",
      status: "Under Process",
      accept: false,
    },
    {
      id: 9012,
      user: {
        firstName: "Liam",
        lastName: "Wilson",
        email: "liamwilson@example.com",
        phone: "+91 9876543218",
        address: "789 Willow Drive, Lucknow",
        aadhar: "6677-8899-0011",
      },
      title: "Blocked Drain",
      description: "Drain is blocked near the residential area.",
      severity: "High",
      location: "Latitude: 19.195678, Longitude: 72.834567",
      status: "Under Process",
      accept: true,
    },
    {
      id: 1023,
      user: {
        firstName: "Olivia",
        lastName: "Martinez",
        email: "oliviamartinez@example.com",
        phone: "+91 9876543219",
        address: "246 Sycamore Lane, Jaipur",
        aadhar: "7788-9900-1122",
      },
      title: "Noise Complaint",
      description: "Loud music from the nearby house late at night.",
      severity: "Low",
      location: "Latitude: 19.208765, Longitude: 72.828904",
      status: "Under Process",
      accept: true,
    },
  ]);
  

  useEffect(() => {
    const selectedIncident = incidents.find((incident) => incident.id === reportId);
    setFullDetails(selectedIncident);
  }, [reportId, incidents]);

  if (!fullDetails) {
    return <div className="text-center text-red-500 font-bold mt-10">No Report Found</div>;
  }

  const downloadPDF = () => {
    const input = document.getElementById("report-details");
  
    // Make sure the content is rendered before calling html2canvas
    if (input) {
      console.log("Generating PDF...");
  
      html2canvas(input).then((canvas) => {
        console.log("Canvas generated", canvas);
  
        // Check if the canvas has content
        if (canvas.width === 0 || canvas.height === 0) {
          console.error("Canvas size is zero, content might not be rendered properly.");
          return;
        }
  
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
  
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
        console.log(`PDF dimensions: ${pdfWidth}x${pdfHeight}`);
        
        pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight); // Set appropriate margins
        pdf.save(`Incident_Report_${fullDetails.id}.pdf`);
      }).catch((err) => {
        console.error("Error generating PDF:", err);
      });
    } else {
      console.error("Report details element not found.");
    }
  };
  




  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6" >
      
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full border-l-8 border-blue-500">
      <div id="report-details">
        <div>
        {/* Report Header */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Incident Report</h1>

        {/* Report Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Report Details</h2>
          <hr className="mb-4" />
          <p className="text-gray-800 font-bold">
            Report ID: <span className="font-normal">{fullDetails.id}</span>
          </p>
          <p className="text-gray-800 font-bold">
            Severity:{" "}
            <span
              className={`px-3 py-1 text-md  font-bold rounded-full  ${
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
            <strong>Title:</strong> {fullDetails.title}
          </p>
          <p className="text-gray-800">
            <strong>Description:</strong> {fullDetails.description}
          </p>
          <p className="text-gray-800">
            <strong>Location:</strong> {fullDetails.location}
          </p>
        </div>

        {/* User Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">User Details</h2>
          <hr className="mb-4" />
          <p className="text-gray-800">
            <strong>First Name:</strong> {fullDetails.user.firstName}
          </p>
          <p className="text-gray-800">
            <strong>Last Name:</strong> {fullDetails.user.lastName}
          </p>
          <p className="text-gray-800">
            <strong>Email:</strong> {fullDetails.user.email}
          </p>
          <p className="text-gray-800">
            <strong>Phone:</strong> {fullDetails.user.phone}
          </p>
          <p className="text-gray-800">
            <strong>Address:</strong> {fullDetails.user.address}
          </p>
          <p className="text-gray-800">
            <strong>Aadhar Number:</strong> {fullDetails.user.aadhar}
          </p>
        </div>
        </div>
        </div>
<div className="flex justify-center items-center flex-col">
<button
            className="lg:w-80 sm:w-56 md:w-56 lg:px-20 sm:px-36 my-5 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
            onClick={downloadPDF}
          >
            Download as PDF
          </button>



        {/* Back Button */}
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
