// pages/employer/JobApplications.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUsers,
  FaSearch,
  FaDownload,
  FaEye,
  FaStar,
  FaRegStar,
  FaSpinner,
  FaUserCheck,
  FaUserTimes,
  FaFileAlt,
  FaChevronDown,
  FaClock,
  FaRegClock,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCode,
  FaGlobe,
  FaBirthdayCake,
  FaVenusMars,
  FaLanguage,
  FaHeart,
  FaBriefcase as FaWork,
  FaMapPin,
  FaCheckCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import useJobPostStore from "../../store/jobPostStore";
import useAuthStore from "../../store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// ── Auth helper (axios config with Bearer token) ───────────────────────────
const getAuthConfig = (extra = {}) => {
  const { getBearerToken } = useAuthStore.getState();
  const token = getBearerToken();
  return {
    withCredentials: true,
    ...extra,
    headers: {
      ...(extra.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// ── Status config ─────────────────────────────────────────────────────────────
const APP_STATUS = {
  applied: {
    label: "Applied",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    dot: "bg-blue-400",
    icon: <FaRegClock size={9} />,
    gradient: "from-blue-500 to-blue-600",
  },
  shortlisted: {
    label: "Shortlisted",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    dot: "bg-amber-400",
    icon: <FaStar size={9} />,
    gradient: "from-amber-400 to-orange-500",
  },
  reviewed: {
    label: "Reviewed",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    dot: "bg-purple-400",
    icon: <FaEye size={9} />,
    gradient: "from-purple-500 to-purple-600",
  },
  hired: {
    label: "Hired",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: <FaUserCheck size={9} />,
    gradient: "from-emerald-500 to-teal-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-200",
    dot: "bg-red-400",
    icon: <FaUserTimes size={9} />,
    gradient: "from-red-400 to-rose-500",
  },
};

// ── Avatar helpers ────────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-[#1E2558] to-[#4EB956]",
];

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase() || "??";
};

const getAvatarGradient = (name = "") =>
  AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];

// ── Seeker Profile Drawer ─────────────────────────────────────────────────────
const SeekerDrawer = ({ seeker, application, onClose, onAction }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const statusKey = application?.status || "applied";
  const statusCfg = APP_STATUS[statusKey] || APP_STATUS.applied;

  if (!seeker) return null;

  const info = seeker.personalInfo || {};
  const name =
    info.name || info.firstName
      ? `${info.firstName || ""} ${info.lastName || ""}`.trim()
      : "Unknown Applicant";
  const avatarGradient = getAvatarGradient(name);

  const proficiencyColor = (p) =>
    ({
      native: "bg-emerald-500",
      fluent: "bg-blue-500",
      advanced: "bg-violet-500",
      intermediate: "bg-amber-500",
      beginner: "bg-gray-400",
    })[p] || "bg-gray-400";

  const proficiencyWidth = (p) =>
    ({
      native: "100%",
      fluent: "85%",
      advanced: "70%",
      intermediate: "55%",
      beginner: "30%",
    })[p] || "40%";

  const skillDots = (p) =>
    ({ expert: 5, advanced: 4, intermediate: 3, beginner: 2, basic: 1 })[p] ||
    3;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn .2s ease" }}
      />

      {/* Panel */}
      <div
        className="w-full max-w-xl bg-white flex flex-col shadow-2xl overflow-hidden"
        style={{ animation: "slideIn .3s cubic-bezier(.16,1,.3,1)" }}
      >
        {/* ─ Hero Header ─ */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1E2558] to-[#0f143a] flex-shrink-0">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-[#4EB956]/20" />

          <div className="relative px-6 pt-6 pb-5">
            <div className="flex items-start justify-between mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${statusCfg.gradient} text-white shadow-sm`}
              >
                {statusCfg.icon} {statusCfg.label}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                <FaTimes size={12} />
              </button>
            </div>

            <div className="flex items-end gap-4">
              {seeker.profileImage ? (
                <img
                  src={seeker.profileImage}
                  alt={name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg flex-shrink-0"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg`}
                >
                  {getInitials(name)}
                </div>
              )}
              <div className="min-w-0 mb-1">
                <h2 className="text-lg font-bold text-white leading-tight">
                  {name}
                </h2>
                <p className="text-white/60 text-xs mt-0.5">
                  {info.careerLevel ||
                    seeker.experience?.[0]?.jobTitle ||
                    "Professional"}
                </p>
                {(info.city || info.country) && (
                  <p className="flex items-center gap-1 text-white/50 text-xs mt-1">
                    <FaMapMarkerAlt size={9} />
                    {[info.city, info.country].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Quick pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {info.email && (
                <a
                  href={`mailto:${info.email}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-xs transition-all"
                >
                  <FaEnvelope size={9} /> {info.email}
                </a>
              )}
              {info.mobile && (
                <a
                  href={`tel:${info.mobile}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-xs transition-all"
                >
                  <FaPhone size={9} /> {info.mobile}
                </a>
              )}
              {seeker.profileCompletion && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#4EB956]/20 rounded-lg text-[#4EB956] text-xs font-semibold">
                  <FaCheckCircle size={9} /> {seeker.profileCompletion}%
                  Complete
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-white/10 px-2">
            {["overview", "experience", "skills", "projects"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-semibold capitalize transition-all border-b-2 ${
                  activeTab === tab
                    ? "text-[#4EB956] border-[#4EB956]"
                    : "text-white/40 border-transparent hover:text-white/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ─ Tab Content ─ */}
        <div className="flex-1 overflow-y-auto">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="p-6 space-y-5">
              {seeker.summary && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Summary
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                    {seeker.summary}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      icon: <FaVenusMars size={10} />,
                      label: "Gender",
                      value: info.gender,
                    },
                    {
                      icon: <FaHeart size={10} />,
                      label: "Status",
                      value: info.maritalStatus,
                    },
                    {
                      icon: <FaGlobe size={10} />,
                      label: "Nationality",
                      value: info.nationality,
                    },
                    {
                      icon: <FaBirthdayCake size={10} />,
                      label: "DOB",
                      value: info.dob
                        ? `${info.dob.day ?? ""} ${info.dob.month ?? ""} ${info.dob.year ?? ""}`.trim()
                        : null,
                    },
                    {
                      icon: <FaMapPin size={10} />,
                      label: "Address",
                      value: info.postalAddress,
                    },
                    {
                      icon: <FaWork size={10} />,
                      label: "Career Level",
                      value: info.careerLevel,
                    },
                  ]
                    .filter((d) => d.value)
                    .map((d, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#1E2558]/8 flex items-center justify-center text-[#1E2558] flex-shrink-0 mt-0.5">
                          {d.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400">{d.label}</p>
                          <p className="text-xs font-semibold text-gray-700 mt-0.5 truncate">
                            {d.value}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {seeker.languages?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Languages
                  </h3>
                  <div className="space-y-2">
                    {seeker.languages.map((lang, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-28 flex-shrink-0">
                          <div
                            className={`w-2 h-2 rounded-full ${proficiencyColor(lang.proficiency)}`}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {lang.language}
                          </span>
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${proficiencyColor(lang.proficiency)} transition-all duration-700`}
                            style={{
                              width: proficiencyWidth(lang.proficiency),
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 capitalize w-20 text-right">
                          {lang.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {seeker.jobPreferences && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Job Preferences
                  </h3>
                  <div className="bg-gradient-to-br from-[#1E2558]/5 to-[#4EB956]/5 rounded-xl p-4 border border-[#4EB956]/20 space-y-3">
                    {seeker.jobPreferences.preferredTitles?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1.5">
                          Preferred Roles
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {seeker.jobPreferences.preferredTitles.map((t, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-[#1E2558] text-white rounded-lg text-xs font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(seeker.jobPreferences.salaryMin ||
                      seeker.jobPreferences.salaryMax) && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          Expected Salary
                        </p>
                        <p className="text-sm font-bold text-[#1E2558]">
                          {seeker.jobPreferences.currency}{" "}
                          {seeker.jobPreferences.salaryMin?.toLocaleString()} –{" "}
                          {seeker.jobPreferences.salaryMax?.toLocaleString()}
                          <span className="text-xs font-normal text-gray-400 ml-1">
                            / {seeker.jobPreferences.salaryRangeKey}
                          </span>
                        </p>
                      </div>
                    )}
                    {seeker.jobPreferences.preferredLocations?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1.5">
                          Preferred Locations
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {seeker.jobPreferences.preferredLocations.map(
                            (loc, i) => (
                              <span
                                key={i}
                                className="flex items-center gap-1 px-2 py-0.5 bg-white text-gray-600 rounded-lg text-xs border border-gray-200"
                              >
                                <FaMapMarkerAlt size={8} /> {loc}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                    {seeker.jobPreferences.noticePeriodDays && (
                      <p className="text-xs text-gray-500">
                        Notice Period:{" "}
                        <span className="font-semibold text-gray-700">
                          {seeker.jobPreferences.noticePeriodDays} days
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Resume assets */}
              {seeker.resumeAssets?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Resume Assets
                  </h3>
                  <div className="space-y-2">
                    {seeker.resumeAssets.map((asset, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <FaFileAlt className="text-[#1E2558]" size={13} />
                          <span className="text-xs font-medium text-gray-700 capitalize">
                            {asset.type === "resume_file"
                              ? "Resume PDF"
                              : asset.type === "resume_video"
                                ? "Video Resume"
                                : "Profile Photo"}
                          </span>
                          {asset.isActive && (
                            <span className="px-1.5 py-0.5 bg-[#4EB956]/10 text-[#4EB956] rounded text-xs font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        {asset.url && (
                          <a
                            href={asset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-lg bg-[#1E2558]/8 hover:bg-[#1E2558] hover:text-white flex items-center justify-center text-[#1E2558] transition-all"
                          >
                            <FaExternalLinkAlt size={10} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Experience */}
          {activeTab === "experience" && (
            <div className="p-6 space-y-5">
              {seeker.experience?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Work Experience
                  </h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#4EB956] via-[#4EB956]/30 to-transparent" />
                    <div className="space-y-4 pl-10">
                      {seeker.experience.map((exp, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[26px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#4EB956] shadow-sm shadow-[#4EB956]/30" />
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-[#4EB956]/30 transition-all">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-bold text-gray-800">
                                  {exp.jobTitle}
                                </p>
                                <p className="text-xs text-[#1E2558] font-semibold mt-0.5">
                                  {exp.company}
                                </p>
                              </div>
                              {exp.isCurrent && (
                                <span className="px-2 py-0.5 bg-[#4EB956]/10 text-[#4EB956] text-xs font-bold rounded-full border border-[#4EB956]/20 flex-shrink-0">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">
                              {exp.startMonth}/{exp.startYear} –{" "}
                              {exp.isCurrent
                                ? "Present"
                                : `${exp.endMonth}/${exp.endYear}`}
                            </p>
                            {exp.description && (
                              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {seeker.education?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Education
                  </h3>
                  <div className="space-y-3">
                    {seeker.education.map((edu, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 transition-all"
                      >
                        <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-500 flex-shrink-0">
                          <FaGraduationCap size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800">
                            {edu.degree}
                          </p>
                          <p className="text-xs text-violet-600 font-medium">
                            {edu.institute}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {edu.field} · Grade: {edu.grade}
                          </p>
                          <p className="text-xs text-gray-400">
                            {edu.startDate
                              ? new Date(edu.startDate).getFullYear()
                              : ""}{" "}
                            –{" "}
                            {edu.endDate
                              ? new Date(edu.endDate).getFullYear()
                              : "Present"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!seeker.experience?.length && !seeker.education?.length && (
                <div className="text-center py-10 text-gray-300">
                  <FaBriefcase size={32} className="mx-auto mb-2" />
                  <p className="text-sm">No experience or education listed</p>
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          {activeTab === "skills" && (
            <div className="p-6 space-y-5">
              {seeker.skills?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Technical Skills
                  </h3>
                  <div className="space-y-3">
                    {seeker.skills.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[#1E2558]/8 flex items-center justify-center">
                            <FaCode size={10} className="text-[#1E2558]" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {s.skill}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {Array.from({ length: 5 }).map((_, dot) => (
                            <div
                              key={dot}
                              className={`w-2 h-2 rounded-full transition-all ${dot < skillDots(s.proficiency) ? "bg-[#4EB956]" : "bg-gray-200"}`}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-1 capitalize">
                            {s.proficiency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {seeker.jobPreferences?.preferredSkills?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Also Skilled In
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {seeker.jobPreferences.preferredSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#1E2558]/8 to-[#4EB956]/8 text-[#1E2558] rounded-xl text-xs font-semibold border border-[#4EB956]/20 hover:border-[#4EB956]/50 transition-all"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!seeker.skills?.length &&
                !seeker.jobPreferences?.preferredSkills?.length && (
                  <div className="text-center py-8 text-gray-300">
                    <FaCode size={32} className="mx-auto mb-2" />
                    <p className="text-sm">No skills listed</p>
                  </div>
                )}
            </div>
          )}

          {/* Projects */}
          {activeTab === "projects" && (
            <div className="p-6 space-y-4">
              {seeker.projects?.length > 0 ? (
                seeker.projects.map((proj, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-100 overflow-hidden hover:border-[#4EB956]/30 transition-all group"
                  >
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-gray-800">
                          {proj.title}
                        </p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-7 h-7 rounded-lg bg-[#4EB956]/10 flex items-center justify-center text-[#4EB956] hover:bg-[#4EB956] hover:text-white transition-all"
                            >
                              <FaExternalLinkAlt size={10} />
                            </a>
                          )}
                          {proj.repoUrl && (
                            <a
                              href={proj.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-7 h-7 rounded-lg bg-[#1E2558]/8 flex items-center justify-center text-[#1E2558] hover:bg-[#1E2558] hover:text-white transition-all"
                            >
                              <FaCode size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                      {proj.description && (
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                          {proj.description}
                        </p>
                      )}
                    </div>
                    {proj.techStack?.length > 0 && (
                      <div className="px-4 py-3 bg-white border-t border-gray-100 flex flex-wrap gap-1.5">
                        {proj.techStack.map((tech, j) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 bg-[#1E2558]/6 text-[#1E2558] rounded-md text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-300">
                  <FaCode size={32} className="mx-auto mb-2" />
                  <p className="text-sm">No projects listed</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─ Footer Actions ─ */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50/50 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onAction("shortlist", application)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 justify-center border ${
                application?.status === "shortlisted"
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600"
              }`}
            >
              {application?.status === "shortlisted" ? (
                <FaStar size={11} />
              ) : (
                <FaRegStar size={11} />
              )}
              {application?.status === "shortlisted"
                ? "Shortlisted"
                : "Shortlist"}
            </button>
            <button
              onClick={() => onAction("hire", application)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex-1 justify-center"
            >
              <FaUserCheck size={11} /> Hire
            </button>
            <button
              onClick={() => onAction("reject", application)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-red-500 border border-red-200 hover:bg-red-50 transition-all flex-1 justify-center"
            >
              <FaUserTimes size={11} /> Reject
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </div>
  );
};

// ── Action Dropdown ───────────────────────────────────────────────────────────
const ActionDropdown = ({ application, onAction }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const actions = [
    {
      key: "view",
      label: "View Full Profile",
      icon: <FaEye size={11} />,
      color: "text-[#1E2558]",
      hover: "hover:bg-[#1E2558]/5",
    },
    {
      key: "download",
      label: "Download CV",
      icon: <FaDownload size={11} />,
      color: "text-gray-600",
      hover: "hover:bg-gray-50",
    },
    { divider: true },
    {
      key: "shortlist",
      label: "Shortlist",
      icon: <FaStar size={11} />,
      color: "text-amber-500",
      hover: "hover:bg-amber-50",
      hide: application?.status === "shortlisted",
    },
    {
      key: "hire",
      label: "Mark as Hired",
      icon: <FaUserCheck size={11} />,
      color: "text-emerald-600",
      hover: "hover:bg-emerald-50",
      hide: application?.status === "hired",
    },
    {
      key: "reject",
      label: "Reject",
      icon: <FaUserTimes size={11} />,
      color: "text-red-500",
      hover: "hover:bg-red-50",
      hide: application?.status === "rejected",
    },
  ].filter((a) => !a.hide);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
          open
            ? "bg-[#1E2558] border-[#1E2558] text-white shadow-sm"
            : "bg-white border-gray-200 text-gray-600 hover:border-[#1E2558]/40 hover:text-[#1E2558]"
        }`}
      >
        Actions
        <FaChevronDown
          size={9}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 py-1.5 overflow-hidden"
          style={{ animation: "dropIn .15s cubic-bezier(.16,1,.3,1)" }}
        >
          {actions.map((action, i) =>
            action.divider ? (
              <div key={i} className="my-1.5 border-t border-gray-50 mx-2" />
            ) : (
              <button
                key={action.key}
                onClick={() => {
                  onAction(action.key, application);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-all ${action.color} ${action.hover}`}
              >
                <span className="w-5 h-5 rounded-md bg-current/10 flex items-center justify-center flex-shrink-0">
                  {action.icon}
                </span>
                {action.label}
              </button>
            ),
          )}
        </div>
      )}
      <style>{`@keyframes dropIn { from { opacity:0; transform:translateY(-6px) scale(.97) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
};

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-5 py-4">
      <div className="w-6 h-3 bg-gray-100 rounded" />
    </td>
    <td className="px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex-shrink-0" />
        <div className="space-y-1.5">
          <div className="w-28 h-3 bg-gray-100 rounded" />
          <div className="w-20 h-2.5 bg-gray-100 rounded" />
        </div>
      </div>
    </td>
    <td className="px-4 py-4">
      <div className="w-24 h-3 bg-gray-100 rounded" />
    </td>
    <td className="px-4 py-4">
      <div className="w-32 h-5 bg-gray-100 rounded-full" />
    </td>
    <td className="px-4 py-4">
      <div className="w-20 h-5 bg-gray-100 rounded-full" />
    </td>
    <td className="px-4 py-4">
      <div className="w-16 h-3 bg-gray-100 rounded" />
    </td>
    <td className="px-4 py-4">
      <div className="w-20 h-7 bg-gray-100 rounded-xl" />
    </td>
  </tr>
);

// ── Applicant Row ─────────────────────────────────────────────────────────────
const ApplicantRow = ({ application, index, onAction, onViewProfile }) => {
  const seeker = application._seekerData;
  const info = seeker?.personalInfo || {};
  const name = info.name
    ? info.name
    : info.firstName
      ? `${info.firstName} ${info.lastName || ""}`.trim()
      : "—";

  const statusKey = application?.status || "applied";
  const statusCfg = APP_STATUS[statusKey] || APP_STATUS.applied;
  const avatarGradient = getAvatarGradient(name);
  const skills =
    seeker?.skills?.map((s) => s.skill) ||
    seeker?.jobPreferences?.preferredSkills ||
    [];
  const isLoading = application._loadingSeeker;

  return (
    <tr className="group hover:bg-gradient-to-r hover:from-[#4EB956]/5 hover:to-transparent transition-all duration-200">
      <td className="px-5 py-4 w-10">
        <span className="text-xs font-bold text-gray-300">#{index + 1}</span>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-10 h-10 rounded-2xl bg-gray-100 animate-pulse flex-shrink-0" />
          ) : seeker?.profileImage ? (
            <img
              src={seeker.profileImage}
              alt={name}
              className="w-10 h-10 rounded-2xl object-cover shadow-sm flex-shrink-0"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" size={12} />
              ) : (
                getInitials(name)
              )}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm">{name}</p>
            {info.email && (
              <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <FaEnvelope size={8} /> {info.email}
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="text-sm text-gray-700 font-medium truncate max-w-[160px]">
          {seeker?.experience?.[0]?.jobTitle ||
            info.careerLevel ||
            (isLoading ? "Loading…" : "—")}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
          {seeker?.experience?.[0]?.company || ""}
        </p>
      </td>

      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-[#4EB956]/10 text-[#1E2558] rounded-full text-xs font-medium border border-[#4EB956]/20"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
              +{skills.length - 3}
            </span>
          )}
          {!skills.length && !isLoading && (
            <span className="text-xs text-gray-300 italic">No skills</span>
          )}
        </div>
      </td>

      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusCfg.dot}`}
          />
          {statusCfg.icon}
          {statusCfg.label}
        </span>
      </td>

      <td className="px-4 py-4">
        {application.createdAt ? (
          <div>
            <p className="text-xs font-medium text-gray-600">
              {new Date(application.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {Math.floor(
                (Date.now() - new Date(application.createdAt)) / 86400000,
              )}
              d ago
            </p>
          </div>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewProfile(application)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-[#1E2558] hover:bg-[#1E2558]/8 border border-transparent transition-all duration-200"
            title="View Profile"
          >
            <FaEye size={13} />
          </button>
          <button
            onClick={() =>
              onAction(
                application?.status === "shortlisted" ? "applied" : "shortlist",
                application,
              )
            }
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
              application?.status === "shortlisted"
                ? "bg-amber-50 text-amber-400 border border-amber-200"
                : "text-gray-300 hover:text-amber-400 hover:bg-amber-50 border border-transparent"
            }`}
            title={
              application?.status === "shortlisted"
                ? "Remove shortlist"
                : "Shortlist"
            }
          >
            {application?.status === "shortlisted" ? (
              <FaStar size={13} />
            ) : (
              <FaRegStar size={13} />
            )}
          </button>
          <ActionDropdown application={application} onAction={onAction} />
        </div>
      </td>
    </tr>
  );
};

// ── Mobile Card ───────────────────────────────────────────────────────────────
const ApplicantCard = ({ application, onAction, onViewProfile }) => {
  const seeker = application._seekerData;
  const info = seeker?.personalInfo || {};
  const name =
    info.name ||
    (info.firstName
      ? `${info.firstName} ${info.lastName || ""}`.trim()
      : "Unknown Applicant");
  const statusCfg =
    APP_STATUS[application?.status || "applied"] || APP_STATUS.applied;
  const skills =
    seeker?.skills?.map((s) => s.skill) ||
    seeker?.jobPreferences?.preferredSkills ||
    [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 hover:border-[#4EB956]/30 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex items-center gap-3 min-w-0 cursor-pointer"
          onClick={() => onViewProfile(application)}
        >
          {seeker?.profileImage ? (
            <img
              src={seeker.profileImage}
              alt={name}
              className="w-11 h-11 rounded-2xl object-cover flex-shrink-0"
            />
          ) : (
            <div
              className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${getAvatarGradient(name)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
            >
              {application._loadingSeeker ? (
                <FaSpinner className="animate-spin" size={12} />
              ) : (
                getInitials(name)
              )}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-gray-800 text-sm">{name}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {seeker?.experience?.[0]?.jobTitle || info.careerLevel || "—"}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </span>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 4).map((s, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-[#4EB956]/10 text-[#1E2558] rounded-full text-xs font-medium border border-[#4EB956]/20"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {application.createdAt
            ? `Applied ${Math.floor((Date.now() - new Date(application.createdAt)) / 86400000)}d ago`
            : ""}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onViewProfile(application)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-[#1E2558] hover:bg-[#1E2558]/8 border border-transparent transition-all"
          >
            <FaEye size={12} />
          </button>
          <button
            onClick={() => onAction("shortlist", application)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              application?.status === "shortlisted"
                ? "bg-amber-50 text-amber-400 border border-amber-200"
                : "text-gray-300 hover:text-amber-400 hover:bg-amber-50 border border-transparent"
            }`}
          >
            {application?.status === "shortlisted" ? (
              <FaStar size={12} />
            ) : (
              <FaRegStar size={12} />
            )}
          </button>
          <ActionDropdown application={application} onAction={onAction} />
        </div>
      </div>
    </div>
  );
};

// ── Job Desc Modal ────────────────────────────────────────────────────────────
const JobDescModal = ({ job, onClose }) => {
  if (!job) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ animation: "fadeIn .2s ease" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        style={{ animation: "scaleIn .2s cubic-bezier(.16,1,.3,1)" }}
      >
        <div className="h-1 bg-gradient-to-r from-[#1E2558] via-[#4EB956] to-[#1E2558]" />
        <div className="px-7 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{job.jobTitle}</h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {job.jobLocation && (
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <FaMapMarkerAlt size={10} /> {job.jobLocation}
                </span>
              )}
              {job.jobType && (
                <span className="flex items-center gap-1.5 text-xs text-gray-400 capitalize">
                  <FaBriefcase size={10} /> {job.jobType.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all flex-shrink-0"
          >
            <FaTimes size={13} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {job.jobDescription ? (
            <div
              className="prose prose-sm max-w-none text-gray-600 leading-relaxed [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: job.jobDescription }}
            />
          ) : (
            <p className="text-gray-400 italic text-sm">
              No description provided.
            </p>
          )}
        </div>
      </div>
      <style>{`@keyframes scaleIn { from { opacity:0; transform:scale(.95) } to { opacity:1; transform:scale(1) } }`}</style>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const JobApplications = () => {
  const { jobId } = useParams();
  const { myJobs, fetchMyJobs } = useJobPostStore();

  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showJobDesc, setShowJobDesc] = useState(false);
  const [drawerApp, setDrawerApp] = useState(null);

  const job = myJobs.find((j) => (j.jobId || j._id) === jobId) || null;

  useEffect(() => {
    if (myJobs.length === 0) fetchMyJobs();
  }, []);

  // ── Fetch seeker profile via dedicated endpoint ────────────────────────────
  const fetchSeekerProfile = useCallback(async (seekerUserId) => {
    if (!seekerUserId) return null;
    try {
      const res = await axios.get(
        `${API_URL}/applications/seeker-profile/${seekerUserId}`,
        getAuthConfig(),
      );
      if (res.data?.success) return res.data.data;
      return null;
    } catch (e) {
      console.warn("seeker-profile fetch failed:", e?.response?.status);
      return null;
    }
  }, []);

  // ── Load applications then enrich in parallel ──────────────────────────────
  useEffect(() => {
    if (!jobId) return;

    const load = async () => {
      setLoadingApps(true);
      let apps = [];

      try {
        const res = await axios.get(
          `${API_URL}/applications/job/${jobId}`,
          getAuthConfig(),
        );
        if (res.data?.success) {
          apps = Array.isArray(res.data.data) ? res.data.data : [];
        }
      } catch (e) {
        console.error("Failed to fetch applications:", e);
      }

      // Seed with loading state
      setApplications(
        apps.map((a) => ({ ...a, _seekerData: null, _loadingSeeker: true })),
      );
      setLoadingApps(false);

      // Enrich each application with seeker profile concurrently
      apps.forEach(async (app) => {
        const uid = app.seekerUserId || app.seekerId;
        const appKey = app.applicationId || app._id;
        if (!uid) {
          setApplications((prev) =>
            prev.map((a) =>
              (a.applicationId || a._id) === appKey
                ? { ...a, _loadingSeeker: false }
                : a,
            ),
          );
          return;
        }

        const seekerData = await fetchSeekerProfile(uid);

        setApplications((prev) =>
          prev.map((a) =>
            (a.applicationId || a._id) === appKey
              ? { ...a, _seekerData: seekerData, _loadingSeeker: false }
              : a,
          ),
        );
      });
    };

    load();
  }, [jobId, fetchSeekerProfile]);

  // ── Status update ──────────────────────────────────────────────────────────
  const handleAction = async (actionKey, application) => {
    const appId = application?.applicationId || application?._id;

    if (actionKey === "view") {
      setDrawerApp(application);
      return;
    }

    if (actionKey === "download") {
      const assets = application?._seekerData?.resumeAssets || [];
      const resumeFile = assets.find((a) => a.type === "resume_file" && a.url);
      const cvUrl = resumeFile?.url || application?.resumeFileUrl;
      if (cvUrl) window.open(cvUrl, "_blank");
      else alert("No CV available for this applicant.");
      return;
    }

    const statusMap = {
      shortlist: "shortlisted",
      hire: "hired",
      reject: "rejected",
    };
    const newStatus = statusMap[actionKey];
    if (!newStatus) return;

    try {
      await axios.patch(
        `${API_URL}/applications/${appId}/status`,
        { status: newStatus },
        getAuthConfig(),
      );
      setApplications((prev) =>
        prev.map((a) =>
          (a.applicationId || a._id) === appId
            ? { ...a, status: newStatus }
            : a,
        ),
      );
      if (drawerApp && (drawerApp.applicationId || drawerApp._id) === appId) {
        setDrawerApp((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const statusCounts = applications.reduce((acc, a) => {
    acc[a.status || "applied"] = (acc[a.status || "applied"] || 0) + 1;
    return acc;
  }, {});

  const filtered = applications.filter((a) => {
    if (filter !== "all" && (a.status || "applied") !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const info = a._seekerData?.personalInfo || {};
      const name = (
        info.name || `${info.firstName || ""} ${info.lastName || ""}`.trim()
      ).toLowerCase();
      const role = (
        a._seekerData?.experience?.[0]?.jobTitle || ""
      ).toLowerCase();
      return name.includes(q) || role.includes(q);
    }
    return true;
  });

  const tabs = [
    { key: "all", label: "All", count: applications.length },
    {
      key: "shortlisted",
      label: "Shortlisted",
      count: statusCounts.shortlisted || 0,
    },
    { key: "applied", label: "Applied", count: statusCounts.applied || 0 },
    { key: "reviewed", label: "Reviewed", count: statusCounts.reviewed || 0 },
    { key: "hired", label: "Hired", count: statusCounts.hired || 0 },
    { key: "rejected", label: "Rejected", count: statusCounts.rejected || 0 },
  ].filter((t) => t.key === "all" || t.count > 0);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Seeker Drawer */}
      {drawerApp && (
        <SeekerDrawer
          seeker={drawerApp._seekerData}
          application={drawerApp}
          onClose={() => setDrawerApp(null)}
          onAction={handleAction}
        />
      )}

      {/* Job Desc Modal */}
      {showJobDesc && (
        <JobDescModal job={job} onClose={() => setShowJobDesc(false)} />
      )}

      {/* ── Header card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#1E2558] via-[#4EB956] to-[#1E2558]" />
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <Link
                to="/employer/jobs"
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#1E2558] transition-all flex-shrink-0 mt-0.5"
              >
                <FaArrowLeft size={13} />
              </Link>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-800">
                    {job?.jobTitle || "Job Applications"}
                  </h1>
                  {job?.status && (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        job.status === "published"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                  {job?.jobLocation && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <FaMapMarkerAlt size={10} /> {job.jobLocation}
                    </span>
                  )}
                  {job?.jobType && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 capitalize">
                      <FaBriefcase size={10} /> {job.jobType.replace(/_/g, " ")}
                    </span>
                  )}
                  {job?.endDate && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <FaClock size={10} /> Closes{" "}
                      {new Date(job.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowJobDesc(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-[#1E2558]/30 hover:text-[#1E2558] font-medium transition-all"
            >
              <FaFileAlt size={12} /> View Job Description
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              {
                label: "Total Applicants",
                value: applications.length,
                icon: <FaUsers size={13} />,
                color: "text-[#1E2558]",
                bg: "bg-[#1E2558]/8",
              },
              {
                label: "Shortlisted",
                value: statusCounts.shortlisted || 0,
                icon: <FaStar size={13} />,
                color: "text-amber-500",
                bg: "bg-amber-50",
              },
              {
                label: "Hired",
                value: statusCounts.hired || 0,
                icon: <FaUserCheck size={13} />,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Rejected",
                value: statusCounts.rejected || 0,
                icon: <FaUserTimes size={13} />,
                color: "text-red-500",
                bg: "bg-red-50",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 bg-gray-50/60 rounded-xl px-4 py-3 border border-gray-100"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.color} flex-shrink-0`}
                >
                  {s.icon}
                </div>
                <div>
                  <p
                    className={`text-xl font-bold text-gray-800 leading-tight`}
                  >
                    {loadingApps ? (
                      <FaSpinner className="animate-spin text-sm text-gray-300" />
                    ) : (
                      s.value
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter & Search ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const cfg = tab.key !== "all" ? APP_STATUS[tab.key] : null;
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cfg && !isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                )}
                {tab.label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search by name or current role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loadingApps ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <th className="px-5 py-3 w-10" />
                {[
                  "Applicant",
                  "Current Role",
                  "Skills",
                  "Status",
                  "Applied",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...Array(3)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
              <FaUsers className="text-gray-300 text-2xl" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              {applications.length === 0
                ? "No applications yet"
                : "No results found"}
            </h3>
            <p className="text-gray-400 text-sm">
              {applications.length === 0
                ? "Share your job to attract candidates."
                : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <th className="px-5 py-3 w-10" />
                  {[
                    "Applicant",
                    "Current Role",
                    "Skills",
                    "Status",
                    "Applied",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((app, i) => (
                  <ApplicantRow
                    key={app.applicationId || app._id || i}
                    application={app}
                    index={i}
                    onAction={handleAction}
                    onViewProfile={(a) => setDrawerApp(a)}
                  />
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/30">
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600">
                  {applications.length}
                </span>{" "}
                applicants
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Mobile Cards ── */}
      <div className="lg:hidden space-y-3">
        {loadingApps ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-[#4EB956] text-2xl" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <FaUsers className="text-gray-300 text-3xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No applicants found</p>
          </div>
        ) : (
          filtered.map((app, i) => (
            <ApplicantCard
              key={app.applicationId || app._id || i}
              application={app}
              onAction={handleAction}
              onViewProfile={(a) => setDrawerApp(a)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default JobApplications;
