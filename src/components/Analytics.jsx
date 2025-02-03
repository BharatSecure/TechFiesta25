// import OnSeriesItemClick from "./chart-components/PieChart";
// import SimpleBarChart from "./chart-components/BarChart";
// import LineWithPrediction from "./chart-components/LineChart";
import React, { lazy, Suspense } from "react";
const OnSeriesItemClick = lazy(() => import("./chart-components/PieChart"));
const SimpleBarChart = lazy(() => import("./chart-components/BarChart"));
const LineWithPrediction = lazy(() => import("./chart-components/LineChart"));

const Analytics = () => {
  return (
    <div className="flex flex-col items-center mt-8 mb-8 px-2 sm:px-4">
      <Suspense fallback={<div>Loading...</div>}>
        {/* Title */}
        <h1 className="text-sky-600 font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-6 text-center">
          Analytics Dashboard
        </h1>

        {/* Charts Section */}
        <div className="flex flex-col lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl p-4 sm:p-6 bg-gradient-to-r from-indigo-50 via-sky-100 to-blue-50 rounded-2xl shadow-lg">
          {/* Pie Chart */}
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:-translate-y-2 transition-transform hover:shadow-lg w-full max-w-xs sm:max-w-md lg:max-w-full mx-auto">
            <h2 className="text-lg sm:text-4xl font-semibold text-gray-700 mb-4 text-center">
              Pie Chart
            </h2>
            <div className="w-full h-full">
              <OnSeriesItemClick />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:-translate-y-2 transition-transform hover:shadow-lg w-full max-w-xs sm:max-w-md lg:max-w-full mx-auto ">
            <h2 className="text-lg sm:text-4xl font-semibold text-gray-700 mb-4 text-center">
              Bar Chart
            </h2>
            <div className="w-full h-full">
              <SimpleBarChart />
            </div>
          </div>

          {/* Line Chart with Prediction */}
          <div className="lg:col-span-2 p-4 sm:p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:-translate-y-2 transition-transform hover:shadow-lg w-full max-w-xs sm:max-w-md lg:max-w-full mx-auto">
            <h2 className="text-lg sm:text-4xl font-semibold text-gray-700 mb-4 text-center">
              Line Chart with Prediction
            </h2>
            <div className="w-full h-auto">
              <LineWithPrediction />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Analytics;
