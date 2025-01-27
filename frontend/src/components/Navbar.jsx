import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { authAtom } from "../atoms/authAtom";
import { userAtom } from "../atoms/userAtom";
import useLogout from "../hooks/useLogout";
import { showSuccessToast, showErrorToast } from "./CustomToast";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const setAuth = useSetRecoilState(authAtom);
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      // Remove user data from localStorage
      localStorage.removeItem("user");

      // Clear user data from Recoil state
      setUser(null);

      showSuccessToast("Logged out successfully");
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return (
    <nav className="navbar relative flex justify-between items-center p-4 bg-primary-light dark:bg-background-dark text-white border-b border-gray-200 dark:border-gray-800 z-50">
      <Link to="/" className="flex items-center gap-3 relative z-20">
        <img
          src={Logo}
          alt="Lost & Found Logo"
          className="w-10 h-10 md:w-16 md:h-16 object-contain "
        />
        <span className=" block font-heading text-xl sm:text-2xl md:text-3xl font-bold md:mt-4 mt-2">
          Lost & Found
        </span>
      </Link>

      <div className="flex items-center gap-4 relative z-20">
        <ThemeToggle />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <Link to="/update" title="Update Profile">
                  <img
                    src={user.profilePic}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-300 transition-colors duration-200"
                  title="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                onClick={() => setAuth("signup")}
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Sign-up
              </Link>
              <Link
                to="/auth"
                onClick={() => setAuth("login")}
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Log-in
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 w-full bg-primary-light dark:bg-background-dark md:hidden border-b border-gray-200 dark:border-gray-800 z-10">
          <div className="flex flex-col items-center gap-4 p-4">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <Link to="/update" title="Update Profile">
                    <img
                      src={user.profilePic}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-300 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>Logout</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => {
                    setAuth("signup");
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-gray-300 w-full text-center py-2"
                >
                  Sign-up
                </Link>
                <Link
                  to="/auth"
                  onClick={() => {
                    setAuth("login");
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-gray-300 w-full text-center py-2"
                >
                  Log-in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
