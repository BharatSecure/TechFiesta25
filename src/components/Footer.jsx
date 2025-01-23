import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IconButton } from "@mui/material";

const Footer = () => {
  return (
    <footer className="bg-sky-100 text-gray-800 py-8">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center px-6">
        <div className="mb-6 lg:mb-0 flex">
          <IconButton onClick={() => handleNavigation("/")}>
            <img
              src="/logo.png" 
              alt="Logo"
              style={{ width: 22, height: 22,}}
            />
          </IconButton>
          <Link to={"/"}>
            <h2 className="font-bold text-sky-600 font-smooch text-3xl hover:text-sky-700">
              BharatSecure
            </h2>
          </Link>
        </div>

        <div className="mb-6 lg:mb-0">
          <ul className="flex gap-6 text-sm font-medium">
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
