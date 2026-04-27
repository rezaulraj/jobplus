// pages/employer/PostJob.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "react-icons/fa";
import useJobPostStore from "../../store/jobPostStore";

// ── Job type options matching backend JOB_TYPES enum ─────────────────────────
const JOB_TYPE_OPTIONS = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
  { value: "remote", label: "Remote" },
];

// ── Minimal Rich Text Editor ───────────────────────────────────────────────
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

  // Sync initial value
  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      const text = editorRef.current.innerText || "";
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    }
  }, []);

  const toolbarBtns = [
    { icon: <FaBold size={12} />, cmd: "bold", title: "Bold" },
    { icon: <FaItalic size={12} />, cmd: "italic", title: "Italic" },
    { icon: <FaUnderline size={12} />, cmd: "underline", title: "Underline" },
    {
      icon: <FaHeading size={12} />,
      cmd: "formatBlock",
      val: "h3",
      title: "Heading",
    },
    {
      icon: <FaQuoteLeft size={12} />,
      cmd: "formatBlock",
      val: "blockquote",
      title: "Quote",
    },
    {
      icon: <FaListUl size={12} />,
      cmd: "insertUnorderedList",
      title: "Bullet List",
    },
    {
      icon: <FaListOl size={12} />,
      cmd: "insertOrderedList",
      title: "Numbered List",
    },
    { icon: <FaUndo size={12} />, cmd: "undo", title: "Undo" },
    { icon: <FaRedo size={12} />, cmd: "redo", title: "Redo" },
  ];

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${error ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 focus-within:border-[#4EB956] focus-within:ring-2 focus-within:ring-[#4EB956]/10"}`}
    >
      {/* Toolbar */}
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

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        className="min-h-[220px] max-h-[420px] overflow-y-auto p-4 text-sm text-gray-700 outline-none leading-relaxed
          [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-3 [&_h3]:mb-1
          [&_blockquote]:border-l-4 [&_blockquote]:border-[#4EB956] [&_blockquote]:pl-3 [&_blockquote]:text-gray-500 [&_blockquote]:italic [&_blockquote]:my-2
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul_li]:mb-0.5
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol_li]:mb-0.5
          [&_strong]:font-semibold [&_em]:italic [&_u]:underline"
        data-placeholder="Describe the role, responsibilities, requirements, and any other details..."
        style={{ caretColor: "#4EB956" }}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

// ── Category Selector ────────────────────────────────────────────────────────
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
  console.log("categories", categories);
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
              ? "Loading categories..."
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
          <div className="max-h-52 overflow-y-auto py-1">
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

// ── Field Error ──────────────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
      <FaExclamationCircle size={10} />
      {msg}
    </p>
  ) : null;

// ── Step indicator ────────────────────────────────────────────────────────────
const steps = ["Basic Info", "Details", "Description"];

const StepIndicator = ({ current }) => (
  <div className="flex items-center gap-0">
    {steps.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              i < current
                ? "bg-[#4EB956] text-white"
                : i === current
                  ? "bg-[#1E2558] text-white ring-4 ring-[#1E2558]/15"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {i < current ? <FaCheck size={10} /> : i + 1}
          </div>
          <span
            className={`text-sm font-medium transition-colors ${i === current ? "text-[#1E2558]" : i < current ? "text-[#4EB956]" : "text-gray-400"}`}
          >
            {step}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div
            className={`flex-1 h-0.5 mx-3 rounded transition-all duration-500 ${i < current ? "bg-[#4EB956]" : "bg-gray-200"}`}
            style={{ minWidth: 32 }}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  jobCategoryId: "",
  jobTitle: "",
  vacancy: "",
  jobLocation: "",
  jobType: "",
  jobDescription: "",
  salaryMin: "",
  salaryMax: "",
  experienceLevel: "",
};

function validate(form, step) {
  const errs = {};
  if (step === 0) {
    if (!form.jobCategoryId) errs.jobCategoryId = "Please select a category";
    if (!form.jobTitle.trim()) errs.jobTitle = "Job title is required";
    else if (form.jobTitle.trim().length < 2)
      errs.jobTitle = "Title must be at least 2 characters";
  }
  if (step === 1) {
    if (
      form.salaryMin &&
      form.salaryMax &&
      Number(form.salaryMin) > Number(form.salaryMax)
    ) {
      errs.salaryMax = "Max salary must be greater than min salary";
    }
  }
  if (step === 2) {
    const text = form.jobDescription?.replace(/<[^>]*>/g, "").trim() || "";
    if (!text) errs.jobDescription = "Job description is required";
    else if (text.length < 20)
      errs.jobDescription = "Description must be at least 20 characters";
  }
  return errs;
}

const PostJob = () => {
  const navigate = useNavigate();
  const { id: editJobId } = useParams(); // for edit flow (optional)

  const {
    categories,
    categoriesLoading,
    fetchCategories,
    createJobPost,
    updateJobPost,
    myJobs,
    isSubmitting,
  } = useJobPostStore();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editJobId && myJobs.length > 0) {
      const job = myJobs.find((j) => (j.jobId || j._id) === editJobId);
      if (job) {
        setForm({
          jobCategoryId: job.jobCategoryId || "",
          jobTitle: job.jobTitle || "",
          vacancy: job.vacancy ?? "",
          jobLocation: job.jobLocation || "",
          jobType: job.jobType || "",
          jobDescription: job.jobDescription || "",
          salaryMin: job.salaryMin ?? "",
          salaryMax: job.salaryMax ?? "",
          experienceLevel: job.experienceLevel || "",
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

  // Live errors for touched fields
  const liveErrors = () => {
    const errs = {
      ...validate(form, 0),
      ...validate(form, 1),
      ...validate(form, 2),
    };
    const visible = {};
    Object.keys(touched).forEach((k) => {
      if (errs[k]) visible[k] = errs[k];
    });
    return visible;
  };

  const goNext = () => {
    const errs = validate(form, step);
    if (Object.keys(errs).length > 0) {
      // mark all step fields as touched
      const allTouched = {};
      Object.keys(errs).forEach((k) => {
        allTouched[k] = true;
      });
      setTouched((p) => ({ ...p, ...allTouched }));
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleSubmit = async (isDraft = false) => {
    // Validate all steps
    const allErrs = {
      ...validate(form, 0),
      ...validate(form, 1),
      ...validate(form, 2),
    };
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      // Go back to first failing step
      if (allErrs.jobCategoryId || allErrs.jobTitle) {
        setStep(0);
        return;
      }
      if (allErrs.salaryMax) {
        setStep(1);
        return;
      }
      setStep(2);
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
      status: isDraft ? "draft" : undefined,
    };

    let result;
    if (editJobId) {
      result = await updateJobPost(editJobId, payload);
    } else {
      result = await createJobPost(payload);
    }

    if (result.success) {
      navigate("/employer/jobs");
    }
  };

  const visibleErrors = { ...liveErrors(), ...errors };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {editJobId ? "Edit Job Post" : "Post a New Job"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {editJobId
            ? "Update your job posting details"
            : "Fill in the details to attract the right candidates"}
        </p>
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <StepIndicator current={step} />
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div
          className="h-1 bg-gradient-to-r from-[#1E2558] to-[#4EB956]"
          style={{
            width: `${((step + 1) / steps.length) * 100}%`,
            transition: "width 0.4s ease",
          }}
        />

        <div className="p-7 space-y-5">
          {/* ── Step 0: Basic Info ─────────────────────────────────────── */}
          {step === 0 && (
            <>
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Senior React Developer"
                  className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all duration-200 ${
                    visibleErrors.jobTitle
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10"
                  }`}
                />
                <FieldError msg={visibleErrors.jobTitle} />
              </div>

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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Vacancies
                  </label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="number"
                      name="vacancy"
                      value={form.vacancy}
                      onChange={handleChange}
                      min="1"
                      placeholder="e.g. 3"
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Step 1: Details ────────────────────────────────────────── */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Job Location
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="jobLocation"
                    value={form.jobLocation}
                    onChange={handleChange}
                    placeholder="e.g. New York, NY or Remote"
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Experience Level
                </label>
                <div className="relative">
                  <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="experienceLevel"
                    value={form.experienceLevel}
                    onChange={handleChange}
                    placeholder="e.g. 3+ years, Entry level, Senior"
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all"
                  />
                </div>
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
                      placeholder="Min (e.g. 50000)"
                      min="0"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all"
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
                      placeholder="Max (e.g. 90000)"
                      min="0"
                      className={`w-full pl-8 pr-4 py-3 border rounded-xl text-sm outline-none transition-all ${
                        visibleErrors.salaryMax
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10"
                      }`}
                    />
                  </div>
                </div>
                <FieldError msg={visibleErrors.salaryMax} />
                <p className="text-xs text-gray-400 mt-1.5">
                  Leave blank if not specified
                </p>
              </div>
            </>
          )}

          {/* ── Step 2: Description ────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Description <span className="text-red-400">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Use the toolbar to format your description. Include
                responsibilities, requirements, and benefits.
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
          )}
        </div>

        {/* Footer nav */}
        <div className="px-7 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white hover:shadow-sm transition-all"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/employer/posted-jobs")}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-white transition-all"
            >
              <FaTimes size={11} className="inline mr-1.5" /> Cancel
            </button>
          </div>

          <div className="flex gap-2">
            {step === steps.length - 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white hover:shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin" size={12} />
                  ) : (
                    <FaSave size={12} />
                  )}
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#4EB956]/20 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin" size={12} />
                  ) : (
                    <FaPaperPlane size={12} />
                  )}
                  {editJobId ? "Update Job" : "Submit for Review"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#4EB956]/20 transition-all"
              >
                Continue →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
