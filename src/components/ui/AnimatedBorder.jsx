import React from "react";

const AnimatedBorder = ({
  children,
  variant = "gradient",
  className = "",
  borderWidth = "2px",
  borderColor = "cyan",
  duration = "3s",
}) => {
  // CSS definitions for each variant
  const variants = {
    gradient: `
      .gradient-border {
        position: relative;
        background: linear-gradient(var(--border-angle), #12c2e9, #c471ed, #f64f59);
        animation: borderRotate var(--duration) linear infinite;
        border-radius: 8px;
        /* Create space for inner content via padding or pseudo-element */
      }
      .gradient-border::after {
        content: '';
        position: absolute;
        inset: var(--border-width);
        background: white;
        border-radius: calc(8px - var(--border-width));
        z-index: -1;
      }
      @property --border-angle {
        syntax: '<angle>';
        inherits: true;
        initial-value: 0turn;
      }
      @keyframes borderRotate {
        100% {
          --border-angle: 1turn;
        }
      }
    `,
    pulse: `
      .pulse-border {
        animation: pulseBorder var(--duration) ease-in-out infinite;
        border: var(--border-width) solid rgba(var(--border-rgb), 0.5);
        border-radius: 8px;
      }
      @keyframes pulseBorder {
        0%, 100% { border-color: rgba(var(--border-rgb), 0.5); }
        50% { border-color: rgba(var(--border-rgb), 1); }
      }
    `,
    dash: `
      .dash-border {
        background-image: linear-gradient(90deg, var(--border-color) 50%, transparent 50%),
                         linear-gradient(90deg, var(--border-color) 50%, transparent 50%),
                         linear-gradient(0deg, var(--border-color) 50%, transparent 50%),
                         linear-gradient(0deg, var(--border-color) 50%, transparent 50%);
        background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
        background-size: 15px var(--border-width), 15px var(--border-width), var(--border-width) 15px, var(--border-width) 15px;
        background-position: 0 0, 100% 100%, 0 100%, 100% 0;
        animation: dashBorder var(--duration) linear infinite;
        border-radius: 8px;
      }
      @keyframes dashBorder {
        100% {
          background-position: 100% 0, 0 100%, 0 0, 100% 100%;
        }
      }
    `,
    glow: `
      .glow-border {
        box-shadow: 0 0 5px var(--border-color),
                    0 0 10px var(--border-color),
                    0 0 15px var(--border-color);
        animation: glowBorder var(--duration) ease-in-out infinite;
        border: var(--border-width) solid transparent;
        border-radius: 8px;
      }
      @keyframes glowBorder {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,
    scanner: `
      .scanner-border {
        position: relative;
        border: var(--border-width) solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
      }
      .scanner-border::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(var(--border-rgb), 0.4),
          transparent
        );
        animation: scanBorder var(--duration) linear infinite;
      }
      @keyframes scanBorder {
        100% { left: 200%; }
      }
    `,
  };

  // Helper to convert color name to RGB string
  const getBorderRGB = (color) => {
    const colors = {
      cyan: "0, 255, 255",
      purple: "128, 0, 128",
      gold: "255, 215, 0",
      red: "255, 0, 0",
      green: "0, 255, 0",
      blue: "0, 0, 255",
    };
    return colors[color] || colors.cyan;
  };

  // Determine the class name to use based on the variant
  const variantClass =
    {
      gradient: "gradient-border",
      pulse: "pulse-border",
      dash: "dash-border",
      glow: "glow-border",
      scanner: "scanner-border",
    }[variant] || "gradient-border";

  return (
    <div
      className={`${variantClass} relative ${className}`}
      style={{
        "--duration": duration,
        "--border-width": borderWidth,
        "--border-color": borderColor,
        "--border-rgb": getBorderRGB(borderColor),
      }}
    >
      {/* Inject the dynamic CSS for the variant */}
      <style>{variants[variant]}</style>
      {children}
    </div>
  );
};

export default AnimatedBorder;
