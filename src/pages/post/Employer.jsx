import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaUserTie,
  FaArrowRight,
  FaPhoneAlt,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Employer = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [hoveredButton, setHoveredButton] = useState(null);
  const backgrounds = [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div className="relative pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
              currentBg === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${bg}')` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentBg === index ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4EB956]/60 via-[#1E2558]/70 to-purple-900/60"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * 100 + "vw",
                y: Math.random() * 100 + "vh",
              }}
              animate={{
                x: Math.random() * 100 + "vw",
                y: Math.random() * 100 + "vh",
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 sm:mb-12 md:mb-16"
          >
            <h1 className="text-4xl sm:text-4xl font-bold text-white mb-4">
              Hire the best{" "}
              <span className=" text-3xl sm:text-4xl text-emerald-300 mt-2">
                Faster & Smarter
              </span>
            </h1>
            <p className="text-xl text-white">
              Publish your first job in just minutes!
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 w-full mb-12 md:mb-16">
            <motion.div
              className="relative"
              onHoverStart={() => setHoveredButton("job")}
              onHoverEnd={() => setHoveredButton(null)}
            >
              <motion.div
                className="absolute -inset-4 sm:-inset-5 md:-inset-6 rounded-full"
                animate={{
                  scale: hoveredButton === "job" ? 1.05 : 1,
                  opacity: hoveredButton === "job" ? 0.8 : 0.3,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 blur-md sm:blur-lg"></div>
              </motion.div>

              <Link to="/employers/post-job" className="block">
                <motion.button
                  className="relative w-64 h-64 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br from-[#1e2558] via-[#2a3478] to-[#1e2558] text-white shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#4eb956]/0 via-[#4eb956]/20 to-[#4eb956]/0"
                    initial={{ x: "-100%" }}
                    animate={{ x: hoveredButton === "job" ? "100%" : "-100%" }}
                    transition={{ duration: 1 }}
                  />

                  <div className="relative h-full flex flex-col items-center justify-center p-6 sm:p-8">
                    <motion.div
                      className="w-20 h-20 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-2xl ring-4 ring-white/30 group-hover:ring-white/50 transition-all duration-500"
                      animate={{
                        rotate: hoveredButton === "job" ? 360 : 0,
                        scale: hoveredButton === "job" ? 1.15 : 1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <FaBriefcase className="text-2xl sm:text-xl md:text-2xl lg:text-3xl text-[#1e2558]" />
                    </motion.div>

                    <div className="text-center space-y-2 mt-4 sm:mt-6">
                      <div className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold">
                        POST A JOB
                      </div>
                      <p className="text-white/70 text-sm sm:text-xs md:text-sm lg:text-base">
                        Find perfect candidates
                      </p>
                    </div>

                    <motion.div
                      className="flex items-center gap-2 text-[#4eb956] mt-4"
                      animate={{ x: hoveredButton === "job" ? 5 : 0 }}
                    >
                      <span className="text-sm sm:text-xs md:text-sm font-semibold">
                        Get Started
                      </span>
                      <FaArrowRight className="text-sm" />
                    </motion.div>

                    {hoveredButton === "job" && (
                      <>
                        <motion.div
                          className="absolute -top-2 -right-2 w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-yellow-400 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <FaStar className="text-white text-xs" />
                        </motion.div>
                        <motion.div
                          className="absolute -bottom-2 -left-2 w-5 h-5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-cyan-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      </>
                    )}
                  </div>
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="my-4 sm:my-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="sm:hidden">
                <div className="text-white/70 font-bold text-lg px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                  OR
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="relative h-56 sm:h-48 md:h-56 lg:h-64 flex items-center justify-center">
                  <div className="w-1 h-24 sm:h-20 md:h-24 lg:h-28 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                  <div className="absolute bg-white/10 backdrop-blur-sm text-white/70 px-5 py-3 rounded-full text-sm sm:text-xs md:text-sm font-semibold border border-white/20">
                    OR
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative cursor-pointer"
              onHoverStart={() => setHoveredButton("freelancer")}
              onHoverEnd={() => setHoveredButton(null)}
            >
              <motion.div
                className="absolute -inset-4 sm:-inset-5 md:-inset-6 rounded-full cursor-pointer"
                animate={{
                  scale: hoveredButton === "freelancer" ? 1.05 : 1,
                  opacity: hoveredButton === "freelancer" ? 0.8 : 0.3,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 blur-md sm:blur-lg"></div>
              </motion.div>

              <Link to="/freelancer/post-job" className="block cursor-pointer">
                <motion.button
                  className="relative w-64 h-64 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br from-[#4eb956] via-emerald-500 to-teal-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    initial={{ x: "-100%" }}
                    animate={{
                      x: hoveredButton === "freelancer" ? "100%" : "-100%",
                    }}
                    transition={{ duration: 1 }}
                  />

                  <div className="relative h-full flex flex-col items-center justify-center p-6 sm:p-8">
                    <motion.div
                      className="w-20 h-20 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-2xl ring-4 ring-white/30 group-hover:ring-white/50 transition-all duration-500"
                      animate={{
                        rotate: hoveredButton === "freelancer" ? -360 : 0,
                        scale: hoveredButton === "freelancer" ? 1.15 : 1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <FaUserTie className="text-2xl sm:text-xl md:text-2xl lg:text-3xl text-[#4eb956]" />
                    </motion.div>

                    <div className="text-center space-y-2 mt-4 sm:mt-6">
                      <div className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold">
                        HIRE FREELANCER
                      </div>
                      {/* <p className="text-white/70 text-sm sm:text-xs md:text-sm lg:text-base">
                        On-demand talent
                      </p> */}
                    </div>

                    <motion.div
                      className="flex items-center gap-2 text-white mt-4"
                      animate={{ x: hoveredButton === "freelancer" ? 5 : 0 }}
                    >
                      <span className="text-sm sm:text-xs md:text-sm font-semibold">
                        Find Talent
                      </span>
                      <FaArrowRight className="text-sm" />
                    </motion.div>

                    {hoveredButton === "freelancer" && (
                      <>
                        <motion.div
                          className="absolute -top-2 -left-2 w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-pink-400 flex items-center justify-center"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <FaStar className="text-white text-xs" />
                        </motion.div>
                        <motion.div
                          className="absolute -bottom-2 -right-2 w-5 h-5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-orange-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      </>
                    )}
                  </div>
                </motion.button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center justify-center gap-4 sm:gap-6 bg-white/5 backdrop-blur-lg rounded-2xl px-6 sm:px-8 py-4 sm:py-6 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
            whileHover={{ scale: 1.03 }}
          >
            <motion.div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[#4eb956] to-emerald-400 flex items-center justify-center ring-2 ring-white/30 group-hover:ring-white/50 shadow-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FaPhoneAlt className="text-white text-lg" />
            </motion.div>
            <div className="text-left">
              <div className="text-white/70 text-xs sm:text-sm">
                Need help? Call us
              </div>
              <div className="text-xl font-bold text-white bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                +8801906-499721 (JOBS PLUS)
              </div>
            </div>
            <motion.div
              className="text-emerald-300 hidden sm:block"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowRight />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute bottom-2 right-2 sm:bottom-6 sm:right-6 max-w-xs sm:max-w-sm"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border-2 border-white/20 p-4 sm:p-6 shadow-2xl hover:border-white/30 transition-all duration-300">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <motion.div
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-white font-bold text-sm sm:text-xl">
                    HC
                  </span>
                </motion.div>
              </div>
              <div>
                <div className="text-white font-bold text-sm sm:text-lg">
                  Hyder Usman Ch.
                </div>
                <div className="text-white/70 text-xs sm:text-sm">
                  Chief Operating Officer
                </div>
                <div className="text-[#4eb956] font-medium text-xs sm:text-sm mt-1">
                  Blue Group of Companies
                </div>
                <p className="text-white/80 italic text-xs sm:text-sm mt-2 sm:mt-3">
                  "Jobs Plus helped us find top talent in record time. Highly
                  recommended!"
                </p>
                <div className="flex items-center gap-1 mt-1 sm:mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="text-yellow-400 text-xs sm:text-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Employer;
