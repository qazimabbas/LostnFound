import React from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authAtom } from "../atoms/authAtom";
const card = [
  {
    pic: "./src/assets/login-1.svg",
    title: "Create an account",
    description: "Initially, you need to create an account to get started.",
  },
  {
    pic: "./src/assets/list-item.svg",
    title: "List the item",
    description:
      "List your lost item on the platform, providing a description and a picture of the item.",
  },
  {
    pic: "./src/assets/notification.svg",
    title: "Get notifications",
    description:
      "You will receive notifications when someone finds your lost item.",
  },
];

const Features = () => {
  const setAuth = useSetRecoilState(authAtom);
  return (
    <section className="bg-background-light dark:bg-background-dark py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-20">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-light dark:text-[#361d7a] mb-4">
          FEATURES
        </h2>
        <div className="w-24 h-1 bg-primary-light dark:bg-[#361d7a] mx-auto rounded-full" />
      </div>

      {/* Cards Container */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {card.map((item, index) =>
            index === 0 ? (
              <Link
                to="/auth"
                onClick={() => setAuth("signup")}
                key={index}
                className="bg-white dark:bg-card-dark rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                  transition-all duration-500 group hover:-translate-y-1 border border-gray-100 dark:border-gray-800"
              >
                <div
                  className="relative h-56 bg-accent-light dark:bg-accent-dark flex items-center justify-center 
                  group-hover:bg-gray-100 dark:group-hover:bg-gray-700/50 transition-colors duration-500"
                >
                  <img
                    src={item.pic}
                    alt={item.title}
                    className="w-[85%] h-[85%] object-contain transition-transform duration-500 
                      group-hover:scale-110 dark:filter dark:brightness-90 dark:contrast-125 dark:saturate-150"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-primary-light dark:text-[#361d7a] mb-3 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {item.description}
                  </p>
                </div>
              </Link>
            ) : (
              <div
                key={index}
                className="bg-white dark:bg-card-dark rounded-xl overflow-hidden shadow-lg hover:shadow-xl 
                  transition-all duration-500 group hover:-translate-y-1 border border-gray-100 dark:border-gray-800"
              >
                <div
                  className="relative h-56 bg-accent-light dark:bg-accent-dark flex items-center justify-center 
                  group-hover:bg-gray-100 dark:group-hover:bg-gray-700/50 transition-colors duration-500"
                >
                  <img
                    src={item.pic}
                    alt={item.title}
                    className="w-[85%] h-[85%] object-contain transition-transform duration-500 
                      group-hover:scale-110 dark:filter dark:brightness-90 dark:contrast-125 dark:saturate-150"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-primary-light dark:text-[#361d7a] mb-3 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Features;
