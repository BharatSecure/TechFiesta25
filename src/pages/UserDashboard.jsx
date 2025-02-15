import React, { useState, useEffect } from "react";

import { MessageCircle } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Timer } from "lucide-react";
import { MapPin } from "lucide-react";
// import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import FloatingChatbot from "@/components/FloatingChatbot";
import { Navigate, useNavigate } from "react-router-dom";
import OrderProgress from "@/components/ProgressBar";
import ChartsUser from "./charts-user";

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
    if (severity === "low") return "text-blue-400 border-lime-300  border-2";
    if (severity === "medium")
      return "text-yellow-400 border-yellow-300  border-2";
    if (severity === "high") return "text-red-400 border-red-300  border-2";
  };

  // const getStatusColor = (status) => {
  //   if (status === "Resolved") return "bg-green-100 text-green-300";
  //   if (status === "submitted") return "bg-red-100 text-red-300";
  //   return "bg-yellow-100 text-yellow-300";
  // };

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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-xl text-left md:text-center md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600 [text-shadow:_0_0_30px_rgb(6_182_212_/_45%)]">
              Your Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 text-red-500 font-bold border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all absolute right-8 top-20 md:top-28"
            >
              Logout
            </button>
          </div>

          {/* Dashboard Stats Cards */}
          <div className="flex flex-col md:flex-row  items-center gap-6  mb-8 justify-center ">
            {/* Total Incidents Card */}
            <div className="bg-white/5 p-6 rounded-2xl cursor-pointer border-white/10 shadow-[0px_5px_15px_rgba(255,255,255,0.1),0px_10px_25px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0px_10px_30px_rgba(255,255,255,0.15),0px_15px_50px_rgba(0,0,0,0.8)] flex items-center justify-between group w-64 md:w-80 border-2 border-red-500">
              <div>
                <h3 className="text-gray-400 font-medium mb-1">
                  Total Incidents
                </h3>
                <p className="text-3xl font-bold text-white">{total}</p>
              </div>
              <AlertTriangle className="text-red-400 w-12 h-12 group-hover:scale-110 transition-transform" />
            </div>

            {/* Resolved Incidents Card */}

            <div className="bg-white/5 cursor-pointer border-2 border-white/10 p-6 rounded-2xl shadow-[0px_5px_15px_rgba(255,255,255,0.1),0px_10px_25px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0px_10px_30px_rgba(100,255,100,0.2),0px_15px_50px_rgba(0,0,0,0.8)] flex items-center justify-between group w-64 md:w-80 hover:border-green-500 ">
              <div>
                <h3 className="text-gray-400 font-medium mb-1">Resolved</h3>
                <p className="text-3xl font-bold text-white">{resolved}</p>
              </div>
              <CheckCircle2 className="text-emerald-400 w-12 h-12 group-hover:scale-110 transition-transform" />
            </div>

            {/* Unresolved Incidents Card */}
            <div className="bg-white/5  p-6 cursor-pointer rounded-2xl border-white/10 shadow-[0px_5px_15px_rgba(255,255,255,0.1),0px_10px_25px_rgba(0,0,0,0.7)] transition-all hover:scale-105 hover:shadow-[0px_10px_30px_rgba(255,204,0,0.2),0px_15px_50px_rgba(0,0,0,0.8)] flex items-center justify-between group w-64 md:w-80 border-2 border-yellow-500">
              <div>
                <h3 className="text-gray-400 font-medium mb-1">Unresolved</h3>
                <p className="text-3xl font-bold text-white">{unresolved}</p>
              </div>
              <Timer className="text-yellow-400 w-12 h-12 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* All Incidents Table */}
          <div className="rounded-2xl border border-white/10  overflow-hidden">
            <h2 className="text-xl font-semibold text-white p-6 border-b border-white/10 bg-white/5">
              All Incidents
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 text-center text-gray-400 font-medium">
                      ID
                    </th>
                    <th className="p-4 text-center text-gray-400 font-medium">
                      Title
                    </th>
                    <th className="p-4 text-center text-gray-400 font-medium">
                      Description
                    </th>
                    <th className="p-4 text-center text-gray-400 font-medium">
                      Severity
                    </th>
                    <th className="p-4 text-center text-gray-400 font-medium">
                      Status
                    </th>
                    <th className="p-4 text-center text-gray-400 font-medium">
                      Location
                    </th>
                    <th className="p-4 text-center text-gray-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => {
                    let step = 0; // Default value

                    if (incident?.status?.toLowerCase() === "resolved") {
                      step = 2;
                    } else if (
                      incident?.status?.toLowerCase() === "under investigation"
                    ) {
                      step = 1;
                    }

                    return (
                      // Add return statement here
                      <tr
                        key={incident.id}
                        className="border-b border-white/10 hover:bg-white/5 transition-color text-center"
                      >
                        <td className="p-4 text-gray-300">#{incident.id}</td>
                        <td className="p-4 text-white font-medium">
                          {incident.incidentType}
                        </td>
                        <td className="p-4 text-gray-300 max-w-xs">
                          <div className="line-clamp-2 overflow-y-auto">
                            {incident.description}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`rounded-lg px-4 py-2 bg-transparent w-28 text-center font-bold ${getSeverityColor(
                              incident.severity
                            )}`}
                          >
                            {incident.severity?.charAt(0).toUpperCase() +
                              incident.severity?.slice(1)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <OrderProgress steps1={step} />
                          </div>
                        </td>
                        <td className="p-4">
                          <a
                            href={incident.maps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors"
                          >
                            <MapPin className="text-xl" />
                          </a>
                        </td>
                        <td className="p-4">
                          <Popover>
                            <PopoverTrigger>
                              <button className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors">
                                <MessageCircle className="text-xl" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
                              <div className="p-4 bg-transparent rounded-xl border border-white/20">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                  Chat with Authorities
                                </h3>
                                <p className="text-gray-300 mb-4 text-sm">
                                  Start a conversation with authorities to
                                  discuss this incident.
                                </p>
                                <button className="w-full px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all">
                                  Start Chat
                                </button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <ChartsUser />
        <Footer />
      </div>

      <FloatingChatbot />
    </>
  );
};

export default UserDashboard;
