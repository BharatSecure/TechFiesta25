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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#94ecf7", // Cyan text for legends
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(148, 236, 247, 0.1)", // Subtle cyan grid
      },
      ticks: {
        color: "#94ecf7", // Cyan text for x-axis
      },
    },
    y: {
      grid: {
        color: "rgba(148, 236, 247, 0.1)", // Subtle cyan grid
      },
      ticks: {
        color: "#94ecf7", // Cyan text for y-axis
      },
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
  }, []);

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
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!data) return null;

  return (
    <div className="p-4 pt-10 space-y-6 bg-slate-900 min-h-screen">
      {/* Title */}
      <h1 className="text-5xl font-bold text-cyan-400 mb-6 text-center drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
        Incident Analytics Dashboard
      </h1>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Resolution Rate",
            value: `${Number(data.overall_statistics.resolution_rate).toFixed(
              1
            )}%`,
          },
          {
            title: "Average Response Score",
            value: Number(data.overall_statistics.avg_response_score).toFixed(
              1
            ),
          },
          {
            title: "Total Incidents",
            value: data.overall_statistics.total_incidents,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-6 shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-cyan-400 mb-2 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
              {stat.title}
            </h3>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Chart Sections */}
      {[
        // {
        //   title: "Monthly Trends",
        //   chart: <Line options={chartOptions} data={monthlyTrendsData} />,
        // },
        {
          title: "Hourly Distribution",
          chart: <Bar options={chartOptions} data={hourlyDistributionData} />,
        },
        {
          title: "Incident Type Distribution",
          chart: <Pie options={chartOptions} data={incidentTypeData} />,
        },
        {
          title: "Weekly Pattern",
          chart: <Bar options={chartOptions} data={weeklyPatternData} />,
        },
        {
          title: "Emergency Services Response",
          chart: <Bar options={chartOptions} data={emergencyServicesData} />,
        },
      ].map((section, index) => (
        <div
          key={index}
          className="bg-slate-800 rounded-xl p-6 shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
            {section.title}
          </h3>
          <div className="h-96 bg-slate-900 rounded-lg p-4 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)]">
            {section.chart}
          </div>
        </div>
      ))}

      {/* Risk Hotspots Table */}
      {/* <div className="bg-slate-800 rounded-xl p-6 shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
          Top Risk Hotspots
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-400/30">
                <th className="p-3 text-left text-cyan-400">Location</th>
                <th className="p-3 text-right text-cyan-400">Incidents</th>
                <th className="p-3 text-right text-cyan-400">High Severity</th>
                <th className="p-3 text-right text-cyan-400">
                  Resolution Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {data.risk_hotspots.map((spot, index) => (
                <tr
                  key={index}
                  className="border-b border-cyan-400/10 text-gray-300"
                >
                  <td className="p-3">{JSON.stringify(spot.location)}</td>
                  <td className="p-3 text-right">{spot.incident_density}</td>
                  <td className="p-3 text-right">{spot.high_severity_count}</td>
                  <td className="p-3 text-right">
                    {spot.resolution_rate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default IncidentAnalyticsDashboard;
