// pages/employer/EditJob.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUsers,
  FaChevronDown,
  FaTimes,
  FaSpinner,
  FaCheck,
  FaSave,
  FaPaperPlane,
  FaExclamationCircle,
  FaTag,
  FaSearch,
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaUnderline,
  FaHeading,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaFileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglassHalf,
  FaClock,
  FaShieldAlt,
  FaInfoCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import useJobPostStore from "../../store/jobPostStore";

// ── Job type options ──────────────────────────────────────────────────────────
const JOB_TYPE_OPTIONS = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
  { value: "remote", label: "Remote" },
];

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  draft: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-400",
    icon: <FaFileAlt size={11} />,
    label: "Draft",
    description: "Not submitted for review yet",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
    icon: <FaHourglassHalf size={11} />,
    label: "Pending Review",
    description: "Waiting for admin approval",
  },
  published: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
    icon: <FaCheckCircle size={11} />,
    label: "Published",
    description: "Live and visible to seekers",
  },
  expired: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-400",
    icon: <FaClock size={11} />,
    label: "Expired",
    description: "Listing has expired",
  },
  closed: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
    icon: <FaTimes size={11} />,
    label: "Closed",
    description: "Manually closed by you",
  },
  rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    icon: <FaExclamationTriangle size={11} />,
    label: "Rejected",
    description: "Rejected by admin",
  },
};

// What transitions each status allows
const STATUS_TRANSITIONS = {
  draft: [
    {
      to: "pending",
      label: "Submit for Review",
      icon: <FaPaperPlane size={11} />,
      color: "text-[#4EB956]",
      bgHover: "hover:bg-green-50",
      description: "Send to admin for approval",
    },
  ],
  pending: [],
  published: [
    {
      to: "closed",
      label: "Close Job",
      icon: <FaPause size={11} />,
      color: "text-orange-500",
      bgHover: "hover:bg-orange-50",
      description: "Stop accepting applications",
    },
  ],
  closed: [
    {
      to: "pending",
      label: "Reopen Job",
      icon: <FaPlay size={11} />,
      color: "text-[#4EB956]",
      bgHover: "hover:bg-green-50",
      description: "Resubmit for admin review",
    },
  ],
  rejected: [
    {
      to: "draft",
      label: "Move to Draft",
      icon: <FaFileAlt size={11} />,
      color: "text-gray-500",
      bgHover: "hover:bg-gray-50",
      description: "Edit and resubmit later",
    },
  ],
  expired: [],
};

