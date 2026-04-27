import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiEdit2,
  FiPlus,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiX,
  FiDownload,
  FiVideo,
  FiGlobe,
  FiMessageSquare,
  FiStar,
  FiBookOpen,
  FiSettings,
  FiFolder,
  FiCamera,
  FiExternalLink,
  FiCheck,
  FiTrash2,
  FiChevronDown,
  FiLoader,
  FiGithub,
} from "react-icons/fi";
import useSeekerStore from "../../store/seekerStore";
import useAuthStore from "../../store/authStore";
import { toast } from "react-toastify";
import GenerateCV from "../../components/GenerateCV";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const YEARS = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() - i,
);

const INPUT =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-white placeholder:text-gray-300";
const LABEL =
  "block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5";
const BTN_P =
  "inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-200";
const BTN_G =
  "inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 rounded-xl hover:bg-gray-100 active:scale-95 transition-all";
const BTN_D =
  "inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-red-500 rounded-lg hover:bg-red-50 active:scale-95 transition-all";
const BTN_E =
  "inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-blue-600 rounded-lg hover:bg-blue-50 active:scale-95 transition-all";

// ─── Helpers ─────
const Field = ({ label, children }) => (
  <div>
    {label && <label className={LABEL}>{label}</label>}
    {children}
  </div>
);

const Row = ({ children, cols = 2 }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-${cols} gap-4`}>
    {children}
  </div>
);

const Chip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
    {label}
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-red-500 transition-colors"
      >
        <FiX size={11} />
      </button>
    )}
  </span>
);

const AddChipInput = ({ placeholder, onAdd }) => {
  const [val, setVal] = useState("");
  const submit = () => {
    if (val.trim()) {
      onAdd(val.trim());
      setVal("");
    }
  };
  return (
    <div className="flex gap-2">
      <input
        className={INPUT}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button type="button" className={BTN_P} onClick={submit}>
        Add
      </button>
    </div>
  );
};

// ─── Animated expand ───
const Expandable = ({ open, children }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (ref.current) setHeight(open ? ref.current.scrollHeight : 0);
  }, [open, children]);
  return (
    <div
      style={{
        height,
        overflow: "hidden",
        transition: "height 0.32s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
};

// ─── Section card ───────
const SectionCard = ({
  icon: IC,
  title,
  onAdd,
  addLabel = "Add",
  children,
  accent = false,
}) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${accent ? "border-emerald-200" : "border-gray-100"}`}
  >
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
          <IC size={15} className="text-emerald-600" />
        </span>
        <h2 className="font-bold text-gray-800 text-sm tracking-tight">
          {title}
        </h2>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all"
        >
          <FiPlus size={13} /> {addLabel}
        </button>
      )}
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

// ─── Inline form panel ───
const FormPanel = ({ open, onCancel, onSave, saving, children, title }) => (
  <Expandable open={open}>
    <div className="mt-4 p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 space-y-4">
      {title && (
        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
          {title}
        </p>
      )}
      {children}
      <div className="flex justify-end gap-2 pt-3 border-t border-emerald-100">
        <button type="button" onClick={onCancel} className={BTN_G}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className={BTN_P}
        >
          {saving ? (
            <>
              <FiLoader size={13} className="animate-spin" /> Saving…
            </>
          ) : (
            <>
              <FiCheck size={13} /> Save
            </>
          )}
        </button>
      </div>
    </div>
  </Expandable>
);

// ─── Empty state ─────
const EmptyState = ({ emoji, label }) => (
  <div className="text-center py-10">
    <div className="text-4xl mb-2 opacity-60">{emoji}</div>
    <p className="text-sm text-gray-400 font-medium">{label}</p>
  </div>
);

