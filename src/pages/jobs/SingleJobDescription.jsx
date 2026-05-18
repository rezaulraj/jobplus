import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle,
  Heart,
  Share2,
  Award,
  User,
  Mail,
  Phone,
  Globe,
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Users,
  TrendingUp,
  ChevronRight,
  Loader2,
} from "lucide-react";
import useJobStore from "../../store/JobStore";
import useSeekerStore from "../../store/seekerStore";
import useAuthStore from "../../store/authStore";
import DOMPurify from "dompurify";
import ApplyJobModal from "../../components/ApplyJobModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const SingleJobDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchJobById, currentJob: job, isLoading } = useJobStore();
  const { fetchMyApplications } = useSeekerStore();
  const { isAuthenticated, user } = useAuthStore();

  const [relatedJobs, setRelatedJobs] = useState([]);
  const [seniorJobs, setSeniorJobs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // ── Applied state ──────────────────────────────────────────────────────────
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // "applied" | "shortlisted" | "hired" | "rejected" | "reviewed"
  const [checkingApplication, setCheckingApplication] = useState(false);

  const colors = {
    primary: "#1e2558",
    secondary: "#4eb956",
    lightPrimary: "rgba(30, 37, 88, 0.1)",
    lightSecondary: "rgba(78, 185, 86, 0.1)",
    border: "#e2e8f0",
    bgLight: "#f8fafc",
  };

  const extractUUID = (slug) => {
    if (!slug) return null;
    const match = slug.match(
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
    );
    return match ? match[1] : slug;
  };

  // ── Check if already applied ───────────────────────────────────────────────
  const checkIfApplied = async (jobId) => {
    // Only check if user is authenticated (seekers only)
    const authState = useAuthStore.getState();
    if (!authState.isAuthenticated || authState.user?.role !== "seeker") return;

    setCheckingApplication(true);
    try {
      const result = await fetchMyApplications({ limit: 100 });
      if (result?.success && Array.isArray(result.data)) {
        const match = result.data.find((app) => app.jobId === jobId);
        if (match) {
          setHasApplied(true);
          setApplicationStatus(match.status);
        } else {
          setHasApplied(false);
          setApplicationStatus(null);
        }
      }
    } catch (e) {
      console.error("Failed to check applications:", e);
    } finally {
      setCheckingApplication(false);
    }
  };

  useEffect(() => {
    const uuid = extractUUID(id);
    if (!uuid) return;
    fetchJobById(uuid);
    const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setIsSaved(saved.includes(uuid));
  }, [id]);

  // Check application status once job is loaded
  useEffect(() => {
    if (!job?.jobId) return;
    checkIfApplied(job.jobId);
  }, [job?.jobId]);

  useEffect(() => {
    if (!job) return;

    const fetchSidebarJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/jobs`, {
          withCredentials: true,
          params: {
            status: "published",
            limit: 50,
            sortBy: "createdAt",
            order: "desc",
          },
        });

        if (response.data?.success) {
          const items = response.data.data?.items || [];

          const related = items
            .filter((j) => {
              const sameCategory =
                (j.jobCategoryId?.jobCategoryId || j.jobCategoryId) ===
                job.categoryId;
              const sameCompany =
                (j.companyId?.companyId || j.companyId) === job.companyId;
              return j.jobId !== job.jobId && (sameCategory || sameCompany);
            })
            .slice(0, 6)
            .map((j) => ({
              jobId: j.jobId,
              title: j.jobTitle,
              company: j.companyId?.nameCompany || "Unknown",
              companyLogo:
                j.companyId?.companyLogo || "/images/default-company.png",
              type: j.jobTypeId?.title || "",
              salary: { min: j.salaryMin || 0, max: j.salaryMax || 0 },
            }));
          setRelatedJobs(related);

          const others = items.filter((j) => j.jobId !== job.jobId);
          const senior = [...others]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .map((j) => ({
              jobId: j.jobId,
              title: j.jobTitle,
              company: j.companyId?.nameCompany || "Unknown",
              companyLogo:
                j.companyId?.companyLogo || "/images/default-company.png",
            }));
          setSeniorJobs(senior);
        }
      } catch (err) {
        console.error("Failed to fetch sidebar jobs:", err);
      }
    };

    fetchSidebarJobs();
  }, [job?.jobId]);

  const getJobUrl = (jobId, title = "") => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);
    return `/job/${slug}-${jobId}`;
  };

  const formatSalary = (salary) => {
    if (!salary) return "Negotiable";
    if (salary.min === 0 && salary.max === 0) return "Negotiable";
    if (salary.min > 0 && salary.max > 0)
      return `৳${salary.min.toLocaleString()} - ৳${salary.max.toLocaleString()}`;
    if (salary.min > 0) return `৳${salary.min.toLocaleString()}+`;
    if (salary.max > 0) return `Up to ৳${salary.max.toLocaleString()}`;
    return "Negotiable";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysLeft = (endDate) => {
    if (!endDate) return null;
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  };

  const handleSaveJob = () => {
    const uuid = extractUUID(id);
    const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    if (!isSaved) {
      saved.push(uuid);
    } else {
      const idx = saved.indexOf(uuid);
      if (idx > -1) saved.splice(idx, 1);
    }
    localStorage.setItem("savedJobs", JSON.stringify(saved));
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: job?.title,
          text: `Check out this job: ${job?.title} at ${job?.company}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // ── Status badge config ────────────────────────────────────────────────────
  const STATUS_CONFIG = {
    applied: {
      label: "Applied",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
      icon: "✓",
    },
    shortlisted: {
      label: "Shortlisted",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
      icon: "★",
    },
    reviewed: {
      label: "Under Review",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      dot: "bg-purple-500",
      icon: "◎",
    },
    hired: {
      label: "Hired!",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      icon: "✓",
    },
    rejected: {
      label: "Not Selected",
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      dot: "bg-red-400",
      icon: "✕",
    },
  };

  // ── Applied Badge Component ────────────────────────────────────────────────
  const AppliedBadge = ({ size = "md", className = "" }) => {
    const cfg = STATUS_CONFIG[applicationStatus] || STATUS_CONFIG.applied;
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg border font-semibold ${cfg.bg} ${cfg.text} ${cfg.border} ${
          size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2.5 text-sm"
        } ${className}`}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
        {cfg.icon} {cfg.label}
      </div>
    );
  };

  // ── Apply Button (only shown when NOT applied) ─────────────────────────────
  const ApplyButton = ({ className = "", style = {}, size = "md" }) => {
    if (checkingApplication) {
      return (
        <button
          disabled
          className={`flex items-center justify-center gap-2 font-semibold rounded-lg text-white opacity-70 cursor-not-allowed ${
            size === "lg" ? "px-10 py-3 text-lg" : "px-8 py-3"
          } ${className}`}
          style={{ backgroundColor: colors.secondary, ...style }}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Checking...
        </button>
      );
    }

    if (hasApplied) {
      return (
        <AppliedBadge
          size={size === "lg" ? "lg" : "md"}
          className={className}
        />
      );
    }

    return (
      <button
        onClick={() => setApplyModalOpen(true)}
        className={`flex items-center justify-center gap-2 font-semibold rounded-lg transition-all hover:shadow-lg cursor-pointer text-white ${
          size === "lg" ? "px-10 py-3 text-lg" : "px-8 py-3"
        } ${className}`}
        style={{ backgroundColor: colors.secondary, ...style }}
      >
        Apply Now
        <ExternalLink className={size === "lg" ? "w-5 h-5" : "w-5 h-5"} />
      </button>
    );
  };

  // ── Save Button (hidden when already applied, or show "Applied" state) ─────
  const SaveButton = ({
    variant = "outline",
    className = "",
    showLabel = true,
  }) => {
    if (hasApplied) return null; // hide save button once applied

    if (variant === "icon-only") {
      return (
        <button
          onClick={handleSaveJob}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${className}`}
          style={{ borderColor: colors.border, color: colors.primary }}
        >
          <Heart
            className={`w-5 h-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
          />
          {showLabel && (
            <span className="hidden sm:inline">
              {isSaved ? "Saved" : "Save Job"}
            </span>
          )}
        </button>
      );
    }

    return (
      <button
        onClick={handleSaveJob}
        className={`px-6 py-3 rounded-lg font-semibold border flex items-center justify-center gap-2 ${className}`}
        style={{ borderColor: colors.primary, color: colors.primary }}
      >
        <Bookmark className="w-5 h-5" />
        {isSaved ? "Saved" : "Save Job"}
      </button>
    );
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen font-ubuntu"
        style={{ backgroundColor: colors.bgLight }}
      >
        <style>{`
          @keyframes shimmer {
            0% { background-position: -800px 0; }
            100% { background-position: 800px 0; }
          }
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 800px 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 6px;
          }
          .skeleton-dark {
            background: linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%);
            background-size: 800px 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 6px;
          }
        `}</style>

        {/* ── Skeleton Sticky Header ── */}
        <div
          className="sticky top-0 z-40 bg-white shadow-sm border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="skeleton w-28 h-8 rounded-lg" />
                <div className="hidden md:flex items-center gap-2">
                  <div className="skeleton w-10 h-4" />
                  <div className="skeleton w-3 h-3 rounded-full" />
                  <div className="skeleton w-8 h-4" />
                  <div className="skeleton w-3 h-3 rounded-full" />
                  <div className="skeleton w-40 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="skeleton w-24 h-9 rounded-lg" />
                <div className="skeleton w-20 h-9 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Skeleton Main Content ── */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ── LEFT: Main skeleton ── */}
            <div className="lg:w-4/5">
              <div
                className="bg-white rounded-xl shadow-lg border overflow-hidden"
                style={{ borderColor: colors.border }}
              >
                {/* Job Header Skeleton */}
                <div
                  className="p-6 border-b"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      {/* Logo + title row */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className="skeleton w-16 h-16 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="skeleton h-8 w-3/4 rounded-lg" />
                          <div className="flex items-center gap-2">
                            <div className="skeleton h-5 w-36 rounded-lg" />
                            <div className="skeleton h-6 w-20 rounded-full" />
                            <div className="skeleton h-6 w-24 rounded-full" />
                          </div>
                        </div>
                      </div>
                      {/* Meta row */}
                      <div className="flex flex-wrap gap-4">
                        <div className="skeleton h-5 w-40 rounded" />
                        <div className="skeleton h-5 w-24 rounded" />
                        <div className="skeleton h-5 w-32 rounded" />
                        <div className="skeleton h-5 w-28 rounded" />
                      </div>
                    </div>
                    {/* Salary + buttons */}
                    <div className="md:text-right space-y-3">
                      <div className="skeleton h-4 w-12 ml-auto rounded" />
                      <div className="skeleton h-9 w-40 ml-auto rounded-lg" />
                      <div className="flex gap-3 justify-end">
                        <div className="skeleton h-12 w-28 rounded-lg" />
                        <div className="skeleton h-12 w-32 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body skeleton */}
                <div className="p-6 space-y-8">
                  {/* Summary grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: colors.lightPrimary }}
                      >
                        <div className="skeleton h-3 w-16 mb-2 rounded" />
                        <div className="skeleton h-4 w-20 rounded" />
                      </div>
                    ))}
                  </div>

                  {/* Description section */}
                  <div>
                    <div className="skeleton h-6 w-40 mb-4 rounded" />
                    <div className="space-y-2.5">
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-5/6 rounded" />
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-4/5 rounded" />
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-3/4 rounded" />
                    </div>
                  </div>

                  {/* Responsibilities list */}
                  <div>
                    <div className="skeleton h-6 w-48 mb-4 rounded" />
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="skeleton w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
                          <div
                            className={`skeleton h-4 rounded ${i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-5/6" : "w-4/5"}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="skeleton h-6 w-36 mb-4 rounded" />
                    <div className="flex flex-wrap gap-2">
                      {[100, 80, 110, 90, 120, 85].map((w, i) => (
                        <div
                          key={i}
                          className="skeleton h-9 rounded-lg"
                          style={{ width: `${w}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Company info block */}
                  <div
                    className="p-6 rounded-lg border"
                    style={{ borderColor: colors.border }}
                  >
                    <div className="skeleton h-6 w-44 mb-4 rounded" />
                    <div className="flex items-center gap-4 mb-4">
                      <div className="skeleton w-12 h-12 rounded-lg flex-shrink-0" />
                      <div className="space-y-2">
                        <div className="skeleton h-4 w-36 rounded" />
                        <div className="skeleton h-3 w-24 rounded" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="skeleton w-5 h-5 rounded flex-shrink-0" />
                          <div className="space-y-1 flex-1">
                            <div className="skeleton h-3 w-16 rounded" />
                            <div className="skeleton h-4 w-40 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA section skeleton */}
                  <div
                    className="p-8 rounded-lg"
                    style={{ backgroundColor: colors.lightSecondary }}
                  >
                    <div className="text-center space-y-3">
                      <div className="skeleton h-7 w-48 mx-auto rounded" />
                      <div className="skeleton h-4 w-64 mx-auto rounded" />
                      <div className="flex gap-4 justify-center mt-4">
                        <div className="skeleton h-12 w-36 rounded-lg" />
                        <div className="skeleton h-12 w-32 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Sidebar skeleton ── */}
            <div className="lg:w-1/5">
              <div className="sticky top-24 space-y-6">
                {/* Related jobs skeleton */}
                <div
                  className="bg-white rounded-xl shadow-sm border overflow-hidden"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="p-4 border-b flex items-center gap-2"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.lightPrimary,
                    }}
                  >
                    <div className="skeleton w-5 h-5 rounded" />
                    <div className="skeleton h-4 w-24 rounded" />
                  </div>
                  <div className="p-4 space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg border"
                        style={{ borderColor: colors.border }}
                      >
                        <div className="skeleton h-4 w-full mb-1.5 rounded" />
                        <div className="skeleton h-3 w-3/4 mb-2 rounded" />
                        <div className="flex justify-between">
                          <div className="skeleton h-6 w-16 rounded" />
                          <div className="skeleton h-4 w-20 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* More jobs skeleton */}
                <div
                  className="bg-white rounded-xl shadow-sm border overflow-hidden"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="p-4 border-b flex items-center gap-2"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.lightPrimary,
                    }}
                  >
                    <div className="skeleton w-5 h-5 rounded" />
                    <div className="skeleton h-4 w-20 rounded" />
                  </div>
                  <div className="p-4 space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2">
                        <div className="skeleton w-10 h-10 rounded flex-shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="skeleton h-4 w-full rounded" />
                          <div className="skeleton h-3 w-3/4 rounded" />
                        </div>
                      </div>
                    ))}
                    <div className="skeleton h-9 w-full rounded-lg mt-2" />
                  </div>
                </div>

                {/* Quick actions skeleton */}
                <div
                  className="p-4 rounded-lg border space-y-2.5"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.lightPrimary,
                  }}
                >
                  <div className="skeleton h-4 w-28 mb-1 rounded" />
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton h-9 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile bottom bar skeleton ── */}
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-30"
          style={{ borderColor: colors.border }}
        >
          <div className="flex gap-3">
            <div className="skeleton flex-1 h-12 rounded-lg" />
            <div className="skeleton flex-1 h-12 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-source"
        style={{ backgroundColor: colors.bgLight }}
      >
        <div className="text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            Job Not Found
          </h2>
          <button
            onClick={() => navigate("/jobs")}
            className="mt-4 px-6 py-2 rounded-lg font-medium text-white"
            style={{ backgroundColor: colors.primary }}
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-ubuntu"
      style={{ backgroundColor: colors.bgLight }}
    >
      {/* ── Sticky Header ── */}
      <div
        className="sticky top-0 z-40 bg-white shadow-sm border-b"
        style={{ borderColor: colors.border }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/jobs")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Jobs</span>
              </button>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Link to="/" className="hover:underline">
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/jobs" className="hover:underline">
                  Jobs
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-700 truncate max-w-xs">
                  {job.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Applied badge in header */}
              {hasApplied ? (
                <AppliedBadge />
              ) : (
                <SaveButton variant="icon-only" />
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                style={{ borderColor: colors.border, color: colors.primary }}
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── LEFT: Job Description ── */}
          <div className="lg:w-4/5">
            <div
              className="bg-white rounded-xl shadow-lg border overflow-hidden"
              style={{ borderColor: colors.border }}
            >
              {/* Job Header */}
              <div
                className="p-6 border-b"
                style={{ borderColor: colors.border }}
              >
                {/* Already Applied Banner */}
                {hasApplied && (
                  <div
                    className="mb-5 flex items-center gap-3 px-5 py-4 rounded-xl border"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(30,37,88,0.04) 0%, rgba(78,185,86,0.08) 100%)",
                      borderColor: "#4eb956",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                      style={{ backgroundColor: "#4eb956" }}
                    >
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: colors.primary }}
                      >
                        You've already applied for this job
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Status:{" "}
                        <span
                          className={`font-semibold capitalize ${STATUS_CONFIG[applicationStatus]?.text || "text-gray-600"}`}
                        >
                          {STATUS_CONFIG[applicationStatus]?.label ||
                            applicationStatus}
                        </span>
                        {" · "}
                        <Link
                          to="/seeker/applied-jobs"
                          className="underline hover:no-underline"
                          style={{ color: colors.primary }}
                        >
                          View my applications
                        </Link>
                      </p>
                    </div>
                    <AppliedBadge />
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-lg overflow-hidden border flex items-center justify-center bg-gray-50"
                        style={{ borderColor: colors.border }}
                      >
                        <img
                          src={
                            job.clogo ||
                            job.companyLogo ||
                            "/images/default-company.png"
                          }
                          alt={job.company}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            e.target.src = "/images/default-company.png";
                          }}
                        />
                      </div>
                      <div>
                        <h1
                          className="text-2xl md:text-3xl font-bold mb-1"
                          style={{ color: colors.primary }}
                        >
                          {job.title}
                        </h1>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-lg text-gray-800">
                            {job.company}
                          </span>
                          {job.type && (
                            <span
                              className="px-3 py-1 text-sm rounded-full font-medium"
                              style={{
                                backgroundColor: colors.lightSecondary,
                                color: colors.secondary,
                              }}
                            >
                              {job.type}
                            </span>
                          )}
                          {job.category && (
                            <span className="px-3 py-1 text-sm rounded-full font-medium bg-blue-50 text-blue-700">
                              {job.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      {job.location && (
                        <div className="flex items-center gap-2">
                          <MapPin
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                          <span className="text-gray-700">{job.location}</span>
                        </div>
                      )}
                      {job.country && (
                        <div className="flex items-center gap-2">
                          {job.countryFlag && (
                            <img
                              src={job.countryFlag}
                              alt={job.country}
                              className="w-5 h-4 object-cover rounded-sm"
                            />
                          )}
                          <span className="text-gray-700">{job.country}</span>
                        </div>
                      )}
                      {job.experience && (
                        <div className="flex items-center gap-2">
                          <Briefcase
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                          <span className="text-gray-700">
                            {job.experience} yrs experience
                          </span>
                        </div>
                      )}
                      {job.vacancy > 0 && (
                        <div className="flex items-center gap-2">
                          <Users
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                          <span className="text-gray-700">
                            {job.vacancy}{" "}
                            {job.vacancy > 1 ? "vacancies" : "vacancy"}
                          </span>
                        </div>
                      )}
                      {job.gender && (
                        <div className="flex items-center gap-2">
                          <User
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                          <span className="text-gray-700">{job.gender}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Salary + action buttons */}
                  <div className="md:text-right">
                    <div className="mb-4">
                      <div className="text-sm text-gray-600">Salary</div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: colors.primary }}
                      >
                        {formatSalary(job.salary)}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Save button only shown if not applied */}
                      {!hasApplied && <SaveButton />}
                      {/* Apply / Applied badge */}
                      <ApplyButton />
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details Body */}
              <div className="p-6 space-y-8">
                {/* Summary Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Category", value: job.category || "N/A" },
                    { label: "Posted", value: formatDate(job.jobPostedDate) },
                    { label: "Education", value: job.education || "N/A" },
                    {
                      label: "Deadline",
                      value: job.jobEndDate
                        ? `${formatDate(job.jobEndDate)} (${getDaysLeft(job.jobEndDate)})`
                        : "N/A",
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: colors.lightPrimary }}
                    >
                      <div className="text-sm text-gray-600 mb-1">{label}</div>
                      <div
                        className="font-semibold text-sm"
                        style={{ color: colors.primary }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {job.description && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b"
                      style={{
                        borderColor: colors.border,
                        color: colors.primary,
                      }}
                    >
                      Job Description
                    </h3>
                    <div
                      className="prose max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(job.description),
                      }}
                    />
                  </div>
                )}

                {/* Requirements */}
                {job.requirements?.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b"
                      style={{
                        borderColor: colors.border,
                        color: colors.primary,
                      }}
                    >
                      Job Requirements
                    </h3>
                    <ul className="space-y-3">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle
                            className="w-5 h-5 mt-0.5 shrink-0"
                            style={{ color: colors.secondary }}
                          />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b"
                      style={{
                        borderColor: colors.border,
                        color: colors.primary,
                      }}
                    >
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-lg font-medium"
                          style={{
                            backgroundColor: colors.lightPrimary,
                            color: colors.primary,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits?.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b"
                      style={{
                        borderColor: colors.border,
                        color: colors.primary,
                      }}
                    >
                      Benefits & Perks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.benefits.map((benefit, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-lg"
                          style={{ backgroundColor: colors.lightSecondary }}
                        >
                          <CheckCircle
                            className="w-4 h-4"
                            style={{ color: colors.secondary }}
                          />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Info */}
                <div
                  className="p-6 rounded-lg border"
                  style={{ borderColor: colors.border }}
                >
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: colors.primary }}
                  >
                    Company Information
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={
                        job.clogo ||
                        job.companyLogo ||
                        "/images/default-company.png"
                      }
                      alt={job.company}
                      className="w-12 h-12 rounded-lg object-contain border p-1"
                      style={{ borderColor: colors.border }}
                      onError={(e) => {
                        e.target.src = "/images/default-company.png";
                      }}
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {job.company}
                      </div>
                      {job.compnay?.website && (
                        <a
                          href={job.compnay.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                        >
                          Visit Website <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.compnay?.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-500">Address</div>
                          <div className="text-gray-700">
                            {job.compnay.address}
                          </div>
                        </div>
                      </div>
                    )}
                    {job.compnay?.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="text-gray-700">
                            {job.compnay.email}
                          </div>
                        </div>
                      </div>
                    )}
                    {job.compnay?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Phone</div>
                          <div className="text-gray-700">
                            {job.compnay.phone}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Section */}
                <div
                  className="p-8 rounded-lg text-center"
                  style={{ backgroundColor: colors.lightSecondary }}
                >
                  {hasApplied ? (
                    /* ── Already applied CTA ── */
                    <div>
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
                        style={{ backgroundColor: "#4eb956" }}
                      >
                        ✓
                      </div>
                      <h4
                        className="text-2xl font-semibold mb-2"
                        style={{ color: colors.primary }}
                      >
                        Application Submitted!
                      </h4>
                      <p className="text-gray-600 mb-2">
                        You've already applied for this position.{" "}
                        {applicationStatus === "shortlisted" &&
                          "🎉 Great news — you've been shortlisted!"}
                        {applicationStatus === "hired" &&
                          "🎊 Congratulations — you've been hired!"}
                        {applicationStatus === "applied" &&
                          "We'll notify you once the employer reviews your application."}
                        {applicationStatus === "reviewed" &&
                          "Your application is currently under review."}
                        {applicationStatus === "rejected" &&
                          "Unfortunately this position didn't work out."}
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Current Status:{" "}
                        <span
                          className={`font-semibold capitalize ${STATUS_CONFIG[applicationStatus]?.text || ""}`}
                        >
                          {STATUS_CONFIG[applicationStatus]?.label ||
                            applicationStatus}
                        </span>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                          to="/seeker/applied-jobs"
                          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                          style={{ backgroundColor: colors.primary }}
                        >
                          View My Applications
                        </Link>
                        <Link
                          to="/jobs"
                          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold border transition-all hover:bg-white"
                          style={{
                            borderColor: colors.primary,
                            color: colors.primary,
                          }}
                        >
                          <Briefcase className="w-5 h-5" />
                          Browse More Jobs
                        </Link>
                      </div>
                    </div>
                  ) : (
                    /* ── Normal apply CTA ── */
                    <div>
                      <h4
                        className="text-2xl font-semibold mb-3"
                        style={{ color: colors.primary }}
                      >
                        Ready to Apply?
                      </h4>
                      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Don't miss this opportunity!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={handleSaveJob}
                          className="px-8 py-3 rounded-lg font-semibold border flex items-center justify-center gap-2"
                          style={{
                            borderColor: colors.primary,
                            color: colors.primary,
                          }}
                        >
                          <Bookmark className="w-5 h-5" />
                          {isSaved ? "Job Saved" : "Save for Later"}
                        </button>
                        <ApplyButton
                          size="lg"
                          style={{ backgroundColor: colors.primary }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="lg:w-1/5">
            <div className="sticky top-24 space-y-6">
              {/* Related Jobs */}
              <div
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
                style={{ borderColor: colors.border }}
              >
                <div
                  className="p-4 border-b"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.lightPrimary,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                    <h3
                      className="font-semibold"
                      style={{ color: colors.primary }}
                    >
                      Related Jobs
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  {relatedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {relatedJobs.map((rj) => (
                        <Link
                          key={rj.jobId}
                          to={getJobUrl(rj.jobId, rj.title)}
                          className="block p-3 rounded-lg border hover:shadow-sm transition-all"
                          style={{ borderColor: colors.border }}
                        >
                          <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                            {rj.title}
                          </h4>
                          <p className="text-gray-600 text-xs mb-2">
                            {rj.company}
                          </p>
                          <div className="flex items-center justify-between">
                            {rj.type && (
                              <span
                                className="text-xs px-2 py-1 rounded"
                                style={{
                                  backgroundColor: colors.lightSecondary,
                                  color: colors.secondary,
                                }}
                              >
                                {rj.type}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatSalary(rj.salary)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-gray-500 text-sm">
                        No related jobs found
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* More Jobs */}
              {seniorJobs.length > 0 && (
                <div
                  className="bg-white rounded-xl shadow-sm border overflow-hidden"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="p-4 border-b"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.lightPrimary,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Award
                        className="w-5 h-5"
                        style={{ color: colors.primary }}
                      />
                      <h3
                        className="font-semibold"
                        style={{ color: colors.primary }}
                      >
                        More Jobs
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {seniorJobs.map((sj, i) => (
                        <Link
                          key={sj.jobId || i}
                          to={getJobUrl(sj.jobId, sj.title)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div
                            className="w-10 h-10 rounded overflow-hidden border shrink-0"
                            style={{ borderColor: colors.border }}
                          >
                            <img
                              src={sj.companyLogo}
                              alt={sj.company}
                              className="w-full h-full object-contain p-0.5"
                              onError={(e) => {
                                e.target.src = "/images/default-company.png";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                              {sj.title}
                            </h4>
                            <p className="text-gray-500 text-xs">
                              {sj.company}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/jobs"
                      className="block mt-4 text-center py-2 text-sm rounded-lg border transition-colors"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                      }}
                    >
                      View All Jobs
                    </Link>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div
                className="p-4 rounded-lg border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.lightPrimary,
                }}
              >
                <h4
                  className="font-semibold mb-3"
                  style={{ color: colors.primary }}
                >
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  {hasApplied ? (
                    /* Show application status in sidebar when already applied */
                    <>
                      <div
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm border"
                        style={{
                          backgroundColor:
                            STATUS_CONFIG[applicationStatus]?.bg?.replace(
                              "bg-",
                              "",
                            ) || "#f0fdf4",
                          borderColor: "#4eb956",
                          color: colors.primary,
                        }}
                      >
                        <span className="text-base">✓</span>
                        {STATUS_CONFIG[applicationStatus]?.label || "Applied"}
                      </div>
                      <Link
                        to="/my-applications"
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm text-white transition-all hover:shadow-md"
                        style={{ backgroundColor: colors.primary }}
                      >
                        View My Applications
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setApplyModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-md"
                        style={{ backgroundColor: colors.secondary }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Apply Now
                      </button>
                      <button
                        onClick={handleSaveJob}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors hover:bg-white"
                        style={{
                          borderColor: colors.border,
                          color: colors.primary,
                        }}
                      >
                        <Bookmark className="w-4 h-4" />
                        {isSaved ? "Remove from Saved" : "Save This Job"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors hover:bg-white"
                    style={{
                      borderColor: colors.border,
                      color: colors.primary,
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share with Friends
                  </button>
                  <Link
                    to="/jobs"
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors hover:bg-white text-center"
                    style={{
                      borderColor: colors.border,
                      color: colors.primary,
                    }}
                  >
                    <Briefcase className="w-4 h-4" />
                    Browse More Jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Apply Bar ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-30"
        style={{ borderColor: colors.border }}
      >
        {hasApplied ? (
          /* Applied state: full-width status + link */
          <div className="flex gap-3">
            <div
              className="flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 border"
              style={{ borderColor: "#4eb956", color: colors.primary }}
            >
              <span>✓</span>
              {STATUS_CONFIG[applicationStatus]?.label || "Applied"}
            </div>
            <Link
              to="/my-applications"
              className="flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: colors.primary }}
            >
              My Applications
            </Link>
          </div>
        ) : (
          /* Not yet applied: save + apply */
          <div className="flex gap-3">
            <button
              onClick={handleSaveJob}
              className="flex-1 py-3 rounded-lg font-semibold border flex items-center justify-center gap-2"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              <Bookmark className="w-5 h-5" />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => setApplyModalOpen(true)}
              className="flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer text-white"
              style={{ backgroundColor: colors.secondary }}
            >
              Apply Now
            </button>
          </div>
        )}
      </div>

      {/* ── Apply Job Modal ── */}
      {!hasApplied && (
        <ApplyJobModal
          job={job}
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          onSuccess={() => {
            setApplyModalOpen(false);
            setHasApplied(true);
            setApplicationStatus("applied");
          }}
        />
      )}
    </div>
  );
};

export default SingleJobDescription;
