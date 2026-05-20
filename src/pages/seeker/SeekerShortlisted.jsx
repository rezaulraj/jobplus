import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  Star,
  MapPin,
  Calendar,
  Eye,
  Building2,
  DollarSign,
  Clock,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  XCircle,
  Sparkles,
} from "lucide-react";
import useSeekerStore from "../../store/seekerStore";
import useJobStore from "../../store/JobStore";

const LIMIT = 100;

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

const getDaysUntil = (dateString) => {
  if (!dateString) return null;
  const diffDays = Math.ceil(
    (new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24),
  );
  return diffDays;
};

const extractItems = (result) => {
  if (!result) return [];
  if (Array.isArray(result.data?.items)) return result.data.items;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.items)) return result.items;
  return [];
};

const extractMeta = (result) => {
  if (!result) return null;
  if (result.data?.meta) return result.data.meta;
  if (result.meta) return result.meta;
  return null;
};

// ─── skeleton card ──

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

// ─── stat card ────

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

// ─── shortlisted card ──

const ShortlistedCard = ({ app }) => {
  const interviewDate = app.interviewDate || app.job?.interviewDate || null;
  const daysUntilInterview = getDaysUntil(interviewDate);
  // updatedAt = when status changed to shortlisted
  const shortlistedDate = app.updatedAt || app.createdAt;

  return (
    <div className="group p-5 hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-white transition-all duration-200 border-b border-gray-50 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Company logo */}
        <div className="shrink-0">
          {app.job?.companyLogo &&
          app.job.companyLogo !== "/images/default-company.png" ? (
            <img
              src={app.job.companyLogo}
              alt={app.job?.company}
              className="w-14 h-14 rounded-2xl object-contain border border-gray-100 bg-white p-1.5 shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-[#4eb956]/20 flex items-center justify-center border border-indigo-100">
              <Building2 className="w-6 h-6 text-[#4eb956]" />
            </div>
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#4eb956] transition-colors">
              {app.job?.title || "—"}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <Star className="w-3 h-3" />
              Shortlisted
            </span>
            {app.job?.industry && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                {app.job.industry}
              </span>
            )}
          </div>

          <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {app.job?.company || "—"}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
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
            {app.job && (
              <span className="flex items-center gap-1 font-semibold text-[#4eb956]">
                <DollarSign className="w-3.5 h-3.5" />
                {formatSalary(app.job.salary)}
              </span>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
            <div>
              <p className="text-gray-400 mb-0.5">Applied Date</p>
              <p className="font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                {formatDate(app.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Shortlisted Date</p>
              <p className="font-medium text-indigo-700 flex items-center gap-1">
                <Star className="w-3 h-3 text-indigo-500" />
                {formatDate(shortlistedDate)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">
                {interviewDate ? "Interview Date" : "Interview Status"}
              </p>
              <p className="font-medium text-blue-700 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-blue-500" />
                {interviewDate
                  ? new Date(interviewDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Awaiting Schedule"}
                {daysUntilInterview && daysUntilInterview > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md text-[10px] font-semibold">
                    in {daysUntilInterview}d
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Employer note */}
          {app.notes && (
            <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100 text-xs text-gray-700">
              <span className="font-semibold text-blue-800">
                Note from Employer:{" "}
              </span>
              {app.notes}
            </div>
          )}
        </div>

        {/* Profile views + action */}
        <div className="shrink-0 self-start sm:self-center flex flex-col items-center gap-2">
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
          <button className="w-full py-2 px-4 bg-[#1e2558]/90 hover:bg-[#1e2558] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>
        </div>
      </div>

      {/* Skills */}
      {app.job?.skills?.length > 0 && (
        <div className="mt-3 ml-[72px] flex flex-wrap gap-1.5">
          {app.job.skills.slice(0, 4).map((sk, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-lg font-medium"
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

const SeekerShortlisted = () => {
  const { fetchMyApplications } = useSeekerStore();
  const { fetchJobById } = useJobStore();

  const [enriched, setEnriched] = useState([]);
  const [phase, setPhase] = useState("idle"); // "idle"|"loading"|"enriching"|"done"|"error"
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ── load ───────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setPhase("loading");
    setErrorMsg("");
    setEnriched([]);

    let result;
    try {
      result = await fetchMyApplications({ page: 1, limit: LIMIT });
    } catch (err) {
      console.error("fetchMyApplications error:", err);
      setErrorMsg("Network error. Please try again.");
      setPhase("error");
      return;
    }

    // ── debug: log raw result so you can verify shape in console ──
    console.log("[SeekerShortlisted] raw result:", result);

    // Support both { success } at top level and nested inside result.data
    const isSuccess =
      result?.success === true || result?.data?.success === true;

    if (!isSuccess) {
      setErrorMsg("Could not load applications. Please try again.");
      setPhase("error");
      return;
    }

    // Extract items regardless of nesting
    const allItems = extractItems(result);
    console.log("[SeekerShortlisted] all items:", allItems.length, allItems);

    // ── FILTER: only shortlisted ──
    const shortlistedItems = allItems.filter(
      (app) => app.status === "shortlisted",
    );
    console.log(
      "[SeekerShortlisted] shortlisted items:",
      shortlistedItems.length,
    );

    if (shortlistedItems.length === 0) {
      setEnriched([]);
      setPhase("done");
      return;
    }

    // ── enrich with job details ──
    setPhase("enriching");

    const enrichedItems = await Promise.all(
      shortlistedItems.map(async (app) => {
        if (!app.jobId) return { ...app, job: null };
        try {
          const jobResult = await fetchJobById(app.jobId);
          console.log(`[SeekerShortlisted] job ${app.jobId}:`, jobResult);
          return {
            ...app,
            job: jobResult?.success ? jobResult.data : null,
          };
        } catch {
          return { ...app, job: null };
        }
      }),
    );

    setEnriched(enrichedItems);
    setPhase("done");
  }, [fetchMyApplications, fetchJobById]);

  useEffect(() => {
    load();
  }, [load]);

  // ── client-side search ─────────────────────────────────────────────────────

  const filtered = enriched.filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.job?.title?.toLowerCase().includes(q) ||
      app.job?.company?.toLowerCase().includes(q) ||
      app.job?.industry?.toLowerCase().includes(q)
    );
  });

  // ── stats ──────────────────────────────────────────────────────────────────

  const withInterview = enriched.filter(
    (a) => a.interviewDate || a.job?.interviewDate,
  ).length;
  const uniqueCompanies = new Set(
    enriched.map((a) => a.job?.company).filter(Boolean),
  ).size;
  const isLoading = phase === "loading" || phase === "enriching";

  // ──────────────────────────────────────────────────────────────────────────

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
                <span className="text-[#1e2558] font-semibold">
                  Shortlisted Jobs
                </span>
              </nav>
              <h1 className="text-xl font-black text-[#1e2558]">
                Profile Shortlisted Jobs
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Jobs where employers have shortlisted your profile
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies…"
                className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4eb956]/40 focus:border-indigo-400 w-52 bg-gray-50"
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={Star}
            label="Total Shortlisted"
            value={enriched.length}
            color="text-[#4eb956]"
            bg="bg-indigo-50"
          />
          <StatCard
            icon={Clock}
            label="Interview Scheduled"
            value={withInterview}
            color="text-[#4eb956]"
            bg="bg-blue-50"
          />
          <StatCard
            icon={Building2}
            label="Companies"
            value={uniqueCompanies}
            color="text-[#4eb956]"
            bg="bg-purple-50"
          />
        </div>

        {/* main card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* card header */}
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4eb956]" />
              <h2 className="font-bold text-gray-800 text-sm">
                {searchQuery
                  ? `Filtered (${filtered.length})`
                  : `All Shortlisted (${enriched.length})`}
              </h2>
            </div>
            <button
              onClick={load}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 cursor-pointer ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
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
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                <Star className="w-7 h-7 text-indigo-300" />
              </div>
              <h3 className="font-bold text-gray-700 mb-1">
                {searchQuery
                  ? "No matching shortlisted jobs"
                  : "No shortlisted jobs yet"}
              </h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Employers will shortlist your profile when they're interested. Keep applying!"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* list */}
          {phase === "done" && filtered.length > 0 && (
            <div>
              {filtered.map((app) => (
                <ShortlistedCard key={app._id || app.applicationId} app={app} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerShortlisted;
