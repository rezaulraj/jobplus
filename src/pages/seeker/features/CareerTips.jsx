import React from "react";
import { motion } from "framer-motion";
import {
  FaLightbulb,
  FaFileAlt,
  FaHandshake,
  FaChartLine,
  FaUsers,
  FaRocket,
  FaRegClock,
  FaRegComments,
  FaLinkedin,
  FaGithub,
  FaRegEnvelope,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaBookOpen,
  FaVideo,
  FaPodcast,
  FaNewspaper,
  FaDownload,
} from "react-icons/fa";

const CareerTips = () => {
  const tips = [
    {
      id: 1,
      icon: <FaFileAlt className="w-8 h-8" />,
      title: "Resume Optimization",
      description:
        "Tailor your resume for each job application. Use keywords from the job description and highlight achievements with numbers.",
      color: "from-[#1e2558] to-[#4eb956]",
      bgColor: "bg-[#1e2558]/10",
      iconColor: "text-[#4eb956]",
    },
    {
      id: 2,
      icon: <FaLinkedin className="w-8 h-8" />,
      title: "LinkedIn Profile",
      description:
        "Keep your LinkedIn profile updated. Engage with industry content, connect with professionals, and showcase your projects.",
      color: "from-[#4eb956] to-[#1e2558]",
      bgColor: "bg-[#4eb956]/10",
      iconColor: "text-[#1e2558]",
    },
    {
      id: 3,
      icon: <FaHandshake className="w-8 h-8" />,
      title: "Networking",
      description:
        "Attend industry events, join professional groups, and build genuine relationships. Most jobs come through referrals.",
      color: "from-[#1e2558] to-[#4eb956]",
      bgColor: "bg-[#1e2558]/10",
      iconColor: "text-[#4eb956]",
    },
    {
      id: 4,
      icon: <FaRegComments className="w-8 h-8" />,
      title: "Interview Preparation",
      description:
        "Practice common questions, research the company, prepare your own questions, and do mock interviews.",
      color: "from-[#4eb956] to-[#1e2558]",
      bgColor: "bg-[#4eb956]/10",
      iconColor: "text-[#1e2558]",
    },
    {
      id: 5,
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Skill Development",
      description:
        "Identify in-demand skills in your field. Take online courses, earn certifications, and build projects.",
      color: "from-[#1e2558] to-[#4eb956]",
      bgColor: "bg-[#1e2558]/10",
      iconColor: "text-[#4eb956]",
    },
    {
      id: 6,
      icon: <FaRegClock className="w-8 h-8" />,
      title: "Time Management",
      description:
        "Create a job search schedule. Set daily goals for applications, networking, and skill development.",
      color: "from-[#4eb956] to-[#1e2558]",
      bgColor: "bg-[#4eb956]/10",
      iconColor: "text-[#1e2558]",
    },
  ];

  const resources = [
    {
      icon: <FaBookOpen />,
      title: "Free E-books",
      description: "Download career guides and interview preparation books",
      bgColor: "bg-[#4eb956]/20",
      color: "text-[#1e2558]",
    },
    {
      icon: <FaVideo />,
      title: "Video Tutorials",
      description: "Watch expert advice and interview tips",
      bgColor: "bg-[#1e2558]/20",
      color: "text-[#4eb956]",
    },
    {
      icon: <FaPodcast />,
      title: "Career Podcasts",
      description: "Listen to industry leaders share experiences",
      bgColor: "bg-[#4eb956]/20",
      color: "text-[#1e2558]",
    },
    {
      icon: <FaNewspaper />,
      title: "Industry News",
      description: "Stay updated with market trends",
      bgColor: "bg-[#1e2558]/20",
      color: "text-[#4eb956]",
    },
  ];

  const interviewQuestions = [
    "Tell me about yourself",
    "Why do you want to work here?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
  ];

  const dosAndDonts = {
    dos: [
      "Research the company thoroughly",
      "Dress professionally",
      "Arrive 10-15 minutes early",
      "Bring copies of your resume",
      "Send thank-you emails",
    ],
    donts: [
      "Don't be late",
      "Don't badmouth previous employers",
      "Don't use your phone",
      "Don't give vague answers",
      "Don't forget to ask questions",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#4eb956]/5 py-16 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1e2558]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#4eb956]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-60 left-20 w-80 h-80 bg-[#1e2558]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block p-4 bg-gradient-to-r from-[#1e2558] to-[#4eb956] rounded-full mb-6"
          >
            <FaLightbulb className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1e2558] to-[#4eb956]">
              Career Growth Tips
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock your professional potential with expert advice, proven
            strategies, and practical resources to advance your career.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10">
            {[
              { number: "50+", label: "Expert Tips", icon: FaStar },
              { number: "10k+", label: "Job Seekers", icon: FaUsers },
              { number: "95%", label: "Success Rate", icon: FaRocket },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="w-5 h-5 text-[#4eb956]" />
                  <span className="text-2xl font-bold text-[#1e2558]">
                    {stat.number}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tip.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <div className="p-8">
                <div
                  className={`${tip.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className={tip.iconColor}>{tip.icon}</div>
                </div>

                <h3 className="text-xl font-bold text-[#1e2558] mb-3 group-hover:text-[#4eb956] transition-colors duration-300">
                  {tip.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {tip.description}
                </p>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-[#4eb956] font-semibold group-hover:gap-3 transition-all"
                >
                  <span>Learn More</span>
                  <FaArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              <div
                className={`h-1 bg-gradient-to-r ${tip.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
              />
            </motion.div>
          ))}
        </div>

        {/* Resources Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-[#1e2558] mb-12">
            Free <span className="text-[#4eb956]">Resources</span> to Help You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center cursor-pointer border border-gray-100 hover:border-[#4eb956] transition-all"
              >
                <div
                  className={`${resource.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <div className={`${resource.color} text-2xl`}>
                    {resource.icon}
                  </div>
                </div>
                <h3 className="font-bold text-[#1e2558] mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {resource.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-[#4eb956] text-sm font-semibold flex items-center justify-center gap-1 mx-auto"
                >
                  <FaDownload className="w-3 h-3" />
                  <span>Access Now</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interview Prep Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Common Questions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-[#1e2558]/5 to-[#4eb956]/5 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#4eb956]/20 rounded-xl">
                <FaRegComments className="w-6 h-6 text-[#1e2558]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1e2558]">
                Common Interview Questions
              </h3>
            </div>

            <div className="space-y-4">
              {interviewQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-[#4eb956]/20 rounded-full flex items-center justify-center text-sm font-bold text-[#1e2558]">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{question}</p>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="mt-6 w-full py-3 bg-[#1e2558] text-white rounded-xl font-semibold hover:bg-[#4eb956] transition-colors flex items-center justify-center gap-2"
            >
              <span>View All Questions</span>
              <FaArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Dos and Don'ts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-[#1e2558] mb-6">
              Interview Dos & Don'ts
            </h3>

            <div className="space-y-6">
              {/* Dos */}
              <div>
                <h4 className="font-semibold text-[#4eb956] mb-3 flex items-center gap-2">
                  <FaCheckCircle className="w-5 h-5" />
                  Do's
                </h4>
                <ul className="space-y-2">
                  {dosAndDonts.dos.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 bg-[#4eb956] rounded-full"></div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div>
                <h4 className="font-semibold text-[#1e2558] mb-3 flex items-center gap-2">
                  <FaRegClock className="w-5 h-5" />
                  Don'ts
                </h4>
                <ul className="space-y-2">
                  {dosAndDonts.donts.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 bg-[#1e2558] rounded-full"></div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default CareerTips;
