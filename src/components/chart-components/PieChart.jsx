import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const items = [
  { id: "id_A", value: 30, label: "Reported" },
  { id: "id_B", value: 30, label: "Under Process" },
  { id: "id_C", value: 40, label: "Resolved" },
];

export default function OnSeriesItemClick() {
  const [chartWidth, setChartWidth] = React.useState(window.innerWidth * 0.8); // Set to 80% of the window width
  const [chartHeight, setChartHeight] = React.useState(200); // Default height

  const handleClick = (event, itemIdentifier, item) => {
    console.log(item.id); // Log clicked item id
  };

  React.useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth * 0.8); // Adjust width dynamically
      setChartHeight(window.innerHeight * 0.3); // Adjust height dynamically
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Title updated here */}
      <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 2, fontWeight: "bold" }}>
        Incident Status Overview
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{ width: "100%" }}
        className="shadow-md border-2 border-slate-700 rounded-lg overflow-auto"
      >
        {/* Pie Chart component with dynamic width and height */}
        <PieChart
          series={[
            {
              data: items,
            },
          ]}
          onItemClick={handleClick}
          width={chartWidth}
          height={chartHeight}
          margin={{ right: 200 }}
        />
      </Stack>
    </>
  );
}
