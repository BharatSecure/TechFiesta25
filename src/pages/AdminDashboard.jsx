import React, { useState, useEffect } from "react";
import {
  MdReportProblem,
  MdCheckCircle,
  MdHourglassEmpty,
  MdChat,
} from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [total, setTotal] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [unresolved, setUnResolved] = useState(0);
  const [newTasks, setNewTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [filternew, setFilterNew] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const token = localStorage.getItem("accessToken");
  const getincidents = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/all_station_incidents/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const incidentData = await response.json();
        setIncidents(incidentData);
      } else {
        console.error("Failed to fetch incidents");
      }
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  useEffect(() => {
    getincidents();
  }, []);

  const getSeverityColor = (severity) => {
    if (severity === "low") return "text-blue-700 border-blue-600 bg-blue-200";
    if (severity === "medium")
      return "text-yellow-700 border-yellow-600 bg-yellow-200";
    if (severity === "high") return "text-red-700 border-red-600 bg-red-200";
    return "text-gray-700 border-gray-600 bg-gray-200";
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = "/";
    logout();
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
    setUnResolved(unresolvedIncidents);
  }, [incidents]);

  useEffect(() => {
    const newIncidentList = incidents.filter(
      (incident) => incident.status === "submitted"
    );
    setNewTasks(newIncidentList);
  }, [incidents]);

  useEffect(() => {
    const filteredIncidents = incidents.filter((incident) => {
      if (filter === "All") {
        return incident.status !== "submitted";
      }
      return (
        incident.severity === filter.toLowerCase() &&
        incident.status !== "submitted"
      );
    });

    setFilterNew(filteredIncidents);
  }, [filter, incidents]);

  const handlefilter = (e) => {
    setFilter(e);
  };

  const handleNewTask = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/update_incident/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "processing" }),
        }
      );

      if (response.ok) {
        getincidents(); // Refresh incidents after update
      } else {
        console.error("Failed to update incident");
      }
    } catch (error) {
      console.error("Error updating incident:", error);
    }
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/update_incident/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Resolved" }),
        }
      );

      if (response.ok) {
        getincidents(); // Refresh incidents after update
      } else {
        console.error("Failed to mark incident as completed");
      }
    } catch (error) {
      console.error("Error marking incident as completed:", error);
    }
  };

  return (
    <div className="h-full bg-gradient-to-r from-green-100 to-green-200">
      <div className="flex-grow p-8 pb-24">
        <header className="mb-6 lg:text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            <span className="block sm:inline text-lg sm:text-xl md:text-2xl text-emerald-600">
              Admin Dashboard
            </span>
          </h1>
        </header>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          style={{ float: "right", position: "relative", top: "-50px" }}
        >
          Logout
        </button>

        <div className="flex flex-wrap gap-6 mb-6 justify-center mt-16 ml-8 sm:ml-0">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-between w-full sm:w-80 border-4 border-red-500 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">
                Total Incidents
              </h3>
              <p className="text-3xl font-bold text-gray-900">{total}</p>
            </div>
            <MdReportProblem className="text-red-500 text-6xl" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-between w-full sm:w-80 border-4 border-green-500 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">
                Resolved Incidents
              </h3>
              <p className="text-3xl font-bold text-gray-900">{resolved}</p>
            </div>
            <MdCheckCircle className="text-green-500 text-6xl" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-between w-full sm:w-80 border-4 border-yellow-500 cursor-pointer">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">
                Unresolved Incidents
              </h3>
              <p className="text-3xl font-bold text-gray-900">{unresolved}</p>
            </div>
            <MdHourglassEmpty className="text-yellow-500 text-6xl" />
          </div>
        </div>

        {newTasks.length === 0 ? (
          <h2 className="text-2xl my-11">No New Reports Available</h2>
        ) : (
          <div>
            <h1 className="text-4xl font-semibold mt-10">New Incidents:</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 from-green-100 to-green-200 mb-14">
              {newTasks.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-6 rounded-lg shadow-lg border-2 border-black ${getSeverityColor(
                    incident.severity
                  )}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`px-3 py-1 rounded border font-bold text-lg ${getSeverityColor(
                        incident.severity
                      )}`}
                    >
                      {incident.severity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {incident.incidentType}
                    </h3>
                    <p className="text-gray-800 font-bold text-xl">
                      ID: {incident.id}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {incident.description}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    Reported By: {incident.reported_by?.username || "Unknown"}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {incident.location
                      ? `${incident.location.latitude}, ${incident.location.longitude}`
                      : "No location"}
                  </p>
                  <button
                    className="bg-purple-400 hover:bg-purple-600 px-5 py-2 rounded-lg text-black"
                    onClick={() => handleNewTask(incident.id)}
                  >
                    Accept Task
                  </button>
                  <button
                    className="bg-gray-800 hover:bg-gray-950 text-white px-4 py-2 rounded-lg mt-4 relative bottom-0 right-0 w-full"
                    onClick={() => navigate(`/view-details/${incident.id}`)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <h1 className="text-4xl font-semibold mb-5">Accepted Incidents</h1>
        <form className="mb-6 flex flex-row items-center justify-start gap-4 space-y-2">
          <label
            htmlFor="severity-filter"
            className="text-lg font-semibold text-gray-800 mb-2"
          >
            Filter by Severity:
          </label>
          <select
            id="severity-filter"
            className="cursor-pointer w-64 p-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:shadow-md transition-all"
            value={filter}
            onChange={(event) => handlefilter(event.target.value)}
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 from-green-100 to-green-200">
          {filternew.map((incident) => (
            <div
              key={incident.id}
              className={`p-6 rounded-lg shadow-lg border-2 border-black ${getSeverityColor(
                incident.severity
              )}`}
            >
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded border font-bold text-lg ${getSeverityColor(
                    incident.severity
                  )}`}
                >
                  {incident.severity}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {incident.incidentType}
                </h3>
                <p className="text-gray-800 font-bold text-xl">
                  ID: {incident.id}
                </p>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {incident.description}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                Reported By: {incident.reported_by?.username || "Unknown"}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {incident.location
                  ? `${incident.location.latitude}, ${incident.location.longitude}`
                  : "No location"}
              </p>

              <div className="flex gap-4 items-center">
                <Popover>
                  <PopoverTrigger>
                    <MdChat
                      title="Contact Authorities"
                      className="text-black cursor-pointer hover:text-black hover:scale-105 transition-transform text-3xl"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="p-4 bg-white w-full h-full">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        Chat with {incident.reported_by?.username || "User"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start a conversation to discuss this incident.
                      </p>
                      <div className="flex justify-end gap-2">
                        <button className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition">
                          Start Chat
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {incident.status !== "Resolved" && (
                  <button
                    onClick={() => handleMarkAsCompleted(incident.id)}
                    className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
                  >
                    Mark as Completed
                  </button>
                )}

                {incident.status === "Resolved" && (
                  <span className="text-green-700 font-bold border border-green-500 px-2 py-1 rounded">
                    Completed
                  </span>
                )}
              </div>

              <button
                className="bg-gray-800 hover:bg-gray-950 text-white px-4 py-2 rounded-lg mt-4 relative bottom-0 right-0 w-full"
                onClick={() => navigate(`/view-details/${incident.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
