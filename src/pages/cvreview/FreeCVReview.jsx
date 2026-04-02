import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaRobot,
  FaStar,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaLanguage,
  FaUsers,
  FaTrophy,
  FaRegClock,
  FaDownload,
  FaShareAlt,
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaWhatsapp,
  FaRegCopy,
  FaSpinner,
  FaRocket,
  FaMagic,
  FaBrain,
  FaMicrochip,
  FaChartBar,
  FaAward,
  FaRegGem,
  FaRegSmile,
} from "react-icons/fa";

const FreeCVReview = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sharePopup, setSharePopup] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  // Mock analysis result - In real app, this would come from AI API
  const generateMockAnalysis = (fileName) => {
    return {
      overallScore: 85,
      summary: {
        strengths: 8,
        improvements: 4,
        critical: 1,
      },
      sections: {
        personal: { score: 90, status: "good" },
        professional: { score: 85, status: "good" },
        education: { score: 95, status: "excellent" },
        skills: { score: 75, status: "needs-work" },
        experience: { score: 80, status: "good" },
        achievements: { score: 70, status: "needs-work" },
      },
      keywords: {
        matched: [
          "JavaScript",
          "React",
          "Node.js",
          "Python",
          "SQL",
          "Project Management",
          "Team Leadership",
          "Agile",
        ],
        missing: ["TypeScript", "AWS", "Docker", "GraphQL", "MongoDB"],
        industryKeywords: [
          "Frontend Development",
          "Full Stack",
          "Cloud Computing",
          "DevOps",
          "Machine Learning",
        ],
      },
      formatting: {
        length: "2 pages (Good)",
        structure: "Clear section organization",
        readability: "Easy to scan",
        consistency: "Good formatting overall",
      },
      feedback: {
        strengths: [
          {
            title: "Strong Professional Summary",
            description:
              "Your summary effectively highlights your key skills and career goals.",
            icon: FaTrophy,
          },
          {
            title: "Quantifiable Achievements",
            description:
              "You've used numbers to demonstrate your impact in previous roles.",
            icon: FaChartLine,
          },
          {
            title: "Relevant Education",
            description:
              "Your educational background aligns well with your career path.",
            icon: FaGraduationCap,
          },
          {
            title: "Clean Formatting",
            description: "Your CV is well-structured and easy to read.",
            icon: FaCheckCircle,
          },
        ],
        improvements: [
          {
            title: "Add More Technical Keywords",
            description:
              "Include modern technologies like TypeScript, AWS, and Docker.",
            icon: FaCode,
            action: "Add technical skills section",
          },
          {
            title: "Quantify More Achievements",
            description:
              "Use numbers to show impact (e.g., 'Increased sales by 30%').",
            icon: FaChartBar,
            action: "Review experience section",
          },
          {
            title: "Include Soft Skills",
            description: "Add communication, leadership, and teamwork skills.",
            icon: FaUsers,
            action: "Add soft skills section",
          },
          {
            title: "Update Skills Section",
            description: "Your skills section could be more comprehensive.",
            icon: FaBrain,
            action: "Expand skills list",
          },
        ],
        critical: [
          {
            title: "Contact Information Missing",
            description:
              "Your CV doesn't include phone number or email address.",
            icon: FaExclamationTriangle,
            action: "Add contact details immediately",
          },
        ],
      },
      suggestions: [
        "Add a professional summary at the top",
        "Include more action verbs in experience descriptions",
        "Add links to LinkedIn and GitHub profiles",
        "Proofread for spelling and grammar errors",
        "Customize CV for specific job applications",
        "Add a projects section for technical roles",
        "Include certifications and courses",
        "Add language proficiency levels",
      ],
      atsScore: 82,
      readabilityScore: 88,
      impactScore: 85,
      comparison: {
        percentile: "Top 15%",
        similarProfiles: 1245,
        marketDemand: "High",
      },
      industryMatch: {
        tech: 90,
        finance: 75,
        healthcare: 60,
        education: 80,
      },
    };
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setAnalysisResult(generateMockAnalysis(file?.name || "CV.pdf"));
    }, 3000);
  };

  const resetAnalysis = () => {
    setFile(null);
    setUploadProgress(0);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setAnalysisResult(null);
    setActiveTab("overview");
  };

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
    twitter: `https://twitter.com/intent/tweet?text=Check out this AI-powered CV review tool!&url=${window.location.href}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    whatsapp: `https://wa.me/?text=Check out this AI-powered CV review tool! ${window.location.href}`,
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  const sendToEmail = () => {
    if (emailAddress) {
      alert(`Report sent to ${emailAddress}`);
      setSharePopup(false);
      setEmailAddress("");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#4eb956]/5">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#1e2558]/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#4eb956]/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
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
                <FaRobot className="w-16 h-16 text-white" />
              </div>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1e2558] to-[#4eb956]">
              AI-Powered CV Review
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Upload your CV and let our advanced AI analyze it for free. Get
            instant feedback, suggestions for improvement, and ATS optimization
            tips to land your dream job.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { number: "50k+", label: "CVs Analyzed", icon: FaFileAlt },
              { number: "98%", label: "Accuracy Rate", icon: FaMicrochip },
              { number: "4.9★", label: "User Rating", icon: FaStar },
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

        {/* Main Upload/Review Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16"
        >
          {!analysisComplete ? (
            <div className="p-12">
              <div className="max-w-2xl mx-auto text-center">
                {!file ? (
                  <>
                    <div className="border-4 border-dashed border-gray-200 rounded-3xl p-16 hover:border-[#4eb956] transition-colors cursor-pointer group">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label
                        htmlFor="cv-upload"
                        className="cursor-pointer block"
                      >
                        <FaCloudUploadAlt className="w-24 h-24 text-gray-300 mx-auto mb-6 group-hover:text-[#4eb956] transition-colors" />
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">
                          Upload Your CV
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Drag and drop or click to browse
                        </p>
                        <div className="flex justify-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <FaFilePdf className="w-5 h-5" />
                            PDF
                          </div>
                          <div className="flex items-center gap-2">
                            <FaFileWord className="w-5 h-5" />
                            DOC
                          </div>
                          <div className="flex items-center gap-2">
                            <FaFileWord className="w-5 h-5" />
                            DOCX
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">
                          Max file size: 10MB
                        </p>
                      </label>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="bg-gradient-to-r from-[#1e2558]/5 to-[#4eb956]/5 rounded-2xl p-8 mb-8">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <FaFileAlt className="w-12 h-12 text-[#4eb956]" />
                        <div className="text-left">
                          <h3 className="font-bold text-[#1e2558] text-lg">
                            {file.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      {uploadProgress < 100 ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Uploading...</span>
                            <span className="font-semibold text-[#1e2558]">
                              {uploadProgress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-[#1e2558] to-[#4eb956] h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {!isAnalyzing ? (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={startAnalysis}
                              className="w-full py-4 bg-gradient-to-r from-[#1e2558] to-[#4eb956] text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3"
                            >
                              <FaMagic className="w-5 h-5" />
                              Analyze with AI
                            </motion.button>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-center justify-center gap-3 text-[#1e2558]">
                                <FaSpinner className="w-6 h-6 animate-spin" />
                                <span className="font-semibold">
                                  AI is analyzing your CV...
                                </span>
                              </div>
                              <div className="flex justify-center gap-6">
                                {[
                                  "Reading content",
                                  "Checking format",
                                  "Analyzing keywords",
                                  "Scoring sections",
                                ].map((step, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.5 }}
                                    className="text-xs text-gray-500"
                                  >
                                    {step}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={resetAnalysis}
                            className="text-sm text-gray-500 hover:text-[#4eb956] transition-colors"
                          >
                            Upload different file
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            analysisResult && (
              <div className="divide-y divide-gray-100">
                {/* Analysis Header */}
                <div className="bg-gradient-to-r from-[#1e2558] to-[#4eb956] p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        Analysis Complete!
                      </h2>
                      <p className="text-white/80">
                        Your CV has been analyzed by AI
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold mb-1">
                        {analysisResult.overallScore}
                      </div>
                      <p className="text-white/80">Overall Score</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-4 mt-8">
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold">
                        {analysisResult.summary.strengths}
                      </div>
                      <div className="text-sm text-white/70">Strengths</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold">
                        {analysisResult.summary.improvements}
                      </div>
                      <div className="text-sm text-white/70">Improvements</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold">
                        {analysisResult.summary.critical}
                      </div>
                      <div className="text-sm text-white/70">
                        Critical Issues
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold">
                        {analysisResult.keywords.matched.length}
                      </div>
                      <div className="text-sm text-white/70">
                        Keywords Found
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 p-6 bg-gray-50 overflow-x-auto">
                  {[
                    { id: "overview", label: "Overview", icon: FaChartLine },
                    { id: "feedback", label: "Feedback", icon: FaLightbulb },
                    { id: "keywords", label: "Keywords", icon: FaCode },
                    { id: "formatting", label: "Formatting", icon: FaFileAlt },
                    { id: "comparison", label: "Comparison", icon: FaUsers },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? "bg-[#1e2558] text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Overview Tab */}
                      {activeTab === "overview" && (
                        <div className="space-y-8">
                          {/* Score Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                  <FaBrain className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    ATS Score
                                  </p>
                                  <p className="text-2xl font-bold text-[#1e2558]">
                                    {analysisResult.atsScore}%
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                How well your CV performs with Applicant
                                Tracking Systems
                              </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="bg-green-100 p-3 rounded-lg">
                                  <FaChartLine className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Readability
                                  </p>
                                  <p className="text-2xl font-bold text-[#1e2558]">
                                    {analysisResult.readabilityScore}%
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                How easy your CV is to read and scan
                              </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                  <FaRocket className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Impact Score
                                  </p>
                                  <p className="text-2xl font-bold text-[#1e2558]">
                                    {analysisResult.impactScore}%
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                How impactful your achievements are
                              </p>
                            </div>
                          </div>

                          {/* Section Scores */}
                          <div>
                            <h3 className="font-bold text-[#1e2558] mb-4">
                              Section Scores
                            </h3>
                            <div className="space-y-4">
                              {Object.entries(analysisResult.sections).map(
                                ([key, value]) => (
                                  <div key={key}>
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="capitalize text-gray-700">
                                        {key}
                                      </span>
                                      <span
                                        className={`font-semibold ${getScoreColor(value.score)}`}
                                      >
                                        {value.score}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`${getScoreBgColor(value.score)} h-2 rounded-full`}
                                        style={{ width: `${value.score}%` }}
                                      />
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Industry Match */}
                          <div>
                            <h3 className="font-bold text-[#1e2558] mb-4">
                              Industry Match
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Object.entries(analysisResult.industryMatch).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="bg-gray-50 rounded-xl p-4 text-center"
                                  >
                                    <div className="text-2xl font-bold text-[#4eb956] mb-1">
                                      {value}%
                                    </div>
                                    <div className="text-sm text-gray-600 capitalize">
                                      {key}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Feedback Tab */}
                      {activeTab === "feedback" && (
                        <div className="space-y-8">
                          {/* Critical Issues */}
                          {analysisResult.feedback.critical.length > 0 && (
                            <div>
                              <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                                <FaExclamationTriangle className="w-5 h-5" />
                                Critical Issues
                              </h3>
                              <div className="space-y-4">
                                {analysisResult.feedback.critical.map(
                                  (item, i) => (
                                    <div
                                      key={i}
                                      className="bg-red-50 rounded-xl p-6 border border-red-100"
                                    >
                                      <div className="flex items-start gap-4">
                                        <div className="bg-red-100 p-3 rounded-lg">
                                          <item.icon className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="font-bold text-red-800 mb-2">
                                            {item.title}
                                          </h4>
                                          <p className="text-red-700 mb-3">
                                            {item.description}
                                          </p>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-red-800">
                                              Action:
                                            </span>
                                            <span className="text-sm text-red-700">
                                              {item.action}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {/* Strengths */}
                          <div>
                            <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
                              <FaCheckCircle className="w-5 h-5" />
                              Strengths
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {analysisResult.feedback.strengths.map(
                                (item, i) => (
                                  <div
                                    key={i}
                                    className="bg-green-50 rounded-xl p-6 border border-green-100"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="bg-green-100 p-2 rounded-lg">
                                        <item.icon className="w-5 h-5 text-green-600" />
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-green-800 mb-1">
                                          {item.title}
                                        </h4>
                                        <p className="text-sm text-green-700">
                                          {item.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Improvements */}
                          <div>
                            <h3 className="text-lg font-bold text-yellow-600 mb-4 flex items-center gap-2">
                              <FaLightbulb className="w-5 h-5" />
                              Suggestions for Improvement
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {analysisResult.feedback.improvements.map(
                                (item, i) => (
                                  <div
                                    key={i}
                                    className="bg-yellow-50 rounded-xl p-6 border border-yellow-100"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="bg-yellow-100 p-2 rounded-lg">
                                        <item.icon className="w-5 h-5 text-yellow-600" />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-bold text-yellow-800 mb-1">
                                          {item.title}
                                        </h4>
                                        <p className="text-sm text-yellow-700 mb-2">
                                          {item.description}
                                        </p>
                                        <span className="text-xs font-semibold text-yellow-800 bg-yellow-200 px-2 py-1 rounded">
                                          {item.action}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Keywords Tab */}
                      {activeTab === "keywords" && (
                        <div className="space-y-8">
                          {/* Matched Keywords */}
                          <div>
                            <h3 className="text-lg font-bold text-[#4eb956] mb-4">
                              ✓ Matched Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.keywords.matched.map(
                                (keyword, i) => (
                                  <span
                                    key={i}
                                    className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium"
                                  >
                                    {keyword}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Missing Keywords */}
                          <div>
                            <h3 className="text-lg font-bold text-red-500 mb-4">
                              ✗ Missing Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.keywords.missing.map(
                                (keyword, i) => (
                                  <span
                                    key={i}
                                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium"
                                  >
                                    {keyword}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Industry Keywords */}
                          <div>
                            <h3 className="text-lg font-bold text-[#1e2558] mb-4">
                              🎯 Industry Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.keywords.industryKeywords.map(
                                (keyword, i) => (
                                  <span
                                    key={i}
                                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
                                  >
                                    {keyword}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Keyword Density Chart */}
                          <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-bold text-[#1e2558] mb-4">
                              Keyword Density
                            </h3>
                            <div className="space-y-3">
                              {analysisResult.keywords.matched
                                .slice(0, 5)
                                .map((keyword, i) => (
                                  <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-gray-700">
                                        {keyword}
                                      </span>
                                      <span className="font-semibold text-[#4eb956]">
                                        {Math.floor(Math.random() * 5) + 1}x
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div
                                        className="bg-[#4eb956] h-1.5 rounded-full"
                                        style={{
                                          width: `${Math.floor(Math.random() * 60) + 20}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Formatting Tab */}
                      {activeTab === "formatting" && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-xl p-6">
                              <h4 className="font-bold text-[#1e2558] mb-4">
                                Document Length
                              </h4>
                              <p className="text-3xl font-bold text-[#4eb956] mb-2">
                                2 Pages
                              </p>
                              <p className="text-sm text-gray-600">
                                Ideal length for your experience level
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-6">
                              <h4 className="font-bold text-[#1e2558] mb-4">
                                Readability
                              </h4>
                              <p className="text-3xl font-bold text-[#4eb956] mb-2">
                                Easy
                              </p>
                              <p className="text-sm text-gray-600">
                                Good use of bullet points and white space
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {Object.entries(analysisResult.formatting).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                                >
                                  <span className="capitalize text-gray-700">
                                    {key}:
                                  </span>
                                  <span className="font-semibold text-[#1e2558]">
                                    {value}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>

                          {/* Formatting Tips */}
                          <div className="bg-[#1e2558]/5 rounded-xl p-6">
                            <h4 className="font-bold text-[#1e2558] mb-3">
                              Formatting Tips
                            </h4>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <FaCheckCircle className="w-4 h-4 text-[#4eb956] mt-0.5" />
                                Use consistent font sizes and styles
                              </li>
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <FaCheckCircle className="w-4 h-4 text-[#4eb956] mt-0.5" />
                                Keep margins between 0.5 and 1 inch
                              </li>
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <FaCheckCircle className="w-4 h-4 text-[#4eb956] mt-0.5" />
                                Use bullet points for easy scanning
                              </li>
                              <li className="flex items-start gap-2 text-sm text-gray-700">
                                <FaCheckCircle className="w-4 h-4 text-[#4eb956] mt-0.5" />
                                Save as PDF to preserve formatting
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Comparison Tab */}
                      {activeTab === "comparison" && (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-[#1e2558] to-[#4eb956] text-white rounded-xl p-6">
                              <p className="text-sm opacity-90 mb-2">
                                Your CV ranks in the
                              </p>
                              <p className="text-4xl font-bold mb-1">
                                {analysisResult.comparison.percentile}
                              </p>
                              <p className="text-sm opacity-90">
                                compared to similar profiles
                              </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                              <p className="text-sm text-gray-600 mb-2">
                                Similar Profiles
                              </p>
                              <p className="text-3xl font-bold text-[#1e2558] mb-1">
                                {analysisResult.comparison.similarProfiles.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                in our database
                              </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                              <p className="text-sm text-gray-600 mb-2">
                                Market Demand
                              </p>
                              <p className="text-3xl font-bold text-[#4eb956] mb-1">
                                {analysisResult.comparison.marketDemand}
                              </p>
                              <p className="text-sm text-gray-600">
                                for your profile
                              </p>
                            </div>
                          </div>

                          {/* Peer Comparison Chart */}
                          <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-bold text-[#1e2558] mb-6">
                              Comparison with Peers
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-700">
                                    Your Score
                                  </span>
                                  <span className="font-bold text-[#4eb956]}">
                                    {analysisResult.overallScore}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-gradient-to-r from-[#1e2558] to-[#4eb956] h-3 rounded-full"
                                    style={{
                                      width: `${analysisResult.overallScore}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-700">
                                    Average Peer Score
                                  </span>
                                  <span className="font-bold text-gray-600">
                                    72%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-gray-400 h-3 rounded-full"
                                    style={{ width: "72%" }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-700">
                                    Top 10% Score
                                  </span>
                                  <span className="font-bold text-gray-600">
                                    92%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-gray-400 h-3 rounded-full"
                                    style={{ width: "92%" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Improvement Potential */}
                          <div className="bg-[#4eb956]/10 rounded-xl p-6">
                            <h3 className="font-bold text-[#1e2558] mb-3">
                              Improvement Potential
                            </h3>
                            <p className="text-3xl font-bold text-[#4eb956] mb-2">
                              +15%
                            </p>
                            <p className="text-sm text-gray-600">
                              Your CV could score 15% higher by implementing our
                              suggestions
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Action Footer */}
                <div className="p-6 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="px-6 py-2 bg-gradient-to-r from-[#1e2558] to-[#4eb956] text-white rounded-lg font-semibold flex items-center gap-2"
                    >
                      <FaDownload className="w-4 h-4" />
                      Download Report
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSharePopup(true)}
                      className="px-6 py-2 bg-white text-[#1e2558] rounded-lg font-semibold border border-gray-200 flex items-center gap-2 hover:border-[#4eb956] transition-colors"
                    >
                      <FaShareAlt className="w-4 h-4" />
                      Share
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={resetAnalysis}
                    className="px-6 py-2 bg-white text-[#1e2558] rounded-lg font-semibold border border-gray-200 hover:border-[#4eb956] transition-colors"
                  >
                    Analyze Another CV
                  </motion.button>
                </div>
              </div>
            )
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: FaBrain,
              title: "AI-Powered Analysis",
              description:
                "Advanced algorithms analyze your CV against industry standards and job requirements.",
            },
            {
              icon: FaChartBar,
              title: "ATS Optimization",
              description:
                "Ensure your CV passes through Applicant Tracking Systems with high scores.",
            },
            {
              icon: FaLightbulb,
              title: "Smart Suggestions",
              description:
                "Get personalized recommendations to improve your CV's effectiveness.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-8 text-center shadow-lg"
            >
              <div className="bg-[#4eb956]/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-[#1e2558]" />
              </div>
              <h3 className="text-xl font-bold text-[#1e2558] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-[#1e2558]/5 to-[#4eb956]/5 rounded-3xl p-12"
        >
          <h2 className="text-3xl font-bold text-center text-[#1e2558] mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Upload",
                desc: "Upload your CV in PDF, DOC, or DOCX format",
              },
              {
                step: "2",
                title: "Analyze",
                desc: "Our AI analyzes content, structure, and keywords",
              },
              {
                step: "3",
                title: "Review",
                desc: "Get detailed feedback and improvement suggestions",
              },
              {
                step: "4",
                title: "Improve",
                desc: "Update your CV and increase your chances",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#4eb956] shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#1e2558] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Share Popup */}
      <AnimatePresence>
        {sharePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSharePopup(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-8"
            >
              <h3 className="text-2xl font-bold text-[#1e2558] mb-6">
                Share Your Results
              </h3>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  {
                    icon: FaLinkedin,
                    color: "bg-blue-600",
                    platform: "linkedin",
                  },
                  {
                    icon: FaTwitter,
                    color: "bg-blue-400",
                    platform: "twitter",
                  },
                  {
                    icon: FaFacebook,
                    color: "bg-blue-800",
                    platform: "facebook",
                  },
                  {
                    icon: FaWhatsapp,
                    color: "bg-green-500",
                    platform: "whatsapp",
                  },
                ].map((item, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    onClick={() =>
                      window.open(shareLinks[item.platform], "_blank")
                    }
                    className={`${item.color} aspect-square rounded-xl flex items-center justify-center text-white`}
                  >
                    <item.icon className="w-6 h-6" />
                  </motion.button>
                ))}
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Share via email</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4eb956]"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={sendToEmail}
                    className="px-4 py-2 bg-[#1e2558] text-white rounded-lg"
                  >
                    <FaEnvelope className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Copy link</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => copyToClipboard(window.location.href)}
                    className="px-4 py-2 bg-[#4eb956] text-white rounded-lg"
                  >
                    <FaRegCopy className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
        .animate-pulse {
          animation: pulse 4s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default FreeCVReview;
