import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  FaHome,
  FaCompass,
  FaEnvelope,
  FaSearch,
  FaArrowRight,
  FaCloud,
  FaLeaf,
  FaStar,
  FaMeteor,
} from "react-icons/fa";
import { RiPlanetLine, RiCloudyLine } from "react-icons/ri";
import { GiSpaceship, GiOrbital, GiGalaxy } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [floatingIcons, setFloatingIcons] = useState([]);
  const [showParticles, setShowParticles] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };

    window.addEventListener("mousemove", moveCursor);

    const icons = [];
    const iconList = [
      FaCloud,
      FaLeaf,
      FaStar,
      FaMeteor,
      RiPlanetLine,
      GiGalaxy,
    ];

    for (let i = 0; i < 20; i++) {
      icons.push({
        id: i,
        Icon: iconList[Math.floor(Math.random() * iconList.length)],
        size: Math.random() * 24 + 16,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        color: Math.random() > 0.5 ? "#4eb956" : "#ffffff",
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    setFloatingIcons(icons);

    setTimeout(() => setShowParticles(true), 1000);

    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };
  const navigateTo = (path = "/") => {
    navigate(path);
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0f2e] via-[#1e2558] to-[#0a0f2e] text-white overflow-hidden relative">
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 border-[#4eb956] pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {floatingIcons.map((icon) => (
          <motion.div
            key={icon.id}
            className="absolute"
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              color: icon.color,
              opacity: icon.opacity,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(icon.id) * 50, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: icon.duration,
              repeat: Infinity,
              delay: icon.delay,
              ease: "easeInOut",
            }}
          >
            <icon.Icon size={icon.size} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showParticles && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#4eb956] rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="absolute w-96 h-96 rounded-full border border-[#4eb956] border-opacity-20"
          variants={orbitVariants}
          animate="animate"
        >
          <motion.div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <RiPlanetLine className="text-[#4eb956] text-3xl" />
          </motion.div>
        </motion.div>

        <div className="relative mb-8">
          <motion.div
            className="text-[200px] md:text-[280px] font-bold leading-none flex items-center"
            variants={itemVariants}
          >
            <motion.div
              variants={numberVariants}
              whileHover="hover"
              className="relative"
            >
              <span className="text-white">4</span>
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <FaStar className="text-[#4eb956] text-4xl" />
              </motion.div>
            </motion.div>

            <motion.div
              variants={numberVariants}
              whileHover="hover"
              className="relative mx-4"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                scale: { duration: 3, repeat: Infinity },
                rotate: { duration: 5, repeat: Infinity },
              }}
            >
              <span className="text-[#4eb956]">0</span>
              <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <GiSpaceship className="text-white text-3xl" />
              </motion.div>
            </motion.div>

            <motion.div
              variants={numberVariants}
              whileHover="hover"
              className="relative"
            >
              <span className="text-white">4</span>
              <motion.div
                className="absolute -bottom-4 -left-4"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  reverse: true,
                }}
              >
                <GiOrbital className="text-[#4eb956] text-4xl" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute top-1/4 -left-12"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            }}
          >
            <RiCloudyLine className="text-white text-6xl opacity-30" />
          </motion.div>

          <motion.div
            className="absolute bottom-1/4 -right-12"
            animate={{
              y: [0, 30, 0],
              rotate: [0, -360],
            }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            }}
          >
            <RiCloudyLine className="text-[#4eb956] text-6xl opacity-30" />
          </motion.div>
        </div>

        <motion.div className="mb-8 text-center" variants={itemVariants}>
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            Lost in{" "}
            <motion.span
              className="text-[#4eb956] inline-block"
              animate={{
                textShadow: [
                  "0 0 8px #4eb956",
                  "0 0 16px #4eb956",
                  "0 0 8px #4eb956",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Space
            </motion.span>
          </motion.h1>

          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-[#4eb956] to-transparent mx-auto my-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          />

          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
          >
            The page you're looking for has drifted into the cosmic void.
            <br />
            Don't worry, we'll help you navigate back home.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-5xl"
          variants={containerVariants}
        >
          {[
            {
              icon: FaHome,
              title: "Return Home",
              path: "/",
              description: "Go back to the main dashboard",
              color: "from-[#4eb956] to-emerald-500",
              delay: 0.1,
            },
            {
              icon: FaCompass,
              title: "Explore",
              path: "/jobs",
              description: "Discover new pages and features",
              color: "from-blue-500 to-cyan-400",
              delay: 0.2,
            },
            {
              icon: FaEnvelope,
              title: "Contact Support",

              description: "Get help from our team",
              color: "from-purple-500 to-pink-500",
              delay: 0.3,
            },
          ].map((item, index) => (
            <motion.a
              href={item.path}
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-3xl" />

              <div className="relative bg-gray-900 bg-opacity-40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 border-opacity-50 hover:border-[#4eb956] transition-all duration-300 cursor-pointer h-full">
                <motion.div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 mx-auto`}
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <item.icon className="text-white text-2xl" />
                </motion.div>

                <h3 className="text-2xl font-bold text-center mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-300 text-center mb-6">
                  {item.description}
                </p>

                <motion.div
                  className="flex items-center justify-center text-[#4eb956]"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="mr-2">Get Started</span>
                  <FaArrowRight />
                </motion.div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <motion.button
            onClick={navigateTo}
            className="px-12 py-6 bg-gradient-to-r from-[#4eb956] to-emerald-500 text-white font-bold text-xl rounded-2xl shadow-2xl relative overflow-hidden"
            animate={{
              boxShadow: [
                "0 10px 30px rgba(78, 185, 86, 0.3)",
                "0 15px 40px rgba(78, 185, 86, 0.5)",
                "0 10px 30px rgba(78, 185, 86, 0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="relative z-10 flex items-center">
              <FaCompass className="mr-3" />
              Begin Your Journey Back
            </span>

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.8 }}
            />
          </motion.button>

          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-[#4eb956] to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-70 transition-opacity duration-300 -z-10"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          className="mt-16 text-center text-gray-400"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center space-x-6 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <FaStar
                  className={`text-${
                    i % 2 === 0 ? "[#4eb956]" : "white"
                  } text-lg opacity-70`}
                />
              </motion.div>
            ))}
          </div>

          <p className="text-sm">
            Navigate safely through the cosmos • Error 404 • Page not found
          </p>
        </motion.div>
      </motion.div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4eb956] rounded-full opacity-5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl" />
    </div>
  );
};

export default NotFoundPage;
