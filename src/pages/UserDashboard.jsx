import React, { useState, useEffect } from "react";
import { MdReportProblem } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";
import { MdHourglassEmpty } from "react-icons/md";
import { MdChat } from "react-icons/md";
import { data, Navigate, useNavigate } from "react-router-dom";
// import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import FloatingChatbot from "@/components/FloatingChatbot";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useAuth();
  console.log(`is logged in ${isLoggedIn}`);

  const [total, setTotal] = useState();
  const [resolved, setResolved] = useState(0);
  const [unresolved, setUnResolved] = useState(0);
  const [incidents, setIncidents] = useState([]);
  const token = localStorage.getItem("accessToken");

  const getSeverityColor = (severity) => {
    if (severity === "low")
      return "text-yellow-700 border-lime-600 bg-lime-300 border-2";
    if (severity === "medium")
      return "text-yellow-700 border-yellow-600 bg-yellow-300 border-2";
    if (severity === "high")
      return "text-red-800 border-red-600 bg-red-300 border-2";
  };

  const getStatusColor = (status) => {
    if (status === "Resolved") return "bg-green-100 text-green-700";
    if (status === "submitted") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    logout();
    navigate("/login");
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

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // console.log(`Access Token: ${token}`);
        const response = await fetch(
          "http://127.0.0.1:8000/api/all_user_incidents/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Replace with your actual token logic
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Incidents Response Data:", data);

          if (Array.isArray(data.incidents)) {
            setIncidents(data.incidents); // Set incidents state here
            setTotal(data.incidents.length);
            setResolved(
              data.incidents.filter((inci) => inci.status === "Resolved").length
            );
            setUnResolved(
              data.incidents.filter((inci) => inci.status !== "Resolved").length
            );
          } else {
            console.error("Unexpected data format:", data);
          }
        } else {
          console.error(
            `Error fetching incidents: ${response.statusText} (Status: ${response.status})`
          );
        }
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents();
  }, []); // Empty dependency array ensures this runs only once

  console.log("user data dashboard", incidents);
  return (
    <>
      <div className="h-full bg-gradient-to-r from-green-100 to-green-200">
        <div className="p-8">
          {/* Header */}
          <header className="mb-6 lg:text-center">
            <h1 className="text-xl lg:text-3xl sm:text-2xl md:text-2xl font-semibold text-gray-800">
              <span className="text-sky-600">Your Dashboard</span>
            </h1>
          </header>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-soft hover:shadow-soft-hover"
            style={{ float: "right", position: "relative", top: "-50px" }}
          >
            Logout
          </button>
          {/* Dashboard Stats Cards */}
          <div className="flex flex-wrap gap-6 mb-6 justify-center mt-16 ml-8 sm:ml-0">
            {/* Total Incidents Card */}
            <div className="bg-red-200 border-red-800 p-6 rounded-2xl shadow-soft hover:shadow-soft-hover transition-all transform hover:scale-105 flex items-center justify-between w-full sm:w-80 border-2 cursor-pointer">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Total Incidents
                </h3>
                <p className="text-3xl font-bold text-gray-900">{total}</p>
              </div>
              <MdReportProblem className="text-red-500 text-6xl" />
            </div>

            {/* Resolved Incidents Card */}
            <div className="bg-green-200 border-green-700 p-6 rounded-2xl shadow-soft hover:shadow-soft-hover transition-all transform hover:scale-105 flex items-center justify-between w-full sm:w-80 border-2  cursor-pointer">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Resolved Incidents
                </h3>
                <p className="text-3xl font-bold text-gray-900">{resolved}</p>
              </div>
              <MdCheckCircle className="text-green-500 text-6xl" />
            </div>

            {/* Unresolved Incidents Card */}
            <div className="bg-yellow-200 border-yellow-800 p-6 rounded-2xl shadow-soft hover:shadow-soft-hover transition-all transform hover:scale-105 flex items-center justify-between w-full sm:w-80 border-2 cursor-pointer">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  Unresolved Incidents
                </h3>
                <p className="text-3xl font-bold text-gray-900">{unresolved}</p>
              </div>
              <MdHourglassEmpty className="text-yellow-500 text-6xl" />
            </div>
          </div>

          {/* All Incidents Table */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-16">
            All Incidents
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl shadow-soft overflow-hidden">
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
                    <td className="p-4 font-semibold">
                      {incident.incidentType}
                    </td>
                    <td className="p-3 max-w-80 h-5">
                      <div className="max-h-20 p-3 overflow-y-auto">
                        {incident.description}
                      </div>
                    </td>
                    <td className="p-4 items-center">
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-soft ${getSeverityColor(
                          incident.severity
                        )}`}
                      >
                        {incident.severity?.charAt(0).toUpperCase() +
                          incident.severity?.slice(1)}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-soft ${getStatusColor(
                          incident.status
                        )}`}
                      >
                        {incident.status?.charAt(0).toUpperCase() +
                          incident.status?.slice(1)}
                      </button>
                    </td>
                    <td className="p-4 text-gray-600">{incident.maps_link}</td>
                    <td className="p-4 text-center">
                      <Popover>
                        <PopoverTrigger>
                          <MdChat
                            title="Contact Authorities"
                            className="text-sky-500 cursor-pointer hover:text-sky-700 transition-all text-3xl"
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="p-4 bg-white rounded-2xl shadow-soft w-full h-full">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                              Chat with Authorities
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Start a conversation with authorities to discuss
                              this incident. Provide updates or ask for guidance
                              in real-time.
                            </p>
                            <div className="flex justify-end gap-2">
                              <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all shadow-soft hover:shadow-soft-hover">
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
      </div>

      <Footer />
      <FloatingChatbot />
    </>
  );
};

export default UserDashboard;
