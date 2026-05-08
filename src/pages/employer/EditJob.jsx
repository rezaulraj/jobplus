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
import { State, City } from "country-state-city";
import useJobPostStore from "../../store/jobPostStore";

const DEFAULT_COUNTRY_CODE = "BD";

const getCountryNameFromApi = (countries, code) =>
  countries.find((c) => c.isoCode === code)?.name || "";

const getStateName = (stateCode, countryCode) =>
  stateCode
    ? State.getStateByCodeAndCountry(stateCode, countryCode)?.name || ""
    : "";

const buildLocation = ({ city, state, country, countries = [] }) => {
  const countryName = getCountryNameFromApi(countries, country);
  const stateName = getStateName(state, country);
  return [city, stateName, countryName].filter(Boolean).join(", ");
};

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

const RichTextEditor = ({ value, onChange, error }) => {
  const editorRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);

  const sync = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    onChange(html);

    const text = editorRef.current.innerText || "";
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }, [onChange]);

  const exec = (command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    sync();
  };

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
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol_li]:mb-0.5"
        data-placeholder="Describe the role, responsibilities, requirements..."
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

const FieldError = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
      <FaExclamationCircle size={10} /> {msg}
    </p>
  ) : null;

const ApiSearchSelector = ({
  items = [],
  loading,
  value,
  onChange,
  error,
  placeholder,
  searchPlaceholder,
  icon,
  getId,
  getLabel,
  getSubLabel,
  renderLeft,
}) => {
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

  const filtered = items.filter((item) =>
    getLabel(item)?.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = items.find((item) => getId(item) === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm transition-all duration-200 bg-white ${
          error
            ? "border-red-400 bg-red-50"
            : open
              ? "border-[#4EB956] ring-2 ring-[#4EB956]/10"
              : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selected && renderLeft ? (
            renderLeft(selected)
          ) : (
            <span className={selected ? "text-[#4EB956]" : "text-gray-400"}>
              {icon}
            </span>
          )}

          <span
            className={`truncate ${
              selected ? "text-gray-800 font-medium" : "text-gray-400"
            }`}
          >
            {loading
              ? "Loading..."
              : selected
                ? getLabel(selected)
                : placeholder}
          </span>
        </div>

        <FaChevronDown
          className={`text-gray-400 text-xs transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-[9999] w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-50">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-100 rounded-lg outline-none focus:border-[#4EB956] bg-gray-50"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin text-[#4EB956]" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">
                No data found
              </p>
            ) : (
              filtered.map((item) => {
                const id = getId(item);
                const isSelected = id === value;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onChange(id, item);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? "bg-[#4EB956]/10 text-[#4EB956] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {renderLeft && renderLeft(item)}

                      <div className="min-w-0 text-left">
                        <p className="truncate">{getLabel(item)}</p>
                        {getSubLabel?.(item) && (
                          <p className="text-[11px] text-gray-400 truncate">
                            {getSubLabel(item)}
                          </p>
                        )}
                      </div>
                    </div>

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

const LocationSelector = ({
  form,
  setForm,
  countries,
  countriesLoading,
  visibleErrors,
}) => {
  const states = form.country ? State.getStatesOfCountry(form.country) : [];
  const cities =
    form.country && form.state
      ? City.getCitiesOfState(form.country, form.state)
      : [];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Job Location
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ApiSearchSelector
          items={countries}
          loading={countriesLoading}
          value={form.country}
          onChange={(countryCode, country) => {
            const location =
              buildLocation({
                city: "",
                state: "",
                country: countryCode,
                countries,
              }) || country?.name;

            setForm((p) => ({
              ...p,
              country: countryCode,
              state: "",
              city: "",
              jobLocation: location || "",
            }));
          }}
          error={visibleErrors?.country}
          placeholder="Select Country"
          searchPlaceholder="Search country..."
          icon={<FaMapMarkerAlt />}
          getId={(item) => item.isoCode}
          getLabel={(item) => item.name}
          getSubLabel={(item) => item.isoCode}
          renderLeft={(item) =>
            item.flag ? (
              <img
                src={item.flag}
                alt={item.name}
                className="w-5 h-5 rounded-full object-cover shrink-0"
              />
            ) : (
              <FaMapMarkerAlt className="text-gray-400 text-sm" />
            )
          }
        />

        <div className="relative">
          <select
            name="state"
            value={form.state}
            disabled={!form.country}
            onChange={(e) => {
              const stateCode = e.target.value;

              const location = buildLocation({
                city: "",
                state: stateCode,
                country: form.country,
                countries,
              });

              setForm((p) => ({
                ...p,
                state: stateCode,
                city: "",
                jobLocation:
                  location || getCountryNameFromApi(countries, form.country),
              }));
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all bg-white disabled:bg-gray-100 disabled:text-gray-400 appearance-none"
          >
            <option value="">Select State/Division</option>

            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>

          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        </div>

        <div className="relative">
          <select
            name="city"
            value={form.city}
            disabled={!form.country || !form.state}
            onChange={(e) => {
              const cityName = e.target.value;

              const location = buildLocation({
                city: cityName,
                state: form.state,
                country: form.country,
                countries,
              });

              setForm((p) => ({
                ...p,
                city: cityName,
                jobLocation:
                  location || getCountryNameFromApi(countries, form.country),
              }));
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all bg-white disabled:bg-gray-100 disabled:text-gray-400 appearance-none"
          >
            <option value="">Select City</option>

            {cities.map((city, index) => (
              <option key={`${city.name}-${index}`} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#4EB956] bg-[#4EB956]/10 px-3 py-2 rounded-xl w-fit">
        <FaMapMarkerAlt />
        <span>{form.jobLocation || "No location selected"}</span>
      </div>
    </div>
  );
};

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
              className={`font-medium ${
                new Date(job.endDate) < new Date()
                  ? "text-red-500"
                  : "text-gray-600"
              }`}
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
                          className={`text-xs ${
                            isConfirming ? "text-white/70" : "text-gray-400"
                          }`}
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

      <div className="px-5 py-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <FaShieldAlt size={10} />
          <span>Status changes are subject to plan limits</span>
        </div>
      </div>
    </div>
  );
};

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

function validateForm(form) {
  const errs = {};

  if (!form.jobCategoryId) errs.jobCategoryId = "Please select a category";

  if (!form.jobTitle?.trim()) errs.jobTitle = "Job title is required";
  else if (form.jobTitle.trim().length < 2) {
    errs.jobTitle = "Title must be at least 2 characters";
  }

  if (
    form.salaryMin &&
    form.salaryMax &&
    Number(form.salaryMin) > Number(form.salaryMax)
  ) {
    errs.salaryMax = "Max salary must be greater than min";
  }

  const text = form.jobDescription?.replace(/<[^>]*>/g, "").trim() || "";

  if (!text) errs.jobDescription = "Job description is required";
  else if (text.length < 20) {
    errs.jobDescription = "Description must be at least 20 characters";
  }

  return errs;
}

const EditJob = () => {
  const navigate = useNavigate();
  const { id: editJobId } = useParams();

  const {
    categories,
    categoriesLoading,
    fetchCategories,

    jobTypes,
    jobTypesLoading,
    fetchJobTypes,

    countries,
    countriesLoading,
    fetchCountries,

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
    country: DEFAULT_COUNTRY_CODE,
    state: "",
    city: "",
    jobLocation: "Bangladesh",
    jobType: "",
    jobTypeId: "",
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
    fetchJobTypes();
    fetchCountries();

    if (myJobs.length === 0) fetchMyJobs();
  }, [
    fetchCategories,
    fetchJobTypes,
    fetchCountries,
    fetchMyJobs,
    myJobs.length,
  ]);

  useEffect(() => {
    if (!countries.length) return;

    setForm((p) => {
      if (p.jobLocation) return p;

      return {
        ...p,
        jobLocation:
          getCountryNameFromApi(countries, p.country) || "Bangladesh",
      };
    });
  }, [countries]);

  useEffect(() => {
    if (editJobId && myJobs.length > 0) {
      const found = myJobs.find((j) => (j.jobId || j._id) === editJobId);

      if (found) {
        const countryCode = found.countryCode || DEFAULT_COUNTRY_CODE;
        const stateCode = found.stateCode || "";
        const cityName = found.city || "";

        setJob(found);

        setForm({
          jobCategoryId: found.jobCategoryId || "",
          jobTitle: found.jobTitle || "",
          vacancy: found.vacancy ?? "",
          country: countryCode,
          state: stateCode,
          city: cityName,
          jobLocation:
            found.jobLocation ||
            buildLocation({
              city: cityName,
              state: stateCode,
              country: countryCode,
              countries,
            }) ||
            "Bangladesh",
          jobType: found.jobType || "",
          jobTypeId: found.jobTypeId || "",
          jobDescription: found.jobDescription || "",
          salaryMin: found.salaryMin ?? "",
          salaryMax: found.salaryMax ?? "",
          experienceLevel: found.experienceLevel || "",
        });
      }
    }
  }, [editJobId, myJobs, countries]);

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

    Object.keys(touched).forEach((key) => {
      if (errs[key]) visible[key] = errs[key];
    });

    return visible;
  };

  const visibleErrors = { ...liveErrors(), ...errors };

  const handleSave = async () => {
    const errs = validateForm(form);

    if (Object.keys(errs).length > 0) {
      const allTouched = {};

      Object.keys(errs).forEach((key) => {
        allTouched[key] = true;
      });

      setTouched(allTouched);
      setErrors(errs);
      return;
    }

    const selectedJobType = jobTypes.find(
      (type) => type.jobTypeId === form.jobTypeId,
    );

    const payload = {
      jobCategoryId: form.jobCategoryId,
      jobTitle: form.jobTitle.trim(),
      vacancy: form.vacancy ? Number(form.vacancy) : null,

      country: getCountryNameFromApi(countries, form.country) || "Bangladesh",
      countryCode: form.country || DEFAULT_COUNTRY_CODE,
      state: getStateName(form.state, form.country) || null,
      stateCode: form.state || null,
      city: form.city || null,
      jobLocation: form.jobLocation.trim() || "Bangladesh",

      jobTypeId: form.jobTypeId || null,
      jobType: selectedJobType?.title || form.jobType || null,

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
      <div className="flex items-start justify-between gap-4 flex-wrap">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <SectionCard
            title="Basic Information"
            icon={<FaBriefcase size={12} />}
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Category <span className="text-red-400">*</span>
              </label>

              <ApiSearchSelector
                items={categories}
                loading={categoriesLoading}
                value={form.jobCategoryId}
                onChange={(id) => {
                  setForm((p) => ({ ...p, jobCategoryId: id }));
                  setTouched((p) => ({ ...p, jobCategoryId: true }));
                }}
                error={visibleErrors.jobCategoryId}
                placeholder="Select a job category"
                searchPlaceholder="Search categories..."
                icon={<FaTag />}
                getId={(item) => item.jobCategoryId || item._id}
                getLabel={(item) => item.title}
              />

              <FieldError msg={visibleErrors.jobCategoryId} />
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Job Type
                </label>

                <ApiSearchSelector
                  items={jobTypes}
                  loading={jobTypesLoading}
                  value={form.jobTypeId}
                  onChange={(id, item) => {
                    setForm((p) => ({
                      ...p,
                      jobTypeId: id,
                      jobType: item.title,
                    }));
                  }}
                  placeholder="Select job type"
                  searchPlaceholder="Search job types..."
                  icon={<FaBriefcase />}
                  getId={(item) => item.jobTypeId || item._id}
                  getLabel={(item) => item.title}
                  getSubLabel={(item) =>
                    item.isActive ? "Active" : "Inactive"
                  }
                />
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

          <SectionCard
            title="Location & Compensation"
            icon={<FaMapMarkerAlt size={12} />}
          >
            <div className="space-y-4">
              <LocationSelector
                form={form}
                setForm={setForm}
                countries={countries}
                countriesLoading={countriesLoading}
                visibleErrors={visibleErrors}
              />

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                onChange={(value) => {
                  setForm((p) => ({ ...p, jobDescription: value }));
                  setTouched((p) => ({ ...p, jobDescription: true }));
                }}
                error={visibleErrors.jobDescription}
              />

              <FieldError msg={visibleErrors.jobDescription} />
            </div>
          </SectionCard>

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

        <div className="space-y-5">
          <StatusPanel
            job={job}
            onStatusChange={handleStatusChange}
            isLoading={statusLoading}
          />

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
