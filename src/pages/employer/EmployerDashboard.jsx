// pages/employer/EmployerDashboard.jsx
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaFileAlt,
  FaUsers,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaPlus,
  FaSpinner,
  FaExclamationTriangle,
  FaFire,
  FaChartLine,
  FaRegCalendarAlt,
  FaTrophy,
  FaUserCheck,
} from "react-icons/fa";
import useJobPostStore from "../../store/jobPostStore";
import useAuthStore from "../../store/authStore";

// ── Helpers ───
const timeAgo = (date) => {
  if (!date) return "—";
  const diff = Date.now() - new Date(date);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const daysLeft = (endDate) => {
  if (!endDate) return null;
  const diff = Math.ceil((new Date(endDate) - Date.now()) / 86400000);
  return diff;
};

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-[#1E2558] to-[#4EB956]",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
];

const getAvatarColor = (str = "") =>
  AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

const getInitials = (name = "") => {
  const p = name.trim().split(" ");
  return p.length >= 2
    ? `${p[0][0]}${p[p.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

// ── Status config ──
const JOB_STATUS = {
  published: {
    label: "Published",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  draft: {
    label: "Draft",
    bg: "bg-gray-50",
    text: "text-gray-500",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
  closed: {
    label: "Closed",
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-200",
    dot: "bg-red-400",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  expired: {
    label: "Expired",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
    dot: "bg-orange-400",
  },
};

// ── Stat Card ──
const StatCard = ({
  label,
  value,
  icon,
  colorClass,
  bgClass,
  sub,
  isLoading,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-3xl font-bold text-gray-800 mt-1.5 leading-tight">
          {isLoading ? (
            <FaSpinner className="animate-spin text-xl text-gray-200 mt-1" />
          ) : (
            value
          )}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div
        className={`w-11 h-11 rounded-2xl ${bgClass} flex items-center justify-center ${colorClass} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
    </div>
  </div>
);

// ── Job Row ──
const JobRow = ({ job }) => {
  const jobId = job.jobId || job._id;
  const cfg = JOB_STATUS[job.status] || JOB_STATUS.draft;
  const left = daysLeft(job.endDate);

  return (
    <tr className="group hover:bg-gray-50/70 transition-colors duration-150">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E2558] to-[#4EB956] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {job.jobTitle?.charAt(0)?.toUpperCase() || "J"}
          </div>
          <div className="min-w-0">
            <Link
              to={`/employer/jobs/${jobId}/applications`}
              className="font-semibold text-gray-800 text-sm hover:text-[#4EB956] transition-colors truncate block max-w-[200px]"
            >
              {job.jobTitle}
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              {job.jobType && (
                <span className="text-xs text-gray-400 capitalize">
                  {job.jobType.replace(/_/g, " ")}
                </span>
              )}
              {job.jobLocation && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <FaMapMarkerAlt size={8} /> {job.jobLocation}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <Link
          to={`/employer/jobs/${jobId}/applications`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E2558] hover:text-[#4EB956] transition-colors"
        >
          <FaUsers size={11} className="text-[#4EB956]" />
          {job.applicationCount ?? 0}
        </Link>
      </td>

      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </td>

      <td className="px-5 py-3.5">
        <span className="text-xs text-gray-500">{timeAgo(job.createdAt)}</span>
      </td>

      <td className="px-5 py-3.5">
        {left !== null ? (
          <span
            className={`text-xs font-medium ${left <= 3 ? "text-red-500" : left <= 7 ? "text-orange-500" : "text-gray-500"}`}
          >
            {left > 0 ? `${left}d left` : "Expired"}
          </span>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>

      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/employer/jobs/${jobId}/applications`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4EB956]/10 text-[#1E2558] text-xs font-semibold hover:bg-[#4EB956]/20 transition-colors"
          >
            View <FaArrowRight size={9} />
          </Link>
          <Link
            to={`/employer/edit-job/${jobId}`}
            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors"
          >
            Edit
          </Link>
        </div>
      </td>
    </tr>
  );
};

// ── Activity Feed Item ──
const ActivityItem = ({ job, index }) => {
  const jobId = job.jobId || job._id;
  const cfg = JOB_STATUS[job.status] || JOB_STATUS.draft;
  const color = getAvatarColor(job.jobTitle || "");

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-150"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
      >
        {job.jobTitle?.charAt(0)?.toUpperCase() || "J"}
      </div>
      <div className="flex-1 min-w-0">
        <Link
          to={`/employer/jobs/${jobId}/applications`}
          className="text-sm font-semibold text-gray-800 hover:text-[#4EB956] truncate block transition-colors"
        >
          {job.jobTitle}
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
          >
            <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <span className="text-xs text-gray-400">
            {timeAgo(job.createdAt)}
          </span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-800">
          {job.applicationCount ?? 0}
        </p>
        <p className="text-xs text-gray-400">apps</p>
      </div>
    </div>
  );
};

// ── Empty State ──
const EmptyJobs = () => (
  <div className="text-center py-10">
    <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#1E2558]/10 to-[#4EB956]/10 rounded-2xl flex items-center justify-center mb-3 border border-[#4EB956]/20">
      <FaBriefcase className="text-[#4EB956] text-xl" />
    </div>
    <h3 className="text-sm font-semibold text-gray-700 mb-1">
      No jobs posted yet
    </h3>
    <p className="text-xs text-gray-400 mb-4">
      Start attracting top candidates today
    </p>
    <Link
      to="/employer/post-job"
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl text-xs font-semibold hover:shadow-md transition-all"
    >
      <FaPlus size={10} /> Post Your First Job
    </Link>
  </div>
);

// ── Donut Chart (CSS only) ───
const DonutChart = ({ published, pending, draft, closed, total }) => {
  if (total === 0)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-300 text-sm italic">No data yet</p>
      </div>
    );

  const segments = [
    {
      label: "Published",
      count: published,
      color: "#4EB956",
      bg: "bg-emerald-500",
    },
    { label: "Pending", count: pending, color: "#F59E0B", bg: "bg-amber-400" },
    { label: "Draft", count: draft, color: "#9CA3AF", bg: "bg-gray-400" },
    { label: "Closed", count: closed, color: "#EF4444", bg: "bg-red-400" },
  ].filter((s) => s.count > 0);

  // Build conic-gradient
  let cumulative = 0;
  const stops = segments.map((s) => {
    const pct = (s.count / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return `${s.color} ${start.toFixed(1)}% ${cumulative.toFixed(1)}%`;
  });
  const gradient = `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="flex items-center gap-6 h-full">
      {/* Donut */}
      <div className="relative flex-shrink-0">
        <div
          className="w-28 h-28 rounded-full"
          style={{ background: gradient }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
            <p className="text-xl font-bold text-gray-800 leading-tight">
              {total}
            </p>
            <p className="text-xs text-gray-400">total</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 flex-1">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${s.bg} flex-shrink-0`}
              />
              <span className="text-xs text-gray-600">{s.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-800">{s.count}</span>
              <span className="text-xs text-gray-400">
                ({((s.count / total) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ───
const EmployerDashboard = () => {
  const { user } = useAuthStore();
  const { myJobs, isLoading, fetchMyJobs } = useJobPostStore();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  // ── Computed stats ──
  const stats = useMemo(() => {
    const published = myJobs.filter((j) => j.status === "published").length;
    const pending = myJobs.filter((j) => j.status === "pending").length;
    const draft = myJobs.filter((j) => j.status === "draft").length;
    const closed = myJobs.filter((j) => j.status === "closed").length;
    const rejected = myJobs.filter((j) => j.status === "rejected").length;
    const expired = myJobs.filter((j) => j.status === "expired").length;

    const totalApplications = myJobs.reduce(
      (sum, j) => sum + (j.applicationCount ?? 0),
      0,
    );
    const shortlisted = myJobs.reduce(
      (sum, j) => sum + (j.shortlistedCount ?? 0),
      0,
    );
    const expiringSoon = myJobs.filter((j) => {
      const left = daysLeft(j.endDate);
      return left !== null && left > 0 && left <= 7 && j.status === "published";
    }).length;

    return {
      total: myJobs.length,
      published,
      pending,
      draft,
      closed,
      rejected,
      expired,
      totalApplications,
      shortlisted,
      expiringSoon,
    };
  }, [myJobs]);

  // ── Recent jobs (latest 5) ──
  const recentJobs = useMemo(
    () =>
      [...myJobs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [myJobs],
  );

  // ── Top performing jobs ───
  const topJobs = useMemo(
    () =>
      [...myJobs]
        .filter((j) => j.status === "published")
        .sort((a, b) => (b.applicationCount ?? 0) - (a.applicationCount ?? 0))
        .slice(0, 4),
    [myJobs],
  );

  // ── Greeting ───
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.fullName || "there";

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner ── */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#4EB956] blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white blur-2xl" />
        </div>

        <div className="relative px-7 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[#4EB956] text-sm font-semibold mb-1">
              {greeting} 👋
            </p>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {firstName}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {stats.total === 0
                ? "Post your first job to get started."
                : `You have ${stats.published} active job${stats.published !== 1 ? "s" : ""} and ${stats.totalApplications} total application${stats.totalApplications !== 1 ? "s" : ""}.`}
            </p>
            {stats.expiringSoon > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <FaExclamationTriangle size={11} className="text-amber-400" />
                <p className="text-amber-300 text-xs font-medium">
                  {stats.expiringSoon} job{stats.expiringSoon > 1 ? "s" : ""}{" "}
                  expiring within 7 days
                </p>
              </div>
            )}
          </div>
          <Link
            to="/employer/post-job"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4EB956] hover:bg-[#45a84e] text-white rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-lg hover:shadow-[#4EB956]/30 flex-shrink-0"
          >
            <FaPlus size={11} /> Post New Job
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Jobs"
          value={stats.published}
          icon={<FaBriefcase size={15} />}
          colorClass="text-[#1E2558]"
          bgClass="bg-[#1E2558]/8"
          sub={`${stats.pending} pending review`}
          isLoading={isLoading}
        />
        <StatCard
          label="Total Applications"
          value={stats.totalApplications}
          icon={<FaFileAlt size={15} />}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
          sub={`across ${stats.total} job${stats.total !== 1 ? "s" : ""}`}
          isLoading={isLoading}
        />
        <StatCard
          label="Shortlisted"
          value={stats.shortlisted}
          icon={<FaUserCheck size={15} />}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
          sub="candidates"
          isLoading={isLoading}
        />
        <StatCard
          label="Draft Jobs"
          value={stats.draft}
          icon={<FaFileAlt size={15} />}
          colorClass="text-gray-500"
          bgClass="bg-gray-100"
          sub="not yet submitted"
          isLoading={isLoading}
        />
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Status Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800 text-base">
                Job Status Overview
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Breakdown of all your postings
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#1E2558]/8 flex items-center justify-center text-[#1E2558]">
              <FaChartLine size={13} />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <FaSpinner className="animate-spin text-[#4EB956] text-2xl" />
            </div>
          ) : (
            <div className="h-36">
              <DonutChart
                published={stats.published}
                pending={stats.pending}
                draft={stats.draft}
                closed={stats.closed}
                total={stats.total}
              />
            </div>
          )}

          {/* Quick status pills */}
          {!isLoading && stats.total > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-gray-50">
              {[
                {
                  label: "Rejected",
                  val: stats.rejected,
                  color: "text-rose-500",
                  bg: "bg-rose-50",
                },
                {
                  label: "Expired",
                  val: stats.expired,
                  color: "text-orange-500",
                  bg: "bg-orange-50",
                },
                {
                  label: "Closed",
                  val: stats.closed,
                  color: "text-red-500",
                  bg: "bg-red-50",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`${s.bg} rounded-xl p-3 text-center`}
                >
                  <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800 text-base">Recent Jobs</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Your latest postings
              </p>
            </div>
            <Link
              to="/employer/jobs"
              className="text-xs font-semibold text-[#4EB956] hover:text-[#1E2558] transition-colors flex items-center gap-1"
            >
              View all <FaArrowRight size={9} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <FaSpinner className="animate-spin text-[#4EB956] text-2xl" />
            </div>
          ) : recentJobs.length === 0 ? (
            <EmptyJobs />
          ) : (
            <div className="space-y-1">
              {recentJobs.map((job, i) => (
                <ActivityItem key={job.jobId || job._id} job={job} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Top Performing Jobs ── */}
      {topJobs.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <FaTrophy size={14} className="text-amber-400" /> Top Performing
                Jobs
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Published jobs by application count
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topJobs.map((job, i) => {
              const jobId = job.jobId || job._id;
              const left = daysLeft(job.endDate);
              const medals = ["🥇", "🥈", "🥉", ""];
              return (
                <Link
                  key={jobId}
                  to={`/employer/jobs/${jobId}/applications`}
                  className="group block p-4 rounded-2xl border border-gray-100 hover:border-[#4EB956]/30 hover:shadow-md transition-all duration-200 bg-gray-50/40 hover:bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E2558] to-[#4EB956] flex items-center justify-center text-white text-xs font-bold">
                      {job.jobTitle?.charAt(0)?.toUpperCase() || "J"}
                    </div>
                    <span className="text-base">{medals[i] || ""}</span>
                  </div>
                  <p className="font-bold text-gray-800 text-sm truncate group-hover:text-[#4EB956] transition-colors">
                    {job.jobTitle}
                  </p>
                  {job.jobLocation && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                      <FaMapMarkerAlt size={8} /> {job.jobLocation}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-[#1E2558]">
                      <FaUsers size={10} className="text-[#4EB956]" />
                      <span className="text-sm font-bold">
                        {job.applicationCount ?? 0}
                      </span>
                      <span className="text-xs text-gray-400">apps</span>
                    </div>
                    {left !== null && (
                      <span
                        className={`text-xs font-medium ${left <= 3 ? "text-red-500" : left <= 7 ? "text-orange-500" : "text-gray-400"}`}
                      >
                        {left > 0 ? `${left}d` : "Exp"}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── All Jobs Table ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-base">
              All Job Postings
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {stats.total} total · click a title to view applicants
            </p>
          </div>
          <Link
            to="/employer/jobs"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4EB956] hover:text-[#1E2558] transition-colors"
          >
            Manage all <FaArrowRight size={9} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <FaSpinner className="animate-spin text-[#4EB956] text-3xl" />
          </div>
        ) : myJobs.length === 0 ? (
          <EmptyJobs />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  {[
                    "Job Title",
                    "Applications",
                    "Status",
                    "Posted",
                    "Expires",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[...myJobs]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 10)
                  .map((job) => (
                    <JobRow key={job.jobId || job._id} job={job} />
                  ))}
              </tbody>
            </table>
            {myJobs.length > 10 && (
              <div className="px-5 py-3 border-t border-gray-50 text-center">
                <Link
                  to="/employer/jobs"
                  className="text-xs font-semibold text-[#4EB956] hover:text-[#1E2558] transition-colors"
                >
                  View all {myJobs.length} jobs →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
