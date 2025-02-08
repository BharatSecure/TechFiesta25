import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Chart options and styles
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const IncidentAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://127.0.0.1:8000/api/advanced-incident-analysis/",
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const monthlyTrendsData = {
    labels:
      data?.monthly_trends.map((item) =>
        new Date(item.month).toLocaleDateString("default", {
          month: "short",
          year: "2-digit",
        })
      ) || [],
    datasets: [
      {
        label: "Total Incidents",
        data: data?.monthly_trends.map((item) => item.total_incidents) || [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Resolution Rate %",
        data: data?.monthly_trends.map((item) => item.resolution_rate) || [],
        borderColor: "rgb(153, 102, 255)",
        tension: 0.1,
      },
    ],
  };

  const hourlyDistributionData = {
    labels: data?.hourly_distribution.map((item) => `${item.hour}:00`) || [],
    datasets: [
      {
        label: "Incidents",
        data:
          data?.hourly_distribution.map((item) => item.incident_count) || [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "High Severity",
        data:
          data?.hourly_distribution.map((item) => item.high_severity_count) ||
          [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const incidentTypeData = {
    labels: data?.incident_type_analysis.map((item) => item.incidentType) || [],
    datasets: [
      {
        data:
          data?.incident_type_analysis.map((item) => item.total_count) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
      },
    ],
  };

  const weeklyPatternData = {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        label: "Total Incidents",
        data: data?.weekly_pattern.map((item) => item.total_incidents) || [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Resolution Rate",
        data: data?.weekly_pattern.map((item) => item.resolution_rate) || [],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  const emergencyServicesData = {
    labels:
      data?.emergency_services_summary.map((item) => item.incidentType) || [],
    datasets: [
      {
        label: "Police",
        data:
          data?.emergency_services_summary.map(
            (item) => item.police_involved
          ) || [],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "Fire Dept",
        data:
          data?.emergency_services_summary.map((item) => item.fire_involved) ||
          [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Hospital",
        data:
          data?.emergency_services_summary.map(
            (item) => item.hospital_involved
          ) || [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!data) return null;

  return (
    <div className="p-4 space-y-4">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Resolution Rate</h3>
          <div className="text-3xl font-bold">
            {Number(data.overall_statistics.resolution_rate).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Average Response Score</h3>
          <div className="text-3xl font-bold">
            {Number(data.overall_statistics.avg_response_score).toFixed(1)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Total Incidents</h3>
          <div className="text-3xl font-bold">
            {data.overall_statistics.total_incidents}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Monthly Trends</h3>
        <div className="h-96">
          <Line options={chartOptions} data={monthlyTrendsData} />
        </div>
      </div>

      {/* Hourly Distribution */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Hourly Distribution</h3>
        <div className="h-96">
          <Bar options={chartOptions} data={hourlyDistributionData} />
        </div>
      </div>

      {/* Incident Type Analysis */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">
          Incident Type Distribution
        </h3>
        <div className="h-96">
          <Pie options={chartOptions} data={incidentTypeData} />
        </div>
      </div>

      {/* Weekly Pattern */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Weekly Pattern</h3>
        <div className="h-96">
          <Bar options={chartOptions} data={weeklyPatternData} />
        </div>
      </div>

      {/* Emergency Services */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">
          Emergency Services Response
        </h3>
        <div className="h-96">
          <Bar options={chartOptions} data={emergencyServicesData} />
        </div>
      </div>

      {/* Risk Hotspots Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Top Risk Hotspots</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-right">Incidents</th>
                <th className="p-2 text-right">High Severity</th>
                <th className="p-2 text-right">Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.risk_hotspots.map((spot, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{JSON.stringify(spot.location)}</td>
                  <td className="p-2 text-right">{spot.incident_density}</td>
                  <td className="p-2 text-right">{spot.high_severity_count}</td>
                  <td className="p-2 text-right">
                    {spot.resolution_rate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncidentAnalyticsDashboard;
