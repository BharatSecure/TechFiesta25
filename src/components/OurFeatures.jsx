import { Link } from "react-router-dom";

const OurFeatures = () => {
  return (
    <div className="mt-20">
      <div
        className="flex justify-center items-center flex-col"
        style={{ backgroundColor: "#edf2f8" }}
      >
        {/* Title */}
        <h1 className="text-sky-600 font-extrabold text-4xl lg:text-6xl tracking-wide mt-7">
          Our Features
        </h1>
        {/* Grid Section */}
        <div className="grid lg:grid-cols-3 mx-3 sm:grid-cols-1 gap-8 mt-12 p-6 rounded-lg">
          {/* Card 1 */}
          <Link to={"/voice-report"}>
            <div className="flex flex-col bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-slate-300 rounded-lg overflow-hidden cursor-pointer">
              <div className="m-4 overflow-hidden rounded-md h-60 flex justify-center items-center">
                <img
                  className="w-full h-full object-cover"
                  src="https://play-lh.googleusercontent.com/pzAgoUBDDetHSQpPp29Z0wkMQNyBvQIXXpNSnO5_yS8IJFs2dIVUaGEqOJDPYW1I9vE"
                  alt="Voice to Text"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="mb-2 text-2xl font-bold text-slate-800">
                  Voice to Text
                </h4>
                <p className="text-base text-slate-600 mt-3 leading-relaxed">
                  A voice-to-text feature that allows users to verbally report
                  incidents, making it accessible for individuals with
                  disabilities who may have difficulty typing.
                </p>
              </div>
              <div className="flex justify-center p-6 pt-2 gap-4">
                <button
                  className="rounded-md bg-gradient-to-r from-sky-500 to-sky-700 py-2 px-6 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-sky-700 hover:to-sky-900 transition-all"
                  type="button"
                >
                  Try Now
                </button>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link to={"/report-incident"}>
            <div className="flex flex-col bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-slate-300 rounded-lg overflow-hidden cursor-pointer">
              <div className="m-4 overflow-hidden rounded-md h-60 flex justify-center items-center">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.squarespace-cdn.com/content/v1/5bab316f7980b339c6dde5c2/877c3b92-24f0-4aa4-8804-2a389705d989/noun-warning-1109440-F5333F.png"
                  alt="Report"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="mb-2 text-2xl font-bold text-slate-800">
                  Report Incident
                </h4>
                <p className="text-base text-slate-600 mt-3 leading-relaxed">
                  Simplify incident reporting with our convenient online form.
                  Quickly and efficiently submit all necessary details with our
                  streamlined process
                </p>
              </div>
              <div className="flex justify-center p-6 pt-2 gap-4">
                <button
                  className="rounded-md bg-gradient-to-r from-yellow-500 to-yellow-700 py-2 px-6 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-yellow-700 hover:to-yellow-900 transition-all"
                  type="button"
                >
                  Try Now
                </button>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link to={"/heatmap"}>
            <div className="flex flex-col bg-gradient-to-r from-green-50 to-green-100 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-slate-300 rounded-lg overflow-hidden cursor-pointer">
              <div className="m-4 overflow-hidden rounded-md h-60 flex justify-center items-center">
                <img
                  className="w-full h-full object-cover"
                  src="https://t4.ftcdn.net/jpg/04/23/40/87/360_F_423408792_3K3fZwYzn84LbJdIiKYW73FbMHnVFXd8.jpg"
                  alt="Heatmap"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="mb-2 text-2xl font-bold text-slate-800">
                  Heatmap
                </h4>
                <p className="text-base text-slate-600 mt-3 leading-relaxed">
                  Pinpoint high-risk areas with our interactive incident
                  heatmap. Visualize the frequency and severity of incidents to
                  proactively address potential hazards.
                </p>
              </div>
              <div className="flex justify-center p-6 pt-2 gap-4">
                <button
                  className="rounded-md bg-gradient-to-r from-green-500 to-green-700 py-2 px-6 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-900 transition-all"
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
