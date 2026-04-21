// pages/employer/JobApplications.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaFileAlt,
  FaChevronDown,
  FaFilter,
  FaSortAmountDown,
  FaCalendarAlt,
  FaClock,
  FaUserCheck,
  FaUserTimes,
  FaRegClock,
  FaTimes,
  FaCheck,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaCode,
  FaEllipsisH,
} from "react-icons/fa";
import useJobPostStore from "../../store/jobPostStore";
import useApplicationStore from "../../store/applicationStore";

// ── Status config ─────────────────────────────────────────────────────────────
const APP_STATUS = {
  applied: {
    label: "Applied",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    dot: "bg-blue-400",
    icon: <FaRegClock size={9} />,
  },
  shortlisted: {
    label: "Shortlisted",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    dot: "bg-amber-400",
    icon: <FaStar size={9} />,
  },
  reviewed: {
    label: "Reviewed",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
    dot: "bg-purple-400",
    icon: <FaEye size={9} />,
  },
  hired: {
    label: "Hired",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
    icon: <FaUserCheck size={9} />,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-100",
    dot: "bg-red-400",
    icon: <FaUserTimes size={9} />,
  },
};

// ── Avatar initials generator ─────────────────────────────────────────────────
const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-[#1E2558] to-[#4EB956]",
];

