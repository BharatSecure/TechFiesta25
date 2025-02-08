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

// Add the missing COLORS constant
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
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
        // Ensure all required properties exist
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
        // Set empty data on error
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
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Incident Statistics Dashboard</h1>
        <select
          className="p-2 border rounded"
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Incident Types Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Incident Types Distribution
          </h2>
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
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Incident Trend</h2>
          <LineChart width={400} height={300} data={stats.monthly_trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              name="Incidents"
            />
          </LineChart>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Severity Distribution</h2>
          <BarChart width={400} height={300} data={stats.severity_distribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="severity" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d">
              {stats.severity_distribution.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </div>

        {/* Score Trend */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Average Score Trend</h2>
          <LineChart width={400} height={300} data={stats.score_trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg_score"
              stroke="#FF8042"
              name="Average Score"
            />
          </LineChart>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.total_incidents}</div>
          <div className="text-sm text-gray-500">Total Incidents</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold">
            {stats.average_score?.toFixed(1) || "N/A"}
          </div>
          <div className="text-sm text-gray-500">Average Score</div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDashboardUser;
