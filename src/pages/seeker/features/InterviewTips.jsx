import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophone,
  FaVideo,
  FaUserTie,
  FaRegClock,
  FaRegComments,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaStar,
  FaDownload,
  FaBookmark,
  FaShareAlt,
  FaLightbulb,
  FaRegLaugh,
  FaRegHandshake,
  FaChartLine,
  FaRegCalendarAlt,
  FaRegFileAlt,
  FaRegQuestionCircle,
  FaRegLightbulb,
  FaRegGem,
  FaRegSmile,
  FaRegFrown,
  FaChevronRight,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaRegEnvelope,
} from "react-icons/fa";

const InterviewTips = () => {
  const [activeTab, setActiveTab] = useState("preparation");
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const tabs = [
    { id: "preparation", label: "Preparation", icon: FaRegClock },
    { id: "common-questions", label: "Common Questions", icon: FaRegComments },
    { id: "body-language", label: "Body Language", icon: FaUserTie },
    { id: "follow-up", label: "Follow Up", icon: FaRegHandshake },
  ];

  const preparationTips = [
    {
      title: "Research the Company",
      icon: FaRegFileAlt,
      color: "from-[#1e2558] to-[#4eb956]",
      tips: [
        "Study company mission, values, and culture",
        "Review recent news and achievements",
        "Understand their products/services",
        "Check their social media presence",
        "Read employee reviews on Glassdoor",
      ],
    },
    {
      title: "Know the Role",
      icon: FaRegQuestionCircle,
      color: "from-[#4eb956] to-[#1e2558]",
      tips: [
        "Analyze job description thoroughly",
        "Match your skills with requirements",
        "Prepare examples of relevant experience",
        "Identify gaps and how to address them",
        "Research typical salary ranges",
      ],
    },
    {
      title: "Practice Common Questions",
      icon: FaMicrophone,
      color: "from-[#1e2558] to-[#4eb956]",
      tips: [
        "Record yourself answering questions",
        "Do mock interviews with friends",
        "Practice the STAR method",
        "Prepare your own questions",
        "Time your responses",
      ],
    },
    {
      title: "Prepare Your Materials",
      icon: FaRegFileAlt,
      color: "from-[#4eb956] to-[#1e2558]",
      tips: [
        "Update and print multiple resume copies",
        "Prepare your portfolio/work samples",
        "Have references ready",
        "Bring a notepad and pen",
        "Prepare questions for interviewers",
      ],
    },
  ];

  const commonQuestions = [
    {
      question: "Tell me about yourself",
      answer:
        "Start with your current role, highlight relevant experience, and connect to why you're interested in this position. Keep it professional and concise (2-3 minutes).",
      tips: [
        "Focus on professional background",
        "Highlight achievements",
        "Connect to the role",
      ],
      difficulty: "Easy",
    },
    {
      question: "Why do you want to work here?",
      answer:
        "Show you've researched the company. Mention specific projects, values, or growth opportunities that align with your career goals.",
      tips: ["Research company values", "Be specific", "Show enthusiasm"],
      difficulty: "Medium",
    },
    {
      question: "What are your strengths and weaknesses?",
      answer:
        "Strengths: Be specific with examples. Weaknesses: Choose a real weakness and explain how you're working to improve it.",
      tips: ["Be honest", "Show self-awareness", "Focus on improvement"],
      difficulty: "Hard",
    },
    {
      question: "Where do you see yourself in 5 years?",
      answer:
        "Show ambition while being realistic. Connect your goals to growth opportunities within the company.",
      tips: ["Show ambition", "Be realistic", "Align with company"],
      difficulty: "Medium",
    },
    {
      question: "Why should we hire you?",
      answer:
        "Summarize your unique value proposition. Highlight how your skills and experience directly address their needs.",
      tips: ["Be confident", "Highlight uniqueness", "Address their needs"],
      difficulty: "Medium",
    },
  ];

  const bodyLanguageTips = [
    {
      do: "Maintain eye contact",
      dont: "Stare or look away too often",
      icon: "👀",
    },
    {
      do: "Sit up straight",
      dont: "Slouch or lean back",
      icon: "🧍",
    },
    {
      do: "Use hand gestures naturally",
      dont: "Fidget or cross arms",
      icon: "👐",
    },
    {
      do: "Smile genuinely",
      dont: "Force smiles or look nervous",
      icon: "😊",
    },
    {
      do: "Nod to show understanding",
      dont: "Overdo it or seem distracted",
      icon: "👍",
    },
    {
      do: "Mirror interviewer's posture",
      dont: "Copy every move obviously",
      icon: "🪞",
    },
  ];

  const followUpTips = [
    {
      timing: "Within 24 hours",
      action: "Send thank-you email",
      details: "Personalize each email, mention specific topics discussed",
      icon: FaRegEnvelope,
    },
    {
      timing: "After 5-7 days",
      action: "Follow up on status",
      details: "Politely inquire about next steps if you haven't heard back",
      icon: FaRegClock,
    },
    {
      timing: "After offer",
      action: "Negotiate professionally",
      details: "Research market rates, discuss total compensation package",
      icon: FaChartLine,
    },
    {
      timing: "After decision",
      action: "Maintain relationship",
      details: "Connect on LinkedIn, send thank-you note regardless of outcome",
      icon: FaLinkedin,
    },
  ];

  const quickTips = [
    "Arrive 10-15 minutes early",
    "Dress one level above the company dress code",
    "Bring multiple copies of your resume",
    "Turn off your phone completely",
    "Prepare 3-5 questions to ask",
    "Use the STAR method for behavioral questions",
    "Send thank-you emails to all interviewers",
    "Follow up within the specified timeline",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#4eb956]/5">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1e2558]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#4eb956]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-72 h-72 bg-[#1e2558]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
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
            className="inline-block mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e2558] to-[#4eb956] rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-[#1e2558] to-[#4eb956] p-6 rounded-full">
                <FaUserTie className="w-16 h-16 text-white" />
              </div>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1e2558] to-[#4eb956]">
              Master Your Interview
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Comprehensive guide to help you ace your next job interview. From
            preparation to follow-up, we've got you covered.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { number: "95%", label: "Success Rate", icon: FaStar },
              { number: "50+", label: "Expert Tips", icon: FaLightbulb },
              { number: "10k+", label: "Job Seekers", icon: FaRegSmile },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white px-6 py-4 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="w-6 h-6 text-[#4eb956]" />
                  <div>
                    <div className="text-2xl font-bold text-[#1e2558]">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#1e2558] to-[#4eb956] text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-md"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Preparation Tab */}
            {activeTab === "preparation" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {preparationTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                  >
                    <div className={`bg-gradient-to-r ${tip.color} p-6`}>
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl">
                          <tip.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {tip.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {tip.tips.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <FaCheckCircle className="w-5 h-5 text-[#4eb956] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Common Questions Tab */}
            {activeTab === "common-questions" && (
              <div className="max-w-3xl mx-auto">
                {commonQuestions.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-4"
                  >
                    <motion.div
                      onClick={() =>
                        setExpandedQuestion(
                          expandedQuestion === index ? null : index,
                        )
                      }
                      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                item.difficulty === "Easy"
                                  ? "bg-[#4eb956]/20 text-[#4eb956]"
                                  : item.difficulty === "Medium"
                                    ? "bg-[#1e2558]/20 text-[#1e2558]"
                                    : "bg-red-100 text-red-600"
                              }`}
                            >
                              {item.difficulty}
                            </div>
                            <h3 className="text-lg font-semibold text-[#1e2558]">
                              {item.question}
                            </h3>
                          </div>
                          <motion.div
                            animate={{
                              rotate: expandedQuestion === index ? 90 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <FaChevronRight className="w-5 h-5 text-gray-400" />
                          </motion.div>
                        </div>

                        <AnimatePresence>
                          {expandedQuestion === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t border-gray-100"
                            >
                              <p className="text-gray-700 mb-4">
                                {item.answer}
                              </p>
                              <div className="bg-[#4eb956]/10 p-4 rounded-lg">
                                <h4 className="font-semibold text-[#1e2558] mb-2">
                                  Pro Tips:
                                </h4>
                                <ul className="space-y-2">
                                  {item.tips.map((tip, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-[#1e2558]"
                                    >
                                      <FaRegLightbulb className="w-4 h-4 text-[#4eb956] flex-shrink-0 mt-1" />
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Body Language Tab */}
            {activeTab === "body-language" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bodyLanguageTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{tip.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCheckCircle className="w-5 h-5 text-[#4eb956]" />
                          <span className="font-semibold text-[#4eb956]">
                            Do: {tip.do}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaTimesCircle className="w-5 h-5 text-[#1e2558]" />
                          <span className="font-semibold text-[#1e2558]">
                            Don't: {tip.dont}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Follow Up Tab */}
            {activeTab === "follow-up" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {followUpTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border-l-4 border-[#4eb956]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-[#1e2558]/10 p-3 rounded-full">
                        <tip.icon className="w-6 h-6 text-[#1e2558]" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-[#4eb956] mb-1 block">
                          {tip.timing}
                        </span>
                        <h3 className="text-lg font-bold text-[#1e2558] mb-2">
                          {tip.action}
                        </h3>
                        <p className="text-gray-600">{tip.details}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-[#1e2558] to-[#4eb956] rounded-3xl p-10 text-white"
        >
          <div className="flex items-center gap-4 mb-8">
            <FaRegGem className="w-10 h-10" />
            <h2 className="text-3xl font-bold">Quick Interview Tips</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <FaStar className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <span className="text-sm">{tip}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resources Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-[#1e2558] mb-8">
            Free Interview Resources
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                icon: FaDownload,
                label: "Interview Checklist",
                color: "bg-[#1e2558]",
              },
              {
                icon: FaVideo,
                label: "Mock Interview Videos",
                color: "bg-[#4eb956]",
              },
              {
                icon: FaRegFileAlt,
                label: "Sample Questions",
                color: "bg-[#1e2558]",
              },
              {
                icon: FaLinkedin,
                label: "LinkedIn Tips",
                color: "bg-[#4eb956]",
              },
            ].map((resource, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${resource.color} text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all`}
              >
                <resource.icon className="w-5 h-5" />
                <span>{resource.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx="true">{`
        @keyframes float {
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
        .animate-float {
          animation: float 7s infinite;
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

export default InterviewTips;
