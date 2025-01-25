import * as React from "react";
import { LineChart, AnimatedLine } from "@mui/x-charts/LineChart";
import { useChartId, useDrawingArea, useXScale } from "@mui/x-charts/hooks";
import { useMediaQuery } from "@mui/material";

function CustomAnimatedLine(props) {
  const { limit, ...other } = props;
  const { top, bottom, height, left, width } = useDrawingArea();
  const scale = useXScale();
  const chartId = useChartId();

  if (limit === undefined) {
    return <AnimatedLine {...other} />;
  }

  const limitPosition = scale(limit); // Convert value to x coordinate.

  if (limitPosition === undefined) {
    return <AnimatedLine {...other} />;
  }

  const clipIdleft = `${chartId}-${props.ownerState.id}-line-limit-${limit}-1`;
  const clipIdRight = `${chartId}-${props.ownerState.id}-line-limit-${limit}-2`;
  return (
    <React.Fragment>
      {/* Clip to show the line before the limit */}
      <clipPath id={clipIdleft}>
        <rect
          x={left}
          y={0}
          width={limitPosition - left}
          height={top + height + bottom}
        />
      </clipPath>
      {/* Clip to show the line after the limit */}
      <clipPath id={clipIdRight}>
        <rect
          x={limitPosition}
          y={0}
          width={left + width - limitPosition}
          height={top + height + bottom}
        />
      </clipPath>
      <g clipPath={`url(#${clipIdleft})`} className="line-before">
        <AnimatedLine {...other} />
      </g>
      <g clipPath={`url(#${clipIdRight})`} className="line-after">
        <AnimatedLine {...other} />
      </g>
    </React.Fragment>
  );
}

export default function LineWithPrediction() {
  const [chartWidth, setChartWidth] = React.useState(window.innerWidth * 0.9); // Set to 90% of window width
  const [chartHeight, setChartHeight] = React.useState(200); // Default height

  // Media query for responsiveness
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  React.useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth * 0.9); // Adjust width dynamically
      setChartHeight(isSmallScreen ? 150 : 200); // Adjust height for small screens
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSmallScreen]);

  return (
    <div className="p-4 justify-center overflow-auto">
      <h2 className="text-center text-xl font-semibold mb-4">
        Weekly Incident Response Times
      </h2>
      <LineChart
        className="shadow-md border-2 border-slate-700 rounded-lg"
        series={[
          {
            type: "line",
            data: [5, 4.5, 6, 5, 4.2, 5.1, 4.8, 4.7, 5.0], // Sample data for actual response times (in hours)
            valueFormatter: (v, i) =>
              `${v} hrs${i.dataIndex > 6 ? " (estimated)" : ""}`,
          },
        ]}
        xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6, 7, 8] }]} // X axis with days of the week
        height={chartHeight} // Dynamic height
        width={chartWidth} // Dynamic width
        slots={{ line: CustomAnimatedLine }}
        slotProps={{ line: { limit: 6 } }} // Limit before prediction begins
        sx={{ "& .line-after path": { strokeDasharray: "10 5" } }} // Dash pattern for predicted part
      />
    </div>
  );
}
