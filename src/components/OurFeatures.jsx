
import { Link } from "react-router-dom";


const OurFeatures = () => {
  return (
    <div className="mt-20">
      <div className="flex justify-center items-center flex-col" style={{backgroundColor: "#f5f5f5"}}>
        {/* Title */}
        <h1 className="text-sky-500 font-bold text-6xl">Our Features</h1>

        {/* Grid Section */}
        <div className="grid lg:grid-cols-3 mx-3 sm:grid-cols-1 gap-5 mt-12 p-6 rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
          {/* Card 1 */}
          <div className="flex flex-col bg-[#F0F9FF] shadow-md border-2 border-slate-700 rounded-lg my-6 w-96 hover:scale-110 transition-transform ">
            <div className="m-2.5 overflow-hidden rounded-md h-60 flex justify-center items-center">
              <img
                className="w-full h-full object-cover"
                src="https://play-lh.googleusercontent.com/pzAgoUBDDetHSQpPp29Z0wkMQNyBvQIXXpNSnO5_yS8IJFs2dIVUaGEqOJDPYW1I9vE"
                alt="profile-picture"
              />
            </div>
            <div className="p-6 text-center">
              <h4 className="mb-1 text-xl font-semibold text-slate-800">
                Voice to Text
              </h4>
              <p className="text-base text-slate-600 mt-4 font-medium max-h-20">
                A voice-to-text feature that allows users to verbally report incidents, making it accessible for individuals with disabilities who may have difficulty typing.
              </p>
            </div>
            <div className="flex justify-center p-6 pt-2 gap-7">
                <Link to={'/voice-report'}>
              <button
                className="min-w-32 rounded-md bg-sky-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                View
              </button>
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col bg-[#FFF7E6] shadow-md border-2 border-slate-700 rounded-lg my-6 w-96 hover:scale-110 transition-transform">
            <div className="m-2.5 overflow-hidden rounded-md h-60 flex justify-center items-center">
              <img
                className="w-full h-full object-cover"
                src="https://images.squarespace-cdn.com/content/v1/5bab316f7980b339c6dde5c2/877c3b92-24f0-4aa4-8804-2a389705d989/noun-warning-1109440-F5333F.png"
                alt="profile-picture"
              />
            </div>
            <div className="p-6 text-center">
              <h4 className="mb-1 text-xl font-semibold text-slate-800">Report</h4>
              <p className="text-base text-slate-600 mt-4 font-medium min-h-20">
                Easily report incidents using our user-friendly online form.
              </p>
            </div>
            <div className="flex justify-center p-6 pt-2 gap-7">
            <Link to={'/report-incident'}>
              <button
                className="min-w-32 rounded-md bg-sky-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                View
              </button>
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col bg-[#E6F7E6] shadow-md border-2 border-slate-700 rounded-lg my-6 w-96 hover:scale-110 transition-transform">
            <div className="m-2.5 overflow-hidden rounded-md h-60 flex justify-center items-center">
              <img
                className="w-full h-full object-cover"
                src="https://t4.ftcdn.net/jpg/04/23/40/87/360_F_423408792_3K3fZwYzn84LbJdIiKYW73FbMHnVFXd8.jpg"
                alt="profile-picture"
              />
            </div>
            <div className="p-6 text-center">
              <h4 className="mb-1 text-xl font-semibold text-slate-800">Heatmap</h4>
              <p className="text-base text-slate-600 mt-4 font-medium min-h-20">
                Identify high-risk areas using our incident heatmap.
              </p>
            </div>
            <div className="flex justify-center p-6 pt-2 gap-7">
            <Link to={'/heatmap'}>
              <button
                className="min-w-32 rounded-md bg-sky-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                View
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurFeatures;
