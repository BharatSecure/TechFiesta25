import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const AdvancedIncidentCharts = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/advanced-incident-analysis/",
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  // Color Palette
  const colors = {
    primary: "rgba(75, 192, 192, 0.6)",
    secondary: "rgba(54, 162, 235, 0.6)",
    danger: "rgba(255, 99, 132, 0.6)",
    warning: "rgba(255, 206, 86, 0.6)",
  };

  // Chart Configuration Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true },
    },
  };

  // Monthly Trends Chart
  const monthlyTrendsChart = {
    labels: analyticsData.monthly_trends.map((m) =>
      new Date(m.month).toLocaleDateString("default", { month: "short" })
    ),
    datasets: [
      {
        label: "Total Incidents",
        data: analyticsData.monthly_trends.map((m) => m.total_incidents),
        backgroundColor: colors.primary,
      },
      {
        label: "High Severity Incidents",
        data: analyticsData.monthly_trends.map(
          (m) => m.high_severity_incidents
        ),
        backgroundColor: colors.danger,
      },
    ],
  };

  // Hourly Distribution Chart
  const hourlyDistributionChart = {
    labels: analyticsData.hourly_distribution.map((h) => `${h.hour}:00`),
    datasets: [
      {
        label: "Incident Count",
        data: analyticsData.hourly_distribution.map((h) => h.incident_count),
        backgroundColor: colors.secondary,
      },
    ],
  };

  // Risk Hotspots Chart
  const riskHotspotsChart = {
    labels: analyticsData.risk_hotspots.map((r) => r.location),
    datasets: [
      {
        label: "Incident Density",
        data: analyticsData.risk_hotspots.map((r) => r.incident_density),
        backgroundColor: [colors.danger, colors.warning, colors.primary],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div className="bg-white shadow rounded p-4">
        <h2>Monthly Incident Trends</h2>
        <div className="h-64">
          <Bar data={monthlyTrendsChart} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2>Hourly Incident Distribution</h2>
        <div className="h-64">
          <Line data={hourlyDistributionChart} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2>Risk Hotspots</h2>
        <div className="h-64">
          <Pie data={riskHotspotsChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedIncidentCharts;
