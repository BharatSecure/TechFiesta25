import React from "react";

const OrderProgress = (steps) => {
  console.log("Current step value:", steps.steps1);
  //OUTPUTS:Current step value:2
  const steps_style = [
    {
      label: "Submitted",
      icon: "1",
      gradientFrom: "from-red-500",
      gradientTo: "to-red-400",
      ringColor: "ring-red-100",
    },
    {
      label: "Under Investigation",
      icon: "2",
      gradientFrom: "from-yellow-500",
      gradientTo: "to-yellow-400",
      ringColor: "ring-yellow-100",
    },
    {
      label: "Resolved",
      icon: "3",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-400",
      ringColor: "ring-green-100",
    },
  ];

  const getProgressBarGradient = () => {
    if (steps.steps1 === 0) return "bg-gradient-to-r from-red-500 to-red-400";
    if (steps.steps1 === 1)
      return "bg-gradient-to-r from-red-500 via-yellow-500 to-yellow-400";
    return "bg-gradient-to-r from-red-500 via-yellow-500 to-green-400";
  };

  return (
    <div className="w-64 px-2 py-4">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-0.5 bg-gray-200 rounded" />

        {/* Active Progress Bar */}
        <div
          className={`absolute top-1/2 left-0 -translate-y-1/2 h-0.5 rounded transition-all duration-500 ${getProgressBarGradient()}`}
          style={{ width: `${(steps.steps1 / (steps.steps1.length - 1)) * 100}%` }}
        />

        {/* Steps Container */}
        <div className="relative flex justify-between">
          {steps_style.map((s, idx) => {
            const isCompleted = idx <= steps.steps1;
            const isActive = idx === steps.steps1;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Step Dot */}
                <div
                  className={`
                    w-4 h-4 rounded-full flex items-center justify-center
                    font-semibold text-xs transition-all duration-300
                    ${
                      isCompleted
                        ? `bg-gradient-to-r ${s.gradientFrom} ${s.gradientTo} text-white shadow-md scale-110`
                        : "bg-gray-200 text-gray-500"
                    }
                    ${isActive ? `ring-4 ${s.ringColor}` : ""}
                  `}
                />

                {/* Step Label - Display only for active step */}
                {isActive && (
                  <span
                    className={`
                    mt-1 text-xs font-bold transition-colors duration-300 whitespace-nowrap
                    ${
                      idx === 0
                        ? "text-red-500"
                        : idx === 1
                        ? "text-yellow-600"
                        : "text-green-500"
                    }
                  `}
                  >
                    {s.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderProgress;
