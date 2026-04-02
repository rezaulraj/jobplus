import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaCalendarAlt,
  FaUserGraduate,
  FaFileAlt,
  FaTags,
  FaGlobe,
  FaLaptop,
  FaUsers,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaPlus,
  FaTrash,
  FaCheck,
  FaHome,
  FaCode,
  FaPaintBrush,
  FaPencilAlt,
  FaChartLine,
  FaCamera,
  FaMusic,
  FaLanguage,
  FaTools,
  FaDatabase,
  FaMobileAlt,
  FaSearch,
  FaStar,
  FaPaperclip,
  FaRegFileAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const FreelancerJobPost = () => {
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Job form state
  const [jobData, setJobData] = useState({
    // Project Details
    projectTitle: "",
    projectType: "",
    projectCategory: "",
    projectDescription: "",
    projectDuration: "",

    // Skills & Requirements
    requiredSkills: [],
    experienceLevel: "",
    languageRequirements: [],
    toolsRequired: [],

    // Budget & Timeline
    budgetType: "fixed",
    budget: {
      min: "",
      max: "",
      currency: "USD",
    },
    timeline: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      estimatedHours: "",
    },

    // Client Preferences
    clientLocation: {
      preferredLocation: "",
      timezone: "",
    },
    communicationPreferences: [],
    meetingFrequency: "",

    // Submission Details
    submissionRequirements: "",
    attachments: [],
    applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),

    // Review & Post
    visibility: "public",
    tags: [],
  });

  // Input states
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [toolInput, setToolInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Set mounted state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Freelance categories
  const projectCategories = [
    {
      id: "web-dev",
      label: "Web Development",
      icon: <FaCode />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "mobile-dev",
      label: "Mobile App",
      icon: <FaMobileAlt />,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "design",
      label: "UI/UX Design",
      icon: <FaPaintBrush />,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "writing",
      label: "Content Writing",
      icon: <FaPencilAlt />,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "marketing",
      label: "Digital Marketing",
      icon: <FaChartLine />,
      color: "from-orange-500 to-yellow-500",
    },
    {
      id: "graphics",
      label: "Graphic Design",
      icon: <FaCamera />,
      color: "from-red-500 to-orange-500",
    },
    {
      id: "video",
      label: "Video Editing",
      icon: <FaMusic />,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "translation",
      label: "Translation",
      icon: <FaLanguage />,
      color: "from-teal-500 to-cyan-500",
    },
    {
      id: "data",
      label: "Data Analysis",
      icon: <FaDatabase />,
      color: "from-gray-700 to-gray-900",
    },
    {
      id: "consulting",
      label: "Consulting",
      icon: <FaBriefcase />,
      color: "from-blue-600 to-indigo-600",
    },
  ];

  const projectTypes = [
    {
      value: "one-time",
      label: "One-time Project",
      description: "Single deliverable project",
    },
    {
      value: "ongoing",
      label: "Ongoing Work",
      description: "Long-term collaboration",
    },
    {
      value: "hourly",
      label: "Hourly Work",
      description: "Pay per hour basis",
    },
    {
      value: "milestone",
      label: "Milestone-based",
      description: "Payment at milestones",
    },
  ];

  const experienceLevels = [
    {
      value: "entry",
      label: "Entry Level",
      description: "0-2 years experience",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "2-5 years experience",
    },
    { value: "expert", label: "Expert", description: "5+ years experience" },
  ];

  const budgetTypes = [
    { value: "fixed", label: "Fixed Price", icon: "💵" },
    { value: "hourly", label: "Hourly Rate", icon: "⏰" },
    { value: "negotiable", label: "Negotiable", icon: "🤝" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
  ];

  const timezones = ["GMT", "EST", "PST", "CET", "IST", "AEST", "JST", "CST"];

  const communicationPreferences = [
    { value: "email", label: "Email", icon: "📧" },
    { value: "video", label: "Video Calls", icon: "📹" },
    { value: "chat", label: "Chat/Messaging", icon: "💬" },
    { value: "phone", label: "Phone Calls", icon: "📞" },
    { value: "in-person", label: "In-person", icon: "👥" },
  ];

  const meetingFrequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "bi-weekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "as-needed", label: "As Needed" },
  ];

  const visibilityOptions = [
    {
      value: "public",
      label: "Public",
      description: "Visible to all freelancers",
    },
    { value: "private", label: "Private", description: "Invite-only" },
    { value: "featured", label: "Featured", description: "Promoted listing" },
  ];

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setJobData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setJobData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  // Handle date changes
  const handleDateChange = useCallback((date, field) => {
    setJobData((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        [field]: date,
      },
    }));
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    setJobData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  }, []);

  // Remove attachment
  const removeAttachment = useCallback((index) => {
    setJobData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  }, []);

  // Add skill
  const addSkill = useCallback(() => {
    if (
      skillInput.trim() &&
      !jobData.requiredSkills.includes(skillInput.trim())
    ) {
      setJobData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  }, [skillInput, jobData.requiredSkills]);

  // Remove skill
  const removeSkill = useCallback((skill) => {
    setJobData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
    }));
  }, []);

  // Add language
  const addLanguage = useCallback(() => {
    if (
      languageInput.trim() &&
      !jobData.languageRequirements.includes(languageInput.trim())
    ) {
      setJobData((prev) => ({
        ...prev,
        languageRequirements: [
          ...prev.languageRequirements,
          languageInput.trim(),
        ],
      }));
      setLanguageInput("");
    }
  }, [languageInput, jobData.languageRequirements]);

  // Remove language
  const removeLanguage = useCallback((language) => {
    setJobData((prev) => ({
      ...prev,
      languageRequirements: prev.languageRequirements.filter(
        (l) => l !== language,
      ),
    }));
  }, []);

  // Add tool
  const addTool = useCallback(() => {
    if (toolInput.trim() && !jobData.toolsRequired.includes(toolInput.trim())) {
      setJobData((prev) => ({
        ...prev,
        toolsRequired: [...prev.toolsRequired, toolInput.trim()],
      }));
      setToolInput("");
    }
  }, [toolInput, jobData.toolsRequired]);

  // Remove tool
  const removeTool = useCallback((tool) => {
    setJobData((prev) => ({
      ...prev,
      toolsRequired: prev.toolsRequired.filter((t) => t !== tool),
    }));
  }, []);

  // Add tag
  const addTag = useCallback(() => {
    if (tagInput.trim() && !jobData.tags.includes(tagInput.trim())) {
      setJobData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  }, [tagInput, jobData.tags]);

  // Remove tag
  const removeTag = useCallback((tag) => {
    setJobData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  // Handle key press for inputs
  const handleKeyPress = useCallback(
    (e, type) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (type === "skill") addSkill();
        if (type === "language") addLanguage();
        if (type === "tool") addTool();
        if (type === "tag") addTag();
      }
    },
    [addSkill, addLanguage, addTool, addTag],
  );

  // Navigation
  const nextStep = useCallback(() => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (
        !jobData.projectTitle ||
        !jobData.projectCategory ||
        !jobData.projectDescription
      ) {
        alert("Please fill in all required project details");
        return;
      }
    } else if (currentStep === 2) {
      if (jobData.requiredSkills.length === 0) {
        alert("Please add at least one required skill");
        return;
      }
    } else if (currentStep === 3) {
      if (jobData.budgetType === "fixed" && !jobData.budget.min) {
        alert("Please specify the budget");
        return;
      }
    } else if (currentStep === 4) {
      if (!jobData.clientLocation.timezone) {
        alert("Please select a timezone for communication");
        return;
      }
    } else if (currentStep === 5) {
      if (!jobData.submissionRequirements) {
        alert("Please specify submission requirements");
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, jobData]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Prepare data for API
      const submitData = {
        ...jobData,
        postedDate: new Date().toISOString(),
        status: "active",
        applicationCount: 0,
        views: 0,
      };

      // Simulate API call
      setTimeout(() => {
        console.log("Freelance job posted:", submitData);
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 2000);
    },
    [jobData],
  );

  // Progress percentage
  const progressPercentage = ((currentStep - 1) / 6) * 100;

  // Step titles
  const stepTitles = [
    "Project Details",
    "Skills & Requirements",
    "Budget & Timeline",
    "Client Preferences",
    "Submission Details",
    "Review & Post",
  ];

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setJobData({
      projectTitle: "",
      projectType: "",
      projectCategory: "",
      projectDescription: "",
      projectDuration: "",
      requiredSkills: [],
      experienceLevel: "",
      languageRequirements: [],
      toolsRequired: [],
      budgetType: "fixed",
      budget: { min: "", max: "", currency: "USD" },
      timeline: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedHours: "",
      },
      clientLocation: { preferredLocation: "", timezone: "" },
      communicationPreferences: [],
      meetingFrequency: "",
      submissionRequirements: "",
      attachments: [],
      applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      visibility: "public",
      tags: [],
    });
    setIsSubmitted(false);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mb-4 shadow-lg"
          >
            <FaLaptop className="text-3xl text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Post a Freelance Project
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect freelancer for your project. Fill in the details
            step by step.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 6: {stepTitles[currentStep - 1]}
            </span>
            <span className="text-sm font-semibold text-purple-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            ></motion.div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index + 1 <= currentStep ? "text-purple-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    index + 1 < currentStep
                      ? "bg-purple-500 text-white"
                      : index + 1 === currentStep
                        ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200"
                        : "bg-gray-200"
                  }`}
                >
                  {index + 1 < currentStep ? (
                    <FaCheckCircle className="text-sm" />
                  ) : (
                    <span className="font-semibold text-sm">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs text-center max-w-16 hidden md:block font-medium">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              // Success Screen
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-8 md:p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <FaCheckCircle className="text-4xl text-white" />
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Project Posted Successfully!
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Your freelance project is now live and visible to talented
                  freelancers worldwide.
                </p>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6 max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-purple-800 mb-3 flex items-center justify-center gap-2">
                    <FaStar className="text-yellow-500" />
                    Project Summary
                  </h3>
                  <div className="text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <FaBriefcase className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Project</p>
                        <p className="font-medium">{jobData.projectTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                        <FaCode className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">
                          {
                            projectCategories.find(
                              (c) => c.id === jobData.projectCategory,
                            )?.label
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <FaDollarSign className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-medium">
                          ${jobData.budget.min} - ${jobData.budget.max}{" "}
                          {jobData.budget.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-purple-200"
                  >
                    Post Another Project
                  </button>
                  <button
                    onClick={() => console.log("View project")}
                    className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors duration-300"
                  >
                    View Project
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-6 md:p-8"
              >
                <form
                  onSubmit={
                    currentStep === 6
                      ? handleSubmit
                      : (e) => {
                          e.preventDefault();
                          nextStep();
                        }
                  }
                >
                  {/* Project Details */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                          <FaBriefcase className="text-xl text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            Project Details
                          </h2>
                          <p className="text-sm text-gray-600">
                            Describe what you need done
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Title{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="projectTitle"
                            value={jobData.projectTitle}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., Build an E-commerce Website"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Project Category{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {projectCategories.map((category) => (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() =>
                                  setJobData((prev) => ({
                                    ...prev,
                                    projectCategory: category.id,
                                  }))
                                }
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                  jobData.projectCategory === category.id
                                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <div
                                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br ${category.color}`}
                                >
                                  <span className="text-white text-lg">
                                    {category.icon}
                                  </span>
                                </div>
                                <span className="text-xs font-medium text-center">
                                  {category.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Type
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {projectTypes.map((type) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() =>
                                  setJobData((prev) => ({
                                    ...prev,
                                    projectType: type.value,
                                  }))
                                }
                                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                  jobData.projectType === type.value
                                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <div className="font-medium">{type.label}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {type.description}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Description{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="projectDescription"
                            value={jobData.projectDescription}
                            onChange={handleInputChange}
                            required
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="Describe your project in detail. What are the goals, requirements, and deliverables?"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skills & Requirements */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                          <FaTools className="text-xl text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            Skills & Requirements
                          </h2>
                          <p className="text-sm text-gray-600">
                            What skills should freelancers have?
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Required Skills{" "}
                            <span className="text-red-500">*</span>
                            <span className="text-xs text-gray-500 ml-2">
                              (Add at least one skill)
                            </span>
                          </label>
                          <div className="flex space-x-2 mb-3">
                            <input
                              type="text"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, "skill")}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                              placeholder="e.g., React, Python, Figma, SEO"
                            />
                            <button
                              type="button"
                              onClick={addSkill}
                              className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 flex items-center space-x-2"
                            >
                              <FaPlus />
                              <span>Add</span>
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {jobData.requiredSkills.map((skill, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-2 rounded-lg border border-purple-100"
                              >
                                <span className="font-medium text-purple-700">
                                  {skill}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience Level
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {experienceLevels.map((level) => (
                              <button
                                key={level.value}
                                type="button"
                                onClick={() =>
                                  setJobData((prev) => ({
                                    ...prev,
                                    experienceLevel: level.value,
                                  }))
                                }
                                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                  jobData.experienceLevel === level.value
                                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <div className="font-medium">{level.label}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {level.description}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Language Requirements
                            </label>
                            <div className="flex space-x-2 mb-3">
                              <select
                                value={languageInput}
                                onChange={(e) =>
                                  setLanguageInput(e.target.value)
                                }
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                              >
                                <option value="">Select Language</option>
                                {languages.map((lang) => (
                                  <option key={lang.code} value={lang.name}>
                                    {lang.name}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={addLanguage}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                              >
                                <FaPlus />
                                <span>Add</span>
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {jobData.languageRequirements.map(
                                (lang, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg"
                                  >
                                    <span className="font-medium">{lang}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeLanguage(lang)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <FaTrash className="text-sm" />
                                    </button>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tools & Software Required
                            </label>
                            <div className="flex space-x-2 mb-3">
                              <input
                                type="text"
                                value={toolInput}
                                onChange={(e) => setToolInput(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, "tool")}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g., Adobe Creative Suite, GitHub, Slack"
                              />
                              <button
                                type="button"
                                onClick={addTool}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                              >
                                <FaPlus />
                                <span>Add</span>
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {jobData.toolsRequired.map((tool, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg"
                                >
                                  <span className="font-medium">{tool}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeTool(tool)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash className="text-sm" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget & Timeline */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                          <FaDollarSign className="text-xl text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            Budget & Timeline
                          </h2>
                          <p className="text-sm text-gray-600">
                            Set your budget and timeline
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Budget Type
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {budgetTypes.map((type) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() =>
                                  setJobData((prev) => ({
                                    ...prev,
                                    budgetType: type.value,
                                  }))
                                }
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                  jobData.budgetType === type.value
                                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <span className="text-2xl mb-2">
                                  {type.icon}
                                </span>
                                <span className="font-medium">
                                  {type.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {jobData.budgetType === "hourly"
                                ? "Hourly Rate Range"
                                : "Project Budget"}
                              {jobData.budgetType !== "negotiable" && (
                                <span className="text-red-500">*</span>
                              )}
                            </label>
                            <div className="flex space-x-3">
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Min
                                </label>
                                <div className="relative">
                                  <FaDollarSign className="absolute left-3 top-3.5 text-gray-400" />
                                  <input
                                    type="number"
                                    name="budget.min"
                                    value={jobData.budget.min}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Max
                                </label>
                                <div className="relative">
                                  <FaDollarSign className="absolute left-3 top-3.5 text-gray-400" />
                                  <input
                                    type="number"
                                    name="budget.max"
                                    value={jobData.budget.max}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                              <div className="w-32">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Currency
                                </label>
                                <select
                                  name="budget.currency"
                                  value={jobData.budget.currency}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                >
                                  <option value="USD">USD</option>
                                  <option value="EUR">EUR</option>
                                  <option value="GBP">GBP</option>
                                  <option value="CAD">CAD</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Estimated Hours
                            </label>
                            <input
                              type="number"
                              name="timeline.estimatedHours"
                              value={jobData.timeline.estimatedHours}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                              placeholder="e.g., 40 hours"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Start Date
                            </label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400 z-10" />
                              <DatePicker
                                selected={jobData.timeline.startDate}
                                onChange={(date) =>
                                  handleDateChange(date, "startDate")
                                }
                                minDate={new Date()}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                dateFormat="MMMM d, yyyy"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expected End Date
                            </label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400 z-10" />
                              <DatePicker
                                selected={jobData.timeline.endDate}
                                onChange={(date) =>
                                  handleDateChange(date, "endDate")
                                }
                                minDate={jobData.timeline.startDate}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                dateFormat="MMMM d, yyyy"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Client Preferences */}
                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg">
                          <FaUsers className="text-xl text-orange-600" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            Client Preferences
                          </h2>
                          <p className="text-sm text-gray-600">
                            How you prefer to work
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Preferred Location (Optional)
                            </label>
                            <div className="relative">
                              <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                              <input
                                type="text"
                                name="clientLocation.preferredLocation"
                                value={jobData.clientLocation.preferredLocation}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g., North America, Europe, Anywhere"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Timezone <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="clientLocation.timezone"
                              value={jobData.clientLocation.timezone}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            >
                              <option value="">Select Timezone</option>
                              {timezones.map((tz) => (
                                <option key={tz} value={tz}>
                                  {tz}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Communication Preferences
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {communicationPreferences.map((pref) => (
                              <button
                                key={pref.value}
                                type="button"
                                onClick={() => {
                                  const current =
                                    jobData.communicationPreferences;
                                  const updated = current.includes(pref.value)
                                    ? current.filter((p) => p !== pref.value)
                                    : [...current, pref.value];
                                  setJobData((prev) => ({
                                    ...prev,
                                    communicationPreferences: updated,
                                  }));
                                }}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                  jobData.communicationPreferences.includes(
                                    pref.value,
                                  )
                                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <span className="text-2xl mb-2">
                                  {pref.icon}
                                </span>
                                <span className="text-xs font-medium text-center">
                                  {pref.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meeting Frequency
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {meetingFrequencies.map((freq) => (
                              <button
                                key={freq.value}
                                type="button"
                                onClick={() =>
                                  setJobData((prev) => ({
                                    ...prev,
                                    meetingFrequency: freq.value,
                                  }))
                                }
                                className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                                  jobData.meetingFrequency === freq.value
                                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 font-medium"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {freq.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submission Details */}
                  {currentStep === 5 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg">
                          <FaFileAlt className="text-xl text-red-600" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            Submission Details
                          </h2>
                          <p className="text-sm text-gray-600">
                            How freelancers should apply
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Submission Requirements{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="submissionRequirements"
                            value={jobData.submissionRequirements}
                            onChange={handleInputChange}
                            required
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="What should freelancers include in their proposal? (e.g., portfolio, cover letter, samples, etc.)"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Attachments (Optional)
                            <span className="text-xs text-gray-500 ml-2">
                              Max 5 files, 10MB each
                            </span>
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors duration-200">
                            <input
                              type="file"
                              id="file-upload"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer"
                            >
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaPaperclip className="text-2xl text-purple-600" />
                              </div>
                              <p className="text-gray-600 mb-2">
                                Drag & drop files or{" "}
                                <span className="text-purple-600 font-medium">
                                  browse
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                PDF, DOC, JPG, PNG, ZIP up to 10MB
                              </p>
                            </label>
                          </div>

                          {jobData.attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {jobData.attachments.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
                                >
                                  <div className="flex items-center space-x-3">
                                    <FaRegFileAlt className="text-gray-400" />
                                    <div>
                                      <p className="font-medium text-sm">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)}{" "}
                                        MB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeAttachment(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Application Deadline
                          </label>
                          <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400 z-10" />
                            <DatePicker
                              selected={jobData.applicationDeadline}
                              onChange={(date) =>
                                setJobData((prev) => ({
                                  ...prev,
                                  applicationDeadline: date,
                                }))
                              }
                              minDate={new Date()}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                              dateFormat="MMMM d, yyyy"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Review & Post */}
                  {currentStep === 6 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-gray-100 to-blue-100 rounded-lg">
                          <FaSearch className="text-xl text-gray-600" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            Review & Post
                          </h2>
                          <p className="text-sm text-gray-600">
                            Review your project before posting
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Tags
                            <span className="text-xs text-gray-500 ml-2">
                              (Helps freelancers find your project)
                            </span>
                          </label>
                          <div className="flex space-x-2 mb-3">
                            <input
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, "tag")}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                              placeholder="e.g., react, ecommerce, mobile-app, ui-design"
                            />
                            <button
                              type="button"
                              onClick={addTag}
                              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <FaPlus />
                              <span>Add</span>
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {jobData.tags.map((tag, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-2 rounded-lg border border-purple-100"
                              >
                                <span className="font-medium text-purple-700">
                                  #{tag}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Visibility
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {visibilityOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                  setJobData((prev) => ({
                                    ...prev,
                                    visibility: option.value,
                                  }))
                                }
                                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                  jobData.visibility === option.value
                                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <div className="font-medium">
                                  {option.label}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {option.description}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Project Summary Preview */}
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaBriefcase className="text-purple-600" />
                            Project Summary
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Project Title
                                </p>
                                <p className="font-medium text-lg">
                                  {jobData.projectTitle}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Category
                                </p>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                    {
                                      projectCategories.find(
                                        (c) => c.id === jobData.projectCategory,
                                      )?.icon
                                    }
                                  </div>
                                  <p className="font-medium">
                                    {
                                      projectCategories.find(
                                        (c) => c.id === jobData.projectCategory,
                                      )?.label
                                    }
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Budget</p>
                                <p className="font-medium text-green-600">
                                  ${jobData.budget.min} - ${jobData.budget.max}{" "}
                                  {jobData.budget.currency}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Timeline
                                </p>
                                <p className="font-medium">
                                  {jobData.timeline.startDate.toLocaleDateString()}{" "}
                                  -{" "}
                                  {jobData.timeline.endDate.toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Required Skills
                                </p>
                                <p className="font-medium">
                                  {jobData.requiredSkills
                                    .slice(0, 3)
                                    .join(", ")}
                                  {jobData.requiredSkills.length > 3 &&
                                    ` +${
                                      jobData.requiredSkills.length - 3
                                    } more`}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Visibility
                                </p>
                                <p className="font-medium capitalize">
                                  {jobData.visibility}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      >
                        <FaArrowLeft />
                        <span>Back</span>
                      </button>
                    )}

                    <div className="ml-auto">
                      {currentStep < 6 ? (
                        <button
                          type="submit"
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-purple-200"
                        >
                          <span>Continue</span>
                          <FaArrowRight />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-purple-200"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Posting Project...</span>
                            </div>
                          ) : (
                            "Post Project Now"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help Text */}
        {!isSubmitted && (
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Need help?{" "}
              <Link
                // to="/client/help"
                className="text-purple-600 hover:underline font-medium"
              >
                View posting guidelines
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerJobPost;
