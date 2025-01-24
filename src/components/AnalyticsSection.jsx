//NOT IN USE
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsSection = () => {
  // Example data for Incident Frequency (Bar Chart)
  const incidentFrequencyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Incidents Reported",
        data: [10, 20, 15, 30, 25, 40, 35], // Dummy data
        backgroundColor: "#4CAF50", // Bar color
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  // Example data for Incident Categories Breakdown (Pie Chart)
  const incidentCategoriesData = {
    labels: ["Accident", "Injury", "Fire", "Other"],
    datasets: [
      {
        data: [30, 20, 10, 40], // Dummy data
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="mt-20">
      <div className="flex flex-col items-center">
        <h1 className="text-sky-600 font-extrabold text-4xl lg:text-6xl tracking-wide mt-7 mb-12">
          Analytics Dashboard
        </h1>

        {/* Incident Frequency Bar Chart */}
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-12">
          <h2 className="text-xl font-bold mb-4">
            Incident Frequency Over Time
          </h2>
          <Bar data={incidentFrequencyData} options={{ responsive: true }} />
        </div>

        {/* Incident Categories Breakdown Pie Chart */}
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-12">
          <h2 className="text-xl font-bold mb-4">
            Incident Categories Breakdown
          </h2>
          <Pie data={incidentCategoriesData} options={{ responsive: true }} />
        </div>

        {/* Response Time Overview (Card) */}
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-12">
          <h2 className="text-xl font-bold mb-4">Average Response Time</h2>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              2 Hours 30 Minutes
            </p>
            <p className="text-gray-600">
              Average response time for incidents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
