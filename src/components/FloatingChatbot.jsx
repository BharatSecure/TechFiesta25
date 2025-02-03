import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { useEffect, useState } from "react";

const FloatingChatbot = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger bounce animation after component mounts
    setAnimate(true);

    // Reset animation after 1 second to prepare for potential future triggers
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 group cursor-pointer z-50"
      onClick={() => navigate("/chatbot")}
    >
      <div className="relative flex items-center">
        {/* Chatbot Text (Hidden by Default, Visible on Hover) */}
        <span className="absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-md w-40">
          Use our Chatbot
        </span>

        {/* Chatbot Icon with Bouncing Animation */}
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-black ${
            animate ? "animate-bounce" : ""
          }`}
        >
          <FaRobot className="text-2xl sm:text-3xl group-hover:scale-100" />
        </div>
      </div>
    </div>
  );
};

export default FloatingChatbot;

// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom"; // Import useLocation
// import { Bot } from "lucide-react";

// const FloatingChatbot = () => {
//   const [hasAnimated, setHasAnimated] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [shouldAnimate, setShouldAnimate] = useState(false);
//   const location = useLocation(); // Use location to detect route changes

//   useEffect(() => {
//     // Reset state every time the route changes (this re-triggers the animation logic)
//     setHasAnimated(false);
//     setIsVisible(false);
//     setShouldAnimate(false);

//     // Check if this is the first visit
//     // localStorage.removeItem("chatbotAnimationShown");
//     const hasSeenAnimation = localStorage.getItem("chatbotAnimationShown");

//     let visibleTimeout;
//     let animatedTimeout;

//     if (!hasSeenAnimation) {
//       // This is the first visit
//       setShouldAnimate(true);
//       // Start animation after a small delay (1 second)
//       visibleTimeout = setTimeout(() => setIsVisible(true), 1000);
//       // Mark animation as complete after duration (2 seconds in total)
//       animatedTimeout = setTimeout(() => {
//         setHasAnimated(true);
//         // Store that animation has been shown
//         localStorage.setItem("chatbotAnimationShown", "true");
//       }, 2000);
//     } else {
//       // Not first visit - show in final position immediately
//       setIsVisible(true);
//       setHasAnimated(true);
//     }

//     // Cleanup timeouts if the component unmounts
//     return () => {
//       clearTimeout(visibleTimeout);
//       clearTimeout(animatedTimeout);
//     };
//   }, [location]); // Trigger useEffect when the route changes

//   const handleClick = () => {
//     const event = new CustomEvent("openChatbot", { bubbles: true });
//     document.dispatchEvent(event);
//   };

//   return (
//     <div
//       className={`fixed group cursor-pointer z-50 transition-all duration-[1.5s] ease-in-out
//         ${isVisible ? "opacity-100" : "opacity-0"}
//         ${
//           hasAnimated
//             ? "bottom-6 right-6 sm:bottom-10 sm:right-10"
//             : "bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2"
//         }`}
//       onClick={handleClick}
//     >
//       <div className="relative flex items-center">
//         {/* Chatbot Text (Hidden by Default, Visible on Hover) */}
//         <span className="absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-md w-40">
//           Use our Chatbot
//         </span>

//         {/* Chatbot Icon */}
//         <div
//           className={`w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg
//             transition-all duration-300 group-hover:scale-110 group-hover:bg-black
//             ${
//               shouldAnimate && !hasAnimated && isVisible ? "animate-bounce" : ""
//             }`}
//         >
//           <Bot className="text-2xl sm:text-3xl group-hover:scale-100" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FloatingChatbot;

// import { useNavigate } from "react-router-dom";
// import { FaRobot } from "react-icons/fa";

// const FloatingChatbot = () => {
//   const navigate = useNavigate();

//   return (
//     <div
//       className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 group cursor-pointer z-50"
//       onClick={() => navigate("/chatbot")}
//     >
//       <div className="relative flex items-center">
//         {/* Chatbot Text (Hidden by Default, Visible on Hover) */}
//         <span className="absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded-lg shadow-md w-40">
//           Use our Chatbot
//         </span>

//         {/* Chatbot Icon */}
//         <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-black">
//           <FaRobot className="text-2xl sm:text-3xl group-hover:scale-100" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FloatingChatbot;
