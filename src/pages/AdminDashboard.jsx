import React, { useState, useEffect } from "react";
import { MdReportProblem, MdCheckCircle, MdHourglassEmpty, MdChat } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  const [total, setTotal] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [unresolved, setUnresolved] = useState(0);

  const incidents = [
    {
      id: 3319,
      user: "John Doe",
      title: "Broken Streetlight",
      description: "A streetlight is broken near the park.",
      severity: "Medium",
      location: "Latitude: 19.185664, Longitude: 72.8367104",
      status: "Resolved",
    },
    {
      id: 1269,
      user: "Jane Smith",
      title: "Pothole on Road",
      description: "A big pothole on the main road.",
      severity: "High",
      location: "Latitude: 19.185664, Longitude: 72.8367104",
      status: "Under Process",
    },
    {
      id: 1012,
      user: "Michael Johnson",
      title: "Flooding in Basement",
      description: "Water leakage in the building basement.",
      severity: "Low",
      location: "Latitude: 19.185664, Longitude: 72.8367104",
      status: "Under Process",
    },
  ];

  const getSeverityColor = (severity) => {
    if (severity === "Low") return "text-green-700 border-green-600 bg-green-200";
    if (severity === "Medium") return "text-yellow-700 border-yellow-600 bg-yellow-200";
    if (severity === "High") return "text-red-700 border-red-600 bg-red-200";
  };

  const getStatusColor = (status) => {
    if (status === "Resolved") return "bg-green-100 text-green-700";
    if (status === "Not Resolved") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  useEffect(() => {
    let totalIncidents = 0;
    let resolvedIncidents = 0;
    let unresolvedIncidents = 0;

    incidents.forEach((incident) => {
      totalIncidents++;
      if (incident.status === "Resolved") {
        resolvedIncidents++;
      } else {
        unresolvedIncidents++;
      }
    });

    setTotal(totalIncidents);
    setResolved(resolvedIncidents);
    setUnresolved(unresolvedIncidents);
  }, [incidents]);

  return (
    <>
      <div className="h-screen bg-gradient-to-r from-teal-100 to-teal-200">
        <div className="p-8">
          {/* Header */}
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              <span className="text-emerald-600">Admin Dashboard</span>
            </h1>
          </header>

          {/* Dashboard Stats Cards */}
          <div className="flex flex-row gap-6 mb-6 justify-center mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 w-80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium text-gray-700">Total Incidents</h3>
                  <p className="text-3xl font-bold text-gray-900">{total}</p>
                </div>
                <MdReportProblem className="text-red-500 text-6xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 w-80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium text-gray-700">Resolved Incidents</h3>
                  <p className="text-3xl font-bold text-gray-900">{resolved}</p>
                </div>
                <MdCheckCircle className="text-green-500 text-6xl" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 w-80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium text-gray-700">Unresolved Incidents</h3>
                  <p className="text-3xl font-bold text-gray-900">{unresolved}</p>
                </div>
                <MdHourglassEmpty className="text-yellow-500 text-6xl" />
              </div>
            </div>
          </div>

          {/* Incidents Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {incidents.map((incident) => (
              <div key={incident.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800">{incident.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                <p className="text-gray-600 text-sm mb-2">Reported By: {incident.user}</p>
                <p className={`mb-2 px-3 py-1 rounded ${getSeverityColor(incident.severity)}`}>
                  Severity: {incident.severity}
                </p>
                <p className={`mb-2 px-3 py-1 rounded ${getStatusColor(incident.status)}`}>
                  Status: {incident.status}
                </p>
                <p className="text-gray-600 text-sm mb-4">{incident.location}</p>
                <Popover>
                  <PopoverTrigger>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Chat with User
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="p-4">
                      <h4 className="text-md font-semibold text-gray-800">Chat with User</h4>
                      <p className="text-sm text-gray-600">
                        Discuss the incident and provide updates or support.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminDashboard;
