
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-sky-100 text-gray-800 py-8 mt-7">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center px-6">
        {/* Website Name */}
        <div className="mb-6 lg:mb-0">
          <h2 className=" font-bold text-sky-600 font-smooch text-3xl">BharatSecure</h2>
        </div>

        {/* Links Section */}
        <div className="mb-6 lg:mb-0">
          <ul className="flex gap-6 text-sm font-medium">
            <li>
              <a href="#" className="hover:text-sky-500">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-sky-500">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-sky-500">
                Blogs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-sky-500">
                Features
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
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

      {/* Copyright Section */}
      <div className="mt-6 border-t border-gray-300 pt-4 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} BharatSecure. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
