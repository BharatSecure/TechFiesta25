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

// Enhanced chart options with neuromorphic theme
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#94ecf7",
        font: {
          family: "'Inter', sans-serif",
          weight: 500,
        },
        padding: 20,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 24, 48, 0.9)",
      titleColor: "#94ecf7",
      bodyColor: "#94ecf7",
      borderColor: "rgba(148, 236, 247, 0.2)",
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(148, 236, 247, 0.1)",
        drawBorder: false,
      },
      ticks: {
        color: "#94ecf7",
        font: {
          family: "'Inter', sans-serif",
        },
      },
    },
    y: {
      grid: {
        color: "rgba(148, 236, 247, 0.1)",
        drawBorder: false,
      },
      ticks: {
        color: "#94ecf7",
        font: {
          family: "'Inter', sans-serif",
        },
      },
    },
  },
};

const IncidentAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const hourlyDistributionData = {
    labels: data?.hourly_distribution.map((item) => `${item.hour}:00`) || [],
    datasets: [
      {
        label: "Incidents",
        data:
          data?.hourly_distribution.map((item) => item.incident_count) || [],
        backgroundColor: "rgba(148, 236, 247, 0.5)",
        borderColor: "rgba(148, 236, 247, 0.8)",
        borderWidth: 2,
      },
      {
        label: "High Severity",
        data:
          data?.hourly_distribution.map((item) => item.high_severity_count) ||
          [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 0.8)",
        borderWidth: 2,
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
          "rgba(148, 236, 247, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(148, 236, 247, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderWidth: 2,
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
        backgroundColor: "rgba(148, 236, 247, 0.5)",
        borderColor: "rgba(148, 236, 247, 0.8)",
        borderWidth: 2,
      },
      {
        label: "Resolution Rate",
        data: data?.weekly_pattern.map((item) => item.resolution_rate) || [],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 0.8)",
        borderWidth: 2,
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
        borderColor: "rgba(54, 162, 235, 0.8)",
        borderWidth: 2,
      },
      {
        label: "Fire Dept",
        data:
          data?.emergency_services_summary.map((item) => item.fire_involved) ||
          [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 0.8)",
        borderWidth: 2,
      },
      {
        label: "Hospital",
        data:
          data?.emergency_services_summary.map(
            (item) => item.hospital_involved
          ) || [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 0.8)",
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#001830]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent shadow-[0_0_15px_rgba(34,211,238,0.3)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#001830]">
        <div className="text-cyan-400 p-6 bg-[#002345] rounded-xl shadow-[5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(0,255,255,0.1)] border border-cyan-400/20">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 bg-[#001830] min-h-screen">
      {/* Title with enhanced glow effect */}
      <h1 className="text-5xl font-bold text-cyan-400 mb-12 text-center drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] animate-pulse">
        Incident Analytics Dashboard
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          {
            title: "Resolution Rate",
            value: `${Number(data.overall_statistics.resolution_rate).toFixed(
              1
            )}%`,
            icon: "📈",
          },
          {
            title: "Average Response Score",
            value: Number(data.overall_statistics.avg_response_score).toFixed(
              1
            ),
            icon: "⭐",
          },
          {
            title: "Total Incidents",
            value: data.overall_statistics.total_incidents,
            icon: "🎯",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-[#002345] rounded-xl p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(0,255,255,0.1)] border border-cyan-400/20 transform transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                  {stat.title}
                </h3>
                <div className="text-3xl font-bold text-white">
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
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
            className="bg-[#002345] rounded-xl p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(0,255,255,0.1)] border border-cyan-400/20 transform transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            <h3 className="text-xl font-semibold text-cyan-400 mb-6 p-3 rounded-lg shadow-[inset_-2px_-2px_8px_rgba(0,0,0,0.2),_inset_2px_2px_8px_rgba(0,255,255,0.1)] border border-cyan-400/20">
              {section.title}
            </h3>
            <div className="h-[400px] bg-[#001830] rounded-lg p-4 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(0,255,255,0.1)] border border-cyan-400/10">
              {section.chart}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentAnalyticsDashboard;
