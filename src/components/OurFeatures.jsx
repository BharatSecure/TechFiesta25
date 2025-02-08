import { Link } from "react-router-dom";

const OurFeatures = () => {
  return (
    <div>
      <div className="flex justify-center items-center flex-col bg-slate-900 min-h-screen">
        {/* Title */}
        <h1 className="text-cyan-400 font-extrabold text-3xl sm:text-4xl lg:text-6xl tracking-wide mt-7 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          Our Features
        </h1>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 p-6 sm:p-4 md:p-6 rounded-lg">
          {/* Card 1 */}
          <Link to={"/chatbot"}>
            <div className="flex flex-col bg-slate-800 shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 rounded-xl overflow-hidden cursor-pointer">
              <div className="m-4 overflow-hidden rounded-xl h-48 sm:h-60 flex justify-center items-center bg-slate-700">
                <img
                  className="w-full h-full object-cover opacity-80"
                  src="https://img.freepik.com/free-vector/chat-bot-concept-illustration_114360-5522.jpg"
                  alt="Saathi AI"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="mb-2 text-xl sm:text-2xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                  Saathi AI
                </h4>
                <p className="text-base text-slate-300 mt-3 leading-relaxed">
                  Your AI-powered assistant for medical, safety, and emotional
                  support, along with legal guidance. Saathi AI ensures you get
                  the right help when you need it the most.
                </p>
              </div>
              <div className="flex justify-center p-6 pt-2 gap-4">
                <button
                  className="rounded-xl bg-cyan-500 py-2 px-6 text-white text-sm font-semibold shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300"
                  type="button"
                >
                  Try Now
                </button>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link to={"/report-incident"}>
            <div className="flex flex-col bg-slate-800 shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 rounded-xl overflow-hidden cursor-pointer">
              <div className="m-4 overflow-hidden rounded-xl h-48 sm:h-60 flex justify-center items-center bg-slate-700">
                <img
                  className="w-full h-full object-cover opacity-80"
                  src="https://images.squarespace-cdn.com/content/v1/5bab316f7980b339c6dde5c2/877c3b92-24f0-4aa4-8804-2a389705d989/noun-warning-1109440-F5333F.png"
                  alt="Report"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="mb-2 text-xl sm:text-2xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                  Report Incident
                </h4>
                <p className="text-base text-slate-300 mt-3 leading-relaxed">
                  Simplify incident reporting with our convenient online form.
                  Quickly and efficiently submit all necessary details with our
                  streamlined process.
                </p>
              </div>
              <div className="flex justify-center p-6 pt-2 gap-4">
                <button
                  className="rounded-xl bg-cyan-500 py-2 px-6 text-white text-sm font-semibold shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300"
                  type="button"
                >
                  Try Now
                </button>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link to={"/heatmap"}>
            <div className="flex flex-col bg-slate-800 shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 rounded-xl overflow-hidden cursor-pointer">
              <div className="m-4 overflow-hidden rounded-xl h-48 sm:h-60 flex justify-center items-center bg-slate-700">
                <img
                  className="w-full h-full object-cover opacity-80"
                  src="https://t4.ftcdn.net/jpg/04/23/40/87/360_F_423408792_3K3fZwYzn84LbJdIiKYW73FbMHnVFXd8.jpg"
                  alt="Heatmap"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="mb-2 text-xl sm:text-2xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                  Heatmap
                </h4>
                <p className="text-base text-slate-300 mt-3 leading-relaxed">
                  Pinpoint high-risk areas with our interactive incident
                  heatmap. Visualize the frequency and severity of incidents to
                  proactively address potential hazards.
                </p>
              </div>
              <div className="flex justify-center p-6 pt-2 gap-4">
                <button
                  className="rounded-xl bg-cyan-500 py-2 px-6 text-white text-sm font-semibold shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300"
                  type="button"
                >
                  Try Now
                </button>
              </div>
            </div>
          </Link>

          {/* Card 4 */}
          <Link to={"/voice-report"}>
            <div className="flex flex-col bg-slate-800 shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300 rounded-xl overflow-hidden cursor-pointer">
              <div className="m-4 overflow-hidden rounded-xl h-48 sm:h-60 flex justify-center items-center bg-slate-700">
                <img
                  className="w-full h-full object-cover opacity-80"
                  src="https://play-lh.googleusercontent.com/pzAgoUBDDetHSQpPp29Z0wkMQNyBvQIXXpNSnO5_yS8IJFs2dIVUaGEqOJDPYW1I9vE"
                  alt="Voice to Text"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="mb-2 text-xl sm:text-2xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                  Voice to Text
                </h4>
                <p className="text-base text-slate-300 mt-3 leading-relaxed">
                  A voice-to-text feature that allows users to verbally report
                  incidents, making it accessible for individuals with
                  disabilities who may have difficulty typing.
                </p>
              </div>
              <div className="flex justify-center p-6 pt-2 gap-4">
                <button
                  className="rounded-xl bg-cyan-500 py-2 px-6 text-white text-sm font-semibold shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300"
                  type="button"
                >
                  Try Now
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurFeatures;
