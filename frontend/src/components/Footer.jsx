import React from "react";
import { Link } from "react-router-dom";

const socials = [
  "./src/assets/instagram.svg",
  "./src/assets/linkedin.svg",
  "./src/assets/github.svg",
];

const Footer = () => {
  return (
    <footer className="bg-primary-light dark:bg-[#0f1729] border-t border-gray-200 dark:border-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left side - Copyright and Name */}
          <div className="text-center md:text-left">
            <p className="text-sm md:text-base">
              © 2024 Lost & Found. All rights reserved.
            </p>
            <p className="text-sm md:text-base mt-1">
              Developed by{" "}
              <span className="font-semibold hover:text-gray-300 cursor-pointer">
                Kazim Abbas
              </span>
            </p>
          </div>

          {/* Center - Made with love */}
          <div className="text-center">
            <p className="text-sm text-gray-300">
              Made with ❤️ using MERN Stack
            </p>
          </div>

          {/* Right side - Social Links */}
          <div className="flex items-center justify-center md:justify-end space-x-4">
            {socials.map((social, index) => (
              <a
                key={index}
                href="#"
                className="hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  src={social}
                  alt={`Social ${index + 1}`}
                  className="w-6 h-6 invert"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
