import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const uData = [10, 12, 8, 15, 9, 5, 7];
const pData = [25, 30, 20, 22, 27, 15, 18];
const xLabels = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

export default function SimpleBarChart() {
  const [chartWidth, setChartWidth] = React.useState(window.innerWidth * 0.8); // 80% of the window width
  const [chartHeight, setChartHeight] = React.useState(300); // Default height

  React.useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth * 0.8); // Adjust width dynamically
      setChartHeight(window.innerHeight * 0.4); // Adjust height dynamically
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="p-4 overflow-auto">
      <h2 className="text-center text-xl font-semibold mb-4">
        Weekly Incident Reports
      </h2>
      <BarChart
        className="shadow-md border-2 border-slate-700 rounded-lg"
        width={chartWidth}
        height={chartHeight}
        series={[
          { data: pData, label: "Reported", id: "pvId" },
          { data: uData, label: "Solved", id: "uvId" },
        ]}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
      />
    </div>
  );
}
