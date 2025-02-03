// Legend component for the heatmap
import React from "react";

const Legend = () => {
  return (
    <div style={legendStyle}>
      <div style={legendItemStyle}>
        <span
          style={{
            ...colorBoxStyle,
            backgroundColor: "rgba(255, 255, 0, 1.0)", // Yellow (Low severity)
          }}
        ></span>
        Low
      </div>
      <div style={legendItemStyle}>
        <span
          style={{
            ...colorBoxStyle,
            backgroundColor: "rgba(255, 165, 0, 1.0)", // Orange (Medium severity)
          }}
        ></span>
        Medium
      </div>
      <div style={legendItemStyle}>
        <span
          style={{
            ...colorBoxStyle,
            backgroundColor: "rgba(255, 0, 0, 1.0)", // Red (High severity)
          }}
        ></span>
        High
      </div>
      <div style={legendItemWithLogoStyle}>
        <img
          src="https://tse1.mm.bing.net/th?id=OIP.oVCuLP_ERzy8yJFGJc4t4QHaHa&pid=Api&P=0&h=180" // Police logo URL
          alt="Police Logo"
          style={iconStyle}
        />
        Police
      </div>
      <div style={legendItemWithLogoStyle}>
        <img
          src="https://tse1.mm.bing.net/th?id=OIP.mK4UTLLTl9D2i8HOVQBaMAHaHa&pid=Api&P=0&h=180" // Medical logo URL
          alt="Medical Logo"
          style={iconStyle}
        />
        Medical
      </div>
    </div>
  );
};

// Styles for the legend
const legendStyle = {
  position: "absolute",
  top: "2px", // Position it at the top
  right: "30px", // Position it on the right side
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: 999,
  fontSize: "14px",
  width: "150px", // Control the width of the legend for better alignment
};

// Styling for legend items without logos
const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "5px",
};

// Styling for legend items with logos (Police and Medical)
const legendItemWithLogoStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "5px",
};

// Styling for color boxes
const colorBoxStyle = {
  width: "20px",
  height: "20px",
  marginRight: "10px",
  borderRadius: "2px",
};

// Styling for the icons/logos
const iconStyle = {
  width: "20px",
  height: "20px",
  marginRight: "10px", // Space between logo and text
};

export default Legend;
