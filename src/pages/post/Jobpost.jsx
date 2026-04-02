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
  FaBuilding,
  FaUsers,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaPlus,
  FaTrash,
  FaCheck,
  FaHome,
  FaSuitcase,
  FaUserTie,
  FaUser,
  FaCalendar,
  FaEnvelope,
} from "react-icons/fa";

// Department data array
const jobDepartments = [
  { name: "Accounting/Finance" },
  { name: "Business Development" },
  { name: "Sales/Marketing" },
  { name: "IT/Telecommunication" },
  { name: "Information Technology" },
  { name: "Engineering" },
  { name: "Manufacturing" },
  { name: "Services" },
  { name: "Recruitment/Employment Firms" },
  { name: "Data Entry/Office Support" },
  { name: "Hospitality/Travel/Tourism" },
  { name: "Education/Training" },
  { name: "Customer/Service/Call Centre" },
  { name: "Consultants" },
  { name: "Banking/Financial Services" },
  { name: "N.G.O./Social Services" },
  { name: "E-Commerce/E-Business" },
  { name: "Real Estate/Property" },
  { name: "Healthcare/Hospital/Medical" },
  { name: "BPO" },
  { name: "Construction/Cement/Metals" },
  { name: "Architect/Interior Design" },
  { name: "Importers/Distributors/Exporters" },
];

// Subcategory data
const subCategories = [
  { name: "Sales" },
  { name: "Marketing" },
  { name: "Software Development" },
  { name: "Human Resources" },
  { name: "Finance" },
  { name: "Operations" },
  { name: "Customer Support" },
  { name: "Administration" },
];

// Job categories for final step
const jobCategories = [
  { name: "Technology" },
  { name: "Marketing" },
  { name: "Sales" },
  { name: "Design" },
  { name: "Finance" },
  { name: "Human Resources" },
  { name: "Operations" },
  { name: "Customer Service" },
];

// Industries
const industries = [
  { name: "Technology" },
  { name: "Finance" },
  { name: "Healthcare" },
  { name: "E-commerce" },
  { name: "Education" },
  { name: "Manufacturing" },
  { name: "Consulting" },
  { name: "Media & Entertainment" },
];

