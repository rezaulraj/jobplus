import React, { useState } from "react";
import {
  FaBuilding,
  FaUserTie,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
  FaFileContract,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const EmployerAuth = () => {
  // Form state
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    companyWebsite: "",
    companySize: "",
    industry: "",
    companyLocation: "",
    companyDescription: "",
    companyPhone: "",
    taxId: "",

    // Employer Information
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    department: "",
    workPhone: "",

    // Account Security
    password: "",
    confirmPassword: "",

    // Agreements
    termsAccepted: false,
    privacyAccepted: false,
    authorizedRepresentative: false,
    receiveUpdates: true,
  });

  // UI state
  const [currentSection, setCurrentSection] = useState(1); // 1: Company, 2: Employer, 3: Account, 4: Review
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Options
  const industries = [
    "Information Technology",
    "Finance & Banking",
    "Healthcare & Medical",
    "Manufacturing",
    "Retail & E-commerce",
    "Education & Training",
    "Hospitality & Tourism",
    "Construction & Engineering",
    "Transportation & Logistics",
    "Energy & Utilities",
    "Telecommunications",
    "Media & Entertainment",
    "Professional Services",
    "Non-profit & NGO",
    "Government & Public Sector",
    "Real Estate",
    "Agriculture",
    "Pharmaceutical",
    "Automotive",
    "Other",
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1001-5000 employees",
    "5000+ employees",
  ];

  const departments = [
    "Human Resources",
    "Recruitment",
    "Talent Acquisition",
    "Management",
    "Operations",
    "Administration",
    "Executive",
    "IT Department",
    "Marketing",
    "Sales",
    "Finance",
    "Other",
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle section navigation
  const nextSection = () => {
    // Validate current section before proceeding
    if (currentSection === 1) {
      if (
        !formData.companyName ||
        !formData.industry ||
        !formData.companySize ||
        !formData.companyPhone
      ) {
        alert("Please fill in all required company information");
        return;
      }
    } else if (currentSection === 2) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.jobTitle
      ) {
        alert("Please fill in all required employer information");
        return;
      }
    } else if (currentSection === 3) {
      if (!formData.password || !formData.confirmPassword) {
        alert("Please fill in password fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (formData.password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
      }
    }

    if (currentSection < 4) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Final validation
    if (
      !formData.termsAccepted ||
      !formData.privacyAccepted ||
      !formData.authorizedRepresentative
    ) {
      alert("Please accept all required agreements");
      setIsSubmitting(false);
      return;
    }

    // Prepare data for API
    const submitData = {
      company: {
        name: formData.companyName,
        website: formData.companyWebsite,
        size: formData.companySize,
        industry: formData.industry,
        location: formData.companyLocation,
        description: formData.companyDescription,
        phone: formData.companyPhone,
        taxId: formData.taxId,
      },
      recruiter: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        jobTitle: formData.jobTitle,
        department: formData.department,
        workPhone: formData.workPhone,
      },
      password: formData.password,
      preferences: {
        receiveUpdates: formData.receiveUpdates,
      },
    };

    // Simulate API call
    setTimeout(() => {
      console.log("Employer registration submitted:", submitData);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      companyName: "",
      companyWebsite: "",
      companySize: "",
      industry: "",
      companyLocation: "",
      companyDescription: "",
      companyPhone: "",
      taxId: "",
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: "",
      department: "",
      workPhone: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      privacyAccepted: false,
      authorizedRepresentative: false,
      receiveUpdates: true,
    });
    setCurrentSection(1);
    setIsSubmitted(false);
  };

  // Progress bar percentage
  const progressPercentage = ((currentSection - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Employer Registration
          </h1>
          <p className="text-gray-600">
            Complete all sections to register your company
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentSection} of 4
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#1e2558] to-[#4eb956] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Progress Labels */}
          <div className="flex justify-between mt-3">
            {["Company Info", "Employer Info", "Account Setup", "Review"].map(
              (label, index) => (
                <div
                  key={index}
                  className={`text-xs font-medium ${
                    currentSection > index + 1
                      ? "text-[#4eb956]"
                      : currentSection === index + 1
                      ? "text-[#1e2558]"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {isSubmitted ? (
            // Success Screen
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-[#4eb956] to-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-3xl text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Registration Submitted!
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your company registration has been submitted for verification.
                You will receive a confirmation email within 1-2 business days.
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 max-w-md mx-auto mb-8">
                <h3 className="font-semibold text-blue-800 mb-2">
                  What happens next?
                </h3>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Account verification (1-2 business days)</li>
                  <li>• Welcome email with login credentials</li>
                  <li>• Access to employer dashboard</li>
                  <li>• Start posting jobs immediately</li>
                </ul>
              </div>

              <button
                onClick={resetForm}
                className="px-6 py-3 bg-[#1e2558] text-white rounded-lg hover:bg-[#2d377a] transition-colors duration-300"
              >
                Register Another Company
              </button>
            </div>
          ) : (
            // Form Sections
            <form onSubmit={handleSubmit}>
              {/* Section 1: Company Information */}
              {currentSection === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
                    1. Company Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                        placeholder="Enter company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Industry</option>
                        {industries.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Size</option>
                        {companySizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="companyPhone"
                          value={formData.companyPhone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Website
                      </label>
                      <div className="relative">
                        <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          name="companyWebsite"
                          value={formData.companyWebsite}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                          placeholder="https://company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID / Business Number
                      </label>
                      <div className="relative">
                        <FaFileContract className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="taxId"
                          value={formData.taxId}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                          placeholder="XX-XXXXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Location
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="companyLocation"
                          value={formData.companyLocation}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                          placeholder="City, State, Country"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description
                      </label>
                      <textarea
                        name="companyDescription"
                        value={formData.companyDescription}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                        placeholder="Brief description of your company..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Optional - This will be visible to job seekers
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Employer Information */}
              {currentSection === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
                    2. Employer Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                        placeholder="Doe"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                          placeholder="john.doe@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                        placeholder="HR Manager"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Phone
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="workPhone"
                          value={formData.workPhone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Account Setup */}
              {currentSection === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
                    3. Account Setup
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              formData.password.length >= 8
                                ? "bg-[#4eb956]"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span
                            className={`text-xs ${
                              formData.password.length >= 8
                                ? "text-[#4eb956]"
                                : "text-gray-500"
                            }`}
                          >
                            At least 8 characters
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e2558] focus:border-transparent transition-all duration-200"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {formData.confirmPassword &&
                        formData.password !== formData.confirmPassword && (
                          <p className="text-red-500 text-xs mt-2">
                            Passwords do not match
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Review & Agreements */}
              {currentSection === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
                    4. Review & Agreements
                  </h2>

                  {/* Review Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Company Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Company Name</p>
                          <p className="font-medium">
                            {formData.companyName || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Industry</p>
                          <p className="font-medium">
                            {formData.industry || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Company Size</p>
                          <p className="font-medium">
                            {formData.companySize || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">
                            {formData.companyPhone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Employer Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">
                            {formData.firstName} {formData.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">
                            {formData.email || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Job Title</p>
                          <p className="font-medium">
                            {formData.jobTitle || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Department</p>
                          <p className="font-medium">
                            {formData.department || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agreements */}
                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="authorizedRepresentative"
                        checked={formData.authorizedRepresentative}
                        onChange={handleInputChange}
                        required
                        className="w-5 h-5 text-[#1e2558] rounded focus:ring-[#1e2558] mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I confirm that I am an authorized representative of{" "}
                        {formData.companyName || "the company"} and have the
                        authority to create this account
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        required
                        className="w-5 h-5 text-[#1e2558] rounded focus:ring-[#1e2558] mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a
                          href="/employer/terms"
                          className="text-[#1e2558] hover:underline font-medium"
                        >
                          Employer Terms of Service
                        </a>
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="privacyAccepted"
                        checked={formData.privacyAccepted}
                        onChange={handleInputChange}
                        required
                        className="w-5 h-5 text-[#1e2558] rounded focus:ring-[#1e2558] mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a
                          href="/employer/privacy"
                          className="text-[#1e2558] hover:underline font-medium"
                        >
                          Privacy Policy
                        </a>
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="receiveUpdates"
                        checked={formData.receiveUpdates}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#1e2558] rounded focus:ring-[#1e2558] mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I want to receive updates about new features and hiring
                        resources
                      </span>
                    </label>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Your account will be reviewed and
                      activated within 1-2 business days. You will receive an
                      email confirmation once approved.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {currentSection > 1 && (
                  <button
                    type="button"
                    onClick={prevSection}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaArrowLeft />
                    <span>Back</span>
                  </button>
                )}

                {currentSection < 4 ? (
                  <button
                    type="button"
                    onClick={nextSection}
                    className="ml-auto flex items-center space-x-2 px-6 py-3 bg-[#1e2558] text-white rounded-lg hover:bg-[#2d377a] transition-colors duration-200"
                  >
                    <span>Continue</span>
                    <FaArrowRight />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto px-8 py-3 bg-gradient-to-r from-[#1e2558] to-[#4eb956] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer Note */}
        {!isSubmitted && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <a
                href="/employer/support"
                className="text-[#1e2558] hover:underline font-medium"
              >
                Contact Employer Support
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerAuth;
