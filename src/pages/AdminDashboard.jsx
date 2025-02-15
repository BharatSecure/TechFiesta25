import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Timer } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { MapPin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MdOutlineReport } from "react-icons/md";
import { MdReport } from "react-icons/md";
import AdminCharts from "./chart";

const AdminDashboard = () => {
  const [total, setTotal] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [unresolved, setUnResolved] = useState(0);
  const [newTasks, setNewTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [filternew, setFilterNew] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [completedId, setCompletedId] = useState([]);
  const [falseReport, setFalseReport] = useState([{}]);
  const [flaggedIncidents, setFlaggedIncidents] = useState([]);

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

  useEffect(() => {}, [incidents]);

  useEffect(() => {
    getincidents();
  }, []);

  const getSeverityColor = (severity) => {
    if (severity === "low") return "text-blue-700 border-blue-600 bg-blue-200";
    if (severity === "medium") return "text-yellow-700 border-yellow-600";
    if (severity === "high") return "text-red-700 border-red-600 bg-red-200";
    return "text-gray-700 border-gray-600 bg-gray-200";
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = "/";
    localStorage.removeItem("userType");
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
        return (
          incident.status !== "submitted" && incident.status !== "Resolved"
        );
      }
      return (
        incident.severity === filter.toLowerCase() &&
        incident.status !== "submitted" &&
        incident.status !== "Resolved"
      );
    });

    setFilterNew(filteredIncidents);
  }, [filter, incidents]);

  const handlefilter = (e) => {
    setFilter(e);
  };

  const fetchFlaggedIncidents = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/all_station_incidents/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const flagged = data.filter((incident) => incident.true_or_false); // Assuming 'true_or_false' marks flagged reports
        setFlaggedIncidents(flagged);
      } else {
        console.error("Failed to fetch flagged incidents");
      }
    } catch (error) {
      console.error("Error fetching flagged incidents:", error);
    }
  };

  // Fetch flagged incidents when the component mounts
  useEffect(() => {
    fetchFlaggedIncidents();
  }, []);

  const handleNewTask = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/update_incident/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "under investigation" }),
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

  useEffect(() => {
    const completedmarked = incidents.filter(
      (incident) => incident.status === "Resolved"
    );

    setCompletedId(completedmarked);
  }, [filter, incidents]);

  const handleFalseReport = async (id) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/all_station_incidents/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ incident_id: id }),
        }
      );

      if (response.ok) {
        setIncidents((prevIncidents) =>
          prevIncidents.filter((incident) => incident.id !== id)
        );
        alert("Report marked as False and removed from the list");
      } else {
        console.error("Failed to mark report as false");
      }
    } catch (error) {
      console.error("Error marking report as false:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      <div className="flex-grow p-8 pb-24">
        <div className="mb-10">
          <h1 className="text-xl text-left md:text-center md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600 [text-shadow:_0_0_30px_rgb(6_182_212_/_45%)]">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 text-red-500 font-bold border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all absolute right-8 top-20 md:top-28"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row  items-center gap-6  mb-8 justify-center ">
          {/* Total Incidents Card */}
          <div className="bg-white/5  p-6 rounded-2xl cursor-pointer border-[4px] border-red-700 shadow-[0px_5px_15px_rgba(255,255,255,0.1),0px_10px_25px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0px_10px_30px_rgba(255,80,80,0.15),0px_15px_50px_rgba(0,0,0,0.8)] flex items-center justify-between group w-64 md:w-80">
            <div>
              <h3 className="text-gray-400 font-medium mb-1">
                Total Incidents
              </h3>
              <p className="text-3xl font-bold text-white">{total}</p>
            </div>
            <AlertTriangle className="text-red-400 w-12 h-12 group-hover:scale-110 transition-transform" />
          </div>

          {/* Resolved Incidents Card */}

          <div className="bg-white/5 cursor-pointer  p-6 rounded-2xl border-[4px] border-green-700 shadow-[0px_5px_15px_rgba(255,255,255,0.1),0px_10px_25px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0px_10px_30px_rgba(100,255,100,0.2),0px_15px_50px_rgba(0,0,0,0.8)] flex items-center justify-between group w-64 md:w-80">
            <div>
              <h3 className="text-gray-400 font-medium mb-1">Resolved</h3>
              <p className="text-3xl font-bold text-white">{resolved}</p>
            </div>
            <CheckCircle2 className="text-emerald-400 w-12 h-12 group-hover:scale-110 transition-transform" />
          </div>

          {/* Unresolved Incidents Card */}
          <div className="bg-white/5 backdrop-blur-sm p-6 cursor-pointer rounded-2xl border-[4px] border-yellow-700 shadow-[0px_5px_15px_rgba(255,255,255,0.1),0px_10px_25px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0px_10px_30px_rgba(255,204,0,0.2),0px_15px_50px_rgba(0,0,0,0.8)] flex items-center justify-between group w-64 md:w-80">
            <div>
              <h3 className="text-gray-400 font-medium mb-1">Unresolved</h3>
              <p className="text-3xl font-bold text-white">{unresolved}</p>
            </div>
            <Timer className="text-yellow-400 w-12 h-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/*NEW INCIDNETS*/}
        {newTasks.length === 0 ? (
          <h2 className="text-2xl my-11 text-white">
            No New Reports Available
          </h2>
        ) : (
          <div>
            <h1 className="text-4xl text-white font-bold mt-10 md:text-left text-center">
              New Incidents:
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 mb-14 ">
              {newTasks.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-6 rounded-2xl bg-transparent  border ${getSeverityColor(
                    incident.severity
                  )} shadow-[0px_5px_15px_rgba(255,255,255,0.1),0px_10px_25px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0px_10px_30px_rgba(255,255,255,0.15),0px_15px_50px_rgba(0,0,0,0.8)] ${getSeverityColor(
                    incident.severity
                  )} ${
                    incident.count > 1
                      ? `border-4 border-red-500 ${
                          incident.severity === "low"
                            ? "animate-[pulse_1.4s_infinite]"
                            : incident.severity === "medium"
                            ? "animate-[pulse_1.4s_infinite]"
                            : incident.severity === "high"
                            ? "animate-[pulse_1.4s_infinite]"
                            : ""
                        }  shadow-lg shadow-red-500`
                      : ""
                  } w-full`}
                >
                  {incident.count > 1 ? (
                    <div className="text-3xl text-center text-red-500">
                      Multiple Reports!!
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`px-3 py-1 rounded-full font-bold text-lg ${getSeverityColor(
                        incident.severity
                      )}`}
                    >
                      {incident.severity?.charAt(0).toUpperCase() +
                        incident.severity?.slice(1)}
                    </span>
                    {falseReport.some(
                      (report) => report.incidentid === incident.id
                    ) ? (
                      <MdReport
                        className="text-3xl text-red-500 hover:cursor-pointer"
                        title="Marked as False Report"
                      />
                    ) : (
                      <MdOutlineReport
                        onClick={() => handleFalseReport(incident.id)}
                        className="text-3xl text-white hover:text-red-500 cursor-pointer"
                        title="Mark as False Report"
                      />
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {incident.incidentType}
                    </h3>
                    <p className="text-white font-bold text-xl">
                      ID: #{incident.id}
                    </p>
                  </div>
                  <p className="text-gray-300 text-sm mb-2 line-clamp-2 overflow-y-auto">
                    {incident.description}
                  </p>
                  <p className="text-gray-300 text-sm mb-2">
                    Reported By:{" "}
                    <span className="font-semibold text-white">
                      {incident.reported_by?.first_name || "Unknown"}{" "}
                      {incident.reported_by?.last_name || ""}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm mb-2">
                    User Score: {incident.score}
                  </p>
                  <div className="flex gap-2 items-center ">
                    <a
                      href={incident.maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <MapPin className="text-xl" />
                    </a>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg w-full transition-all"
                      onClick={() => handleNewTask(incident.id)}
                    >
                      Accept Task
                    </button>
                    <button
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg w-full transition-all"
                      onClick={() => navigate(`/view-details/${incident.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/*ACEPPTED INCIDENTS*/}

        <h1 className="text-4xl font-semibold mb-5 text-white md:text-left text-center">
          Accepted Incidents
        </h1>
        <form className="mb-6 flex flex-row items-center justify-start gap-4 space-y-2">
          <label
            htmlFor="severity-filter"
            className="text-lg font-semibold text-gray-200 mb-2"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {filternew.map((incident) => (
            <div
              key={incident.id}
              className={`p-6 rounded-2xl bg-transparent border ${getSeverityColor(
                incident.severity
              )} shadow-[0px_5px_15px_rgba(255,255,255,0.1),0px_10px_25px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0px_10px_30px_rgba(255,255,255,0.15),0px_15px_50px_rgba(0,0,0,0.8)] ${getSeverityColor(
                incident.severity
              )} ${
                incident.count > 1
                  ? `border-4 border-red-500 ${
                      incident.severity === "low"
                        ? "animate-[pulse_1.4s_infinite]"
                        : incident.severity === "medium"
                        ? "animate-[pulse_1.4s_infinite]"
                        : incident.severity === "high"
                        ? "animate-[pulse_1.4s_infinite]"
                        : ""
                    }  shadow-lg shadow-red-500`
                  : ""
              } w-full`}
            >
              {incident.count > 1 ? (
                <div className="text-3xl text-center text-red-500">
                  Mass Report!!
                </div>
              ) : (
                ""
              )}
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-lg ${getSeverityColor(
                    incident.severity
                  )}`}
                >
                  {incident.severity?.charAt(0).toUpperCase() +
                    incident.severity?.slice(1)}
                </span>

                {falseReport.some(
                  (report) => report.incidentid === incident.id
                ) ? (
                  <MdReport
                    className="text-3xl text-red-500 hover:cursor-pointer"
                    title="Marked as False Report"
                  />
                ) : (
                  <MdOutlineReport
                    onClick={() => handleFalseReport(incident.id)}
                    className="text-3xl text-white hover:text-red-500 cursor-pointer"
                    title="Mark as False Report"
                  />
                )}
              </div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {incident.incidentType}
                </h3>
                <p className="text-white font-bold text-xl">
                  ID: #{incident.id}
                </p>
              </div>
              <p className="text-gray-300 text-sm mb-2 line-clamp-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
                {incident.description}
              </p>

              <p className="text-gray-300 text-sm mb-2">
                Reported By:{" "}
                <span className="font-semibold text-white">
                  {incident.reported_by?.first_name || "Unknown"}{" "}
                  {incident.reported_by?.last_name || ""}
                </span>
              </p>

              <p className="text-gray-300 text-sm mb-2">
                User Score: {incident.score}
              </p>
              <div className="flex gap-2 items-center mb-5 ">
                <p className="text-gray-300 text-sm ">Location:</p>
                <a
                  href={incident.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <MapPin className="text-xl" />
                </a>
              </div>

              <div className="flex gap-4 items-center">
                <Popover>
                  <PopoverTrigger>
                    <MessageCircle
                      title="Contact Authorities"
                      className="text-white cursor-pointer hover:text-white hover:scale-105 transition-transform text-3xl"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
                    <div className="p-4  bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 w-full h-full">
                      <h3 className="text-lg font-bold text-white mb-2">
                        Chat with{" "}
                        {incident.reported_by?.first_name || "Unknown"}{" "}
                        {incident.reported_by?.last_name || ""}
                      </h3>
                      <p className="text-white mb-4">
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
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
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

        {/*COmpleted Incidentss */}
        <h1 className="text-4xl font-semibold mb-5 mt-12 text-green-300 md:text-left text-center">
          Completed Incidents:
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {completedId.map((incident) => (
            <div
              key={incident.id}
              className={`p-6 rounded-2xl bg-transparent border-4 border-green-500 shadow-[0px_5px_15px_rgba(255,255,255,0.1),0px_10px_25px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0px_10px_30px_rgba(0,255,0,0.15),0px_15px_50px_rgba(0,128,0,0.8)]`}
            >
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-lg  ${getSeverityColor(
                    incident.severity
                  )}`}
                >
                  {incident.severity?.charAt(0).toUpperCase() +
                    incident.severity?.slice(1)}
                </span>
                <div className="px-4 py-2 border-4 rounded-lg border-green-400 text-green-300 font-bold">
                  Completed
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {incident.incidentType}
                </h3>
                <p className="text-white font-bold text-xl">
                  ID: #{incident.id}
                </p>
              </div>

              <p className="text-gray-300 text-sm mb-2 line-clamp-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
                {incident.description}
              </p>

              <p className="text-gray-300 text-sm mb-2">
                Reported By:{" "}
                <span className="font-semibold text-white">
                  {incident.reported_by?.first_name || "Unknown"}{" "}
                  {incident.reported_by?.last_name || ""}
                </span>
              </p>
              <p className="text-gray-300 text-sm mb-2">
                User Score: {incident.score}
              </p>

              <div className="flex gap-2 items-center mb-5 ">
                <p className="text-gray-300 text-sm ">Location:</p>
                <a
                  href={incident.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <MapPin className="text-xl" />
                </a>
              </div>

              <div className="flex gap-4 items-center">
                <Popover>
                  <PopoverTrigger>
                    <MessageCircle
                      title="Contact Authorities"
                      className="text-white cursor-pointer hover:text-white hover:scale-105 transition-transform text-3xl"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
                    <div className="p-4 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 w-full h-full">
                      <h3 className="text-lg font-bold text-white mb-2">
                        Chat with{" "}
                        {incident.reported_by?.first_name || "Unknown"}{" "}
                        {incident.reported_by?.last_name || ""}
                      </h3>
                      <p className="text-white mb-4">
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
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
                  >
                    Mark as Completed
                  </button>
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

        {/* Flagged Incidentss
        <h1 className="text-4xl text-red-500 font-semibold mb-5 mt-12  md:text-left text-center">
          Flagged Incidents:
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {flaggedIncidents.map((incident) => (
            <div
              key={incident.id}
              className={`p-6 rounded-2xl bg-transparent border-4 border-red-500 shadow-[0px_5px_15px_rgba(255,0,0,0.1),0px_10px_25px_rgba(255,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0px_10px_30px_rgba(255,0,0,0.15),0px_15px_50px_rgba(128,0,0,0.8)]`}
            >
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-lg ${getSeverityColor(
                    incident.severity
                  )}`}
                >
                  {incident.severity?.charAt(0).toUpperCase() +
                    incident.severity?.slice(1)}
                </span>
                <div className="px-4 py-2 border-4 rounded-lg border-red-400 text-red-300 font-bold">
                  Flagged
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {incident.incidentType}
                </h3>
                <p className="text-white font-bold text-xl">
                  ID: #{incident.id}
                </p>
              </div>

              <p className="text-gray-300 text-sm mb-2 line-clamp-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
                {incident.description}
              </p>

              <p className="text-gray-300 text-sm mb-2">
                Reported By:{" "}
                <span className="font-semibold text-white">
                  {incident.reported_by?.first_name || "Unknown"}{" "}
                  {incident.reported_by?.last_name || ""}
                </span>
              </p>

              <p className="text-gray-300 text-sm mb-2">
                User Score: {incident.score}
              </p>

              <div className="flex gap-2 items-center mb-5 ">
                <p className="text-gray-300 text-sm ">Location:</p>
                <a
                  href={incident.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <MapPin className="text-xl" />
                </a>
              </div>

              <div className="flex gap-4 items-center">
                <Popover>
                  <PopoverTrigger>
                    <MessageCircle
                      title="Contact Authorities"
                      className="text-white cursor-pointer hover:text-white hover:scale-105 transition-transform text-3xl"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
                    <div className="p-4 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 w-full h-full">
                      <h3 className="text-lg font-bold text-white mb-2">
                        Chat with{" "}
                        {incident.reported_by?.first_name || "Unknown"}{" "}
                        {incident.reported_by?.last_name || ""}
                      </h3>
                      <p className="text-white mb-4">
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
              </div>

              <button
                className="bg-gray-800 hover:bg-gray-950 text-white px-4 py-2 rounded-lg mt-4 relative bottom-0 right-0 w-full"
                onClick={() => navigate(`/view-details/${incident.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div> */}
        <AdminCharts />
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
