import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

const FloatingChatbot = () => {
  const navigate = useNavigate();

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

        {/* Chatbot Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-black">
          <FaRobot className="text-2xl sm:text-3xl group-hover:scale-100" />
        </div>
      </div>
    </div>
  );
};

export default FloatingChatbot;
