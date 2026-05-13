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
import { State, City } from "country-state-city";
import useJobPostStore from "../../store/jobPostStore";

const DEFAULT_COUNTRY_CODE = "BD";

const getCountryNameFromApi = (countries, code) => {
  return countries.find((c) => c.isoCode === code)?.name || "";
};

const getStateName = (stateCode, countryCode) => {
  if (!countryCode || !stateCode) return "";
  return State.getStatesOfCountry(countryCode).find(
    (s) => s.isoCode === stateCode,
  )?.name;
};

const buildLocation = ({ city, state, country, countries = [] }) => {
  const countryName = getCountryNameFromApi(countries, country);
  const stateName = getStateName(state, country);

  return [city, stateName, countryName].filter(Boolean).join(", ");
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
        className="min-h-[220px] max-h-[420px] overflow-y-auto p-4 text-sm text-gray-700 outline-none leading-relaxed
        [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-3 [&_h3]:mb-1
        [&_blockquote]:border-l-4 [&_blockquote]:border-[#4EB956] [&_blockquote]:pl-3 [&_blockquote]:text-gray-500 [&_blockquote]:italic [&_blockquote]:my-2
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul_li]:mb-0.5
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol_li]:mb-0.5"
        data-placeholder="Describe the role, responsibilities, requirements, and other details..."
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
      <FaExclamationCircle size={10} />
      {msg}
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
        <div className="absolute z-40 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
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
              countryId: country?.countryId || country?._id || "",
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

const steps = ["Basic Info", "Details", "Description"];

const StepIndicator = ({ current }) => (
  <div className="flex items-center gap-0 overflow-x-auto pb-1">
    {steps.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex items-center gap-2 shrink-0">
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
            className={`text-sm font-medium ${
              i === current
                ? "text-[#1E2558]"
                : i < current
                  ? "text-[#4EB956]"
                  : "text-gray-400"
            }`}
          >
            {step}
          </span>
        </div>

        {i < steps.length - 1 && (
          <div
            className={`flex-1 h-0.5 mx-3 rounded min-w-8 ${
              i < current ? "bg-[#4EB956]" : "bg-gray-200"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

const EMPTY_FORM = {
  jobCategoryId: "",
  jobTitle: "",
  vacancy: "",
  country: DEFAULT_COUNTRY_CODE,
  countryId: "",
  state: "",
  city: "",
  jobLocation: "Bangladesh",
  jobType: "",
  jobTypeId: "",
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
    else if (form.jobTitle.trim().length < 2) {
      errs.jobTitle = "Title must be at least 2 characters";
    }
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
    else if (text.length < 20) {
      errs.jobDescription = "Description must be at least 20 characters";
    }
  }

  return errs;
}

const PostJob = () => {
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
    fetchJobTypes();
    fetchCountries();
  }, [fetchCategories, fetchJobTypes, fetchCountries]);

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
      const job = myJobs.find((j) => (j.jobId || j._id) === editJobId);

      if (job) {
        const countryCode = job.countryCode || DEFAULT_COUNTRY_CODE;
        const stateCode = job.stateCode || "";
        const cityName = job.city || "";

        setForm({
          jobCategoryId: job.jobCategoryId || "",
          jobTitle: job.jobTitle || "",
          vacancy: job.vacancy ?? "",
          country: countryCode,
          state: stateCode,
          city: cityName,
          jobLocation:
            job.jobLocation ||
            buildLocation({
              city: cityName,
              state: stateCode,
              country: countryCode,
              countryId: job.countryId || "",
              countries,
            }) ||
            "Bangladesh",
          jobType: job.jobType || "",
          jobTypeId: job.jobTypeId || "",
          jobDescription: job.jobDescription || "",
          salaryMin: job.salaryMin ?? "",
          salaryMax: job.salaryMax ?? "",
          experienceLevel: job.experienceLevel || "",
        });
      }
    }
  }, [editJobId, myJobs, countries]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((p) => ({ ...p, [name]: value }));
    setTouched((p) => ({ ...p, [name]: true }));
  };

  const handleBlur = (e) => {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
  };

  const liveErrors = () => {
    const errs = {
      ...validate(form, 0),
      ...validate(form, 1),
      ...validate(form, 2),
    };

    const visible = {};

    Object.keys(touched).forEach((key) => {
      if (errs[key]) visible[key] = errs[key];
    });

    return visible;
  };

  const goNext = () => {
    const errs = validate(form, step);

    if (Object.keys(errs).length > 0) {
      const allTouched = {};

      Object.keys(errs).forEach((key) => {
        allTouched[key] = true;
      });

      setTouched((p) => ({ ...p, ...allTouched }));
      setErrors(errs);
      return;
    }

    setErrors({});
    setStep((s) => s + 1);
  };

  const handleSubmit = async (isDraft = false) => {
    const allErrs = {
      ...validate(form, 0),
      ...validate(form, 1),
      ...validate(form, 2),
    };

    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);

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

    const selectedJobType = jobTypes.find(
      (type) => type.jobTypeId === form.jobTypeId,
    );

    const payload = {
      jobCategoryId: form.jobCategoryId,
      jobTitle: form.jobTitle.trim(),
      vacancy: form.vacancy ? Number(form.vacancy) : null,
      
      countryId: form.countryId,
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
      status: isDraft ? "draft" : undefined,
    };

    const result = editJobId
      ? await updateJobPost(editJobId, payload)
      : await createJobPost(payload);

    if (result.success) {
      navigate("/employer/jobs");
    }
  };

  const visibleErrors = { ...liveErrors(), ...errors };

  return (
    <div className="max-w-2xl mx-auto">
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <StepIndicator current={step} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div
          className="h-1 bg-gradient-to-r from-[#1E2558] to-[#4EB956]"
          style={{
            width: `${((step + 1) / steps.length) * 100}%`,
            transition: "width 0.4s ease",
          }}
        />

        <div className="p-7 space-y-5">
          {step === 0 && (
            <>
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

          {step === 1 && (
            <>
              <LocationSelector
                form={form}
                setForm={setForm}
                countries={countries}
                countriesLoading={countriesLoading}
                visibleErrors={visibleErrors}
              />

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                    <input
                      type="number"
                      name="salaryMin"
                      value={form.salaryMin}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Min"
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
                      placeholder="Max"
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

          {step === 2 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Description <span className="text-red-400">*</span>
              </label>

              <p className="text-xs text-gray-400 mb-2">
                Include responsibilities, requirements, and benefits.
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
          )}
        </div>

        <div className="px-7 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3 flex-wrap">
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
              <FaTimes size={11} className="inline mr-1.5" />
              Cancel
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
