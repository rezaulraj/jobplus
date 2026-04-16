// pages/employer/CompanyProfile.jsx
import React, { useState } from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaUsers,
  FaPencilAlt,
  FaCamera,
  FaSave,
  FaTimes,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [companyData, setCompanyData] = useState({
    logo: null,
    coverImage: null,
    name: "TechCorp Solutions",
    tagline: "Building the future of work",
    email: "contact@techcorp.com",
    phone: "+1 (555) 123-4567",
    website: "www.techcorp.com",
    founded: "2015",
    employeeCount: "50-100",
    industry: "Information Technology",
    description:
      "We are a leading technology company specializing in innovative software solutions for businesses worldwide. Our mission is to transform how companies operate through cutting-edge technology.",
    location: {
      address: "123 Innovation Street",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      zipCode: "94105",
    },
    socialMedia: {
      linkedin: "https://linkedin.com/company/techcorp",
      twitter: "https://twitter.com/techcorp",
      facebook: "https://facebook.com/techcorp",
      instagram: "https://instagram.com/techcorp",
    },
    benefits: [
      "Flexible Working Hours",
      "Health Insurance",
      "401k Matching",
      "Remote Work Options",
      "Professional Development",
      "Paid Time Off",
    ],
    gallery: ["office1.jpg", "office2.jpg", "team.jpg"],
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaBuilding /> },
    { id: "media", label: "Media", icon: <FaCamera /> },
    { id: "benefits", label: "Benefits", icon: <FaCheckCircle /> },
    { id: "team", label: "Team", icon: <FaUsers /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setCompanyData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCompanyData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSocialChange = (platform, value) => {
    setCompanyData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Company Profile
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your company information and branding
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 bg-linear-to-r from-[#1E2558] to-[#4EB956] text-white rounded-lg hover:shadow-lg transition-all"
              >
                <FaSave className="mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-linear-to-r from-[#1E2558] to-[#4EB956] text-white rounded-lg hover:shadow-lg transition-all"
            >
              <FaPencilAlt className="mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-48 bg-linear-to-r from-[#1E2558] to-[#4EB956] relative">
          {companyData.coverImage && (
            <img
              src={companyData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          {isEditing && (
            <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-all">
              <FaCamera className="text-gray-700" />
            </button>
          )}
        </div>

        {/* Company Logo and Basic Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-lg bg-linear-to-r from-[#1E2558] to-[#4EB956] flex items-center justify-center text-white text-3xl font-bold">
                  {companyData.name.charAt(0)}
                </div>
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all">
                  <FaCamera className="text-gray-600 text-sm" />
                </button>
              )}
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={companyData.name}
                      onChange={handleInputChange}
                      className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:border-[#4EB956] outline-none"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-800">
                      {companyData.name}
                    </h2>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      name="tagline"
                      value={companyData.tagline}
                      onChange={handleInputChange}
                      className="text-gray-600 border-b border-gray-300 focus:border-[#4EB956] outline-none mt-1"
                    />
                  ) : (
                    <p className="text-gray-600">{companyData.tagline}</p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    Verified Company
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    Premium
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-linear-to-r from-[#1E2558] to-[#4EB956] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-[#4EB956]" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={companyData.email}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                    />
                  ) : (
                    <span className="text-gray-600">{companyData.email}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaPhone className="text-[#4EB956]" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={companyData.phone}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                    />
                  ) : (
                    <span className="text-gray-600">{companyData.phone}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaGlobe className="text-[#4EB956]" />
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={companyData.website}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                    />
                  ) : (
                    <a
                      href={`https://${companyData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4EB956] hover:underline"
                    >
                      {companyData.website}
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-[#4EB956]" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location.address"
                      value={companyData.location.address}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                      placeholder="Address"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {companyData.location.address},{" "}
                      {companyData.location.city}, {companyData.location.state}{" "}
                      {companyData.location.zipCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Industry</p>
                  {isEditing ? (
                    <select
                      name="industry"
                      value={companyData.industry}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                    >
                      <option>Information Technology</option>
                      <option>Healthcare</option>
                      <option>Finance</option>
                      <option>Education</option>
                    </select>
                  ) : (
                    <p className="font-medium text-gray-800">
                      {companyData.industry}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Company Size</p>
                  {isEditing ? (
                    <select
                      name="employeeCount"
                      value={companyData.employeeCount}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                    >
                      <option>1-10</option>
                      <option>11-50</option>
                      <option>50-100</option>
                      <option>100-500</option>
                      <option>500+</option>
                    </select>
                  ) : (
                    <p className="font-medium text-gray-800">
                      {companyData.employeeCount} employees
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Founded</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="founded"
                      value={companyData.founded}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">
                      {companyData.founded}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                About Company
              </h3>
              {isEditing ? (
                <textarea
                  name="description"
                  value={companyData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#4EB956] outline-none"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {companyData.description}
                </p>
              )}
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Social Media
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(companyData.socialMedia).map(
                  ([platform, url]) => (
                    <div
                      key={platform}
                      className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                    >
                      {platform === "linkedin" && (
                        <FaLinkedin className="text-[#0077b5]" />
                      )}
                      {platform === "twitter" && (
                        <FaTwitter className="text-[#1DA1F2]" />
                      )}
                      {platform === "facebook" && (
                        <FaFacebook className="text-[#4267B2]" />
                      )}
                      {platform === "instagram" && (
                        <FaInstagram className="text-[#E4405F]" />
                      )}
                      {isEditing ? (
                        <input
                          type="url"
                          value={url}
                          onChange={(e) =>
                            handleSocialChange(platform, e.target.value)
                          }
                          className="flex-1 bg-transparent text-sm border-b border-gray-300 focus:border-[#4EB956] outline-none"
                          placeholder={`${platform} URL`}
                        />
                      ) : (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:text-[#4EB956] truncate"
                        >
                          {platform}
                        </a>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === "benefits" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Benefits & Perks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companyData.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg group"
                >
                  <FaCheckCircle className="text-[#4EB956] flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                  {isEditing && (
                    <button className="ml-auto text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <FaTimes size={14} />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4EB956] transition-all">
                  <FaPlus className="text-gray-400" />
                  <span className="text-gray-500">Add Benefit</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Company Gallery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {companyData.gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-[#1E2558] to-[#4EB956] opacity-0 group-hover:opacity-10 transition-all" />
                  {isEditing && (
                    <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all">
                      <FaTimes className="text-red-500 text-sm" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4EB956] transition-all">
                  <FaCamera className="text-gray-400 text-2xl mb-2" />
                  <span className="text-gray-500 text-sm">Upload Image</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Leadership Team
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((member) => (
                <div
                  key={member}
                  className="bg-gray-50 rounded-lg p-4 text-center"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-r from-[#1E2558] to-[#4EB956] flex items-center justify-center text-white text-2xl font-bold mb-3">
                    JD
                  </div>
                  <h4 className="font-semibold text-gray-800">John Doe</h4>
                  <p className="text-sm text-gray-500">CEO & Founder</p>
                  <p className="text-xs text-gray-400 mt-2">
                    15+ years in tech
                  </p>
                </div>
              ))}
              {isEditing && (
                <button className="bg-gray-50 rounded-lg p-4 text-center border-2 border-dashed border-gray-300 hover:border-[#4EB956] transition-all">
                  <FaPlus className="mx-auto text-gray-400 text-2xl mb-2" />
                  <span className="text-gray-500">Add Team Member</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-[#1E2558] to-[#4EB956] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Company Profile Preview
            </h3>
            <p className="text-white/80 text-sm">
              See how your profile looks to job seekers
            </p>
          </div>
          <button className="px-4 py-2 bg-white text-[#1E2558] rounded-lg hover:shadow-lg transition-all">
            View Public Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
