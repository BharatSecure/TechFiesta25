import OnSeriesItemClick from "./chart-components/PieChart";
import SimpleBarChart from "./chart-components/BarChart";
import LineWithPrediction from "./chart-components/LineChart";

const Analytics = () => {
  return (
    <div className="flex flex-col items-center mt-14 mb-12 px-4">
      {/* Title */}
      <h1 className="text-sky-600 font-extrabold text-4xl sm:text-5xl lg:text-6xl mb-8 text-center">
        Analytics Dashboard
      </h1>

      {/* Charts Section */}
      <div className="grid gap-8 sm:gap-12 w-full max-w-7xl p-4 sm:p-6 bg-gradient-to-r from-indigo-50 via-sky-100 to-blue-50 rounded-2xl shadow-2xl">
        {/* Pie Chart */}
        <div className="p-6 sm:p-8 bg-white rounded-xl shadow-xl border border-gray-200 hover:-translate-y-3 transition-transform hover:shadow-2xl w-full max-w-sm mx-auto sm:max-w-md lg:max-w-full">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6 text-center">
            Pie Chart
          </h2>
          <OnSeriesItemClick />
        </div>

        {/* Bar Chart */}
        <div className="p-6 sm:p-8 bg-white rounded-xl shadow-xl border border-gray-200 hover:-translate-y-3 transition-transform hover:shadow-2xl w-full max-w-sm mx-auto sm:max-w-md lg:max-w-full">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6 text-center">
            Bar Chart
          </h2>
          <SimpleBarChart />
        </div>

        {/* Line Chart with Prediction (spans both columns on large screens) */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-white rounded-xl shadow-xl border border-gray-200 hover:-translate-y-3 transition-transform hover:shadow-2xl w-full max-w-sm mx-auto sm:max-w-md lg:max-w-full flex flex-col justify-center items-center">
  <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6 text-center">
    Line Chart with Prediction
  </h2>
  <LineWithPrediction />
</div>

      </div>
    </div>
  );
};

export default Analytics;