// ── Rich Text Editor ──────────────────────────────────────────────────────────
const RichTextEditor = ({ value, onChange, error }) => {
  const editorRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);

  const exec = (command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    sync();
  };

  const sync = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    onChange(html);
    const text = editorRef.current.innerText || "";
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      const text = editorRef.current.innerText || "";
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    }
  }, []);

  const toolbarBtns = [
    { icon: <FaBold size={11} />, cmd: "bold", title: "Bold" },
    { icon: <FaItalic size={11} />, cmd: "italic", title: "Italic" },
    { icon: <FaUnderline size={11} />, cmd: "underline", title: "Underline" },
    {
      icon: <FaHeading size={11} />,
      cmd: "formatBlock",
      val: "h3",
      title: "Heading",
    },
    {
      icon: <FaQuoteLeft size={11} />,
      cmd: "formatBlock",
      val: "blockquote",
      title: "Quote",
    },
    {
      icon: <FaListUl size={11} />,
      cmd: "insertUnorderedList",
      title: "Bullet List",
    },
    {
      icon: <FaListOl size={11} />,
      cmd: "insertOrderedList",
      title: "Numbered List",
    },
    { icon: <FaUndo size={11} />, cmd: "undo", title: "Undo" },
    { icon: <FaRedo size={11} />, cmd: "redo", title: "Redo" },
  ];

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${
        error
          ? "border-red-400 ring-2 ring-red-100"
          : "border-gray-200 focus-within:border-[#4EB956] focus-within:ring-2 focus-within:ring-[#4EB956]/10"
      }`}
    >
      <div className="flex items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-100 flex-wrap">
        {toolbarBtns.map((btn, i) => (
          <button
            key={i}
            type="button"
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(btn.cmd, btn.val || null);
            }}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-[#1E2558] hover:shadow-sm transition-all duration-150"
          >
            {btn.icon}
          </button>
        ))}
        <div className="ml-auto text-xs text-gray-400 font-medium">
          {wordCount} words
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        className="min-h-[200px] max-h-[380px] overflow-y-auto p-4 text-sm text-gray-700 outline-none leading-relaxed
          [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-3 [&_h3]:mb-1
          [&_blockquote]:border-l-4 [&_blockquote]:border-[#4EB956] [&_blockquote]:pl-3 [&_blockquote]:text-gray-500 [&_blockquote]:italic [&_blockquote]:my-2
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul_li]:mb-0.5
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol_li]:mb-0.5
          [&_strong]:font-semibold [&_em]:italic [&_u]:underline"
        data-placeholder="Describe the role, responsibilities, requirements..."
        style={{ caretColor: "#4EB956" }}
      />
      <style>{`[contenteditable]:empty:before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; }`}</style>
    </div>
  );
};

// ── Category Selector ─────────────────────────────────────────────────────────
const CategorySelector = ({ categories, loading, value, onChange, error }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = categories.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = categories.find((c) => (c.jobCategoryId || c._id) === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
          error
            ? "border-red-400 bg-red-50"
            : open
              ? "border-[#4EB956] ring-2 ring-[#4EB956]/10"
              : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <FaTag
            className={`text-sm ${selected ? "text-[#4EB956]" : "text-gray-400"}`}
          />
          <span
            className={selected ? "text-gray-800 font-medium" : "text-gray-400"}
          >
            {loading
              ? "Loading..."
              : selected
                ? selected.title
                : "Select a job category"}
          </span>
        </div>
        <FaChevronDown
          className={`text-gray-400 text-xs transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-30 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-50">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-100 rounded-lg outline-none focus:border-[#4EB956] bg-gray-50"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin text-[#4EB956]" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">
                No categories found
              </p>
            ) : (
              filtered.map((cat) => {
                const catId = cat.jobCategoryId || cat._id;
                const isSelected = catId === value;
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => {
                      onChange(catId);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? "bg-[#4EB956]/10 text-[#4EB956] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.title}</span>
                    {isSelected && (
                      <FaCheck size={11} className="text-[#4EB956]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Field Error ───────────────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
      <FaExclamationCircle size={10} /> {msg}
    </p>
  ) : null;

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ── Status Panel ──────────────────────────────────────────────────────────────
const StatusPanel = ({ job, onStatusChange, isLoading }) => {
  const [confirming, setConfirming] = useState(null);
  const status = job?.status || "draft";
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const transitions = STATUS_TRANSITIONS[status] || [];

  const handleTransition = async (transition) => {
    if (confirming === transition.to) {
      await onStatusChange(transition.to);
      setConfirming(null);
    } else {
      setConfirming(transition.to);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`px-5 py-4 border-b ${cfg.bg} ${cfg.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Current Status
            </p>
            <StatusBadge status={status} />
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border}`}
          >
            <span className={cfg.text}>{cfg.icon}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">{cfg.description}</p>
      </div>

      {/* Meta info */}
      <div className="px-5 py-4 border-b border-gray-50 space-y-2.5">
        {job?.createdAt && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <FaCalendarAlt size={10} /> Created
            </span>
            <span className="font-medium text-gray-600">
              {new Date(job.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}
        {job?.publishedAt && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <FaCheckCircle size={10} /> Published
            </span>
            <span className="font-medium text-green-600">
              {new Date(job.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}
        {job?.endDate && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <FaClock size={10} /> Expires
            </span>
            <span
              className={`font-medium ${new Date(job.endDate) < new Date() ? "text-red-500" : "text-gray-600"}`}
            >
              {new Date(job.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}
        {job?.vacancy && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <FaUsers size={10} /> Vacancies
            </span>
            <span className="font-medium text-gray-600">{job.vacancy}</span>
          </div>
        )}
      </div>

      {/* Transitions */}
      <div className="px-5 py-4">
        {transitions.length === 0 ? (
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
            <FaInfoCircle
              size={12}
              className="text-gray-400 mt-0.5 flex-shrink-0"
            />
            <p className="text-xs text-gray-500 leading-relaxed">
              {status === "pending"
                ? "This job is awaiting admin review. No action required."
                : status === "expired"
                  ? "This job listing has expired. Please create a new posting."
                  : "No status changes available."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Actions
            </p>
            {transitions.map((t) => {
              const isConfirming = confirming === t.to;
              return (
                <div key={t.to}>
                  <button
                    type="button"
                    onClick={() => handleTransition(t)}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                      isConfirming
                        ? "border-[#1E2558] bg-[#1E2558] text-white"
                        : `border-gray-200 text-gray-700 ${t.bgHover} hover:border-gray-300`
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isConfirming ? "text-white" : t.color}>
                        {isLoading && isConfirming ? (
                          <FaSpinner size={11} className="animate-spin" />
                        ) : (
                          t.icon
                        )}
                      </span>
                      <div className="text-left">
                        <p className="text-xs font-semibold">
                          {isConfirming ? "Tap again to confirm" : t.label}
                        </p>
                        <p
                          className={`text-xs ${isConfirming ? "text-white/70" : "text-gray-400"}`}
                        >
                          {t.description}
                        </p>
                      </div>
                    </div>
                    {isConfirming && (
                      <FaCheck size={10} className="text-white" />
                    )}
                  </button>
                  {isConfirming && (
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="w-full text-xs text-gray-400 hover:text-gray-600 mt-1 py-1 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Plan info */}
      <div className="px-5 py-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <FaShieldAlt size={10} />
          <span>Status changes are subject to plan limits</span>
        </div>
      </div>
    </div>
  );
};

// ── Section Card ──────────────────────────────────────────────────────────────
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1E2558]/10 to-[#4EB956]/10 flex items-center justify-center text-[#1E2558]">
        {icon}
      </div>
      <h2 className="text-sm font-bold text-gray-700">{title}</h2>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

// ── Input Field ───────────────────────────────────────────────────────────────
const InputField = ({ label, required, icon, error, children }) => (
  <div>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      {children}
    </div>
    <FieldError msg={error} />
  </div>
);

const inputClass = (hasIcon, error) =>
  `w-full ${hasIcon ? "pl-9" : "px-4"} pr-4 py-3 border rounded-xl text-sm outline-none transition-all duration-200 ${
    error
      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10"
  }`;

// ── Validate ──────────────────────────────────────────────────────────────────
function validateForm(form) {
  const errs = {};
  if (!form.jobCategoryId) errs.jobCategoryId = "Please select a category";
  if (!form.jobTitle?.trim()) errs.jobTitle = "Job title is required";
  else if (form.jobTitle.trim().length < 2)
    errs.jobTitle = "Title must be at least 2 characters";
  if (
    form.salaryMin &&
    form.salaryMax &&
    Number(form.salaryMin) > Number(form.salaryMax)
  )
    errs.salaryMax = "Max salary must be greater than min";
  const text = form.jobDescription?.replace(/<[^>]*>/g, "").trim() || "";
  if (!text) errs.jobDescription = "Job description is required";
  else if (text.length < 20)
    errs.jobDescription = "Description must be at least 20 characters";
  return errs;
}

// ── Main Component ────────────────────────────────────────────────────────────
const EditJob = () => {
  const navigate = useNavigate();
  const { id: editJobId } = useParams();

  const {
    categories,
    categoriesLoading,
    fetchCategories,
    updateJobPost,
    updateJobStatus,
    myJobs,
    fetchMyJobs,
    isSubmitting,
    isLoading,
  } = useJobPostStore();

  const [form, setForm] = useState({
    jobCategoryId: "",
    jobTitle: "",
    vacancy: "",
    jobLocation: "",
    jobType: "",
    jobDescription: "",
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "",
  });

  const [job, setJob] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (myJobs.length === 0) fetchMyJobs();
  }, []);

  useEffect(() => {
    if (editJobId && myJobs.length > 0) {
      const found = myJobs.find((j) => (j.jobId || j._id) === editJobId);
      if (found) {
        setJob(found);
        setForm({
          jobCategoryId: found.jobCategoryId || "",
          jobTitle: found.jobTitle || "",
          vacancy: found.vacancy ?? "",
          jobLocation: found.jobLocation || "",
          jobType: found.jobType || "",
          jobDescription: found.jobDescription || "",
          salaryMin: found.salaryMin ?? "",
          salaryMax: found.salaryMax ?? "",
          experienceLevel: found.experienceLevel || "",
        });
      }
    }
  }, [editJobId, myJobs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setTouched((p) => ({ ...p, [name]: true }));
  };

  const handleBlur = (e) =>
    setTouched((p) => ({ ...p, [e.target.name]: true }));

  const liveErrors = () => {
    const errs = validateForm(form);
    const visible = {};
    Object.keys(touched).forEach((k) => {
      if (errs[k]) visible[k] = errs[k];
    });
    return visible;
  };

  const visibleErrors = { ...liveErrors(), ...errors };

  const handleSave = async () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      const allTouched = {};
      Object.keys(errs).forEach((k) => {
        allTouched[k] = true;
      });
      setTouched(allTouched);
      setErrors(errs);
      return;
    }
    const payload = {
      jobCategoryId: form.jobCategoryId,
      jobTitle: form.jobTitle.trim(),
      vacancy: form.vacancy ? Number(form.vacancy) : null,
      jobLocation: form.jobLocation.trim() || null,
      jobType: form.jobType || undefined,
      jobDescription: form.jobDescription,
      salaryMin: form.salaryMin !== "" ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax !== "" ? Number(form.salaryMax) : null,
      experienceLevel: form.experienceLevel.trim() || null,
    };
    const result = await updateJobPost(editJobId, payload);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setErrors({});
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true);
    const result = await updateJobStatus(editJobId, newStatus);
    if (result.success) {
      // Update local job state
      setJob((prev) => ({ ...prev, status: newStatus }));
    }
    setStatusLoading(false);
  };

  if (isLoading && !job) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#4EB956] text-3xl mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job && myJobs.length > 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-red-400 text-2xl" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">
            Job Not Found
          </h3>
          <p className="text-gray-400 text-sm mb-5">
            This job doesn't exist or you don't have permission to edit it.
          </p>
          <Link
            to="/employer/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl text-sm font-medium"
          >
            <FaArrowLeft size={11} /> Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/employer/jobs"
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#1E2558] transition-all"
          >
            <FaArrowLeft size={13} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Job Post</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {job?.jobTitle || "Loading..."}{" "}
              {job && <span className="mx-1.5 text-gray-300">·</span>}
              {job && <StatusBadge status={job.status} />}
            </p>
          </div>
        </div>

        {/* Save button + success indicator */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-pulse">
              <FaCheckCircle size={13} /> Saved!
            </div>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#4EB956]/20 transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin" size={13} />
            ) : (
              <FaSave size={13} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Body: two-column layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form (2/3 width) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <SectionCard
            title="Basic Information"
            icon={<FaBriefcase size={12} />}
          >
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Category <span className="text-red-400">*</span>
              </label>
              <CategorySelector
                categories={categories}
                loading={categoriesLoading}
                value={form.jobCategoryId}
                onChange={(v) => {
                  setForm((p) => ({ ...p, jobCategoryId: v }));
                  setTouched((p) => ({ ...p, jobCategoryId: true }));
                }}
                error={visibleErrors.jobCategoryId}
              />
              <FieldError msg={visibleErrors.jobCategoryId} />
            </div>

            {/* Title */}
            <InputField
              label="Job Title"
              required
              error={visibleErrors.jobTitle}
            >
              <input
                type="text"
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Senior React Developer"
                className={inputClass(false, visibleErrors.jobTitle)}
              />
            </InputField>

            {/* Type & Vacancies */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Job Type
                </label>
                <div className="relative">
                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all appearance-none bg-white text-gray-700"
                  >
                    <option value="">Select type</option>
                    {JOB_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>
              </div>
              <InputField label="Vacancies" icon={<FaUsers size={12} />}>
                <input
                  type="number"
                  name="vacancy"
                  value={form.vacancy}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g. 3"
                  className={inputClass(true, null)}
                />
              </InputField>
            </div>
          </SectionCard>

          {/* Location & Compensation */}
          <SectionCard
            title="Location & Compensation"
            icon={<FaMapMarkerAlt size={12} />}
          >
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Job Location"
                icon={<FaMapMarkerAlt size={12} />}
              >
                <input
                  type="text"
                  name="jobLocation"
                  value={form.jobLocation}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka or Remote"
                  className={inputClass(true, null)}
                />
              </InputField>
              <InputField
                label="Experience Level"
                icon={<FaBriefcase size={12} />}
              >
                <input
                  type="text"
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleChange}
                  placeholder="e.g. 3+ years"
                  className={inputClass(true, null)}
                />
              </InputField>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Salary Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="number"
                    name="salaryMin"
                    value={form.salaryMin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Min salary"
                    min="0"
                    className={inputClass(true, null)}
                  />
                </div>
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="number"
                    name="salaryMax"
                    value={form.salaryMax}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Max salary"
                    min="0"
                    className={inputClass(true, visibleErrors.salaryMax)}
                  />
                </div>
              </div>
              <FieldError msg={visibleErrors.salaryMax} />
              <p className="text-xs text-gray-400 mt-1.5">
                Leave blank if not specified
              </p>
            </div>
          </SectionCard>

          {/* Description */}
          <SectionCard title="Job Description" icon={<FaFileAlt size={12} />}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description <span className="text-red-400">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Include responsibilities, requirements, and benefits for the
                best applicants.
              </p>
              <RichTextEditor
                value={form.jobDescription}
                onChange={(v) => {
                  setForm((p) => ({ ...p, jobDescription: v }));
                  setTouched((p) => ({ ...p, jobDescription: true }));
                }}
                error={visibleErrors.jobDescription}
              />
              <FieldError msg={visibleErrors.jobDescription} />
            </div>
          </SectionCard>

          {/* Footer actions */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
            <Link
              to="/employer/jobs"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-all"
            >
              <FaTimes size={11} /> Discard Changes
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#4EB956]/20 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin" size={13} />
              ) : (
                <FaSave size={13} />
              )}
              Save Changes
            </button>
          </div>
        </div>

        {/* Right: Status Panel (1/3 width) */}
        <div className="space-y-5">
          <StatusPanel
            job={job}
            onStatusChange={handleStatusChange}
            isLoading={statusLoading}
          />

          {/* Quick tips */}
          <div className="bg-gradient-to-br from-[#1E2558]/5 to-[#4EB956]/5 rounded-2xl border border-[#4EB956]/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <FaInfoCircle size={13} className="text-[#4EB956]" />
              <p className="text-xs font-bold text-[#1E2558] uppercase tracking-wider">
                Tips
              </p>
            </div>
            <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EB956] mt-1.5 flex-shrink-0" />
                Changes to published jobs take effect immediately.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EB956] mt-1.5 flex-shrink-0" />
                Pending jobs can't accept status changes until reviewed.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EB956] mt-1.5 flex-shrink-0" />
                Rejected jobs should be moved to Draft, then edited before
                resubmitting.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
