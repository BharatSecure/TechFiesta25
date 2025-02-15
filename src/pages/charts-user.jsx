import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const COLORS = [
  "#00ffff", // cyan
  "#00ccff", // light blue
  "#0099ff", // blue
  "#0066ff", // darker blue
  "#0033ff", // even darker blue
  "#00ff99", // mint
];

const IncidentDashboardUser = () => {
  const [stats, setStats] = useState({
    incident_types: [],
    monthly_trend: [],
    severity_distribution: [],
    score_trend: [],
    total_incidents: 0,
    average_score: 0,
  });
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        setLoading(true);
        const response = await fetch(
          "http://127.0.0.1:8000/api/incident-chart-user/",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setStats({
          incident_types: data.incident_types || [],
          monthly_trend: data.monthly_trend || [],
          severity_distribution: data.severity_distribution || [],
          score_trend: data.score_trend || [],
          total_incidents: data.total_incidents || 0,
          average_score: data.average_score || 0,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setStats({
          incident_types: [],
          monthly_trend: [],
          severity_distribution: [],
          score_trend: [],
          total_incidents: 0,
          average_score: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#001830] text-cyan-400">
        <div className="text-lg">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#001830] min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2 p-4 rounded-xl shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.3),_inset_5px_5px_15px_rgba(0,255,255,0.1)] border border-cyan-400/20">
          Your Analytics
        </h1>
        <p className="text-cyan-300/80">Track and analyze your incident data</p>
      </div>

      {/* Controls Section */}
      <div className="flex justify-end mb-8">
        <select
          className="px-4 py-2 bg-[#002345] text-cyan-400 border border-cyan-400/30 rounded-lg shadow-[inset_-2px_-2px_8px_rgba(0,0,0,0.3),_inset_2px_2px_8px_rgba(0,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-[#002345] rounded-xl p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(0,255,255,0.1)] border border-cyan-400/20 transform transition-all hover:shadow-[inset_5px_5px_15px_rgba(0,0,0,0.2),inset_-5px_-5px_15px_rgba(0,0,255,0.1)]">
          <div className="text-3xl font-bold text-cyan-400">
            {stats.total_incidents}
          </div>
          <div className="text-sm font-medium text-cyan-300/80">
            Total Incidents
          </div>
        </div>
        <div className="bg-[#002345] rounded-xl p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(0,255,255,0.1)] border border-cyan-400/20 transform transition-all hover:shadow-[inset_5px_5px_15px_rgba(0,0,0,0.2),inset_-5px_-5px_15px_rgba(0,0,255,0.1)]">
          <div className="text-3xl font-bold text-cyan-400">
            {stats.average_score?.toFixed(1) || "N/A"}
          </div>
          <div className="text-sm font-medium text-cyan-300/80">
            Average Score
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart containers with neuromorphic styling */}
        {[
          "Incident Types Distribution",
          "Monthly Incident Trend",
          "Severity Distribution",
          "Average Score Trend",
        ].map((title, index) => (
          <div
            key={title}
            className="bg-[#002345] rounded-xl p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(0,255,255,0.1)] border border-cyan-400/20"
          >
            <h2 className="text-xl font-semibold text-cyan-400 mb-6 p-2 rounded-lg shadow-[inset_-2px_-2px_8px_rgba(0,0,0,0.2),_inset_2px_2px_8px_rgba(0,255,255,0.1)]">
              {title}
            </h2>
            {index === 0 && (
              <PieChart width={400} height={300}>
                <Pie
                  data={stats.incident_types}
                  dataKey="count"
                  nameKey="incidentType"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.incident_types.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#002345",
                    border: "1px solid rgba(0,255,255,0.2)",
                    color: "cyan", // Doesn't affect text inside tooltip
                  }}
                  itemStyle={{
                    color: "cyan", // This actually changes text color
                  }}
                />
                <Legend />
              </PieChart>
            )}
            {index === 1 && (
              <LineChart width={400} height={300} data={stats.monthly_trend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,255,255,0.1)"
                />
                <XAxis
                  dataKey="month"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  stroke="#00ffff"
                />
                <YAxis stroke="#00ffff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#002345",
                    border: "1px solid rgba(0,255,255,0.2)",
                    color: "cyan", // Doesn't affect text inside tooltip
                  }}
                  itemStyle={{
                    color: "cyan", // This actually changes text color
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00ffff"
                  name="Incidents"
                />
              </LineChart>
            )}
            {index === 2 && (
              <BarChart
                width={400}
                height={300}
                data={stats.severity_distribution}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,255,255,0.1)"
                />
                <XAxis dataKey="severity" stroke="#00ffff" />
                <YAxis stroke="#00ffff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#002345",
                    border: "1px solid rgba(0,255,255,0.2)",
                    color: "cyan", // Doesn't affect text inside tooltip
                  }}
                  itemStyle={{
                    color: "cyan", // This actually changes text color
                  }}
                />
                <Bar dataKey="count">
                  {stats.severity_distribution.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
            {index === 3 && (
              <LineChart width={400} height={300} data={stats.score_trend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,255,255,0.1)"
                />
                <XAxis
                  dataKey="month"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  stroke="#00ffff"
                />
                <YAxis domain={[0, 100]} stroke="#00ffff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#002345",
                    border: "1px solid rgba(0,255,255,0.2)",
                    color: "cyan", // Doesn't affect text inside tooltip
                  }}
                  itemStyle={{
                    color: "cyan", // This actually changes text color
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avg_score"
                  stroke="#00ffff"
                  name="Average Score"
                />
              </LineChart>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentDashboardUser;
