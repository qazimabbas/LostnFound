import React from "react";

const Hero = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark p-4 md:p-8 flex flex-col md:flex-row w-full items-center justify-center">
      <div className="flex-1 flex flex-col gap-3 md:gap-5 text-center md:text-left mb-8 md:mb-16">
        <h2 className="font-heading text-4xl md:text-6xl tracking-tighter font-black text-text-light dark:text-text-dark">
          LOST & FOUND
        </h2>
        <h4 className="font-heading text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300">
          LOST IT. LIST IT. FIND IT
        </h4>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img
          src="./src/assets/lost-2.svg"
          alt="ILostItIcon"
          className="w-[90%] md:w-[80%] max-w-[500px] dark:filter dark:brightness-90 transition-transform duration-300 hover:scale-110 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Hero;
