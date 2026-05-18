import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  Eye,
  Building2,
  DollarSign,
  Clock,
  Hourglass,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";
import useSeekerStore from "../../store/seekerStore";
import useJobStore from "../../store/JobStore";

// ─── constants ────────────────────────────────────────────────────────────────

const LIMIT = 10;

const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    icon: Clock,
  },
  pending: {
    label: "Pending",
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
    icon: Clock,
  },
  under_review: {
    label: "Under Review",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: Hourglass,
  },
  reviewed: {
    label: "Reviewed",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
    icon: Eye,
  },
  shortlisted: {
    label: "Shortlisted",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
    icon: Star,
  },
  accepted: {
    label: "Accepted",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
    icon: XCircle,
  },
};

const getStatus = (status) => STATUS_CONFIG[status] || STATUS_CONFIG["applied"];

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const formatSalary = (salary) => {
  if (!salary) return "Negotiable";
  if (salary.min === 0 && salary.max === 0)
    return salary.default || "Negotiable";
  if (salary.min > 0 && salary.max > 0)
    return `৳${salary.min.toLocaleString()} – ৳${salary.max.toLocaleString()}`;
  if (salary.min > 0) return `৳${salary.min.toLocaleString()}+`;
  if (salary.max > 0) return `Up to ৳${salary.max.toLocaleString()}`;
  return "Negotiable";
};

// ─── skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="p-5 animate-pulse">
    <div className="flex gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-100 rounded-lg w-2/5" />
        <div className="h-3 bg-gray-100 rounded-lg w-1/4" />
        <div className="flex gap-3">
          <div className="h-3 bg-gray-100 rounded-lg w-24" />
          <div className="h-3 bg-gray-100 rounded-lg w-20" />
        </div>
      </div>
      <div className="w-24 h-16 bg-gray-100 rounded-2xl shrink-0" />
    </div>
  </div>
);