// ─── Proficiency badge ────
const PROF_CLS = {
  beginner: "bg-amber-50 text-amber-700 border-amber-100",
  intermediate: "bg-sky-50 text-sky-700 border-sky-100",
  advanced: "bg-violet-50 text-violet-700 border-violet-100",
  expert: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

// MAIN COMPONENT
const SeekerProfile = () => {
  const {
    isLoading,
    fetchSeekerProfile,
    updateSummary,
    updateSkill,
    addSkill,
    deleteSkill,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addProject,
    updateProject,
    deleteProject,
    updateJobPreferences,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    uploadProfileAssets,
    uploadResumeVideo,
  } = useSeekerStore();

  const { user } = useAuthStore();

  const [pageLoading, setPageLoading] = useState(true);
  const [profile, setProfile] = useState({
    personalInfo: null,
    summary: "",
    experiences: [],
    skills: [],
    education: [],
    preferences: null,
    projects: [],
    languages: [],
    cvPrivacy: "public",
    profileImage: null,
    videoCV: null,
  });

  const [panels, setPanels] = useState({
    personalInfo: false,
    summary: false,
    addExp: false,
    addSkill: false,
    addEdu: false,
    addProject: false,
    addLang: false,
    addPref: false,
    uploadVideo: false,
  });
  const [editPanels, setEditPanels] = useState({});
  const [saving, setSaving] = useState({});

  const togglePanel = (k, v) =>
    setPanels((p) => ({ ...p, [k]: v !== undefined ? v : !p[k] }));
  const toggleEdit = (k, v) =>
    setEditPanels((p) => ({ ...p, [k]: v !== undefined ? v : !p[k] }));
  const setSav = (k, v) => setSaving((p) => ({ ...p, [k]: v }));

  // ── Load profile ────
  const loadProfile = useCallback(async () => {
    const result = await fetchSeekerProfile();
    if (result?.success && result?.data) {
      const d = result.data;
      setProfile({
        personalInfo: d.personalInfo || null,
        summary: d.summary || "",
        experiences: d.experience || [],
        skills: d.skills || [],
        education: d.education || [],
        preferences: d.jobPreferences || null,
        projects: d.projects || [],
        languages: d.languages || [],
        cvPrivacy: d.cvPrivacy || "public",
        profileImage: d.profileImage || null,
        videoCV: d.videoCV || null,
      });
    }
  }, [fetchSeekerProfile]);

  useEffect(() => {
    (async () => {
      setPageLoading(true);
      await loadProfile();
      setPageLoading(false);
    })();
  }, [loadProfile]);

  // ── Profile completion ─────
  const pct = (() => {
    const checks = [
      !!profile.personalInfo,
      !!profile.summary,
      profile.experiences.length > 0,
      profile.skills.length > 0,
      profile.education.length > 0,
      !!profile.preferences,
      profile.projects.length > 0,
      profile.languages.length > 0,
      !!profile.profileImage,
      !!profile.videoCV,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  })();

  const completionItems = [
    { label: "Personal Info", done: !!profile.personalInfo },
    { label: "Work History", done: profile.experiences.length > 0 },
    { label: "Education", done: profile.education.length > 0 },
    { label: "Profile Picture", done: !!profile.profileImage },
    { label: "Summary", done: !!profile.summary },
    { label: "Skills", done: profile.skills.length > 0 },
    { label: "Projects", done: profile.projects.length > 0 },
    { label: "Languages", done: profile.languages.length > 0 },
    { label: "Job Preferences", done: !!profile.preferences },
    { label: "Video CV", done: !!profile.videoCV },
  ];

  // PERSONAL INFO FORM (inline)
  const PersonalInfoForm = () => {
    const { updatePersonalInfo, deletePersonalInfo } = useSeekerStore();

    const [f, setF] = useState({
      name: profile.personalInfo?.name || user?.fullName || "",
      email: profile.personalInfo?.email || user?.email || "",
      fatherName: profile.personalInfo?.fatherName || "",
      dobDay: profile.personalInfo?.dob?.day || "",
      dobMonth: profile.personalInfo?.dob?.month || "",
      dobYear: profile.personalInfo?.dob?.year || "",
      gender: profile.personalInfo?.gender || "",
      maritalStatus: profile.personalInfo?.maritalStatus || "",
      nationality: profile.personalInfo?.nationality || "",
      country: profile.personalInfo?.country || "",
      city: profile.personalInfo?.city || "",
      mobile: profile.personalInfo?.mobile || "",
      careerLevel: profile.personalInfo?.careerLevel || "",
      experience: profile.personalInfo?.experience || "",
      expectedSalary: profile.personalInfo?.expectedSalary || "",
      postalAddress: profile.personalInfo?.postalAddress || "",
    });

    useEffect(() => {
      if (panels.personalInfo) {
        setF({
          name: profile.personalInfo?.name || user?.fullName || "",
          email: profile.personalInfo?.email || user?.email || "",
          fatherName: profile.personalInfo?.fatherName || "",
          dobDay: profile.personalInfo?.dob?.day || "",
          dobMonth: profile.personalInfo?.dob?.month || "",
          dobYear: profile.personalInfo?.dob?.year || "",
          gender: profile.personalInfo?.gender || "",
          maritalStatus: profile.personalInfo?.maritalStatus || "",
          nationality: profile.personalInfo?.nationality || "",
          country: profile.personalInfo?.country || "",
          city: profile.personalInfo?.city || "",
          mobile: profile.personalInfo?.mobile || "",
          careerLevel: profile.personalInfo?.careerLevel || "",
          experience: profile.personalInfo?.experience || "",
          expectedSalary: profile.personalInfo?.expectedSalary || "",
          postalAddress: profile.personalInfo?.postalAddress || "",
        });
      }
    }, [panels.personalInfo, profile.personalInfo, user]);

    const setField = (k, v) => setF((p) => ({ ...p, [k]: v }));

    const save = async () => {
      setSav("personalInfo", true);

      const payload = {
        name: f.name.trim() || "",
        email: f.email.trim() || "",
        fatherName: f.fatherName.trim() || "",
        dob: {
          day: f.dobDay || "",
          month: f.dobMonth || "",
          year: f.dobYear || "",
        },
        gender: f.gender || "",
        maritalStatus: f.maritalStatus || "",
        nationality: f.nationality || "",
        country: f.country.trim() || "",
        city: f.city.trim() || "",
        mobile: f.mobile.trim() || "",
        careerLevel: f.careerLevel || "",
        experience: f.experience || "",
        expectedSalary: f.expectedSalary ? String(f.expectedSalary).trim() : "",
        postalAddress: f.postalAddress.trim() || "",
      };

      const result = await updatePersonalInfo(payload);

      if (result?.success) {
        await loadProfile();
        togglePanel("personalInfo", false);
        toast.success("Personal information saved!");
      } else {
        toast.error(result?.error || "Failed to save");
      }

      setSav("personalInfo", false);
    };

    const removeAll = async () => {
      const ok = window.confirm("Delete personal information?");
      if (!ok) return;

      setSav("personalInfo", true);

      const result = await deletePersonalInfo();

      if (result?.success) {
        await loadProfile();
        togglePanel("personalInfo", false);
        toast.success("Personal information removed!");
      } else {
        toast.error(result?.error || "Failed to delete");
      }

      setSav("personalInfo", false);
    };

    return (
      <FormPanel
        title="Edit Personal Information"
        open={panels.personalInfo}
        onCancel={() => togglePanel("personalInfo", false)}
        onSave={save}
        saving={saving.personalInfo}
      >
        <Row>
          <Field label="Full Name *">
            <input
              className={INPUT}
              value={f.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </Field>

          <Field label="Email *">
            <input
              className={INPUT}
              type="email"
              value={f.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </Field>
        </Row>

        <Row>
          <Field label="Father Name">
            <input
              className={INPUT}
              value={f.fatherName}
              onChange={(e) => setField("fatherName", e.target.value)}
            />
          </Field>

          <Field label="Mobile">
            <input
              className={INPUT}
              type="tel"
              value={f.mobile}
              placeholder="+880..."
              onChange={(e) => setField("mobile", e.target.value)}
            />
          </Field>
        </Row>

        <Row>
          <Field label="Date of Birth">
            <div className="grid grid-cols-3 gap-2">
              <input
                className={INPUT}
                placeholder="Day"
                value={f.dobDay}
                onChange={(e) => setField("dobDay", e.target.value)}
              />
              <select
                className={INPUT}
                value={f.dobMonth}
                onChange={(e) => setField("dobMonth", e.target.value)}
              >
                <option value="">Month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                className={INPUT}
                value={f.dobYear}
                onChange={(e) => setField("dobYear", e.target.value)}
              >
                <option value="">Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Gender">
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setField("gender", g)}
                  className={`flex-1 py-2.5 text-sm transition-all ${
                    f.gender === g
                      ? "bg-emerald-500 text-white font-semibold"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </Field>
        </Row>

        <Row>
          <Field label="Marital Status">
            <select
              className={INPUT}
              value={f.maritalStatus}
              onChange={(e) => setField("maritalStatus", e.target.value)}
            >
              <option value="">Select</option>
              {["Single", "Married", "Divorced", "Widowed"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Nationality">
            <select
              className={INPUT}
              value={f.nationality}
              onChange={(e) => setField("nationality", e.target.value)}
            >
              <option value="">Select</option>
              {[
                "Bangladeshi",
                "American",
                "British",
                "Canadian",
                "Indian",
                "Pakistani",
                "Other",
              ].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
        </Row>

        <Row>
          <Field label="Country">
            <select
              className={INPUT}
              value={f.country}
              onChange={(e) => setField("country", e.target.value)}
            >
              <option value="">Select</option>
              {[
                "Bangladesh",
                "United States",
                "United Kingdom",
                "Canada",
                "Australia",
                "India",
                "Pakistan",
                "Other",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="City">
            <input
              className={INPUT}
              value={f.city}
              placeholder="Your city"
              onChange={(e) => setField("city", e.target.value)}
            />
          </Field>
        </Row>

        <Row>
          <Field label="Career Level">
            <select
              className={INPUT}
              value={f.careerLevel}
              onChange={(e) => setField("careerLevel", e.target.value)}
            >
              <option value="">Select</option>
              {[
                "Entry Level",
                "Intermediate",
                "Senior",
                "Manager",
                "Director",
                "Executive",
              ].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Total Experience">
            <select
              className={INPUT}
              value={f.experience}
              onChange={(e) => setField("experience", e.target.value)}
            >
              <option value="">Select</option>
              {[
                "No experience",
                "Less than 1 year",
                "1-2 years",
                "3-5 years",
                "6-10 years",
                "More than 10 years",
              ].map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </Field>
        </Row>

        <Row cols={1}>
          <Field label="Expected Salary (BDT)">
            <input
              className={INPUT}
              type="number"
              value={f.expectedSalary}
              placeholder="e.g. 50000"
              onChange={(e) => setField("expectedSalary", e.target.value)}
            />
          </Field>
        </Row>

        <Field label="Postal Address">
          <textarea
            className={INPUT}
            rows={2}
            value={f.postalAddress}
            onChange={(e) => setField("postalAddress", e.target.value)}
          />
        </Field>

        <div className="pt-2">
          <button
            type="button"
            onClick={removeAll}
            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm"
          >
            Delete Personal Info
          </button>
        </div>
      </FormPanel>
    );
  };

  // SUMMARY FORM
  const SummaryForm = () => {
    const [text, setText] = useState(profile.summary || "");
    const save = async () => {
      setSav("summary", true);
      const result = await updateSummary(text);
      if (result?.success) {
        setProfile((p) => ({ ...p, summary: text }));
        togglePanel("summary", false);
        toast.success("Summary saved!");
      } else toast.error("Failed to save summary");
      setSav("summary", false);
    };
    return (
      <FormPanel
        open={panels.summary}
        onCancel={() => togglePanel("summary", false)}
        onSave={save}
        saving={saving.summary}
      >
        <Field label="Professional Summary">
          <textarea
            className={INPUT}
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write about your professional background, key strengths…"
          />
        </Field>
        <p className="text-xs text-gray-400">{text.length} characters</p>
      </FormPanel>
    );
  };

  // EXPERIENCE FORMS

  const blankExp = () => ({
    jobTitle: "",
    company: "",
    managedTeam: false,
    isCurrent: false,
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    description: "",
  });

  const ExperienceForm = ({
    initial = blankExp(),
    open,
    onCancel,
    onSave,
    title,
    savKey,
  }) => {
    const [f, setF] = useState({ ...initial });
    const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
    const save = async () => {
      if (!f.jobTitle || !f.company) {
        toast.error("Job title and company required");
        return;
      }
      setSav(savKey, true);
      const payload = {
        jobTitle: f.jobTitle,
        company: f.company,
        managedTeam: f.managedTeam,
        isCurrent: f.isCurrent,
        startMonth: Number(f.startMonth),
        startYear: Number(f.startYear),
        endMonth: f.isCurrent ? null : Number(f.endMonth),
        endYear: f.isCurrent ? null : Number(f.endYear),
        description: f.description,
      };
      onSave(payload, f.expId);
    };
    return (
      <FormPanel
        title={title}
        open={open}
        onCancel={onCancel}
        onSave={save}
        saving={saving[savKey]}
      >
        <Row>
          <Field label="Job Title *">
            <input
              className={INPUT}
              value={f.jobTitle}
              placeholder="e.g. Software Engineer"
              onChange={(e) => set("jobTitle", e.target.value)}
            />
          </Field>
          <Field label="Company *">
            <input
              className={INPUT}
              value={f.company}
              placeholder="Company name"
              onChange={(e) => set("company", e.target.value)}
            />
          </Field>
        </Row>
        <Row>
          <div>
            <label className={LABEL}>Start Date *</label>
            <div className="flex gap-2">
              <select
                className={INPUT}
                value={f.startMonth}
                onChange={(e) => set("startMonth", e.target.value)}
              >
                <option value="">Month</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                className={INPUT}
                value={f.startYear}
                onChange={(e) => set("startYear", e.target.value)}
              >
                <option value="">Year</option>
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          {!f.isCurrent && (
            <div>
              <label className={LABEL}>End Date</label>
              <div className="flex gap-2">
                <select
                  className={INPUT}
                  value={f.endMonth}
                  onChange={(e) => set("endMonth", e.target.value)}
                >
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  className={INPUT}
                  value={f.endYear}
                  onChange={(e) => set("endYear", e.target.value)}
                >
                  <option value="">Year</option>
                  {YEARS.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Row>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="rounded accent-emerald-500"
              checked={f.isCurrent}
              onChange={(e) => set("isCurrent", e.target.checked)}
            />
            Currently working here
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="rounded accent-emerald-500"
              checked={f.managedTeam}
              onChange={(e) => set("managedTeam", e.target.checked)}
            />
            Managed a team
          </label>
        </div>
        <Field label="Description">
          <textarea
            className={INPUT}
            rows={3}
            value={f.description}
            placeholder="Key responsibilities and achievements…"
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </FormPanel>
    );
  };

  const handleSaveExp = async (payload, expId) => {
    const result = expId
      ? await updateExperience(expId, payload)
      : await addExperience(payload);
    if (result?.success) {
      await loadProfile();
      togglePanel("addExp", false);
      if (expId) toggleEdit(`exp-${expId}`, false);
      toast.success(expId ? "Experience updated!" : "Experience added!");
    } else toast.error("Failed to save experience");
    setSav("addExp", false);
    setSav(`exp-${expId}`, false);
  };

  const handleDeleteExp = async (expId) => {
    if (!window.confirm("Delete this experience?")) return;
    const result = await deleteExperience(expId);
    if (result?.success) {
      await loadProfile();
      toast.success("Experience removed!");
    } else toast.error("Failed to delete");
  };

  // SKILL FORMS
  const blankSkill = () => ({ skill: "", proficiency: "" });

  const SkillForm = ({
    initial = blankSkill(),
    open,
    onCancel,
    onSave,
    title,
    savKey,
  }) => {
    const [f, setF] = useState({ ...initial });
    const save = async () => {
      if (!f.skill || !f.proficiency) {
        toast.error("Skill and proficiency required");
        return;
      }
      setSav(savKey, true);
      onSave(
        { skill: f.skill.trim(), proficiency: f.proficiency.toLowerCase() },
        f.skillId,
      );
    };
    return (
      <FormPanel
        title={title}
        open={open}
        onCancel={onCancel}
        onSave={save}
        saving={saving[savKey]}
      >
        <Row>
          <Field label="Skill *">
            <input
              className={INPUT}
              value={f.skill}
              placeholder="e.g. React.js"
              onChange={(e) => setF((p) => ({ ...p, skill: e.target.value }))}
            />
          </Field>
          <Field label="Proficiency *">
            <select
              className={INPUT}
              value={f.proficiency}
              onChange={(e) =>
                setF((p) => ({ ...p, proficiency: e.target.value }))
              }
            >
              <option value="">Select level</option>
              {["beginner", "intermediate", "advanced", "expert"].map((l) => (
                <option key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </Row>
        <div className="flex flex-wrap gap-2">
          {["beginner", "intermediate", "advanced", "expert"].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setF((p) => ({ ...p, proficiency: l }))}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all capitalize ${f.proficiency === l ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 text-gray-600 hover:border-emerald-400"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </FormPanel>
    );
  };

  const handleSaveSkill = async (payload, skillId) => {
    const result = skillId
      ? await updateSkill(skillId, payload)
      : await addSkill(payload);
    if (result?.success) {
      await loadProfile();
      togglePanel("addSkill", false);
      if (skillId) toggleEdit(`skill-${skillId}`, false);
      toast.success(skillId ? "Skill updated!" : "Skill added!");
    } else toast.error("Failed to save skill");
    setSav("addSkill", false);
    setSav(`skill-${skillId}`, false);
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Delete this skill?")) return;
    const result = await deleteSkill(skillId);
    if (result?.success) {
      await loadProfile();
      toast.success("Skill removed!");
    } else toast.error("Failed to delete");
  };

  // EDUCATION FORMS

  const blankEdu = () => ({
    institute: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
  });

  const EduForm = ({
    initial = blankEdu(),
    open,
    onCancel,
    onSave,
    title,
    savKey,
  }) => {
    const [f, setF] = useState({
      ...initial,
      startDate: initial.startDate
        ? new Date(initial.startDate).toISOString().slice(0, 10)
        : "",
      endDate: initial.endDate
        ? new Date(initial.endDate).toISOString().slice(0, 10)
        : "",
    });
    const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
    const toISO = (v) =>
      v ? new Date(`${v}T00:00:00.000Z`).toISOString() : null;
    const save = async () => {
      if (!f.institute.trim()) {
        toast.error("Institute is required");
        return;
      }
      setSav(savKey, true);
      onSave(
        {
          institute: f.institute.trim(),
          degree: f.degree.trim(),
          field: f.field.trim(),
          startDate: toISO(f.startDate),
          endDate: toISO(f.endDate),
          grade: f.grade.trim(),
          description: f.description.trim(),
        },
        f.eduId,
      );
    };
    return (
      <FormPanel
        title={title}
        open={open}
        onCancel={onCancel}
        onSave={save}
        saving={saving[savKey]}
      >
        <Field label="Institute *">
          <input
            className={INPUT}
            value={f.institute}
            placeholder="e.g. BUET"
            onChange={(e) => set("institute", e.target.value)}
          />
        </Field>
        <Row>
          <Field label="Degree">
            <input
              className={INPUT}
              value={f.degree}
              placeholder="e.g. B.Sc."
              onChange={(e) => set("degree", e.target.value)}
            />
          </Field>
          <Field label="Field of Study">
            <input
              className={INPUT}
              value={f.field}
              placeholder="e.g. Computer Science"
              onChange={(e) => set("field", e.target.value)}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Start Date">
            <input
              className={INPUT}
              type="date"
              value={f.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </Field>
          <Field label="End Date">
            <input
              className={INPUT}
              type="date"
              value={f.endDate}
              onChange={(e) => set("endDate", e.target.value)}
            />
          </Field>
        </Row>
        <Field label="Grade / CGPA">
          <input
            className={INPUT}
            value={f.grade}
            placeholder="e.g. 3.8 / 4.0"
            onChange={(e) => set("grade", e.target.value)}
          />
        </Field>
        <Field label="Description">
          <textarea
            className={INPUT}
            rows={2}
            value={f.description}
            placeholder="Activities, achievements…"
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </FormPanel>
    );
  };

  const handleSaveEdu = async (payload, eduId) => {
    const result = eduId
      ? await updateEducation(eduId, payload)
      : await addEducation(payload);
    if (result?.success) {
      await loadProfile();
      togglePanel("addEdu", false);
      if (eduId) toggleEdit(`edu-${eduId}`, false);
      toast.success(eduId ? "Education updated!" : "Education added!");
    } else toast.error("Failed to save education");
    setSav("addEdu", false);
    setSav(`edu-${eduId}`, false);
  };

  const handleDeleteEdu = async (eduId) => {
    if (!window.confirm("Delete this education record?")) return;
    const result = await deleteEducation(eduId);
    if (result?.success) {
      await loadProfile();
      toast.success("Education removed!");
    } else toast.error("Failed to delete");
  };

  // JOB PREFERENCES FORM

  const JOB_TYPE_OPTIONS = [
    { label: "Full Time", value: "full_time" },
    { label: "Part Time", value: "part_time" },
    { label: "Contract", value: "contract" },
    { label: "Internship", value: "internship" },
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
    { label: "Onsite", value: "onsite" },
  ];

  const JobPrefForm = () => {
    const init = profile.preferences;

    const [f, setF] = useState({
      preferredTitles: init?.preferredTitles || [],
      salaryMin:
        init?.salaryMin !== null && init?.salaryMin !== undefined
          ? init.salaryMin
          : "",
      salaryMax:
        init?.salaryMax !== null && init?.salaryMax !== undefined
          ? init.salaryMax
          : "",
      currency: init?.currency || "BDT",
      salaryRangeKey: init?.salaryRangeKey || "monthly",
      preferredSkills: init?.preferredSkills || [],
      jobTypes: init?.jobTypes || [],
      relocationPreference: init?.relocationPreference || "within_country",
      preferredLocations: init?.preferredLocations || [],
      noticePeriodDays: init?.noticePeriodDays ?? 30,
      openToRelocation: init?.openToRelocation || false,
    });

    const [errors, setErrors] = useState({});

    const toggle = (arr, val) =>
      arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

    const addChip = (field, val) => {
      const v = String(val || "").trim();
      if (!v) return;

      setF((p) => ({
        ...p,
        [field]: p[field].includes(v) ? p[field] : [...p[field], v],
      }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    };

    const rmChip = (field, val) =>
      setF((p) => ({ ...p, [field]: p[field].filter((x) => x !== val) }));

    const validateForm = () => {
      const newErrors = {};

      if (!f.preferredTitles || f.preferredTitles.length === 0) {
        newErrors.preferredTitles =
          "At least one preferred job title is required";
      }

      if (
        f.salaryMin !== "" &&
        f.salaryMax !== "" &&
        Number(f.salaryMin) > Number(f.salaryMax)
      ) {
        newErrors.salaryRange =
          "Maximum salary cannot be less than minimum salary";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const save = async () => {
      if (!validateForm()) {
        toast.error("Please fix the validation errors before saving");
        return;
      }

      setSav("addPref", true);

      const payload = {
        preferredTitles:
          Array.isArray(f.preferredTitles) && f.preferredTitles.length > 0
            ? f.preferredTitles
            : [],

        salaryMin:
          f.salaryMin === "" || f.salaryMin === null
            ? null
            : Number(f.salaryMin),
        salaryMax:
          f.salaryMax === "" || f.salaryMax === null
            ? null
            : Number(f.salaryMax),

        currency: f.currency || "BDT",

        salaryRangeKey: f.salaryRangeKey || "monthly",

        preferredSkills: Array.isArray(f.preferredSkills)
          ? f.preferredSkills
          : [],
        jobTypes: Array.isArray(f.jobTypes) ? f.jobTypes : [],
        preferredLocations: Array.isArray(f.preferredLocations)
          ? f.preferredLocations
          : [],
        relocationPreference: f.relocationPreference || "within_country",
        noticePeriodDays: Number(f.noticePeriodDays) || 0,
        openToRelocation: Boolean(f.openToRelocation),
      };

      console.log(
        "Saving job preferences payload:",
        JSON.stringify(payload, null, 2),
      );

      const result = await updateJobPreferences(payload);

      if (result?.success) {
        await loadProfile();
        togglePanel("addPref", false);
        toast.success("Job preferences saved successfully!");
        setErrors({});
      } else {
        console.error("Save error details:", result?.error);
        toast.error(result?.error || "Failed to save preferences");

        if (result?.validationErrors) {
          setErrors(result.validationErrors);
        }
      }

      setSav("addPref", false);
    };

    const JOB_TYPE_OPTIONS = [
      { label: "Full Time", value: "full_time" },
      { label: "Part Time", value: "part_time" },
      { label: "Contract", value: "contract" },
      { label: "Internship", value: "internship" },
      { label: "Remote", value: "remote" },
      { label: "Hybrid", value: "hybrid" },
      { label: "Onsite", value: "onsite" },
    ];

    const RELOCATION_OPTIONS = [
      { label: "Within Country", value: "within_country" },
      { label: "International", value: "international" },
      { label: "Not Open", value: "not_open" },
    ];

    const CURRENCY_OPTIONS = [
      { label: "BDT (৳)", value: "BDT" },
      { label: "USD ($)", value: "USD" },
      { label: "EUR (€)", value: "EUR" },
      { label: "GBP (£)", value: "GBP" },
    ];

    const SALARY_RANGE_OPTIONS = [
      { label: "Monthly", value: "monthly" },
      { label: "Yearly", value: "yearly" },
      { label: "Hourly", value: "hourly" },
    ];

    return (
      <FormPanel
        title="Job Preferences"
        open={panels.addPref}
        onCancel={() => {
          togglePanel("addPref", false);
          setErrors({});
        }}
        onSave={save}
        saving={saving.addPref}
      >
        <Field label="Desired Job Titles *">
          <AddChipInput
            placeholder="Add title & press Enter (e.g., Software Engineer)"
            onAdd={(v) => addChip("preferredTitles", v)}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {f.preferredTitles.map((t) => (
              <Chip
                key={t}
                label={t}
                onRemove={() => rmChip("preferredTitles", t)}
              />
            ))}
          </div>
          {errors.preferredTitles && (
            <p className="text-xs text-red-500 mt-1">
              {errors.preferredTitles}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Add at least one job title you're interested in
          </p>
        </Field>

        <div>
          <label className={LABEL}>Expected Salary Range</label>
          <div className="flex gap-2 items-center">
            <input
              className={INPUT}
              type="number"
              placeholder="Min"
              value={f.salaryMin}
              onChange={(e) => {
                setF((p) => ({ ...p, salaryMin: e.target.value }));
                if (errors.salaryRange)
                  setErrors((prev) => ({ ...prev, salaryRange: null }));
              }}
            />
            <span className="text-gray-300 font-light">–</span>
            <input
              className={INPUT}
              type="number"
              placeholder="Max"
              value={f.salaryMax}
              onChange={(e) => {
                setF((p) => ({ ...p, salaryMax: e.target.value }));
                if (errors.salaryRange)
                  setErrors((prev) => ({ ...prev, salaryRange: null }));
              }}
            />
            <select
              className={`${INPUT} w-28`}
              value={f.currency}
              onChange={(e) =>
                setF((p) => ({ ...p, currency: e.target.value }))
              }
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          {errors.salaryRange && (
            <p className="text-xs text-red-500 mt-1">{errors.salaryRange}</p>
          )}
        </div>

        <Field label="Salary Range Type">
          <select
            className={INPUT}
            value={f.salaryRangeKey}
            onChange={(e) =>
              setF((p) => ({ ...p, salaryRangeKey: e.target.value }))
            }
          >
            {SALARY_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Job Types">
          <div className="flex flex-wrap gap-2">
            {JOB_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setF((p) => ({
                    ...p,
                    jobTypes: toggle(p.jobTypes, opt.value),
                  }))
                }
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  f.jobTypes.includes(opt.value)
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "border-gray-200 text-gray-600 hover:border-emerald-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">Select all that apply</p>
        </Field>

        <Field label="Preferred Skills">
          <AddChipInput
            placeholder="Add skill & press Enter (e.g., React, Node.js)"
            onAdd={(v) => addChip("preferredSkills", v)}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {f.preferredSkills.map((s) => (
              <Chip
                key={s}
                label={s}
                onRemove={() => rmChip("preferredSkills", s)}
              />
            ))}
          </div>
        </Field>

        <Field label="Preferred Locations">
          <AddChipInput
            placeholder="Add location & press Enter (e.g., Dhaka, Remote)"
            onAdd={(v) => addChip("preferredLocations", v)}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {f.preferredLocations.map((l) => (
              <Chip
                key={l}
                label={l}
                onRemove={() => rmChip("preferredLocations", l)}
              />
            ))}
          </div>
        </Field>

        <Row>
          <Field label="Relocation Preference">
            <select
              className={INPUT}
              value={f.relocationPreference}
              onChange={(e) =>
                setF((p) => ({ ...p, relocationPreference: e.target.value }))
              }
            >
              {RELOCATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Notice Period (Days)">
            <input
              className={INPUT}
              type="number"
              min="0"
              max="365"
              value={f.noticePeriodDays}
              onChange={(e) =>
                setF((p) => ({ ...p, noticePeriodDays: e.target.value }))
              }
            />
            <p className="text-xs text-gray-400 mt-1">
              How many days notice do you need?
            </p>
          </Field>
        </Row>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            className="rounded accent-emerald-500"
            checked={f.openToRelocation}
            onChange={(e) =>
              setF((p) => ({ ...p, openToRelocation: e.target.checked }))
            }
          />
          Open to relocation
        </label>

        <div className="mt-4 p-3 bg-emerald-50 rounded-xl">
          <p className="text-xs text-emerald-700">
            💡 <span className="font-semibold">Tip:</span> Adding accurate job
            preferences helps employers find you faster and improves job
            recommendations.
          </p>
        </div>
      </FormPanel>
    );
  };

  // PROJECTS FORM

  const blankProject = () => ({
    title: "",
    description: "",
    techInput: "",
    techStack: [],
    liveUrl: "",
    repoUrl: "",
    mediaInput: "",
    mediaUrls: [],
  });

  const ProjectForm = ({
    initial = null,
    open,
    onCancel,
    onSave,
    title = "Add Project",
    savKey,
  }) => {
    const [f, setF] = useState(() => ({
      title: initial?.title || "",
      description: initial?.description || "",
      techInput: "",
      techStack: initial?.techStack || [],
      liveUrl: initial?.liveUrl || "",
      repoUrl: initial?.repoUrl || "",
      mediaInput: "",
      mediaUrls: initial?.mediaUrls || [],
    }));

    useEffect(() => {
      setF({
        title: initial?.title || "",
        description: initial?.description || "",
        techInput: "",
        techStack: initial?.techStack || [],
        liveUrl: initial?.liveUrl || "",
        repoUrl: initial?.repoUrl || "",
        mediaInput: "",
        mediaUrls: initial?.mediaUrls || [],
      });
    }, [initial, open]);

    const addChip = (field, inputField) => {
      const value = String(f[inputField] || "").trim();
      if (!value) return;

      setF((p) => ({
        ...p,
        [field]: p[field].includes(value) ? p[field] : [...p[field], value],
        [inputField]: "",
      }));
    };

    const removeChip = (field, value) => {
      setF((p) => ({
        ...p,
        [field]: p[field].filter((x) => x !== value),
      }));
    };

    const save = async () => {
      if (!f.title.trim()) {
        toast.error("Project title required");
        return;
      }

      const payload = {
        title: f.title.trim(),
        description: f.description.trim(),
        techStack: f.techStack,
        liveUrl: f.liveUrl.trim(),
        repoUrl: f.repoUrl.trim(),
        mediaUrls: f.mediaUrls,
      };

      setSav(savKey, true);
      await onSave(payload);
    };

    return (
      <FormPanel
        title={title}
        open={open}
        onCancel={onCancel}
        onSave={save}
        saving={saving[savKey]}
      >
        <Field label="Project Title *">
          <input
            className={INPUT}
            value={f.title}
            placeholder="My Awesome App"
            onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))}
          />
        </Field>

        <Row>
          <Field label="Live URL">
            <input
              className={INPUT}
              type="url"
              value={f.liveUrl}
              placeholder="https://..."
              onChange={(e) => setF((p) => ({ ...p, liveUrl: e.target.value }))}
            />
          </Field>

          <Field label="Repo URL">
            <input
              className={INPUT}
              type="url"
              value={f.repoUrl}
              placeholder="https://github.com/..."
              onChange={(e) => setF((p) => ({ ...p, repoUrl: e.target.value }))}
            />
          </Field>
        </Row>

        <Field label="Tech Stack">
          <div className="flex gap-2">
            <input
              className={INPUT}
              value={f.techInput}
              placeholder="Add tech & press button"
              onChange={(e) =>
                setF((p) => ({ ...p, techInput: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addChip("techStack", "techInput");
                }
              }}
            />
            <button
              type="button"
              className={BTN_P}
              onClick={() => addChip("techStack", "techInput")}
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {f.techStack.map((t) => (
              <Chip
                key={t}
                label={t}
                onRemove={() => removeChip("techStack", t)}
              />
            ))}
          </div>
        </Field>

        <Field label="Media URLs">
          <div className="flex gap-2">
            <input
              className={INPUT}
              type="url"
              value={f.mediaInput}
              placeholder="https://image-or-demo-link..."
              onChange={(e) =>
                setF((p) => ({ ...p, mediaInput: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addChip("mediaUrls", "mediaInput");
                }
              }}
            />
            <button
              type="button"
              className={BTN_P}
              onClick={() => addChip("mediaUrls", "mediaInput")}
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {f.mediaUrls.map((u) => (
              <Chip
                key={u}
                label={u}
                onRemove={() => removeChip("mediaUrls", u)}
              />
            ))}
          </div>
        </Field>

        <Field label="Description">
          <textarea
            className={INPUT}
            rows={4}
            value={f.description}
            placeholder="What does this project do?"
            onChange={(e) =>
              setF((p) => ({ ...p, description: e.target.value }))
            }
          />
        </Field>
      </FormPanel>
    );
  };

  const handleSaveProject = async (payload, projectId) => {
    const key = projectId ? `project-${projectId}` : "addProject";

    const result = projectId
      ? await updateProject(projectId, payload)
      : await addProject(payload);

    if (result?.success) {
      await loadProfile();
      togglePanel("addProject", false);
      if (projectId) toggleEdit(`project-${projectId}`, false);
      toast.success(projectId ? "Project updated!" : "Project added!");
    } else {
      toast.error(result?.error || "Failed to save project");
    }

    setSav(key, false);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;

    const result = await deleteProject(projectId);
    if (result?.success) {
      await loadProfile();
      toast.success("Project removed!");
    } else {
      toast.error(result?.error || "Failed to delete");
    }
  };

  const LanguageForm = ({
    initial = { language: "", proficiency: "" },
    title = "Add Language",
    open,
    onCancel,
    onSave,
    savKey,
    disableLanguage = false,
  }) => {
    const [f, setF] = useState({
      language: initial?.language || "",
      proficiency: initial?.proficiency || "",
    });

    useEffect(() => {
      if (open) {
        setF({
          language: initial?.language || "",
          proficiency: initial?.proficiency || "",
        });
      }
    }, [open, initial?.language, initial?.proficiency]);

    const LANGS = [
      "English",
      "Bengali",
      "Arabic",
      "Spanish",
      "French",
      "German",
      "Chinese",
      "Japanese",
      "Korean",
      "Russian",
      "Turkish",
      "Persian",
      "Urdu",
      "Hindi",
    ];

    const LANGUAGE_LEVEL_OPTIONS = [
      { label: "Native", value: "native" },
      { label: "Fluent", value: "fluent" },
      { label: "Professional Working", value: "professional_working" },
      { label: "Limited Working", value: "limited_working" },
      { label: "Elementary", value: "elementary" },
      { label: "Beginner", value: "beginner" },
    ];

    const save = async () => {
      if (!f.language || !f.proficiency) {
        toast.error("Language and proficiency required");
        return;
      }

      setSav(savKey, true);
      await onSave({
        language: f.language,
        proficiency: f.proficiency,
      });
    };

    return (
      <FormPanel
        title={title}
        open={open}
        onCancel={onCancel}
        onSave={save}
        saving={saving[savKey]}
      >
        <Field label="Language *">
          <select
            className={INPUT}
            value={f.language}
            disabled={disableLanguage}
            onChange={(e) => setF((p) => ({ ...p, language: e.target.value }))}
          >
            <option value="">Select language</option>
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Proficiency *">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LANGUAGE_LEVEL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setF((p) => ({ ...p, proficiency: opt.value }))}
                className={`py-2 px-3 text-xs rounded-xl border transition-all text-left ${
                  f.proficiency === opt.value
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "border-gray-200 text-gray-600 hover:border-emerald-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>
      </FormPanel>
    );
  };

  const handleSaveLanguage = async (payload, currentLanguage = null) => {
    const key = currentLanguage ? `lang-${currentLanguage}` : "addLang";

    const result = currentLanguage
      ? await updateLanguage(currentLanguage, payload.proficiency)
      : await addLanguage(payload);

    if (result?.success) {
      await loadProfile();
      togglePanel("addLang", false);
      if (currentLanguage) toggleEdit(`lang-${currentLanguage}`, false);
      toast.success(currentLanguage ? "Language updated!" : "Language added!");
    } else {
      toast.error(result?.error || "Failed to save language");
    }

    setSav(key, false);
  };

  const handleDeleteLanguage = async (language) => {
    if (!window.confirm("Delete this language?")) return;

    const result = await deleteLanguage(language);
    if (result?.success) {
      await loadProfile();
      toast.success("Language removed!");
    } else {
      toast.error(result?.error || "Failed to delete");
    }
  };

  // VIDEO CV FORM

  const VideoForm = () => {
    const [f, setF] = useState({
      title: "",
      description: "",
      videoFile: null,
      videoUrl: null,
    });
    const save = async () => {
      if (!f.videoFile) {
        toast.error("Please upload a video");
        return;
      }
      setSav("uploadVideo", true);
      const fd = new FormData();
      fd.append("video", f.videoFile);
      fd.append("title", f.title);
      fd.append("description", f.description);
      const result = await uploadResumeVideo(fd);
      if (result?.success) {
        await loadProfile();
        togglePanel("uploadVideo", false);
        toast.success("Video CV uploaded!");
      } else toast.error("Failed to upload video");
      setSav("uploadVideo", false);
    };
    return (
      <FormPanel
        title="Upload Video CV"
        open={panels.uploadVideo}
        onCancel={() => togglePanel("uploadVideo", false)}
        onSave={save}
        saving={saving.uploadVideo}
      >
        <Field label="Video Title">
          <input
            className={INPUT}
            value={f.title}
            placeholder="Professional Introduction"
            onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))}
          />
        </Field>
        <Field label="Description">
          <textarea
            className={INPUT}
            rows={2}
            value={f.description}
            onChange={(e) =>
              setF((p) => ({ ...p, description: e.target.value }))
            }
          />
        </Field>
        <div>
          <label className={LABEL}>Upload Video *</label>
          {f.videoUrl ? (
            <div className="space-y-2">
              <video className="w-full rounded-2xl" controls src={f.videoUrl} />
              <button
                type="button"
                className="text-xs text-red-500 hover:underline"
                onClick={() =>
                  setF((p) => ({ ...p, videoFile: null, videoUrl: null }))
                }
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-400 transition-all">
                <FiVideo size={30} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500 font-medium">
                  Click to upload video
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  MP4, MOV up to 50MB · 2 min recommended
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file)
                    setF((p) => ({
                      ...p,
                      videoFile: file,
                      videoUrl: URL.createObjectURL(file),
                    }));
                }}
              />
            </label>
          )}
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 text-xs text-emerald-700 space-y-1">
          <p className="font-bold mb-1">📹 Tips for a great Video CV:</p>
          <p>• Keep it under 2 minutes and dress professionally</p>
          <p>• Introduce yourself, your key skills, and motivation</p>
          <p>• Use good lighting, neutral background, speak clearly</p>
        </div>
      </FormPanel>
    );
  };

  // LOADING SCREEN

  if (pageLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-200">
            <FiLoader size={28} className="text-white animate-spin" />
          </div>
          <p className="text-gray-500 font-medium text-sm">
            Loading your profile…
          </p>
        </div>
      </div>
    );

  // RENDER
  return (
    <div className="min-h-screen bg-gray-50/80 font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:w-7/12 space-y-4">
            {/* Personal Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <FiUser size={15} className="text-emerald-600" />
                  </span>
                  <h2 className="font-bold text-gray-800 text-sm tracking-tight">
                    Personal Information
                  </h2>
                </div>
                <button
                  onClick={() => togglePanel("personalInfo")}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all"
                >
                  <FiEdit2 size={12} /> {panels.personalInfo ? "Close" : "Edit"}
                </button>
              </div>
              <div className="px-6 py-5">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Avatar + ring */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="relative w-28 h-28">
                      <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          stroke="#e5e7eb"
                          strokeWidth="5"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          stroke="#10b981"
                          strokeWidth="5"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 44}`}
                          strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
                          style={{ transition: "stroke-dashoffset 0.8s ease" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md">
                          {profile.profileImage ? (
                            <img
                              src={profile.profileImage}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiUser size={28} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      <label className="absolute -bottom-1 left-1/2 -translate-x-1/2 cursor-pointer">
                        <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-md hover:bg-emerald-600 transition-all">
                          <FiCamera size={12} className="text-white" />
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const fd = new FormData();
                              fd.append("profileImage", file);
                              const result = await uploadProfileAssets(fd);
                              if (result?.success) {
                                await loadProfile();
                                toast.success("Photo updated!");
                              } else {
                                // Fallback: show preview locally
                                setProfile((p) => ({
                                  ...p,
                                  profileImage: URL.createObjectURL(file),
                                }));
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-emerald-600">
                        {pct}%
                      </span>
                      <p className="text-xs text-gray-400">complete</p>
                    </div>
                  </div>

                  {/* Info display */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900">
                      {profile.personalInfo?.name ||
                        user?.fullName ||
                        "Your Name"}
                    </h3>

                    {profile.personalInfo?.careerLevel && (
                      <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
                        {profile.personalInfo.careerLevel}
                      </span>
                    )}

                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 pt-2">
                      {[
                        {
                          Icon: FiMail,
                          label: "Email",
                          val: profile.personalInfo?.email || user?.email,
                        },
                        {
                          Icon: FiPhone,
                          label: "Mobile",
                          val: profile.personalInfo?.mobile || "Not provided",
                        },
                        {
                          Icon: FiUser,
                          label: "Father Name",
                          val:
                            profile.personalInfo?.fatherName || "Not provided",
                        },
                        {
                          Icon: FiCalendar,
                          label: "Date of Birth",
                          val: profile.personalInfo?.dob?.month
                            ? `${profile.personalInfo.dob.day || ""} ${profile.personalInfo.dob.month} ${profile.personalInfo.dob.year || ""}`.trim()
                            : "Not provided",
                        },
                        {
                          Icon: FiMapPin,
                          label: "Location",
                          val:
                            [
                              profile.personalInfo?.city,
                              profile.personalInfo?.country,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Not provided",
                        },
                        {
                          Icon: FiDollarSign,
                          label: "Expected Salary",
                          val: profile.personalInfo?.expectedSalary
                            ? `${Number(profile.personalInfo.expectedSalary).toLocaleString()} BDT / month`
                            : "Not provided",
                        },
                      ].map(({ Icon, label, val }, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Icon
                            size={13}
                            className="text-gray-400 shrink-0 mt-0.5"
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wide text-gray-400">
                              {label}
                            </p>
                            <p className="truncate">{val}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 pt-3 border-t border-gray-100 mt-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">
                          Marital Status
                        </p>
                        <p className="text-sm text-gray-700">
                          {profile.personalInfo?.maritalStatus ||
                            "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">
                          Nationality
                        </p>
                        <p className="text-sm text-gray-700">
                          {profile.personalInfo?.nationality || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">
                          Experience
                        </p>
                        <p className="text-sm text-gray-700">
                          {profile.personalInfo?.experience || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">
                          Postal Address
                        </p>
                        <p className="text-sm text-gray-700 break-words">
                          {profile.personalInfo?.postalAddress ||
                            "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <PersonalInfoForm />
              </div>
            </div>

            {/* Summary */}
            <SectionCard
              icon={FiMessageSquare}
              title="Professional Summary"
              onAdd={() => togglePanel("summary")}
              addLabel={
                panels.summary ? "Close" : profile.summary ? "Edit" : "Add"
              }
            >
              <SummaryForm />
              {!panels.summary && profile.summary && (
                <p className="text-sm text-gray-600 leading-relaxed mt-3">
                  {profile.summary}
                </p>
              )}
              {!panels.summary && !profile.summary && (
                <EmptyState
                  emoji="✍️"
                  label="Add a professional summary to stand out"
                />
              )}
            </SectionCard>

            {/* Experience */}
            <SectionCard
              icon={FiBriefcase}
              title="Work Experience"
              onAdd={() => togglePanel("addExp")}
              addLabel={panels.addExp ? "Close" : "Add"}
            >
              <ExperienceForm
                title="Add Work Experience"
                open={panels.addExp}
                savKey="addExp"
                onCancel={() => togglePanel("addExp", false)}
                onSave={handleSaveExp}
              />
              {profile.experiences.length === 0 && !panels.addExp && (
                <EmptyState emoji="💼" label="Add your work experience" />
              )}
              <div className="space-y-3 mt-2">
                {profile.experiences.map((exp) => (
                  <div
                    key={exp.expId || exp._id}
                    className="rounded-2xl border border-gray-100 overflow-hidden hover:border-emerald-100 transition-all"
                  >
                    <div className="flex items-start gap-3 p-4">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <FiBriefcase size={14} className="text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm text-gray-800">
                              {exp.jobTitle}
                            </p>
                            <p className="text-sm text-gray-500">
                              {exp.company}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {MONTHS[(exp.startMonth || 1) - 1]}{" "}
                              {exp.startYear} —{" "}
                              {exp.isCurrent
                                ? "Present"
                                : `${MONTHS[(exp.endMonth || 1) - 1]} ${exp.endYear}`}
                            </p>
                            {exp.managedTeam && (
                              <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                                Managed team
                              </span>
                            )}
                            {exp.description && (
                              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                {exp.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              className={BTN_E}
                              onClick={() =>
                                toggleEdit(`exp-${exp.expId || exp._id}`)
                              }
                            >
                              <FiEdit2 size={10} /> Edit
                            </button>
                            <button
                              className={BTN_D}
                              onClick={() =>
                                handleDeleteExp(exp.expId || exp._id)
                              }
                            >
                              <FiTrash2 size={10} /> Del
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ExperienceForm
                      title="Edit Experience"
                      initial={exp}
                      savKey={`exp-${exp.expId || exp._id}`}
                      open={!!editPanels[`exp-${exp.expId || exp._id}`]}
                      onCancel={() =>
                        toggleEdit(`exp-${exp.expId || exp._id}`, false)
                      }
                      onSave={(payload) =>
                        handleSaveExp(payload, exp.expId || exp._id)
                      }
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Skills */}
            <SectionCard
              icon={FiStar}
              title="Skills"
              onAdd={() => togglePanel("addSkill")}
              addLabel={panels.addSkill ? "Close" : "Add"}
            >
              <SkillForm
                title="Add Skill"
                open={panels.addSkill}
                savKey="addSkill"
                onCancel={() => togglePanel("addSkill", false)}
                onSave={handleSaveSkill}
              />
              {profile.skills.length === 0 && !panels.addSkill && (
                <EmptyState emoji="⚡" label="Add your skills" />
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((s) => (
                  <div key={s.skillId} className="group">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${PROF_CLS[s.proficiency] || "bg-gray-50 text-gray-600 border-gray-100"}`}
                    >
                      <span>{s.skill}</span>
                      <span className="opacity-50 capitalize font-normal">
                        · {s.proficiency}
                      </span>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600"
                        onClick={() => toggleEdit(`skill-${s.skillId}`)}
                      >
                        <FiEdit2 size={10} />
                      </button>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                        onClick={() => handleDeleteSkill(s.skillId)}
                      >
                        <FiX size={10} />
                      </button>
                    </div>
                    <SkillForm
                      title="Edit Skill"
                      initial={s}
                      savKey={`skill-${s.skillId}`}
                      open={!!editPanels[`skill-${s.skillId}`]}
                      onCancel={() => toggleEdit(`skill-${s.skillId}`, false)}
                      onSave={(payload) => handleSaveSkill(payload, s.skillId)}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Education */}
            <SectionCard
              icon={FiBookOpen}
              title="Education"
              onAdd={() => togglePanel("addEdu")}
              addLabel={panels.addEdu ? "Close" : "Add"}
            >
              <EduForm
                title="Add Education"
                open={panels.addEdu}
                savKey="addEdu"
                onCancel={() => togglePanel("addEdu", false)}
                onSave={handleSaveEdu}
              />
              {profile.education.length === 0 && !panels.addEdu && (
                <EmptyState
                  emoji="🎓"
                  label="Add your educational background"
                />
              )}
              <div className="space-y-3 mt-2">
                {profile.education.map((edu) => (
                  <div
                    key={edu.eduId}
                    className="rounded-2xl border border-gray-100 overflow-hidden hover:border-emerald-100 transition-all"
                  >
                    <div className="flex items-start gap-3 p-4">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <FiBookOpen size={14} className="text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm text-gray-800">
                              {edu.institute}
                            </p>
                            {(edu.degree || edu.field) && (
                              <p className="text-sm text-gray-500">
                                {[edu.degree, edu.field]
                                  .filter(Boolean)
                                  .join(" — ")}
                              </p>
                            )}
                            {(edu.startDate || edu.endDate) && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {edu.startDate
                                  ? new Date(edu.startDate).toLocaleDateString(
                                      "en-US",
                                      { year: "numeric", month: "short" },
                                    )
                                  : "—"}{" "}
                                →{" "}
                                {edu.endDate
                                  ? new Date(edu.endDate).toLocaleDateString(
                                      "en-US",
                                      { year: "numeric", month: "short" },
                                    )
                                  : "Present"}
                              </p>
                            )}
                            {edu.grade && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                GPA: {edu.grade}
                              </p>
                            )}
                            {edu.description && (
                              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                {edu.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              className={BTN_E}
                              onClick={() => toggleEdit(`edu-${edu.eduId}`)}
                            >
                              <FiEdit2 size={10} /> Edit
                            </button>
                            <button
                              className={BTN_D}
                              onClick={() => handleDeleteEdu(edu.eduId)}
                            >
                              <FiTrash2 size={10} /> Del
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <EduForm
                      title="Edit Education"
                      initial={edu}
                      savKey={`edu-${edu.eduId}`}
                      open={!!editPanels[`edu-${edu.eduId}`]}
                      onCancel={() => toggleEdit(`edu-${edu.eduId}`, false)}
                      onSave={(payload) => handleSaveEdu(payload, edu.eduId)}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Job Preferences */}
            <SectionCard
              icon={FiSettings}
              title="Job Preferences"
              onAdd={() => togglePanel("addPref")}
              addLabel={
                panels.addPref ? "Close" : profile.preferences ? "Edit" : "Add"
              }
            >
              <JobPrefForm />
              {!panels.addPref && profile.preferences && (
                <div className="space-y-3 mt-2 text-sm">
                  {profile.preferences.preferredTitles?.length > 0 && (
                    <div>
                      <p className={LABEL}>Titles</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {profile.preferences.preferredTitles.map((t) => (
                          <Chip key={t} label={t} />
                        ))}
                      </div>
                    </div>
                  )}
                  {(profile.preferences.salaryMin ||
                    profile.preferences.salaryMax) && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Salary:</span>{" "}
                      {profile.preferences.salaryMin || 0} –{" "}
                      {profile.preferences.salaryMax || "∞"}{" "}
                      {profile.preferences.currency}
                    </p>
                  )}
                  {profile.preferences.jobTypes?.length > 0 && (
                    <div>
                      <p className={LABEL}>Job Types</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {profile.preferences.jobTypes.map((t) => {
                          const found = JOB_TYPE_OPTIONS.find(
                            (opt) => opt.value === t,
                          );
                          return (
                            <Chip key={t} label={found ? found.label : t} />
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <p className="text-gray-600">
                    <span className="font-semibold">Notice:</span>{" "}
                    {profile.preferences.noticePeriodDays} days
                  </p>
                </div>
              )}
              {!panels.addPref && !profile.preferences && (
                <EmptyState emoji="🎯" label="Set your job preferences" />
              )}
            </SectionCard>

            {/* Projects */}
            <SectionCard
              icon={FiFolder}
              title="Projects"
              onAdd={() => togglePanel("addProject")}
              addLabel={panels.addProject ? "Close" : "Add"}
            >
              <ProjectForm
                title="Add Project"
                open={panels.addProject}
                savKey="addProject"
                onCancel={() => togglePanel("addProject", false)}
                onSave={(payload) => handleSaveProject(payload)}
              />

              {profile.projects.length === 0 && !panels.addProject && (
                <EmptyState emoji="📁" label="Showcase your projects" />
              )}

              <div className="grid gap-3 mt-2">
                {profile.projects.map((pr) => (
                  <div
                    key={pr.projectId}
                    className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 hover:border-emerald-100 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <FiFolder size={14} className="text-gray-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm text-gray-800">
                          {pr.title}
                        </p>

                        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {pr.liveUrl && (
                            <a
                              href={pr.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <FiExternalLink size={12} />
                            </a>
                          )}

                          {pr.repoUrl && (
                            <a
                              href={pr.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                            >
                              <FiGithub size={12} />
                            </a>
                          )}

                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            onClick={() =>
                              toggleEdit(`project-${pr.projectId}`)
                            }
                          >
                            <FiEdit2 size={10} />
                          </button>

                          <button
                            className={BTN_D}
                            onClick={() => handleDeleteProject(pr.projectId)}
                          >
                            <FiTrash2 size={10} />
                          </button>
                        </div>
                      </div>

                      {pr.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {pr.techStack.map((tech) => (
                            <Chip key={tech} label={tech} />
                          ))}
                        </div>
                      )}

                      {pr.description && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          {pr.description}
                        </p>
                      )}

                      {pr.mediaUrls?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {pr.mediaUrls.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-emerald-600 underline truncate"
                            >
                              {url}
                            </a>
                          ))}
                        </div>
                      )}

                      <ProjectForm
                        title="Edit Project"
                        initial={pr}
                        savKey={`project-${pr.projectId}`}
                        open={!!editPanels[`project-${pr.projectId}`]}
                        onCancel={() =>
                          toggleEdit(`project-${pr.projectId}`, false)
                        }
                        onSave={(payload) =>
                          handleSaveProject(payload, pr.projectId)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Languages */}
            <SectionCard
              icon={FiGlobe}
              title="Languages"
              onAdd={() => togglePanel("addLang")}
              addLabel={panels.addLang ? "Close" : "Add"}
            >
              <LanguageForm
                title="Add Language"
                open={panels.addLang}
                savKey="addLang"
                onCancel={() => togglePanel("addLang", false)}
                onSave={(payload) => handleSaveLanguage(payload)}
              />

              {profile.languages.length === 0 && !panels.addLang && (
                <EmptyState emoji="🌐" label="Add languages you speak" />
              )}

              <div className="space-y-2 mt-2">
                {profile.languages.map((l) => (
                  <div
                    key={l.language}
                    className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 group"
                  >
                    <div>
                      <span className="text-sm font-bold text-gray-800">
                        {l.language}
                      </span>
                      <span className="ml-2 text-xs text-gray-400 font-medium">
                        {l.proficiency}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        onClick={() => toggleEdit(`lang-${l.language}`)}
                      >
                        <FiEdit2 size={10} />
                      </button>

                      <button
                        className={BTN_D}
                        onClick={() => handleDeleteLanguage(l.language)}
                      >
                        <FiTrash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}

                {profile.languages.map((l) => (
                  <LanguageForm
                    key={`form-${l.language}`}
                    title="Edit Language"
                    initial={l}
                    open={!!editPanels[`lang-${l.language}`]}
                    savKey={`lang-${l.language}`}
                    disableLanguage
                    onCancel={() => toggleEdit(`lang-${l.language}`, false)}
                    onSave={(payload) =>
                      handleSaveLanguage(payload, l.language)
                    }
                  />
                ))}
              </div>
            </SectionCard>

            {/* CV Privacy */}
            <SectionCard icon={FiGlobe} title="CV Privacy Settings">
              <div className="space-y-2">
                {[
                  {
                    val: "public",
                    title: "Public",
                    desc: "Visible to all registered employers on the platform",
                  },
                  {
                    val: "private",
                    title: "Private",
                    desc: "Hidden from search. You can still attach it when applying.",
                  },
                ].map((opt) => (
                  <label
                    key={opt.val}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${profile.cvPrivacy === opt.val ? "border-emerald-400 bg-emerald-50/40" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <input
                      type="radio"
                      name="cvPrivacy"
                      value={opt.val}
                      checked={profile.cvPrivacy === opt.val}
                      onChange={() =>
                        setProfile((p) => ({ ...p, cvPrivacy: opt.val }))
                      }
                      className="mt-0.5 accent-emerald-500"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {opt.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="lg:w-5/12">
            <div className="sticky top-6 space-y-4">
              {/* Video CV */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <FiVideo size={15} className="text-emerald-600" />
                    </span>
                    <h2 className="font-bold text-gray-800 text-sm tracking-tight">
                      Video CV
                    </h2>
                  </div>
                  <button
                    onClick={() => togglePanel("uploadVideo")}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <FiPlus size={13} />{" "}
                    {panels.uploadVideo ? "Close" : "Upload"}
                  </button>
                </div>
                <div className="px-6 py-5">
                  <VideoForm />
                  {!panels.uploadVideo &&
                    (profile.videoCV ? (
                      <div className="space-y-2">
                        <video
                          className="w-full rounded-2xl"
                          controls
                          src={profile.videoCV.videoUrl || profile.videoCV.url}
                        />
                        <p className="text-sm font-bold text-gray-700">
                          {profile.videoCV.title || "My Video CV"}
                        </p>
                      </div>
                    ) : (
                      <div
                        onClick={() => togglePanel("uploadVideo", true)}
                        className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-emerald-400 transition-all"
                      >
                        <FiVideo
                          size={26}
                          className="mx-auto text-gray-300 mb-2"
                        />
                        <p className="text-sm text-gray-500 font-medium">
                          Click to upload your video CV
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          MP4 · Max 50MB · 2 min
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Download CV */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <GenerateCV profile={profile} user={user} />

                <p className="text-xs text-gray-400 text-center mt-2">
                  Keep your profile updated for better recommendations
                </p>
              </div>

              {/* Profile Completion Tracker */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-gray-800 tracking-tight">
                    Profile Completion
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {pct}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="space-y-3">
                  {completionItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${item.done ? "bg-emerald-500 shadow-sm shadow-emerald-200" : "border-2 border-gray-200"}`}
                      >
                        {item.done && (
                          <FiCheck
                            size={9}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span
                        className={`text-xs transition-colors ${item.done ? "text-gray-700 font-semibold" : "text-gray-400"}`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfile;
