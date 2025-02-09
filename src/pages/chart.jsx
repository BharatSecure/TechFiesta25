import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#00ffff", // cyan
  "#00ccff", // light blue
  "#0099ff", // blue
  "#0066ff", // darker blue
  "#0033ff", // even darker blue
];

// Neuromorphic Card Components
const Card = ({ children, className = "" }) => (
  <div
    className={`text-cyan-300 bg-[#002345] rounded-xl p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(0,255,255,0.1)] border border-cyan-400/20 transform transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] group ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="mb-4 p-2 rounded-lg shadow-[inset_-2px_-2px_8px_rgba(0,0,0,0.2),_inset_2px_2px_8px_rgba(0,255,255,0.1)]">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)] group-hover:text-cyan-300 transition-colors duration-300">
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div
    className={`${className} text-white group-hover:text-cyan-300 transition-colors duration-300`}
  >
    {children}
  </div>
);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/incident-analysis/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#001830]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent shadow-[0_0_15px_rgba(34,211,238,0.3)]"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#001830]">
        <div className="text-cyan-400 p-6 bg-[#002345] rounded-xl shadow-[5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(0,255,255,0.1)] border border-cyan-400/20">
          Error loading analytics data
        </div>
      </div>
    );
  }

  const chartConfig = {
    cartesianGrid: {
      strokeDasharray: "3 3",
      stroke: "rgba(148, 236, 247, 0.1)",
    },
    xAxis: { stroke: "#94ecf7", tick: { fill: "#94ecf7" } },
    yAxis: { stroke: "#94ecf7", tick: { fill: "#94ecf7" } },
    tooltip: {
      contentStyle: {
        backgroundColor: "#002345",
        border: "1px solid rgba(148, 236, 247, 0.2)",
        borderRadius: "8px",
        color: "#94ecf7",
      },
    },
  };

  return (
    <div className="p-8 pt-28 space-y-8 bg-[#001830] min-h-screen">
      {/* Dashboard Title */}
      <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] hover:text-cyan-300 transition-colors duration-300">
        Incident Analytics Dashboard
      </h1>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Incidents by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.incidents_by_type}>
                <CartesianGrid {...chartConfig.cartesianGrid} />
                <XAxis
                  {...chartConfig.xAxis}
                  dataKey="incidentType"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis {...chartConfig.yAxis} />
                <Tooltip {...chartConfig.tooltip} />
                <Bar dataKey="count" fill="#94ecf7">
                  {analyticsData.incidents_by_type.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Incidents Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Incidents Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.daily_incidents}>
                <CartesianGrid {...chartConfig.cartesianGrid} />
                <XAxis {...chartConfig.xAxis} dataKey="date" />
                <YAxis {...chartConfig.yAxis} />
                <Tooltip {...chartConfig.tooltip} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00ffff"
                  strokeWidth={2}
                  dot={{ fill: "#00ffff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incidents by Severity */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.incidents_by_severity}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analyticsData.incidents_by_severity.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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
                <Legend
                  formatter={(value) => (
                    <span className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incidents by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.incidents_by_status}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analyticsData.incidents_by_status.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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
                <Legend
                  formatter={(value) => (
                    <span className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
