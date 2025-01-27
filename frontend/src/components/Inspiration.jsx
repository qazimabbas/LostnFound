import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../atoms/authAtom";

const Inspiration = () => {
  const setAuth = useSetRecoilState(authAtom);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark p-4 md:p-8 flex flex-col md:flex-row-reverse w-full min-h-screen items-center justify-center">
      <div className="flex-1 md:flex-[0.6] flex flex-col items-center gap-5 justify-center mt-8 md:mt-0">
        <div className="flex flex-col w-full">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary-light dark:text-[#361d7a] tracking-tight text-center">
            PROJECT INSPIRATION
          </h2>
        </div>
        <p className="text-center text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-3 max-w-[95%] md:max-w-[90%]">
        Losing my 3000 PKR phone charger in the university library and 
        being denied access to CCTV footage left me frustrated. 
        That experience inspired me to create a lost-and-found listing website,
         a solution to help students easily report and 
        recover misplaced items, turning a personal inconvenience into a project with a meaningful purpose.
        </p>
        <Link
          to="/auth"
          onClick={() => setAuth("login")}
          className="bg-primary-light dark:bg-[#361d7a] text-lg button mt-5 text-white px-6 py-3 rounded-md
            hover:bg-opacity-90 transition-colors duration-200"
        >
          Get Started
        </Link>
      </div>
      <div className="flex-1 md:flex-[0.4] flex items-center justify-center mt-8 md:mt-0">
        <div className="relative w-[90%] md:w-[95%] max-w-[500px]">
          <img
            src={`./src/assets/${
              isDark ? "Inspiration.svg" : "developer_outline.svg"
            }`}
            alt="Developer Illustration"
            className="w-full h-full transition-all duration-300 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default Inspiration;
