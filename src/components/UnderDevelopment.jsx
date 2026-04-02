import React from "react";
import { FaTools, FaCode, FaRocket, FaClock, FaHeart } from "react-icons/fa";

const UnderDevelopment = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-linear-to-r from-[#4EB956] to-[#1E2558] rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-4 bg-linear-to-r from-[#4EB956] to-[#1E2558] rounded-full blur-md opacity-20"></div>
                  <FaTools className="text-6xl text-[#1E2558] relative z-10 animate-bounce" />
                </div>
                <div className="relative ml-6">
                  <div className="absolute -inset-4 bg-linear-to-r from-[#1E2558] to-[#4EB956] rounded-full blur-md opacity-20"></div>
                  <FaCode
                    className="text-6xl text-[#4EB956] relative z-10 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-[#1E2558] to-[#4EB956] bg-clip-text text-transparent">
                Under Development
              </h1>

              <div className="mb-8">
                <p className="text-2xl md:text-3xl text-gray-700 mb-4">
                  This section is currently
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-linear-to-r from-[#1E2558] to-[#2d377a] rounded-full text-white font-bold text-xl mb-2">
                  <FaRocket className="mr-3 animate-pulse" />
                  <span>UNDER DEVELOPMENT</span>
                </div>
              </div>

              <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl p-8 mb-8 shadow-lg border border-gray-100">
                <p className="text-2xl md:text-3xl text-gray-800 mb-6 leading-relaxed">
                  Please use visit us letter we will soon back
                </p>
                <div className="flex items-center justify-center text-gray-600">
                  <FaClock className="mr-3 text-[#4EB956]" />
                  <span className="text-xl">Coming Soon</span>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 font-medium">
                    Development Progress
                  </span>
                  <span className="text-[#1E2558] font-bold">75%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#4EB956] to-[#1E2558] rounded-full relative animate-pulse"
                    style={{ width: "75%" }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-white opacity-20"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-[#4EB956]/20 to-[#4EB956]/10 rounded-xl mb-4 mx-auto">
                    <FaTools className="text-2xl text-[#4EB956]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Advanced Features
                  </h3>
                  <p className="text-gray-600">
                    Exciting new functionality coming soon
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-[#1E2558]/20 to-[#1E2558]/10 rounded-xl mb-4 mx-auto">
                    <FaCode className="text-2xl text-[#1E2558]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Modern Design
                  </h3>
                  <p className="text-gray-600">
                    Beautiful and intuitive user interface
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-[#4EB956]/20 to-[#1E2558]/20 rounded-xl mb-4 mx-auto">
                    <FaRocket className="text-2xl text-gradient-to-r from-[#1E2558] to-[#4EB956]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Fast Performance
                  </h3>
                  <p className="text-gray-600">
                    Optimized for speed and efficiency
                  </p>
                </div>
              </div>

              <div className="bg-linear-to-r from-[#1E2558]/5 to-[#4EB956]/5 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-center">
                  <FaHeart className="text-2xl text-red-500 mr-3 animate-pulse" />
                  <p className="text-xl text-gray-700 font-medium">
                    Thank you for your patience! We're working hard to bring you
                    an amazing experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(100px, -50px) rotate(90deg);
          }
          50% {
            transform: translate(0, -100px) rotate(180deg);
          }
          75% {
            transform: translate(-100px, -50px) rotate(270deg);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .text-gradient-to-r {
          background: linear-gradient(to right, #1e2558, #4eb956);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default UnderDevelopment;