const Jobpost = () => {
  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Job form state
  const [jobData, setJobData] = useState({
    // Step 1: Basic Information
    jobTitle: "",
    companyName: "",
    department: "",
    employmentType: "",
    experienceLevel: "",

    // Step 2: Location & Details
    location: {
      city: "",
      state: "",
      country: "",
      remoteType: "onsite",
    },
    salary: {
      min: "",
      max: "",
      currency: "BDT",
      period: "month",
    },
    vacancies: "1",

    // Step 3: Requirements
    education: "",
    skills: [],
    certifications: [],

    // Step 4: Description
    description: "",
    responsibilities: "",
    benefits: "",

    // Step 5: Application Details
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applicationEmail: "",
    applicationUrl: "",

    // Step 6: Additional Info
    tags: [],
    category: "",
    subCategory: "",
    industry: "",
  });

  // Input states
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Set mounted state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Options arrays - FIXED: Using emojis instead of React elements in select
  const employmentTypes = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "internship", label: "Internship" },
    { value: "freelance", label: "Freelance" },
  ];

  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (2-5 years)" },
    { value: "senior", label: "Senior Level (5+ years)" },
    { value: "executive", label: "Executive" },
    { value: "director", label: "Director" },
  ];

  // Button versions with icons (for display, not for select)
  const employmentTypeButtons = [
    { value: "full-time", label: "Full Time", icon: <FaClock /> },
    { value: "part-time", label: "Part Time", icon: <FaClock /> },
    { value: "contract", label: "Contract", icon: <FaCalendar /> },
    { value: "temporary", label: "Temporary", icon: <FaCalendar /> },
    { value: "internship", label: "Internship", icon: <FaUserGraduate /> },
    { value: "freelance", label: "Freelance", icon: <FaSuitcase /> },
  ];

  const experienceLevelButtons = [
    { value: "entry", label: "Entry Level", icon: <FaUserGraduate /> },
    { value: "mid", label: "Mid Level", icon: <FaUser /> },
    { value: "senior", label: "Senior Level", icon: <FaUserTie /> },
    { value: "executive", label: "Executive", icon: <FaUserTie /> },
    { value: "director", label: "Director", icon: <FaSuitcase /> },
  ];

  const remoteTypes = [
    { value: "onsite", label: "On-site", icon: <FaBuilding /> },
    { value: "remote", label: "Fully Remote", icon: <FaHome /> },
    {
      value: "hybrid",
      label: "Hybrid",
      icon: (
        <>
          <FaBuilding />
          <FaHome />
        </>
      ),
    },
  ];

  const educationLevels = [
    { value: "high-school", label: "High School Diploma" },
    { value: "associate", label: "Associate Degree" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
    { value: "none", label: "No Formal Education Required" },
  ];

  const currencies = [
    { value: "BDT", label: "BDT (৳)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "JPY", label: "JPY (¥)" },
    { value: "CAD", label: "CAD ($)" },
    { value: "AUD", label: "AUD ($)" },
  ];

  const salaryPeriods = [
    { value: "month", label: "Per Month" },
    { value: "year", label: "Per Year" },
    { value: "week", label: "Per Week" },
    { value: "hour", label: "Per Hour" },
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

  // Add skill
  const addSkill = useCallback(() => {
    if (skillInput.trim() && !jobData.skills.includes(skillInput.trim())) {
      setJobData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  }, [skillInput, jobData.skills]);

  // Remove skill
  const removeSkill = useCallback((skill) => {
    setJobData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }, []);

  // Add certification
  const addCertification = useCallback(() => {
    if (
      certInput.trim() &&
      !jobData.certifications.includes(certInput.trim())
    ) {
      setJobData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certInput.trim()],
      }));
      setCertInput("");
    }
  }, [certInput, jobData.certifications]);

  // Remove certification
  const removeCertification = useCallback((cert) => {
    setJobData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
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
        if (type === "cert") addCertification();
        if (type === "tag") addTag();
      }
    },
    [addSkill, addCertification, addTag]
  );

  // Navigation
  const nextStep = useCallback(() => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (
        !jobData.jobTitle ||
        !jobData.companyName ||
        !jobData.employmentType
      ) {
        alert("Please fill in all required basic information");
        return;
      }
    } else if (currentStep === 2) {
      if (!jobData.location.city || !jobData.location.country) {
        alert("Please fill in location information");
        return;
      }
    } else if (currentStep === 3) {
      if (jobData.skills.length === 0) {
        alert("Please add at least one required skill");
        return;
      }
    } else if (currentStep === 4) {
      if (
        !jobData.description.trim() ||
        jobData.description.trim().length < 50
      ) {
        alert(
          "Please provide a detailed job description (minimum 50 characters)"
        );
        return;
      }
    } else if (currentStep === 5) {
      if (!jobData.applicationEmail && !jobData.applicationUrl) {
        alert("Please provide either application email or URL");
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

      // Final validation
      if (!jobData.category || !jobData.industry) {
        alert("Please select category and industry");
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API
      const submitData = {
        ...jobData,
        postedDate: new Date().toISOString(),
        status: "active",
      };

      // Simulate API call
      setTimeout(() => {
        console.log("Job posted:", submitData);
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 2000);
    },
    [jobData]
  );

  // Progress percentage
  const progressPercentage = ((currentStep - 1) / 6) * 100;

  // Step titles
  const stepTitles = [
    "Basic Information",
    "Location & Salary",
    "Requirements",
    "Description",
    "Application Details",
    "Additional Info",
  ];

  // Reset form
  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setJobData({
      jobTitle: "",
      companyName: "",
      department: "",
      employmentType: "",
      experienceLevel: "",
      location: { city: "", state: "", country: "", remoteType: "onsite" },
      salary: { min: "", max: "", currency: "USD", period: "year" },
      vacancies: "1",
      education: "",
      skills: [],
      certifications: [],
      description: "",
      responsibilities: "",
      benefits: "",
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applicationEmail: "",
      applicationUrl: "",
      tags: [],
      category: "",
      subCategory: "",
      industry: "",
    });
    setIsSubmitted(false);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 "
            >
              <FaBriefcase className="text-2xl text-primary" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Post a New Job
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill in the job details step by step to find the perfect candidate
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 6: {stepTitles[currentStep - 1]}
            </span>
            <span className="text-sm font-semibold text-[#4eb956]">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="h-3 rounded-full bg-gradient-to-r from-[#1e2558] via-[#4eb956] to-[#1e2558]"
            ></motion.div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index + 1 <= currentStep ? "text-[#1e2558]" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index + 1 < currentStep
                      ? "bg-[#4eb956] text-white"
                      : index + 1 === currentStep
                      ? "bg-[#1e2558] text-white shadow-lg"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1 < currentStep ? (
                    <FaCheckCircle />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs text-center max-w-16 hidden md:block">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
                  className="w-24 h-24 bg-gradient-to-br from-[#4eb956] to-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <FaCheckCircle className="text-4xl text-white" />
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Job Posted Successfully!
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Your job listing has been published and is now visible to
                  candidates.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-blue-800 mb-3">
                    Job Summary
                  </h3>
                  <div className="text-left space-y-2">
                    <p>
                      <span className="font-medium">Position:</span>{" "}
                      {jobData.jobTitle}
                    </p>
                    <p>
                      <span className="font-medium">Company:</span>{" "}
                      {jobData.companyName}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {jobData.location.city}, {jobData.location.country}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {
                        employmentTypes.find(
                          (e) => e.value === jobData.employmentType
                        )?.label
                      }
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-[#1e2558] text-white rounded-lg hover:bg-[#2d377a] transition-colors duration-300"
                  >
                    Post Another Job
                  </button>
                  <button
                    onClick={() => console.log("View job listing")}
                    className="px-6 py-3 border border-[#1e2558] text-[#1e2558] rounded-lg hover:bg-[#1e2558] hover:text-white transition-colors duration-300"
                  >
                    View Job Listing
                  </button>
                </div>
              </motion.div>
            ) : (
              // Form Steps
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
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-[#1e2558]/10 rounded-lg">
                          <FaBriefcase className="text-xl text-[#1e2558]" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          Basic Job Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaBriefcase className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                              type="text"
                              name="jobTitle"
                              value={jobData.jobTitle}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                              placeholder="e.g., Senior Frontend Developer"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaBuilding className="absolute left-3 top-3.5 text-gray-400" />
                            <input
                              type="text"
                              name="companyName"
                              value={jobData.companyName}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                              placeholder="Your company name"
                            />
                          </div>
                        </div>

                        {/* Department Dropdown - FIXED */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                          </label>
                          <select
                            name="department"
                            value={jobData.department}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Select Department</option>
                            {jobDepartments.map((dept, index) => (
                              <option key={index} value={dept.name}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Employment Type{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaClock className="absolute left-3 top-3.5 text-gray-400 z-10" />
                            <select
                              name="employmentType"
                              value={jobData.employmentType}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                            >
                              <option value="">Select Type</option>
                              {employmentTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Experience Level Buttons */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience Level
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {experienceLevelButtons.map((level) => (
                              <button
                                key={level.value}
                                type="button"
                                onClick={() =>
                                  setJobData((prev) => ({
                                    ...prev,
                                    experienceLevel: level.value,
                                  }))
                                }
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                  jobData.experienceLevel === level.value
                                    ? "border-[#4eb956] bg-[#4eb956]/10"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <span className="text-xl mb-2">
                                  {level.icon}
                                </span>
                                <span className="text-xs font-medium text-center">
                                  {level.label.split(" ")[0]}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Location & Salary */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-[#1e2558]/10 rounded-lg">
                          <FaMapMarkerAlt className="text-xl text-[#1e2558]" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          Location & Salary Details
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {/* Remote Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Work Arrangement
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {remoteTypes.map((type) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() =>
                                  setJobData((prev) => ({
                                    ...prev,
                                    location: {
                                      ...prev.location,
                                      remoteType: type.value,
                                    },
                                  }))
                                }
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                  jobData.location.remoteType === type.value
                                    ? "border-[#4eb956] bg-[#4eb956]/10"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <span className="text-xl mb-2">
                                  {type.icon}
                                </span>
                                <span className="font-medium">
                                  {type.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                              <input
                                type="text"
                                name="location.city"
                                value={jobData.location.city}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                                placeholder="City"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State/Province
                            </label>
                            <input
                              type="text"
                              name="location.state"
                              value={jobData.location.state}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                              placeholder="State"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="location.country"
                              value={jobData.location.country}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                              placeholder="Country"
                            />
                          </div>
                        </div>

                        {/* Salary */}
                        <div className="border-t pt-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <FaDollarSign className="text-[#4eb956]" />
                            <h3 className="font-medium text-gray-800">
                              Salary Information
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimum Salary
                              </label>
                              <input
                                type="number"
                                name="salary.min"
                                value={jobData.salary.min}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                                placeholder="Min"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Salary
                              </label>
                              <input
                                type="number"
                                name="salary.max"
                                value={jobData.salary.max}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                                placeholder="Max"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Currency
                              </label>
                              <select
                                name="salary.currency"
                                value={jobData.salary.currency}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                              >
                                {currencies.map((curr) => (
                                  <option key={curr.value} value={curr.value}>
                                    {curr.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Period
                              </label>
                              <select
                                name="salary.period"
                                value={jobData.salary.period}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                              >
                                {salaryPeriods.map((period) => (
                                  <option
                                    key={period.value}
                                    value={period.value}
                                  >
                                    {period.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Vacancies */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Vacancies
                          </label>
                          <div className="flex items-center space-x-4">
                            <button
                              type="button"
                              onClick={() =>
                                setJobData((prev) => ({
                                  ...prev,
                                  vacancies: Math.max(
                                    1,
                                    parseInt(prev.vacancies) - 1
                                  ).toString(),
                                }))
                              }
                              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              name="vacancies"
                              value={jobData.vacancies}
                              onChange={handleInputChange}
                              min="1"
                              className="w-24 px-4 py-3 border border-gray-300 rounded-xl text-center focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setJobData((prev) => ({
                                  ...prev,
                                  vacancies: (
                                    parseInt(prev.vacancies) + 1
                                  ).toString(),
                                }))
                              }
                              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Requirements */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-[#1e2558]/10 rounded-lg">
                          <FaUserGraduate className="text-xl text-[#1e2558]" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          Requirements & Qualifications
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {/* Education */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Education Level
                          </label>
                          <select
                            name="education"
                            value={jobData.education}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Select Education Level</option>
                            {educationLevels.map((level) => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Skills */}
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
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                              placeholder="e.g., React, JavaScript, Python"
                            />
                            <button
                              type="button"
                              onClick={addSkill}
                              className="px-4 py-3 bg-[#1e2558] text-white rounded-xl hover:bg-[#2d377a] transition-colors duration-200 flex items-center space-x-2"
                            >
                              <FaPlus />
                              <span>Add</span>
                            </button>
                          </div>

                          {/* Skills List */}
                          <div className="flex flex-wrap gap-2">
                            {jobData.skills.map((skill, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 bg-[#4eb956]/10 px-3 py-2 rounded-lg"
                              >
                                <span className="font-medium">{skill}</span>
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

                        {/* Certifications */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Certifications
                          </label>
                          <div className="flex space-x-2 mb-3">
                            <input
                              type="text"
                              value={certInput}
                              onChange={(e) => setCertInput(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, "cert")}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                              placeholder="e.g., PMP, AWS Certified, CISSP"
                            />
                            <button
                              type="button"
                              onClick={addCertification}
                              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <FaPlus />
                              <span>Add</span>
                            </button>
                          </div>

                          {/* Certifications List */}
                          <div className="flex flex-wrap gap-2">
                            {jobData.certifications.map((cert, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg"
                              >
                                <span className="font-medium">{cert}</span>
                                <button
                                  type="button"
                                  onClick={() => removeCertification(cert)}
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
                  )}

                  {/* Step 4: Description - REPLACED Quill with textareas */}
                  {currentStep === 4 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-[#1e2558]/10 rounded-lg">
                          <FaFileAlt className="text-xl text-[#1e2558]" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          Job Description & Details
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {/* Job Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Description{" "}
                            <span className="text-red-500">*</span>
                            <span className="text-xs text-gray-500 ml-2">
                              (Minimum 50 characters)
                            </span>
                          </label>
                          <textarea
                            value={jobData.description}
                            onChange={(e) =>
                              setJobData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200 h-64"
                            placeholder="Describe the job role, expectations, and impact..."
                          />
                          <div className="mt-2 flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                              Character count: {jobData.description.length}
                            </p>
                            {jobData.description.length < 50 && (
                              <p className="text-xs text-red-500">
                                Minimum 50 characters required
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Responsibilities */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Key Responsibilities
                          </label>
                          <textarea
                            value={jobData.responsibilities}
                            onChange={(e) =>
                              setJobData((prev) => ({
                                ...prev,
                                responsibilities: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200 h-48"
                            placeholder="List the main responsibilities and tasks..."
                          />
                        </div>

                        {/* Benefits */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Benefits & Perks
                          </label>
                          <textarea
                            value={jobData.benefits}
                            onChange={(e) =>
                              setJobData((prev) => ({
                                ...prev,
                                benefits: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200 h-48"
                            placeholder="Describe the benefits, perks, and company culture..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Application Details */}
                  {currentStep === 5 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-[#1e2558]/10 rounded-lg">
                          <FaUsers className="text-xl text-[#1e2558]" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          Application Process
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {/* Application Deadline */}
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
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                              dateFormat="MMMM d, yyyy"
                            />
                          </div>
                        </div>

                        {/* Application Method */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            How to Apply <span className="text-red-500">*</span>
                            <span className="text-xs text-gray-500 ml-2">
                              (Provide at least one method)
                            </span>
                          </label>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Application Email
                              </label>
                              <div className="relative">
                                <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                  type="email"
                                  name="applicationEmail"
                                  value={jobData.applicationEmail}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                                  placeholder="careers@company.com"
                                />
                              </div>
                            </div>

                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                              </div>
                              <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">
                                  OR
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Application URL
                              </label>
                              <div className="relative">
                                <FaGlobe className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                  type="url"
                                  name="applicationUrl"
                                  value={jobData.applicationUrl}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                                  placeholder="https://company.com/careers/apply"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Additional Info */}
                  {currentStep === 6 && (
                    <div className="space-y-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-[#1e2558]/10 rounded-lg">
                          <FaTags className="text-xl text-[#1e2558]" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          Additional Information
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Tags
                            <span className="text-xs text-gray-500 ml-2">
                              (Helps candidates find your job)
                            </span>
                          </label>
                          <div className="flex space-x-2 mb-3">
                            <input
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, "tag")}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                              placeholder="e.g., remote, tech, startup, healthcare"
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

                          {/* Tags List */}
                          <div className="flex flex-wrap gap-2">
                            {jobData.tags.map((tag, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg"
                              >
                                <span className="font-medium">#{tag}</span>
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

                        {/* Category, Sub Category & Industry */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Job Category{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="category"
                              value={jobData.category}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                            >
                              <option value="">Select Category</option>
                              {jobCategories.map((cat, index) => (
                                <option key={index} value={cat.name}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sub Category
                            </label>
                            <select
                              name="subCategory"
                              value={jobData.subCategory}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                            >
                              <option value="">Select Sub Category</option>
                              {subCategories.map((subCat, index) => (
                                <option key={index} value={subCat.name}>
                                  {subCat.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Industry <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="industry"
                              value={jobData.industry}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent transition-all duration-200"
                            >
                              <option value="">Select Industry</option>
                              {industries.map((ind, index) => (
                                <option key={index} value={ind.name}>
                                  {ind.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Review Summary */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="font-semibold text-gray-800 mb-4">
                            Job Summary Preview
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Position</p>
                              <p className="font-medium">
                                {jobData.jobTitle || "Not specified"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Company</p>
                              <p className="font-medium">
                                {jobData.companyName || "Not specified"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="font-medium">
                                {jobData.location.city},{" "}
                                {jobData.location.country}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Type</p>
                              <p className="font-medium">
                                {employmentTypes.find(
                                  (e) => e.value === jobData.employmentType
                                )?.label || "Not specified"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Experience
                              </p>
                              <p className="font-medium">
                                {experienceLevels.find(
                                  (e) => e.value === jobData.experienceLevel
                                )?.label || "Not specified"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Skills</p>
                              <p className="font-medium">
                                {jobData.skills.slice(0, 3).join(", ")}
                                {jobData.skills.length > 3 &&
                                  ` +${jobData.skills.length - 3} more`}
                              </p>
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
                          className="flex items-center space-x-2 px-6 py-3 bg-[#1e2558] text-white rounded-xl hover:bg-[#2d377a] transition-colors duration-200"
                        >
                          <span>Continue</span>
                          <FaArrowRight />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-8 py-3 bg-gradient-to-r from-[#1e2558] to-[#4eb956] text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Posting Job...</span>
                            </div>
                          ) : (
                            "Post Job Now"
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
              <a
                href="/employer/help"
                className="text-[#1e2558] hover:underline font-medium"
              >
                View posting guidelines
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobpost;
