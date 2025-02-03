import { useNavigate, Link } from "react-router-dom"; // Import useNavigate hook
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IconButton } from "@mui/material";

const Footer = () => {
  const navigate = useNavigate();

  const handleFaqClick = () => {
    // Navigate to Home page and scroll to FAQ section
    navigate("/", { state: { scrollToFaq: true } });
  };

  return (
    <footer className="bg-sky-100 text-gray-800 py-8  shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center px-6">
        <div className="mb-6 lg:mb-0 flex">
          <IconButton onClick={() => navigate("/")}>
            <img src="/logo.png" alt="Logo" style={{ width: 22, height: 22 }} />
          </IconButton>
          <Link to={"/"}>
            <h2 className="font-bold text-sky-600 font-smooch text-3xl hover:text-sky-700">
              BharatSecure
            </h2>
          </Link>
        </div>

        <div className="mb-6 lg:mb-0">
          <ul className="flex flex-wrap gap-6 text-sm font-medium">
            <li>
              <Link to="/" className="hover:text-sky-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-sky-500">
                About
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-sky-500">
                Blogs
              </Link>
            </li>
            <li>
              <Link to="/about#features" className="hover:text-sky-500">
                Features
              </Link>
            </li>
            <li>
              <Link to="/feedback" className="hover:text-sky-500">
                Feedback
              </Link>
            </li>
            <li>
              <button onClick={handleFaqClick} className="hover:text-sky-500">
                FAQ's
              </button>
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-800"
          >
            <FaFacebook className="text-2xl" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-800"
          >
            <FaTwitter className="text-2xl" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-800"
          >
            <FaInstagram className="text-2xl" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-800"
          >
            <FaLinkedin className="text-2xl" />
          </a>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-300 pt-4 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} BharatSecure. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
