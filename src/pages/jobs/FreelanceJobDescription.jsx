import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Building,
  CheckCircle,
  Clock,
  Users,
  Award,
  Star,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Heart,
  Share2,
  FileText,
  TrendingUp,
  Tag,
  ArrowLeft,
  Bookmark,
  Loader2,
} from "lucide-react";
import useJobStore from "../../store/JobStore";
import useSeekerStore from "../../store/seekerStore";
import useAuthStore from "../../store/authStore";
import ApplyJobModal from "../../components/ApplyJobModal";

// ─── Status config (same as SingleJobDescription) ─────────────────────────────
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

const FreelanceJobDescription = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { fetchJobById, fetchJobsByJobType, fetchJobTypes, jobTypes } =
    useJobStore();
  const { fetchMyApplications } = useSeekerStore();

  const [selectedJob, setSelectedJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // ── Applied state ────────────────────────────────────────────────────────────
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [checkingApplication, setCheckingApplication] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const extractJobId = (slug) => {
    if (!slug) return null;
    const uuidMatch = slug.match(
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
    );
    return uuidMatch ? uuidMatch[1] : null;
  };

  const getJobUrl = (job) => {
    if (!job?.title) return "/freelance";
    const slug = job.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);
    return `/freelance/${slug}-${job.jobId || job.id}`;
  };

  const handleJobNavigation = (job) => {
    navigate(getJobUrl(job));
    window.scrollTo(0, 0);
  };

  const toggleSaveJob = (id) => {
    setSavedJobs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const formatSalary = (job) => {
    if (!job) return "Negotiable";
    if (job.salary?.min && job.salary?.max)
      return `৳${job.salary.min.toLocaleString()} – ৳${job.salary.max.toLocaleString()}`;
    if (job.salary?.min) return `From ৳${job.salary.min.toLocaleString()}`;
    if (job.salary?.max) return `Up to ৳${job.salary.max.toLocaleString()}`;
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

  // ── Check if seeker already applied ─────────────────────────────────────────
  const checkIfApplied = async (jobId) => {
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

  // ── Load job + related ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const extractedId = extractJobId(jobId);
      if (!extractedId) {
        setLoading(false);
        return;
      }

      const jobResult = await fetchJobById(extractedId);
      if (jobResult?.success && jobResult?.data) {
        setSelectedJob(jobResult.data);
      }

      let types = jobTypes;
      if (!types || types.length === 0) {
        const typesResult = await fetchJobTypes();
        types = typesResult?.data || [];
      }

      const freelanceType = types.find(
        (t) => t.title?.toLowerCase() === "freelance",
      );
      if (freelanceType?.jobTypeId) {
        const relatedResult = await fetchJobsByJobType(
          freelanceType.jobTypeId,
          {
            status: "published",
            limit: 10,
          },
        );
        if (relatedResult?.success && relatedResult?.data) {
          setRelatedJobs(
            relatedResult.data.filter((j) => j.jobId !== extractedId),
          );
        }
      }
      setLoading(false);
    };
    load();
  }, [jobId]);

  // Check application status once job is loaded
  useEffect(() => {
    if (!selectedJob?.jobId) return;
    checkIfApplied(selectedJob.jobId);
  }, [selectedJob?.jobId]);

  const similarJobs = relatedJobs
    .filter((j) => j.skills?.some((s) => selectedJob?.skills?.includes(s)))
    .slice(0, 3);
  const moreJobs = relatedJobs.slice(0, 4);

  // ── Applied Badge ──────────────────────────────────────────────────────────────
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

  // ── Apply Button ───────────────────────────────────────────────────────────────
  const ApplyButton = ({ size = "md", className = "", style = {} }) => {
    if (checkingApplication) {
      return (
        <button
          disabled
          className={`flex items-center justify-center gap-2 rounded-lg font-semibold text-white opacity-70 cursor-not-allowed bg-secondary ${
            size === "lg" ? "px-10 py-3 text-lg" : "px-6 py-3"
          } ${className}`}
          style={style}
        >
          <Loader2 className="w-4 h-4 animate-spin" /> Checking...
        </button>
      );
    }
    if (hasApplied)
      return (
        <AppliedBadge
          size={size === "lg" ? "lg" : "md"}
          className={className}
        />
      );
    return (
      <button
        onClick={() => setApplyModalOpen(true)}
        className={`flex items-center justify-center gap-2 rounded-lg font-semibold text-white transition-colors hover:opacity-90 cursor-pointer bg-secondary ${
          size === "lg" ? "px-10 py-3 text-lg" : "px-6 py-3"
        } ${className}`}
        style={style}
      >
        <MessageSquare className="w-5 h-5" /> Apply Now
      </button>
    );
  };

  // ── Loading ────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto" />
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[applicationStatus] || STATUS_CONFIG.applied;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 font-ubuntu">
      <div className="container mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-secondary cursor-pointer mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Jobs
        </button>

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-secondary">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/jobs" className="hover:text-secondary">
              Jobs
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {selectedJob.title}
            </span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── LEFT COLUMN (80%) ── */}
          <div className="lg:w-4/5 space-y-6">
            {/* ── Job Header Card ── */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-8">
                {/* ── Already Applied Banner ── */}
                {hasApplied && (
                  <div
                    className="mb-6 flex items-center gap-3 px-5 py-4 rounded-xl border"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(30,37,88,0.04) 0%, rgba(78,185,86,0.08) 100%)",
                      borderColor: "#4eb956",
                    }}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm bg-secondary">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-primary">
                        You've already applied for this job
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Status:{" "}
                        <span
                          className={`font-semibold capitalize ${statusCfg.text}`}
                        >
                          {statusCfg.label}
                        </span>
                        {" · "}
                        <Link
                          to="/seeker/applied-jobs"
                          className="underline hover:no-underline text-primary"
                        >
                          View my applications
                        </Link>
                      </p>
                    </div>
                    <AppliedBadge />
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    {/* Company Logo + Title */}
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={selectedJob.companyLogo}
                        alt={selectedJob.company}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.src = "/images/default-company.png";
                        }}
                      />
                      <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                          {selectedJob.title}
                        </h1>
                        <span className="text-gray-500 text-sm">
                          {selectedJob.company}
                        </span>
                      </div>
                    </div>

                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      {selectedJob.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">
                            {selectedJob.location}
                          </span>
                        </div>
                      )}
                      {selectedJob.country && (
                        <div className="flex items-center gap-2">
                          {selectedJob.countryFlag && (
                            <img
                              src={selectedJob.countryFlag}
                              alt={selectedJob.country}
                              className="w-5 h-4 object-cover rounded-sm"
                            />
                          )}
                          <span className="text-gray-600">
                            {selectedJob.country}
                          </span>
                        </div>
                      )}
                      {selectedJob.jobPostedDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">
                            Posted {formatDate(selectedJob.jobPostedDate)}
                          </span>
                        </div>
                      )}
                      {selectedJob.jobEndDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">
                            Deadline {formatDate(selectedJob.jobEndDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedJob.type && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          {selectedJob.type}
                        </span>
                      )}
                      {selectedJob.category && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {selectedJob.category}
                        </span>
                      )}
                      {selectedJob.experience && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                          {selectedJob.experience} yrs exp
                        </span>
                      )}
                      {selectedJob.vacancy > 0 && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {selectedJob.vacancy} opening
                          {selectedJob.vacancy > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Salary / Info cards */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">
                          Compensation
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatSalary(selectedJob)}
                        </div>
                      </div>
                      {selectedJob.gender &&
                        selectedJob.gender !== "Anyone Can Apply" && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">
                              Gender
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {selectedJob.gender}
                            </div>
                          </div>
                        )}
                      {selectedJob.education && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="text-sm text-gray-500 mb-1">
                            Education
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            {selectedJob.education}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Action buttons (right) ── */}
                  <div className="flex flex-col gap-3 min-w-[180px]">
                    {!hasApplied && (
                      <button
                        onClick={() => toggleSaveJob(selectedJob.jobId)}
                        className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                          savedJobs.includes(selectedJob.jobId)
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${savedJobs.includes(selectedJob.jobId) ? "fill-current" : ""}`}
                        />
                        {savedJobs.includes(selectedJob.jobId)
                          ? "Saved"
                          : "Save Job"}
                      </button>
                    )}

                    {/* Apply / Status badge */}
                    <ApplyButton />

                    <button
                      onClick={async () => {
                        try {
                          if (navigator.share) {
                            await navigator.share({
                              title: selectedJob?.title,
                              url: window.location.href,
                            });
                          } else {
                            await navigator.clipboard.writeText(
                              window.location.href,
                            );
                            alert("Link copied to clipboard!");
                          }
                        } catch {}
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" /> Share
                    </button>

                    {/* My Applications shortcut when applied */}
                    {hasApplied && (
                      <Link
                        to="/seeker/applied-jobs"
                        className="px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-white transition-all hover:shadow-lg"
                        style={{ backgroundColor: "#1e2558" }}
                      >
                        <Briefcase className="w-5 h-5" /> My Applications
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Job Description Card ── */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="space-y-8">
                {selectedJob.description && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-gray-500" /> Job
                      Description
                    </h2>
                    <div
                      className="prose max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: selectedJob.description,
                      }}
                    />
                  </div>
                )}

                {selectedJob.skills?.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                      <Award className="w-6 h-6 text-gray-500" /> Required
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {selectedJob.skills.map((skill, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full flex items-center gap-2"
                        >
                          <Tag className="w-4 h-4 text-blue-400" />
                          <span className="font-medium text-gray-800">
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJob.requirements?.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-gray-500" />{" "}
                      Requirements
                    </h2>
                    <div className="space-y-3">
                      {selectedJob.requirements.map((req, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJob.benefits?.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                      <Star className="w-6 h-6 text-gray-500" /> Benefits
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {selectedJob.benefits.map((benefit, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-green-50 border border-green-200 text-green-800 rounded-full text-sm font-medium"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-gray-400" /> About the
                    Company
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedJob.companyLogo}
                      alt={selectedJob.company}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = "/images/default-company.png";
                      }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {selectedJob.company}
                      </div>
                      {selectedJob.compnay?.website && (
                        <a
                          href={selectedJob.compnay.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {selectedJob.compnay.website}{" "}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    {selectedJob.compnay?.email && (
                      <div>📧 {selectedJob.compnay.email}</div>
                    )}
                    {selectedJob.compnay?.phone && (
                      <div>📞 {selectedJob.compnay.phone}</div>
                    )}
                    {selectedJob.compnay?.address && (
                      <div>📍 {selectedJob.compnay.address}</div>
                    )}
                  </div>
                </div>

                {/* ── Bottom CTA ── */}
                <div
                  className={`p-8 rounded-xl text-center ${hasApplied ? "bg-gradient-to-br from-[rgba(30,37,88,0.04)] to-[rgba(78,185,86,0.1)] border border-[#4eb956]" : "bg-green-50"}`}
                >
                  {hasApplied ? (
                    <>
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold bg-secondary">
                        ✓
                      </div>
                      <h4 className="text-2xl font-semibold mb-2 text-primary">
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
                          className={`font-semibold capitalize ${statusCfg.text}`}
                        >
                          {statusCfg.label}
                        </span>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                          to="/seeker/applied-jobs"
                          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                          style={{ backgroundColor: "#1e2558" }}
                        >
                          View My Applications
                        </Link>
                        <Link
                          to="/jobs"
                          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold border transition-all hover:bg-white"
                          style={{ borderColor: "#1e2558", color: "#1e2558" }}
                        >
                          <Briefcase className="w-5 h-5" /> Browse More Jobs
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="text-2xl font-semibold mb-3 text-gray-900">
                        Ready to Apply?
                      </h4>
                      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Don't miss this freelance opportunity!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={() => toggleSaveJob(selectedJob.jobId)}
                          className="px-8 py-3 rounded-lg font-semibold border flex items-center justify-center gap-2 border-gray-700 text-gray-700 hover:bg-white transition-all"
                        >
                          <Bookmark className="w-5 h-5" />
                          {savedJobs.includes(selectedJob.jobId)
                            ? "Job Saved"
                            : "Save for Later"}
                        </button>
                        <ApplyButton size="lg" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (20%) ── */}
          <div className="lg:w-1/5 space-y-6">
            {/* Similar Projects */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-500" /> Similar
                  Projects
                </h3>
                <div className="space-y-4">
                  {similarJobs.map((job) => (
                    <div
                      key={job.jobId}
                      onClick={() => handleJobNavigation(job)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 text-sm">
                        {job.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-emerald-600 font-medium">
                          {formatSalary(job)}
                        </span>
                        <span className="text-gray-400">{job.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Quick Actions sidebar ── */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {hasApplied ? (
                  <>
                    <div
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}
                    >
                      <span className="text-base">{statusCfg.icon}</span>
                      {statusCfg.label}
                    </div>
                    <Link
                      to="/seeker/applied-jobs"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-white hover:shadow-md transition-all"
                      style={{ backgroundColor: "#1e2558" }}
                    >
                      View My Applications
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setApplyModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-white hover:opacity-90 transition-all bg-secondary"
                    >
                      <MessageSquare className="w-4 h-4" /> Apply Now
                    </button>
                    <button
                      onClick={() => toggleSaveJob(selectedJob.jobId)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm border transition-colors ${
                        savedJobs.includes(selectedJob.jobId)
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${savedJobs.includes(selectedJob.jobId) ? "fill-current" : ""}`}
                      />
                      {savedJobs.includes(selectedJob.jobId)
                        ? "Saved"
                        : "Save Job"}
                    </button>
                  </>
                )}
                <button
                  onClick={async () => {
                    if (navigator.share)
                      await navigator.share({
                        title: selectedJob?.title,
                        url: window.location.href,
                      });
                    else {
                      await navigator.clipboard.writeText(window.location.href);
                      alert("Link copied!");
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <Link
                  to="/jobs"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-center"
                >
                  <Briefcase className="w-4 h-4" /> Browse More Jobs
                </Link>
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-secondary rounded-xl shadow-lg p-6 text-gray-900">
              <h3 className="text-lg font-bold mb-4">Project Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Proposals</span>
                  <span className="font-bold">12 Received</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Interviewing</span>
                  <span className="font-bold">3 Candidates</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Viewed</span>
                  <span className="font-bold">2 hours ago</span>
                </div>
                <div className="pt-4 border-t border-gray-900">
                  <div className="text-center text-sm mb-2">
                    Project Activity
                  </div>
                  <div className="w-full bg-primary rounded-full h-2">
                    <div
                      className="bg-purple-300 h-2 rounded-full"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Client Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Client Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                    95%
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      Response Rate
                    </div>
                    <div className="text-sm text-gray-500">
                      Typically replies in 4 hours
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-secondary rounded-full flex items-center justify-center font-bold text-sm">
                    48h
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      Avg. Hire Time
                    </div>
                    <div className="text-sm text-gray-500">
                      Usually hires within 2 days
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Pro Tips
              </h3>
              <ul className="space-y-3">
                {[
                  "Highlight relevant experience in your cover letter",
                  "Include portfolio links for similar projects",
                  "Be specific about your availability",
                  "Ask clarifying questions about project scope",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* More Freelance Opportunities */}
        {moreJobs.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                More Freelance Opportunities
              </h2>
              <button
                onClick={() => navigate("/jobs")}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 bg-transparent border-none cursor-pointer"
              >
                View all projects <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreJobs.map((job) => (
                <div
                  key={job.jobId}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleJobNavigation(job)}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.src = "/images/default-company.png";
                        }}
                      />
                      <span className="text-xs text-gray-500 truncate">
                        {job.company}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-blue-600 mb-3 text-sm">
                      {job.title}
                    </h3>
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      {job.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{job.location}</span>
                        </div>
                      )}
                      {job.category && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.category}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-emerald-600 font-bold mb-4">
                      {formatSalary(job)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobNavigation(job);
                      }}
                      className="w-full py-2 bg-secondary cursor-pointer text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Bottom Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-30">
        {hasApplied ? (
          <div className="flex gap-3">
            <div
              className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}
            >
              <span>{statusCfg.icon}</span>
              {statusCfg.label}
            </div>
            <Link
              to="/seeker/applied-jobs"
              className="flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: "#1e2558" }}
            >
              My Applications
            </Link>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => toggleSaveJob(selectedJob.jobId)}
              className={`flex-1 py-3 rounded-lg font-semibold border flex items-center justify-center gap-2 transition-colors ${
                savedJobs.includes(selectedJob.jobId)
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${savedJobs.includes(selectedJob.jobId) ? "fill-current" : ""}`}
              />
              {savedJobs.includes(selectedJob.jobId) ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => setApplyModalOpen(true)}
              className="flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer text-white bg-secondary"
            >
              Apply Now
            </button>
          </div>
        )}
      </div>

      {/* ── Apply Modal ── */}
      {!hasApplied && (
        <ApplyJobModal
          job={selectedJob}
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

export default FreelanceJobDescription;
