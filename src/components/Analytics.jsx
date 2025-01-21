import React from 'react';
import OnSeriesItemClick from './chart-components/PieChart';
import SimpleBarChart from './chart-components/BarChart';
import LineWithPrediction from './chart-components/LineChart';

const Analytics = () => {
  return (
    <div className="flex flex-col items-center mt-14 mb-5">
      {/* Title */}
      <h1 className="text-sky-500 font-bold text-6xl mb-8">Analytics</h1>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl p-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 rounded-lg shadow-lg">
        {/* Chart 1 */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-300 hover:-translate-y-5 transition-transform">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Pie Chart
          </h2>
          <OnSeriesItemClick />
        </div>

        {/* Chart 2 */}
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-300 hover:-translate-y-5 transition-transform">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Bar Chart
          </h2>
          <SimpleBarChart />
        </div>

        {/* Chart 3 */}
        <div className="lg:col-span-2 p-6 bg-white rounded-lg shadow-md border border-gray-300 hover:-translate-y-5 transition-transform">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Line Chart with Prediction
          </h2>
          <LineWithPrediction />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
