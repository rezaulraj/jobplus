// pages/employer/CompanyProfile.jsx
import React, { useState, useEffect, useRef } from "react";
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
  FaCheckCircle,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import useCompanyStore from "../../store/companyStore";

const companySizeOptions = [
  "",
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees",
];

const EMPTY_FORM = {
  nameCompany: "",
  tagline: "",
  industry: "",
  website: "",
  emailCompany: "",
  phoneCompany: "",
  address: "",
  companySize: "",
  foundedYear: "",
  description: "",
  socialLinks: {
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  },
};

function mapCompanyToForm(company) {
  if (!company) return EMPTY_FORM;
  return {
    nameCompany: company.nameCompany || "",
    tagline: company.tagline || "",
    industry: company.industry || "",
    website: company.website || "",
    emailCompany: company.emailCompany || "",
    phoneCompany: company.phoneCompany || "",
    address: company.address || "",
    companySize: company.companySize || "",
    foundedYear: company.foundedYear ?? "",
    description: company.description || "",
    socialLinks: {
      linkedin: company.socialLinks?.linkedin || "",
      twitter: company.socialLinks?.twitter || "",
      facebook: company.socialLinks?.facebook || "",
      instagram: company.socialLinks?.instagram || "",
    },
  };
}

const CompanyProfile = () => {
  const {
    company,
    isLoading,
    isUploading,
    fetchMyCompany,
    createCompany,
    updateCompany,
    updateCompanyLogo,
    removeCompanyLogo,
    updateCompanyCover,
    removeCompanyCover,
  } = useCompanyStore();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // ── Load company on mount ──────────────────────────────────────────────
  useEffect(() => {
    fetchMyCompany();
  }, []);

  // ── Sync form when company changes or editing starts ──────────────────
  useEffect(() => {
    if (!isEditing) {
      setForm(mapCompanyToForm(company));
    }
  }, [company, isEditing]);

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaBuilding /> },
    { id: "media", label: "Media", icon: <FaCamera /> },
    { id: "benefits", label: "Benefits", icon: <FaCheckCircle /> },
    { id: "team", label: "Team", icon: <FaUsers /> },
  ];

  // ── Form handlers ──────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    setForm(mapCompanyToForm(company));
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      ...form,
      foundedYear: form.foundedYear ? Number(form.foundedYear) : null,
    };

    let result;
    if (!company) {
      result = await createCompany(payload);
    } else {
      result = await updateCompany(payload);
    }

    setIsSaving(false);
    if (result.success) {
      setIsEditing(false);
    }
  };

  // ── Logo upload / remove ───────────────────────────────────────────────
  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await updateCompanyLogo(file);
    e.target.value = "";
  };

  const handleRemoveLogo = async () => {
    if (!window.confirm("Remove company logo?")) return;
    await removeCompanyLogo();
  };

  // ── Cover upload / remove ─────────────────────────────────────────────
  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await updateCompanyCover(file);
    e.target.value = "";
  };

  const handleRemoveCover = async () => {
    if (!window.confirm("Remove company cover image?")) return;
    await removeCompanyCover();
  };

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (isLoading && !company) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-[#4EB956] text-4xl" />
      </div>
    );
  }

  // ── No company yet — show create prompt ───────────────────────────────
  if (!company && !isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Company Profile
        </h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FaBuilding className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Company Profile Yet
          </h2>
          <p className="text-gray-500 mb-6">
            Set up your company profile to start posting jobs.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-lg hover:shadow-lg transition-all"
          >
            <FaBuilding className="mr-2" />
            Create Company Profile
          </button>
          {isEditing && (
            <div className="mt-8 text-left max-w-2xl mx-auto space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Company Details
              </h3>
              <input
                name="nameCompany"
                value={form.nameCompany}
                onChange={handleInputChange}
                placeholder="Company Name *"
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#4EB956] outline-none"
              />
              <input
                name="tagline"
                value={form.tagline}
                onChange={handleInputChange}
                placeholder="Tagline"
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#4EB956] outline-none"
              />
              <input
                name="emailCompany"
                type="email"
                value={form.emailCompany}
                onChange={handleInputChange}
                placeholder="Company Email"
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#4EB956] outline-none"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="About your company"
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#4EB956] outline-none"
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {isSaving ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaSave className="mr-2" />
                  )}
                  Create Company
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-60"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-60"
              >
                {isSaving ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaSave className="mr-2" />
                )}
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-lg hover:shadow-lg transition-all"
            >
              <FaPencilAlt className="mr-2" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Cover + Logo Card */}
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-[#1E2558] to-[#4EB956] relative">
          {company?.companyCover && (
            <img
              src={company.companyCover}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          {/* Hidden cover file input */}
          <input
            type="file"
            ref={coverInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
          {isEditing && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploading}
                className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white transition-all flex items-center gap-2 text-sm font-medium text-gray-700 disabled:opacity-60"
              >
                {isUploading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaCamera />
                )}
                {company?.companyCover ? "Change Cover" : "Upload Cover"}
              </button>
              {company?.companyCover && (
                <button
                  onClick={handleRemoveCover}
                  disabled={isUploading}
                  className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white transition-all flex items-center gap-2 text-sm font-medium text-red-600 disabled:opacity-60"
                >
                  <FaTrash /> Remove
                </button>
              )}
            </div>
          )}
        </div>

        {/* Logo + Company Name */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-12">
            {/* Logo */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-lg">
                {company?.companyLogo ? (
                  <img
                    src={company.companyLogo}
                    alt="Logo"
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-gradient-to-r from-[#1E2558] to-[#4EB956] flex items-center justify-center text-white text-3xl font-bold">
                    {company?.nameCompany?.charAt(0) || "C"}
                  </div>
                )}
              </div>
              {/* Hidden logo file input */}
              <input
                type="file"
                ref={logoInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                    title="Upload logo"
                  >
                    {isUploading ? (
                      <FaSpinner className="animate-spin text-gray-600 text-sm" />
                    ) : (
                      <FaCamera className="text-gray-600 text-sm" />
                    )}
                  </button>
                  {company?.companyLogo && (
                    <button
                      onClick={handleRemoveLogo}
                      disabled={isUploading}
                      className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                      title="Remove logo"
                    >
                      <FaTrash className="text-red-500 text-sm" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Name / Tagline */}
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nameCompany"
                      value={form.nameCompany}
                      onChange={handleInputChange}
                      className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:border-[#4EB956] outline-none w-full"
                      placeholder="Company Name"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-800">
                      {company?.nameCompany}
                    </h2>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      name="tagline"
                      value={form.tagline}
                      onChange={handleInputChange}
                      className="text-gray-600 border-b border-gray-300 focus:border-[#4EB956] outline-none mt-1 w-full"
                      placeholder="Tagline"
                    />
                  ) : (
                    <p className="text-gray-600">{company?.tagline}</p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  {company?.isVerified && (
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                      Verified Company
                    </span>
                  )}
                  {company?.isPremium && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-[#4EB956] flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="emailCompany"
                      value={form.emailCompany}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                      placeholder="Company Email"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {company?.emailCompany || "—"}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaPhone className="text-[#4EB956] flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneCompany"
                      value={form.phoneCompany}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                      placeholder="Phone"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {company?.phoneCompany || "—"}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaGlobe className="text-[#4EB956] flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={form.website}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                      placeholder="Website URL"
                    />
                  ) : company?.website ? (
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4EB956] hover:underline truncate"
                    >
                      {company.website}
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-[#4EB956] flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                      placeholder="Address"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {company?.address || "—"}
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
                    <input
                      type="text"
                      name="industry"
                      value={form.industry}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                      placeholder="e.g. Information Technology"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">
                      {company?.industry || "—"}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Company Size</p>
                  {isEditing ? (
                    <select
                      name="companySize"
                      value={form.companySize}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                    >
                      {companySizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt || "Select size"}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium text-gray-800">
                      {company?.companySize || "—"}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Founded Year</p>
                  {isEditing ? (
                    <input
                      type="number"
                      name="foundedYear"
                      value={form.foundedYear}
                      onChange={handleInputChange}
                      min="1800"
                      max={new Date().getFullYear()}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-[#4EB956] outline-none"
                      placeholder="e.g. 2015"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">
                      {company?.foundedYear || "—"}
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
                  value={form.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#4EB956] outline-none"
                  placeholder="Describe your company..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {company?.description || "No description provided."}
                </p>
              )}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Social Media
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    key: "linkedin",
                    Icon: FaLinkedin,
                    color: "text-[#0077b5]",
                  },
                  { key: "twitter", Icon: FaTwitter, color: "text-[#1DA1F2]" },
                  {
                    key: "facebook",
                    Icon: FaFacebook,
                    color: "text-[#4267B2]",
                  },
                  {
                    key: "instagram",
                    Icon: FaInstagram,
                    color: "text-[#E4405F]",
                  },
                ].map(({ key, Icon, color }) => (
                  <div
                    key={key}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <Icon className={`${color} flex-shrink-0`} />
                    {isEditing ? (
                      <input
                        type="url"
                        name={`socialLinks.${key}`}
                        value={form.socialLinks[key]}
                        onChange={handleInputChange}
                        className="flex-1 bg-transparent text-sm border-b border-gray-300 focus:border-[#4EB956] outline-none"
                        placeholder={`${key} URL`}
                      />
                    ) : company?.socialLinks?.[key] ? (
                      <a
                        href={company.socialLinks[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-[#4EB956] truncate capitalize"
                      >
                        {key}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400 capitalize">
                        {key}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Media Tab — logo/cover managed inline above; gallery is future scope */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Company Branding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Preview */}
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-3">
                  Company Logo
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white shadow flex items-center justify-center overflow-hidden">
                    {company?.companyLogo ? (
                      <img
                        src={company.companyLogo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-gray-300">
                        {company?.nameCompany?.charAt(0) || "C"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-[#4EB956] transition-all disabled:opacity-60"
                    >
                      {isUploading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaCamera />
                      )}
                      Upload Logo
                    </button>
                    {company?.companyLogo && (
                      <button
                        onClick={handleRemoveLogo}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all disabled:opacity-60"
                      >
                        <FaTrash /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Preview */}
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-3">
                  Cover Image
                </p>
                <div className="w-full h-24 rounded-lg overflow-hidden mb-3 bg-gradient-to-r from-[#1E2558] to-[#4EB956]">
                  {company?.companyCover && (
                    <img
                      src={company.companyCover}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-[#4EB956] transition-all disabled:opacity-60"
                  >
                    {isUploading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaCamera />
                    )}
                    Upload Cover
                  </button>
                  {company?.companyCover && (
                    <button
                      onClick={handleRemoveCover}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all disabled:opacity-60"
                    >
                      <FaTrash /> Remove
                    </button>
                  )}
                </div>
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
            <p className="text-gray-500 text-sm">
              Benefits management coming soon.
            </p>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Leadership Team
            </h3>
            <p className="text-gray-500 text-sm">
              Team management coming soon.
            </p>
          </div>
        )}
      </div>

      {/* Plan Info Banner */}
      {company?.plan && (
        <div className="bg-gradient-to-r from-[#1E2558] to-[#4EB956] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Current Plan:{" "}
                <span className="capitalize">{company.plan.planKey}</span>
              </h3>
              <p className="text-white/80 text-sm">
                Status:{" "}
                <span className="capitalize">{company.plan.planStatus}</span>
                {company.plan.premiumUntil && (
                  <>
                    {" "}
                    · Expires:{" "}
                    {new Date(company.plan.premiumUntil).toLocaleDateString()}
                  </>
                )}{" "}
                · Active job limit: {company.plan.activeJobLimit}
                {company.plan.aiCreditsMonthly != null && (
                  <> · AI credits/mo: {company.plan.aiCreditsMonthly}</>
                )}
              </p>
            </div>
            <button className="px-4 py-2 bg-white text-[#1E2558] rounded-lg hover:shadow-lg transition-all font-medium">
              View Public Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
