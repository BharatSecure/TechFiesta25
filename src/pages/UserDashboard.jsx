import React, { useState, useEffect } from "react";
import { MdReportProblem } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";
import { MdHourglassEmpty } from "react-icons/md";
import { MdChat } from "react-icons/md";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const UserDashboard = () => {
  const { logout } = useAuth();

  const dashboardStats = {
    totalIncidents: 15,
    resolvedIncidents: 10,
    unresolvedIncidents: 5,
  };

  const [total, setTotal] = useState();
  const [resolved, setResolved] = useState(0);
  const [unresolved, setUnResolved] = useState(0);

  const incidents = [
    {
      id: 3319,
      title: "Broken Streetlight",
      description: "A streetlight is broken near the park.",
      severity: "Medium",
      Location: "Latitude: 19.185664, Longitude: 72.8367104",
      status: "Resolved",
    },
    {
      id: 1269,
      title: "Pothole on Road",
      description: "A big pothole on the main road.",
      Location: "Latitude: 19.185664, Longitude: 72.8367104",
      severity: "High",
      status: "Under Process",
    },
    {
      id: 1012,
      title: "Flooding in Basement",
      description: "Water leakage in the building basement.",
      Location: "Latitude: 19.185664, Longitude: 72.8367104",
      severity: "Low",
      status: "Under Process",
    },
    // Add more incidents as needed
  ];

  const getSeverityColor = (severity) => {
    if (severity === "Low")
      return "text-yellow-700 border-lime-600 bg-lime-300 border-2";
    if (severity === "Medium")
      return "text-yellow-700 border-yellow-600 bg-yellow-300 border-2";
    if (severity === "High")
      return "text-red-800 border-red-600 bg-red-300 border-2";
  };

  const getStatusColor = (status) => {
    if (status === "Resolved") return "bg-green-100 text-green-700";
    if (status === "Not Resolved") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const handleLogout = () => {
    window.location.href = "/";
    logout();
  };
  useEffect(() => {
    let totalIncidents = 0;
    let resolvedIncidents = 0;
    let unresolvedIncidents = 0;

    incidents.forEach((inci) => {
      
      totalIncidents++;
      if (inci.status === "Resolved") {
        resolvedIncidents++;
      } else {
        unresolvedIncidents++;
      }
    });

    setTotal(totalIncidents);
    setResolved(resolvedIncidents);
    setUnResolved(unresolvedIncidents);
  }, [incidents]);

  return (
    <>
      <div className="h-screen bg-gradient-to-r from-green-100 to-green-200">
        <div className="p-8">
          {/* Header */}
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-semibold text-gray-800">
              <span className="text-sky-600">Your Dashboard</span>
            </h1>
          </header>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            style={{ float: "right", position: "relative", top: "-50px" }}
          >
            Logout
          </button>
          {/* Dashboard Stats Cards */}
          <div className="flex flex-row gap-6 mb-6 justify-center mt-16 ml-8 ">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-evenly w-80 border-4 border-r-4 border-b-red-500 border-l-red-500 border-r-red-500 cursor-pointer">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Total Incidents
                </h3>
                <p className="text-3xl font-bold text-gray-900">{total}</p>
              </div>
              <MdReportProblem className="text-red-500 mr-2 text-6xl " />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-evenly w-80 border-4 border-r-4 border-b-green-500 border-l-green-500 border-r-green-500 cursor-pointer">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Resolved Incidents
                </h3>
                <p className="text-3xl font-bold text-gray-900">{resolved}</p>
              </div>
              <MdCheckCircle className="text-green-500 mr-2 text-6xl " />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-evenly w-80 border-4 border-r-4 border-b-yellow-500 border-l-yellow-500 border-r-yellow-500 cursor-pointer">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Unresolved Incidents
                </h3>
                <p className="text-3xl font-bold text-gray-900">{unresolved}</p>
              </div>
              <MdHourglassEmpty className="text-yellow-500 mr-2 text-6xl " />
            </div>
          </div>

          {/* All Incidents Table */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-16">
            All Incidents
          </h2>
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-gray-600">ID</th>
                <th className="p-4 text-left text-gray-600">Title</th>
                <th className="p-4 text-left text-gray-600">Description</th>
                <th className="p-4 text-left text-gray-600">Severity</th>
                <th className="p-4 text-left text-gray-600">Status</th>
                <th className="p-4 text-left text-gray-600">Location</th>
                <th className="p-4 text-left text-gray-600">Chat</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr
                  key={incident.id}
                  className="hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <td className="p-4 font-semibold">{incident.id}</td>
                  <td className="p-4 font-semibold">{incident.title}</td>
                  <td className="p-4">{incident.description}</td>
                  <td className="p-4 items-center">
                    <button
                      className={`px-4 py-2 rounded-md  text-sm font-semibold ${getSeverityColor(
                        incident.severity
                      )}`}
                    >
                      {incident.severity}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      className={`px-4 py-2 rounded- text-sm font-semibold ${getStatusColor(
                        incident.status
                      )}`}
                    >
                      {incident.status}
                    </button>
                  </td>
                  <td className="p-4 text-gray-600">{incident.Location}</td>
                  <td className="p-4 text-center">
                    <Popover>
                      <PopoverTrigger>
                        <MdChat
                          title="Contact Authorities"
                          className="text-sky-500 cursor-pointer hover:text-sky-700 transition-all text-3xl"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="p-4 bg-white w-full h-full">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Chat with Authorities
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Start a conversation with authorities to discuss
                            this incident. Provide updates or ask for guidance
                            in real-time.
                          </p>
                          <div className="flex justify-end gap-2">
                            <button className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition">
                              Start Chat
                            </button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserDashboard;