// ─── stat card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div
        className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center`}
      >
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
  </div>
);

// ─── application card ─────────────────────────────────────────────────────────

const ApplicationCard = ({ app }) => {
  const s = getStatus(app.status);
  const StatusIcon = s.icon;

  return (
    <div className="group p-5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 border-b border-gray-50 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Company logo */}
        <div className="shrink-0">
          {app.job?.companyLogo &&
          app.job.companyLogo !== "/images/default-company.png" ? (
            <img
              src={app.job.companyLogo}
              alt={app.job.company}
              className="w-14 h-14 rounded-2xl object-contain border border-gray-100 bg-white p-1.5 shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e2558]/10 to-[#4eb956]/10 flex items-center justify-center border border-gray-100">
              <Building2 className="w-6 h-6 text-[#1e2558]/50" />
            </div>
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#1e2558] transition-colors">
              {app.job?.title || "—"}
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              <StatusIcon className="w-3 h-3" />
              {s.label}
            </span>
          </div>

          <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {app.job?.company || "—"}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            {app.job?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {app.job.location}
              </span>
            )}
            {app.job?.jobType && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                {app.job.jobType}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Applied {formatDate(app.createdAt)}
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#4eb956]">
              <DollarSign className="w-3.5 h-3.5" />
              {app.job ? formatSalary(app.job.salary) : "—"}
            </span>
          </div>
        </div>

        {/* Profile views */}
        <div className="shrink-0 self-start sm:self-center">
          <div className="text-center bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-2xl px-5 py-3 min-w-[90px] shadow-sm">
            <div className="flex items-center justify-center mb-1">
              <Eye className="w-3.5 h-3.5 text-[#4eb956]" />
            </div>
            <p className="text-2xl font-black text-[#1e2558]">
              {app.profileViews ?? 0}
            </p>
            <p className="text-[10px] text-gray-400 font-medium leading-tight">
              profile views
            </p>
          </div>
        </div>
      </div>

      {/* Skills preview */}
      {app.job?.skills?.length > 0 && (
        <div className="mt-3 ml-[72px] flex flex-wrap gap-1.5">
          {app.job.skills.slice(0, 4).map((sk, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 bg-[#1e2558]/5 text-[#1e2558] text-xs rounded-lg font-medium"
            >
              {sk}
            </span>
          ))}
          {app.job.skills.length > 4 && (
            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-lg font-medium">
              +{app.job.skills.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ─── main component ───────────────────────────────────────────────────────────

const SeekerAppliedJobs = () => {
  const { fetchMyApplications } = useSeekerStore();
  const { fetchJobById } = useJobStore();

  const [enriched, setEnriched] = useState([]);
  const [meta, setMeta] = useState(null);
  // phase: "idle" | "loading" | "enriching" | "done" | "error"
  const [phase, setPhase] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  // ── load + enrich ──────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setPhase("loading");
    setErrorMsg("");
    setEnriched([]);

    const query = {
      page,
      limit: LIMIT,
      ...(filterStatus !== "all" ? { status: filterStatus } : {}),
    };

    const result = await fetchMyApplications(query);

    if (!result.success) {
      setErrorMsg("Could not load your applications. Please try again.");
      setPhase("error");
      return;
    }

    const items = result.data || [];
    setMeta(result.meta);

    if (items.length === 0) {
      setEnriched([]);
      setPhase("done");
      return;
    }

    // ── enrich: fetch job details for every application in parallel ──
    setPhase("enriching");

    const enrichedItems = await Promise.all(
      items.map(async (app) => {
        const jobId = app.jobId;
        if (!jobId) return { ...app, job: null };
        const jobResult = await fetchJobById(jobId);
        return { ...app, job: jobResult.success ? jobResult.data : null };
      }),
    );

    setEnriched(enrichedItems);
    setPhase("done");
  }, [fetchMyApplications, fetchJobById, page, filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [filterStatus]);

  // ── client-side search ─────────────────────────────────────────────────────

  const filtered = enriched.filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.job?.title?.toLowerCase().includes(q) ||
      app.job?.company?.toLowerCase().includes(q)
    );
  });

  // ── stats ──────────────────────────────────────────────────────────────────

  const totalViews = enriched.reduce((s, a) => s + (a.profileViews || 0), 0);
  const uniqueCompanies = new Set(
    enriched.map((a) => a.job?.company).filter(Boolean),
  ).size;
  const totalPages = meta?.totalPages ?? 1;
  const isLoading = phase === "loading" || phase === "enriching";

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50/70">
      {/* sticky top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <nav className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Link to="/" className="hover:text-[#4eb956] transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[#4eb956] font-semibold">
                  Applied Jobs
                </span>
              </nav>
              <h1 className="text-xl font-black text-[#1e2558]">
                My Applications
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs or companies…"
                  className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4eb956]/40 focus:border-[#4eb956] w-52 bg-gray-50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4eb956]/40 focus:border-[#4eb956] appearance-none bg-gray-50"
                >
                  <option value="all">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={TrendingUp}
            label="Total Applications"
            value={meta?.total ?? enriched.length}
            color="text-[#1e2558]"
            bg="bg-[#1e2558]/10"
          />
          <StatCard
            icon={Eye}
            label="Profile Views"
            value={totalViews}
            color="text-[#4eb956]"
            bg="bg-[#4eb956]/10"
          />
          <StatCard
            icon={Building2}
            label="Companies"
            value={uniqueCompanies}
            color="text-purple-600"
            bg="bg-purple-50"
          />
        </div>

        {/* main card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* card header */}
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#4eb956]" />
              <h2 className="font-bold text-gray-800 text-sm">
                {searchQuery || filterStatus !== "all"
                  ? `Filtered (${filtered.length})`
                  : "All Applications"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {!isLoading && meta && (
                <span className="text-xs text-gray-400">
                  {filtered.length} of {meta.total}
                </span>
              )}
              <button
                onClick={load}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-gray-400 hover:text-[#4eb956] hover:bg-gray-50 disabled:opacity-40 transition-colors"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* loading skeletons */}
          {isLoading && (
            <div className="divide-y divide-gray-50">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
              {phase === "enriching" && (
                <div className="px-5 py-3 flex items-center gap-2 text-xs text-gray-400 bg-amber-50/50">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  Fetching job details…
                </div>
              )}
            </div>
          )}

          {/* error */}
          {phase === "error" && (
            <div className="py-14 px-6 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-7 h-7 text-red-400" />
              </div>
              <p className="font-semibold text-gray-700 mb-1">{errorMsg}</p>
              <button
                onClick={load}
                className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-[#1e2558] text-white text-sm font-semibold rounded-xl hover:bg-[#161c45] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {/* empty */}
          {phase === "done" && filtered.length === 0 && (
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Briefcase className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-700 mb-1">
                {searchQuery || filterStatus !== "all"
                  ? "No matching applications"
                  : "No applications yet"}
              </h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter."
                  : "Apply to jobs and they'll appear here."}
              </p>
              {(searchQuery || filterStatus !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* application list */}
          {phase === "done" && filtered.length > 0 && (
            <div>
              {filtered.map((app) => (
                <ApplicationCard key={app._id || app.applicationId} app={app} />
              ))}
            </div>
          )}

          {/* pagination */}
          {phase === "done" && totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-xl bg-[#4eb956] text-white hover:bg-[#3da044] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerAppliedJobs;
