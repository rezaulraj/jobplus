import { useState, useEffect, useCallback } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  FileText,
  User,
  ShieldCheck,
  Send,
} from "lucide-react";
import useSeekerStore from "../store/seekerStore";
import useAuthStore from "../store/authStore";

/**
 * ApplyJobModal
 *
 * Props:
 *   job        – mapped job object from useJobStore (or AllJobs selectedJob)
 *   isOpen     – boolean controlling visibility
 *   onClose    – callback to close the modal
 *   onSuccess  – optional callback fired after successful application
 */
const ApplyJobModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { applyJob, seekerProfile, fetchSeekerProfile } = useSeekerStore();
  const { user } = useAuthStore();

  const [checks, setChecks] = useState([]);
  const [checksReady, setChecksReady] = useState(false);
  const [canApply, setCanApply] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [view, setView] = useState("apply"); // "apply" | "success"

  // ─── helpers ──────────────────────────────────────────────────────────────

  const getDaysLeft = (endDate) => {
    if (!endDate) return Infinity;
    return Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
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

  const getDeadlineLabel = (job) => {
    if (!job?.jobEndDate) return "No deadline";
    const d = getDaysLeft(job.jobEndDate);
    if (d < 0) return "Deadline passed";
    if (d === 0) return "Ends today";
    if (d === 1) return "Ends tomorrow";
    return `${d} days left`;
  };

  // ─── run validation checks ─────────────────────────────────────────────────

  const runChecks = useCallback(async () => {
    if (!job) return;
    setChecksReady(false);
    setChecks([]);

    // Ensure seeker profile is loaded
    if (!seekerProfile) {
      await fetchSeekerProfile({ silent: true });
    }

    const profile = useSeekerStore.getState().seekerProfile;
    const results = [];

    // 1. Auth + role check  (requireAuth + requireSeeker)
    const isSeeker = user && user.role === "seeker";
    results.push({
      id: "auth",
      label: "Signed in as job seeker",
      icon: ShieldCheck,
      status: isSeeker ? "pass" : "fail",
      note: isSeeker
        ? "Verified"
        : !user
          ? "Please log in"
          : "Seeker account required",
      blocking: true,
    });

    // 2. Profile completeness (soft – warns but doesn't block)
    const hasPersonalInfo = !!(
      profile?.personalInfo?.firstName && profile?.personalInfo?.phone
    );
    results.push({
      id: "profile",
      label: "Personal info filled in",
      icon: User,
      status: hasPersonalInfo ? "pass" : "warn",
      note: hasPersonalInfo
        ? "Complete"
        : "Incomplete – employers may see gaps",
      blocking: false,
    });

    // 3. Resume attached (soft)
    const hasResume = !!(
      profile?.resumeAssets?.length > 0 || profile?.resumeFile
    );
    results.push({
      id: "resume",
      label: "Resume uploaded",
      icon: FileText,
      status: hasResume ? "pass" : "warn",
      note: hasResume ? "Attached" : "No resume – add one for better chances",
      blocking: false,
    });

    // 4. Not already applied – check existing applications
    //    The backend will also enforce this, but we surface it early.
    //    We derive this from seekerProfile if the backend embeds it,
    //    otherwise we optimistically pass (backend will reject with 409/400).
    const appliedJobIds =
      profile?.applications?.map((a) => a.jobId || a.job) || [];
    const alreadyApplied = appliedJobIds.includes(job.jobId || job.id);
    results.push({
      id: "duplicate",
      label: "Not already applied",
      icon: Briefcase,
      status: alreadyApplied ? "fail" : "pass",
      note: alreadyApplied ? "You already applied to this job" : "Good to go",
      blocking: true,
    });

    // 5. Deadline check (client-side; server has its own logic)
    const daysLeft = getDaysLeft(job.jobEndDate);
    const deadlinePassed = daysLeft < 0;
    results.push({
      id: "deadline",
      label: "Application window open",
      icon: Clock,
      status: deadlinePassed ? "fail" : daysLeft <= 3 ? "warn" : "pass",
      note: deadlinePassed
        ? "Deadline has passed"
        : daysLeft === Infinity
          ? "No deadline set"
          : daysLeft <= 3
            ? `Closing soon – ${getDeadlineLabel(job)}`
            : getDeadlineLabel(job),
      blocking: deadlinePassed,
    });

    setChecks(results);
    setChecksReady(true);

    const blocked = results.some((r) => r.blocking && r.status === "fail");
    setCanApply(!blocked);
  }, [job, user, seekerProfile, fetchSeekerProfile]);

  useEffect(() => {
    if (isOpen && job) {
      setView("apply");
      setSubmitError("");
      runChecks();
    }
  }, [isOpen, job]);

  // ─── submit ────────────────────────────────────────────────────────────────

  const handleApply = async () => {
    if (!job) return;
    setIsSubmitting(true);
    setSubmitError("");

    // jobId must be a non-empty string (applySchema: z.object({ jobId: z.string().min(1) }))
    const jobId = job.jobId || job.id;

    if (!jobId || String(jobId).trim().length < 1) {
      setSubmitError("Invalid job. Please refresh and try again.");
      setIsSubmitting(false);
      return;
    }

    const result = await applyJob(jobId);

    if (result.success) {
      setView("success");
      onSuccess?.();
    } else {
      setSubmitError(result.error || "Application failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  // ─── close on Escape ──────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  // ─── render helpers ────────────────────────────────────────────────────────

  const StatusIcon = ({ status }) => {
    if (status === "pass")
      return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
    if (status === "fail")
      return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
    return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
  };

  const badgeClass = (status) => {
    if (status === "pass")
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (status === "fail")
      return "bg-red-50 text-red-700 border border-red-200";
    return "bg-amber-50 text-amber-700 border border-amber-200";
  };

  // ─── JSX ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* ── Success view ── */}
        {view === "success" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Application submitted!
            </h2>
            <p className="text-gray-500 text-sm mb-1">
              Your application for{" "}
              <span className="font-semibold text-gray-700">{job.title}</span>{" "}
              at{" "}
              <span className="font-semibold text-gray-700">{job.company}</span>{" "}
              has been sent.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              Track your status under <strong>My Applications</strong>.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#1e2558] text-white font-semibold text-sm hover:bg-[#161c45] transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {/* ── Apply view ── */}
        {view === "apply" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2
                id="apply-modal-title"
                className="text-base font-bold text-[#1e2558]"
              >
                Confirm application
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Job summary card */}
            <div className="px-5 py-4 bg-slate-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-11 h-11 rounded-xl object-contain bg-white border border-gray-200 p-1"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-[#1e2558]/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#1e2558]" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {job.title}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {job.company}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      {job.location || "Remote"}
                    </span>
                    <span className="text-xs font-semibold text-[#4eb956]">
                      {formatSalary(job.salary)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4">
              {/* Validation checklist */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Pre-flight checks
              </p>

              {!checksReady ? (
                <div className="flex items-center gap-2 py-6 justify-center text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Checking eligibility…</span>
                </div>
              ) : (
                <ul className="space-y-2 mb-4">
                  {checks.map((chk) => (
                    <li
                      key={chk.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50"
                    >
                      <StatusIcon status={chk.status} />
                      <span className="flex-1 text-sm text-gray-700">
                        {chk.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass(
                          chk.status,
                        )}`}
                      >
                        {chk.note}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Error banner */}
              {submitError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              {/* Disclaimer */}
              {checksReady && (
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  By applying, you confirm your profile details are accurate.
                  The employer will receive your{" "}
                  <span className="text-gray-600">
                    resume, skills, and contact info
                  </span>{" "}
                  as shown on your profile.
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={!canApply || isSubmitting || !checksReady}
                  className="flex-1 py-2.5 rounded-xl bg-[#4eb956] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#3da044] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Apply now
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyJobModal;
