// pages/employer/PostedJobs.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaFileAlt,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronDown,
} from "react-icons/fa";
import useJobPostStore from "../../store/jobPostStore";

// ── Status display config ─────────────────────────────────────────────────────
const getStatusConfig = (status) => {
  switch (status) {
    case "published":
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        dot: "bg-green-500",
        label: "Published",
      };
    case "pending":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-400",
        label: "Pending",
      };
    case "draft":
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
        dot: "bg-gray-400",
        label: "Draft",
      };
    case "expired":
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        dot: "bg-orange-400",
        label: "Expired",
      };
    case "closed":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-400",
        label: "Closed",
      };
    case "rejected":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
        label: "Rejected",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
        dot: "bg-gray-400",
        label: status,
      };
  }
};

// ── Only draft / pending / published are employer-changeable ──────────────────
// closed / rejected / expired are set by system or admin — show as read-only badge
const CHANGEABLE_STATUSES = [
  { value: "draft", label: "Draft", dot: "bg-gray-400" },
  { value: "pending", label: "Pending", dot: "bg-amber-400" },
  { value: "published", label: "Published", dot: "bg-green-500" },
];
const READONLY_STATUSES = ["closed", "rejected", "expired"];

// ── StatusSelector ────────────────────────────────────────────────────────────
const StatusSelector = ({ job, jobId, isActionLoading, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cfg = getStatusConfig(job.status);
  const isReadonly = READONLY_STATUSES.includes(job.status);

  // Read-only statuses: just a badge, no interaction
  if (isReadonly) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </span>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        disabled={isActionLoading}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:shadow-sm disabled:opacity-50 cursor-pointer ${cfg.bg} ${cfg.text} ${cfg.border}`}
      >
        {isActionLoading ? (
          <FaSpinner size={9} className="animate-spin" />
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        )}
        {cfg.label}
        <FaChevronDown
          size={8}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-30 py-1.5 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 pb-1.5 pt-0.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
            Change Status
          </p>
          {CHANGEABLE_STATUSES.map((opt) => {
            const isCurrent = job.status === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onStatusChange(jobId, opt.value);
                  setOpen(false);
                }}
                disabled={isCurrent}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  isCurrent
                    ? "text-gray-400 cursor-default bg-gray-50/60"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dot}`}
                />
                <span>{opt.label}</span>
                {isCurrent && (
                  <span className="ml-auto text-[10px] text-gray-400 font-medium">
                    current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── ConfirmModal ──────────────────────────────────────────────────────────────
const ConfirmModal = ({ isOpen, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <FaTrash className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
          Confirm Delete
        </h3>
        <p className="text-gray-500 text-sm text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" size={12} />
            ) : (
              <FaTrash size={12} />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const PostedJobs = () => {
  const { myJobs, isLoading, fetchMyJobs, updateJobStatus, deleteJobPost } =
    useJobPostStore();

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleStatusChange = async (jobId, status) => {
    setActionLoading(jobId);
    await updateJobStatus(jobId, status);
    setActionLoading(null);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setActionLoading(confirmDelete.id);
    await deleteJobPost(confirmDelete.id);
    setActionLoading(null);
    setConfirmDelete(null);
  };

  // Counts per status from real data
  const statusCounts = myJobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1;
    return acc;
  }, {});

  const filterOptions = [
    { value: "all", label: "All", count: myJobs.length },
    {
      value: "published",
      label: "Published",
      count: statusCounts.published || 0,
    },
    { value: "pending", label: "Pending", count: statusCounts.pending || 0 },
    { value: "draft", label: "Draft", count: statusCounts.draft || 0 },
    { value: "expired", label: "Expired", count: statusCounts.expired || 0 },
    { value: "closed", label: "Closed", count: statusCounts.closed || 0 },
    { value: "rejected", label: "Rejected", count: statusCounts.rejected || 0 },
  ].filter((o) => o.value === "all" || o.count > 0);

  const filtered = myJobs
    .filter((job) => {
      if (filter !== "all" && job.status !== filter) return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        return (
          job.jobTitle?.toLowerCase().includes(s) ||
          job.jobLocation?.toLowerCase().includes(s) ||
          job.jobType?.toLowerCase().includes(s)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const totalActive = myJobs.filter((j) => j.status === "published").length;
  const totalPending = myJobs.filter((j) => j.status === "pending").length;

  return (
    <div className="space-y-6">
      <ConfirmModal
        isOpen={!!confirmDelete}
        message={`Are you sure you want to delete "${confirmDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        isLoading={actionLoading !== null}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Posted Jobs
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all your job postings
          </p>
        </div>
        <Link
          to="/employer/post-job"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#4EB956]/20 transition-all duration-200"
        >
          <span className="text-lg leading-none">+</span> Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Jobs",
            value: myJobs.length,
            icon: <FaBriefcase />,
            color: "text-[#1E2558]",
            bg: "bg-[#1E2558]/10",
          },
          {
            label: "Active",
            value: totalActive,
            icon: <FaCheckCircle />,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Pending Review",
            value: totalPending,
            icon: <FaHourglassHalf />,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Draft",
            value: statusCounts.draft || 0,
            icon: <FaFileAlt />,
            color: "text-gray-500",
            bg: "bg-gray-100",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5">
                  {isLoading ? (
                    <FaSpinner className="animate-spin text-base text-gray-400" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === opt.value
                    ? "bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {opt.label}
                <span
                  className={`ml-1.5 text-xs ${filter === opt.value ? "text-white/70" : "text-gray-400"}`}
                >
                  {opt.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1 flex gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by title, location, type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 outline-none transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#4EB956] outline-none bg-white text-gray-600"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-[#4EB956] text-3xl mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading your jobs...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <FaBriefcase className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              No jobs found
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              {myJobs.length === 0
                ? "You haven't posted any jobs yet."
                : "Try adjusting your filters."}
            </p>
            <Link
              to="/employer/post-job"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              <span>+</span> Post New Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {[
                    "Job",
                    "Status",
                    "Type & Location",
                    "Posted / Expires",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((job) => {
                  const jobId = job.jobId || job._id;
                  const isActionLoading = actionLoading === jobId;

                  return (
                    <tr
                      key={jobId}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Job */}
                      <td className="px-4 py-4 max-w-xs">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E2558] to-[#4EB956] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                            {job.jobTitle?.charAt(0) || "J"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {job.jobTitle}
                            </p>
                            {job.salaryMin || job.salaryMax ? (
                              <p className="text-xs text-[#4EB956] font-medium mt-0.5">
                                {job.salaryMin && job.salaryMax
                                  ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
                                  : job.salaryMin
                                    ? `From $${job.salaryMin.toLocaleString()}`
                                    : `Up to $${job.salaryMax.toLocaleString()}`}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-400 mt-0.5">
                                Salary not specified
                              </p>
                            )}
                            {job.experienceLevel && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {job.experienceLevel}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status — changeable dropdown or read-only badge */}
                      <td className="px-4 py-4">
                        <StatusSelector
                          job={job}
                          jobId={jobId}
                          isActionLoading={isActionLoading}
                          onStatusChange={handleStatusChange}
                        />
                      </td>

                      {/* Type & Location */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {job.jobType && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <FaBriefcase size={9} className="text-gray-400" />
                              <span className="capitalize">
                                {job.jobType.replace(/_/g, " ")}
                              </span>
                            </div>
                          )}
                          {job.jobLocation && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <FaMapMarkerAlt
                                size={9}
                                className="text-gray-400"
                              />
                              <span className="truncate max-w-[120px]">
                                {job.jobLocation}
                              </span>
                            </div>
                          )}
                          {job.vacancy && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <FaUsers size={9} />
                              <span>
                                {job.vacancy} vacanc
                                {job.vacancy === 1 ? "y" : "ies"}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <FaCalendarAlt size={9} className="text-gray-400" />
                            {job.createdAt
                              ? new Date(job.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </div>
                          {job.endDate && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <FaClock size={9} />
                              Exp:{" "}
                              {new Date(job.endDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/employer/edit-job/${jobId}`}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1E2558] transition-all"
                            title="Edit"
                          >
                            <FaEdit size={13} />
                          </Link>
                          <button
                            onClick={() =>
                              setConfirmDelete({
                                id: jobId,
                                title: job.jobTitle,
                              })
                            }
                            disabled={isActionLoading}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all disabled:opacity-40"
                            title="Delete"
                          >
                            {isActionLoading ? (
                              <FaSpinner size={13} className="animate-spin" />
                            ) : (
                              <FaTrash size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">{myJobs.length}</span>{" "}
              jobs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostedJobs;
