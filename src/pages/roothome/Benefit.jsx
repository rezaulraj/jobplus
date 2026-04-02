import React from "react";
import { FaRocket, FaFileAlt, FaPenFancy } from "react-icons/fa";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: <FaRocket className="text-white w-8 h-8" />,
    title: "Boost Your Job Hunt",
    subtitle:
      "Get a CV that highlights your profile and increase views by up to 50%",
    bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
  },
  {
    icon: <FaFileAlt className="text-white w-8 h-8" />,
    title: "Free CV Review",
    subtitle:
      "Does your CV pass the 10-second test? Get free professional feedback from Jobs Plus experts.",
    bgColor: "bg-gradient-to-r from-green-400 to-teal-500",
    path: "/free-cv-review",
  },
  {
    icon: <FaPenFancy className="text-white w-8 h-8" />,
    title: "CV Writing Service",
    subtitle:
      "Jobs Plus CV Experts optimize your CV with the most searched keywords recruiters look for.",
    bgColor: "bg-gradient-to-r from-pink-500 to-red-500",
    path: "/cv-writeing-service",
  },
];

const Benefit = () => {
  return (
    <div className="bg-gray-100 py-12 font-source">
      <div className="container mx-auto px-4 sm:px-6 lg:px-2">
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Link
              key={index}
              // to={benefit.path}
              className={`flex flex-col items-start p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform ${benefit.bgColor}`}
            >
              <div className="mb-4 p-3 bg-gray-400 rounded-full">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-white text-sm">{benefit.subtitle}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefit;
