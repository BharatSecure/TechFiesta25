import { Link } from "react-router-dom";

const CTAButton = () => {
  return (
    <div className="text-center mt-8">
      <Link to="/report-incident">
        {" "}
        {/* Link to your reporting page */}
        <button className="bg-sky-600 text-white px-8 py-3 rounded-md text-xl font-semibold hover:bg-sky-700 transition-all">
          Report an Incident
        </button>
      </Link>
    </div>
  );
};

export default CTAButton;