const getAvatarColor = (name = "") => {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

// ── Action Dropdown ───────────────────────────────────────────────────────────
const ActionDropdown = ({ application, onAction }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    {
      key: "view",
      label: "View Profile",
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
            ? "bg-[#1E2558] border-[#1E2558] text-white"
            : "bg-white border-gray-200 text-gray-600 hover:border-[#1E2558]/30 hover:text-[#1E2558]"
        }`}
      >
        Actions
        <FaChevronDown
          size={9}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-30 py-1.5 overflow-hidden">
          {actions.map((action, i) =>
            action.divider ? (
              <div key={i} className="my-1 border-t border-gray-50" />
            ) : (
              <button
                key={action.key}
                onClick={() => {
                  onAction(action.key, application);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-all ${action.color} ${action.hover}`}
              >
                {action.icon}
                {action.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
};

// ── Applicant Row ─────────────────────────────────────────────────────────────
const ApplicantRow = ({ application, index, onAction }) => {
  const name =
    application?.seekerName ||
    application?.seeker?.name ||
    application?.applicantName ||
    "Unknown Applicant";

  const statusKey = application?.status || "applied";
  const statusCfg = APP_STATUS[statusKey] || APP_STATUS.applied;
  const avatarColor = getAvatarColor(name);
  const appliedDate = application?.createdAt || application?.appliedAt;

  return (
    <tr
      className="group hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-transparent transition-all duration-200"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Rank */}
      <td className="px-5 py-4 w-10">
        <span className="text-xs font-bold text-gray-300">#{index + 1}</span>
      </td>

      {/* Applicant */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}
          >
            {getInitials(name)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm">{name}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {application?.seeker?.email && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <FaEnvelope size={8} />
                  {application.seeker.email}
                </span>
              )}
              {application?.source && (
                <span className="text-xs text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  via {application.source}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Current Role */}
      <td className="px-4 py-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-700 font-medium truncate max-w-[160px]">
            {application?.currentTitle ||
              application?.seeker?.currentTitle ||
              application?.jobTitle ||
              "—"}
          </p>
          {(application?.company || application?.seeker?.company) && (
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
              {application?.company || application?.seeker?.company}
            </p>
          )}
        </div>
      </td>

      {/* Skills */}
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {(application?.skills || application?.seeker?.skills || [])
            .slice(0, 3)
            .map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-[#4EB956]/10 text-[#1E2558] rounded-full text-xs font-medium border border-[#4EB956]/20"
              >
                {skill}
              </span>
            ))}
          {(application?.skills || application?.seeker?.skills || []).length >
            3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
              +{(application?.skills || application?.seeker?.skills).length - 3}
            </span>
          )}
          {!(application?.skills || application?.seeker?.skills)?.length && (
            <span className="text-xs text-gray-300 italic">
              No skills listed
            </span>
          )}
        </div>
      </td>

      {/* Status */}
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

      {/* Applied date */}
      <td className="px-4 py-4">
        {appliedDate ? (
          <div>
            <p className="text-xs font-medium text-gray-600">
              {new Date(appliedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {Math.floor(
                (Date.now() - new Date(appliedDate)) / (1000 * 60 * 60 * 24),
              )}{" "}
              days ago
            </p>
          </div>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          {/* Quick shortlist star */}
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

          {/* Download CV quick action */}
          <button
            onClick={() => onAction("download", application)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-[#4EB956] hover:bg-[#4EB956]/10 border border-transparent transition-all duration-200"
            title="Download CV"
          >
            <FaDownload size={12} />
          </button>

          {/* Full action dropdown */}
          <ActionDropdown application={application} onAction={onAction} />
        </div>
      </td>
    </tr>
  );
};

// ── Mobile Applicant Card ─────────────────────────────────────────────────────
const ApplicantCard = ({ application, index, onAction }) => {
  const name =
    application?.seekerName ||
    application?.seeker?.name ||
    application?.applicantName ||
    "Unknown Applicant";

  const statusKey = application?.status || "applied";
  const statusCfg = APP_STATUS[statusKey] || APP_STATUS.applied;
  const avatarColor = getAvatarColor(name);
  const appliedDate = application?.createdAt || application?.appliedAt;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
          >
            {getInitials(name)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-800 text-sm">{name}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {application?.currentTitle || "—"}
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

      {/* Skills */}
      {(application?.skills || application?.seeker?.skills || []).length >
        0 && (
        <div className="flex flex-wrap gap-1">
          {(application?.skills || application?.seeker?.skills || [])
            .slice(0, 4)
            .map((s, i) => (
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
          {appliedDate
            ? `Applied ${Math.floor(
                (Date.now() - new Date(appliedDate)) / (1000 * 60 * 60 * 24),
              )}d ago`
            : ""}
        </p>
        <div className="flex items-center gap-1.5">
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
          <button
            onClick={() => onAction("download", application)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-[#4EB956] hover:bg-[#4EB956]/10 border border-transparent transition-all"
          >
            <FaDownload size={11} />
          </button>
          <ActionDropdown application={application} onAction={onAction} />
        </div>
      </div>
    </div>
  );
};

// ── Job Description Modal ─────────────────────────────────────────────────────
const JobDescModal = ({ job, onClose }) => {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
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
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <FaBriefcase size={10} />
                  <span className="capitalize">
                    {job.jobType.replace(/_/g, " ")}
                  </span>
                </span>
              )}
              {(job.salaryMin || job.salaryMax) && (
                <span className="text-xs font-semibold text-[#4EB956]">
                  {job.salaryMin && job.salaryMax
                    ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
                    : job.salaryMin
                      ? `From $${job.salaryMin.toLocaleString()}`
                      : `Up to $${job.salaryMax.toLocaleString()}`}
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
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {job.jobDescription ? (
            <div
              className="prose prose-sm max-w-none text-gray-600 leading-relaxed
                [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_h3]:mb-2
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:mb-1
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
                [&_strong]:font-semibold [&_strong]:text-gray-800
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#4EB956] [&_blockquote]:pl-4 [&_blockquote]:text-gray-500 [&_blockquote]:italic"
              dangerouslySetInnerHTML={{ __html: job.jobDescription }}
            />
          ) : (
            <p className="text-gray-400 italic text-sm">
              No description provided.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { myJobs, fetchMyJobs } = useJobPostStore();

  // Try to get applications from store — adjust to your actual store
  const applicationStore = (() => {
    try {
      return useApplicationStore();
    } catch {
      return null;
    }
  })();

  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showJobDesc, setShowJobDesc] = useState(false);

  // Derive job from store
  const job = myJobs.find((j) => (j.jobId || j._id) === jobId) || null;

  useEffect(() => {
    if (myJobs.length === 0) fetchMyJobs();
  }, []);

  // Fetch applications — adapt this to your actual API/store call
  useEffect(() => {
    const load = async () => {
      setLoadingApps(true);
      try {
        if (applicationStore?.fetchJobApplications) {
          const result = await applicationStore.fetchJobApplications(jobId);
          if (result?.success) {
            setApplications(result.data || []);
          }
        } else {
          // Fallback: fetch directly
          const { default: axios } = await import("axios");
          const API_URL =
            import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
          const res = await axios.get(`${API_URL}/applications/job/${jobId}`, {
            withCredentials: true,
          });
          if (res.data?.success) setApplications(res.data.data || []);
        }
      } catch (e) {
        console.error("Failed to fetch applications", e);
      } finally {
        setLoadingApps(false);
      }
    };
    if (jobId) load();
  }, [jobId]);

  const handleAction = async (actionKey, application) => {
    const appId = application?.applicationId || application?._id;
    if (actionKey === "view") {
      const seekerId = application?.seekerId || application?.seeker?._id;
      if (seekerId) navigate(`/employer/applicant/${seekerId}`);
      return;
    }
    if (actionKey === "download") {
      const cvUrl = application?.cvUrl || application?.seeker?.cvUrl;
      if (cvUrl) window.open(cvUrl, "_blank");
      else alert("No CV available for this applicant.");
      return;
    }
    // Status updates
    const statusMap = {
      shortlist: "shortlisted",
      hire: "hired",
      reject: "rejected",
    };
    const newStatus = statusMap[actionKey];
    if (!newStatus) return;

    try {
      const { default: axios } = await import("axios");
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
      await axios.patch(
        `${API_URL}/applications/${appId}/status`,
        { status: newStatus },
        { withCredentials: true },
      );
      setApplications((prev) =>
        prev.map((a) =>
          (a.applicationId || a._id) === appId
            ? { ...a, status: newStatus }
            : a,
        ),
      );
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  // Filter
  const statusTabCounts = applications.reduce((acc, a) => {
    acc[a.status || "applied"] = (acc[a.status || "applied"] || 0) + 1;
    return acc;
  }, {});

  const filtered = applications.filter((a) => {
    if (filter !== "all" && (a.status || "applied") !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      const name = (
        a.seekerName ||
        a.seeker?.name ||
        a.applicantName ||
        ""
      ).toLowerCase();
      const title = (
        a.currentTitle ||
        a.seeker?.currentTitle ||
        ""
      ).toLowerCase();
      return name.includes(s) || title.includes(s);
    }
    return true;
  });

  const tabs = [
    { key: "all", label: "All", count: applications.length },
    {
      key: "shortlisted",
      label: "Shortlisted",
      count: statusTabCounts.shortlisted || 0,
    },
    { key: "applied", label: "Applied", count: statusTabCounts.applied || 0 },
    {
      key: "reviewed",
      label: "Reviewed",
      count: statusTabCounts.reviewed || 0,
    },
    { key: "hired", label: "Hired", count: statusTabCounts.hired || 0 },
    {
      key: "rejected",
      label: "Rejected",
      count: statusTabCounts.rejected || 0,
    },
  ].filter((t) => t.key === "all" || t.count > 0);

  return (
    <div className="space-y-6">
      {showJobDesc && (
        <JobDescModal job={job} onClose={() => setShowJobDesc(false)} />
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Top gradient stripe */}
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
                      <FaBriefcase size={10} />
                      {job.jobType.replace(/_/g, " ")}
                    </span>
                  )}
                  {job?.endDate && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <FaClock size={10} />
                      Closes{" "}
                      {new Date(job.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* View Description button only */}
            <button
              onClick={() => setShowJobDesc(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-[#1E2558]/30 hover:text-[#1E2558] font-medium transition-all"
            >
              <FaFileAlt size={12} />
              View Job Description
            </button>
          </div>

          {/* Stats row */}
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
                value: statusTabCounts.shortlisted || 0,
                icon: <FaStar size={13} />,
                color: "text-amber-500",
                bg: "bg-amber-50",
              },
              {
                label: "Hired",
                value: statusTabCounts.hired || 0,
                icon: <FaUserCheck size={13} />,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Rejected",
                value: statusTabCounts.rejected || 0,
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
                  <p className="text-xl font-bold text-gray-800 leading-tight">
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

      {/* ── Filter & Search ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        {/* Status tabs */}
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

        {/* Search */}
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

      {/* ── Desktop Table ───────────────────────────────────────────────────── */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loadingApps ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-[#4EB956] text-3xl mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading applicants...</p>
            </div>
          </div>
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

      {/* ── Mobile Cards ────────────────────────────────────────────────────── */}
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
              index={i}
              onAction={handleAction}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default JobApplications;
