import React, { useState, useEffect } from "react";
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
  FiBook,
  FiTarget,
  FiBookOpen,
  FiSettings,
  FiFolder,
  FiGlobe as FiLanguage,
  FiCamera,
  FiExternalLink,
  FiLoader,
} from "react-icons/fi";
import useSeekerStore from "../../store/seekerStore";
import useAuthStore from "../../store/authStore";
import { toast } from "react-toastify";

const SeekerProfile = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    seekerProfile,
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
    removeJobPreferences,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    uploadProfileAssets,
    uploadResumeVideo,
    uploadResumeFile,
    updateResumeAssetVisibility,
    setResumeAssetActive,
    deleteResumeAsset,
    clearSeekerProfile,
  } = useSeekerStore();

  const { user, isAuthenticated } = useAuthStore();

  const [profile, setProfile] = useState({
    personalInfo: null,
    summary: null,
    experiences: [],
    skills: [],
    education: [],
    preferences: null,
    projects: [],
    languages: [],
    cvPrivacy: "public",
    profileImage: null,
    videoCV: null,
    resumeFiles: [],
  });

  // Load profile data from store
  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  const loadProfile = async () => {
    setLoading(true);
    const result = await fetchSeekerProfile();
    if (result.success && result.data) {
      // Map API data to component state
      const apiData = result.data;
      setProfile({
        personalInfo: apiData.personalInfo || null,
        summary: apiData.summary || null,
        experiences: apiData.experience || [],
        skills: apiData.skills || [],
        education: apiData.education || [],
        preferences: apiData.jobPreferences || null,
        projects: apiData.projects || [],
        languages: apiData.languages || [],
        cvPrivacy: apiData.cvPrivacy || "public",
        profileImage: apiData.profileImage || null,
        videoCV: apiData.videoCV || null,
        resumeFiles: apiData.resumeAssets || [],
      });
    }
    setLoading(false);
  };

  // Helper to convert date objects to string format for API
  const formatDateForAPI = (dateObj) => {
    if (!dateObj || !dateObj.month || !dateObj.year) return null;
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    return `${dateObj.year}-${monthMap[dateObj.month] || "01"}-01`;
  };

  // Format API date to component format
  const formatDateForComponent = (dateString) => {
    if (!dateString) return { month: "", year: "" };
    const date = new Date(dateString);
    const months = [
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
    return {
      month: months[date.getMonth()],
      year: date.getFullYear().toString(),
    };
  };

  // Popup components for each section
  const Popup = ({ title, children, onClose, onSave, size = "md" }) => {
    const sizeClass = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
    }[size];

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div
          className={`bg-white rounded-lg w-full ${sizeClass} max-h-[90vh] overflow-y-auto`}
        >
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="p-4">{children}</div>
          <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isLoading}
              className="px-4 py-2 bg-[#4eb956] text-white rounded-md hover:bg-[#3da944] disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Personal Info Popup
  const PersonalInfoPopup = () => {
    const [formData, setFormData] = useState({
      name: profile.personalInfo?.name || user?.fullName || "",
      email: profile.personalInfo?.email || user?.email || "",
      fatherName: profile.personalInfo?.fatherName || "",
      dob: profile.personalInfo?.dob || { month: "", year: "" },
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

    const months = [
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
    const years = Array.from(
      { length: 50 },
      (_, i) => new Date().getFullYear() - i,
    );

    const careerLevels = [
      "Entry Level",
      "Intermediate",
      "Senior",
      "Manager",
      "Director",
      "Executive",
    ];

    const experienceYears = [
      "No experience",
      "Less than 1 year",
      "1-2 years",
      "3-5 years",
      "6-10 years",
      "More than 10 years",
    ];

    const countries = [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "Germany",
      "France",
      "Japan",
      "India",
      "Bangladesh",
      "Pakistan",
      "Other",
    ];

    const nationalities = [
      "American",
      "British",
      "Canadian",
      "Australian",
      "German",
      "French",
      "Japanese",
      "Indian",
      "Bangladeshi",
      "Pakistani",
      "Other",
    ];

    const handleSave = async () => {
      // Update user profile via user service
      const userStore = useAuthStore.getState();
      await userStore.updateMe?.({
        fullName: formData.name,
        email: formData.email,
        phone: formData.mobile,
      });

      // Update personal info in seeker profile
      setProfile((prev) => ({ ...prev, personalInfo: formData }));
      setActivePopup(null);
      toast.success("Personal information updated successfully!");
    };

    return (
      <Popup
        title="Personal Information"
        onClose={() => setActivePopup(null)}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
              <span className="text-xs text-gray-500 ml-2">
                (only provided to employers you apply or respond to)
              </span>
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.fatherName}
              onChange={(e) =>
                setFormData({ ...formData, fatherName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <div className="flex gap-2">
              <select
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
                value={formData.dob.month}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dob: { ...formData.dob, month: e.target.value },
                  })
                }
              >
                <option value="">Month</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
                value={formData.dob.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dob: { ...formData.dob, year: e.target.value },
                  })
                }
              >
                <option value="">Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              {["Male", "Female", "Other"].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  className={`flex-1 py-2 text-center ${
                    formData.gender === gender
                      ? "bg-[#4eb956] text-white"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setFormData({ ...formData, gender })}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marital Status *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.maritalStatus}
              onChange={(e) =>
                setFormData({ ...formData, maritalStatus: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.nationality}
              onChange={(e) =>
                setFormData({ ...formData, nationality: e.target.value })
              }
            >
              <option value="">Select nationality</option>
              {nationalities.map((nationality) => (
                <option key={nationality} value={nationality}>
                  {nationality}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile *
              <span className="text-xs text-gray-500 ml-2">
                (only provided to employers you apply or respond to)
              </span>
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Career Level *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.careerLevel}
              onChange={(e) =>
                setFormData({ ...formData, careerLevel: e.target.value })
              }
            >
              <option value="">Select career level</option>
              {careerLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Experience *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
            >
              <option value="">Select years of experience</option>
              {experienceYears.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Salary (BDT) *
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={formData.expectedSalary}
              onChange={(e) =>
                setFormData({ ...formData, expectedSalary: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Address
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              rows="3"
              value={formData.postalAddress}
              onChange={(e) =>
                setFormData({ ...formData, postalAddress: e.target.value })
              }
            />
          </div>
        </div>
      </Popup>
    );
  };

  // Summary Popup
  const SummaryPopup = () => {
    const [summary, setSummary] = useState(profile.summary || "");

    const handleSave = async () => {
      const result = await updateSummary(summary);
      if (result.success) {
        setProfile((prev) => ({ ...prev, summary }));
        setActivePopup(null);
      }
    };

    return (
      <Popup
        title="Professional Summary"
        onClose={() => setActivePopup(null)}
        onSave={handleSave}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Summary
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
            rows="6"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write your professional summary here..."
          />
        </div>
      </Popup>
    );
  };

  // Experience Popup
  const ExperiencePopup = ({ editItem = null, expId = null }) => {
    const [experience, setExperience] = useState({
      jobTitle: editItem?.jobTitle || editItem?.title || "",
      company: editItem?.company || "",
      managedTeam: editItem?.managedTeam || false,
      isCurrent: editItem?.isCurrent || editItem?.current || false,
      startMonth: editItem?.startMonth || "",
      startYear: editItem?.startYear || "",
      endMonth: editItem?.endMonth || "",
      endYear: editItem?.endYear || "",
      description: editItem?.description || "",
    });

    const months = [
      { label: "Jan", value: 1 },
      { label: "Feb", value: 2 },
      { label: "Mar", value: 3 },
      { label: "Apr", value: 4 },
      { label: "May", value: 5 },
      { label: "Jun", value: 6 },
      { label: "Jul", value: 7 },
      { label: "Aug", value: 8 },
      { label: "Sep", value: 9 },
      { label: "Oct", value: 10 },
      { label: "Nov", value: 11 },
      { label: "Dec", value: 12 },
    ];

    const years = Array.from(
      { length: 50 },
      (_, i) => new Date().getFullYear() - i,
    );

    const handleSave = async () => {
      const payload = {
        jobTitle: experience.jobTitle,
        company: experience.company,
        managedTeam: experience.managedTeam,
        isCurrent: experience.isCurrent,
        startMonth: Number(experience.startMonth),
        startYear: Number(experience.startYear),
        endMonth: experience.isCurrent ? null : Number(experience.endMonth),
        endYear: experience.isCurrent ? null : Number(experience.endYear),
        description: experience.description,
      };

      const result = expId
        ? await updateExperience(expId, payload)
        : await addExperience(payload);

      if (result.success) {
        await loadProfile();
        setActivePopup(null);
      }
    };

    return (
      <Popup
        title={expId ? "Update Work Experience" : "Add Work Experience"}
        onClose={() => setActivePopup(null)}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={experience.jobTitle}
              onChange={(e) =>
                setExperience({ ...experience, jobTitle: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={experience.company}
              onChange={(e) =>
                setExperience({ ...experience, company: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Managed Team?
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 rounded text-[#4eb956]"
                checked={experience.managedTeam}
                onChange={(e) =>
                  setExperience({
                    ...experience,
                    managedTeam: e.target.checked,
                  })
                }
              />
              Yes, I managed a team
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currently working here?
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 rounded text-[#4eb956]"
                checked={experience.isCurrent}
                onChange={(e) =>
                  setExperience({ ...experience, isCurrent: e.target.checked })
                }
              />
              Yes, I currently work here
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <div className="flex gap-2">
              <select
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
                value={experience.startMonth}
                onChange={(e) =>
                  setExperience({ ...experience, startMonth: e.target.value })
                }
              >
                <option value="">Month</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
                value={experience.startYear}
                onChange={(e) =>
                  setExperience({ ...experience, startYear: e.target.value })
                }
              >
                <option value="">Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!experience.isCurrent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <div className="flex gap-2">
                <select
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
                  value={experience.endMonth}
                  onChange={(e) =>
                    setExperience({ ...experience, endMonth: e.target.value })
                  }
                >
                  <option value="">Month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>

                <select
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
                  value={experience.endYear}
                  onChange={(e) =>
                    setExperience({ ...experience, endYear: e.target.value })
                  }
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              rows="4"
              value={experience.description}
              onChange={(e) =>
                setExperience({ ...experience, description: e.target.value })
              }
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </div>
      </Popup>
    );
  };

  // Skills Popup
  const SkillsPopup = ({ editItem = null }) => {
    const [skillData, setSkillData] = useState({
      skill: editItem?.skill || "",
      proficiency: editItem?.proficiency || "",
    });

    const proficiencyLevels = [
      "beginner",
      "intermediate",
      "advanced",
      "expert",
    ];

    const handleSave = async () => {
      const payload = {
        skill: skillData.skill.trim(),
        proficiency: skillData.proficiency.toLowerCase().trim(),
      };

      if (!payload.skill) {
        toast.error("Skill is required");
        return;
      }

      if (!payload.proficiency) {
        toast.error("Proficiency is required");
        return;
      }

      const result = editItem?.skillId
        ? await updateSkill(editItem.skillId, payload)
        : await addSkill(payload);

      if (result.success) {
        await loadProfile();
        setActivePopup(null);
      }
    };

    return (
      <Popup
        title={editItem?.skillId ? "Update Skill" : "Add Skill"}
        onClose={() => setActivePopup(null)}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill *
            </label>
            <input
              type="text"
              value={skillData.skill}
              onChange={(e) =>
                setSkillData({ ...skillData, skill: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. React"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proficiency *
            </label>
            <select
              value={skillData.proficiency}
              onChange={(e) =>
                setSkillData({ ...skillData, proficiency: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select proficiency</option>
              {proficiencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Popup>
    );
  };

  // Education Popup
  const toIsoDate = (value) => {
    if (!value) return null;
    return new Date(`${value}T00:00:00.000Z`).toISOString();
  };

  const EducationPopup = ({ editItem = null }) => {
    const [education, setEducation] = useState({
      institute: editItem?.institute || "",
      degree: editItem?.degree || "",
      field: editItem?.field || "",
      startDate: editItem?.startDate
        ? new Date(editItem.startDate).toISOString().slice(0, 10)
        : "",
      endDate: editItem?.endDate
        ? new Date(editItem.endDate).toISOString().slice(0, 10)
        : "",
      grade: editItem?.grade || "",
      description: editItem?.description || "",
    });

    const handleSave = async () => {
      if (!education.institute.trim()) {
        toast.error("Institute is required");
        return;
      }

      const payload = {
        institute: education.institute.trim(),
        degree: education.degree.trim(),
        field: education.field.trim(),
        startDate: toIsoDate(education.startDate),
        endDate: toIsoDate(education.endDate),
        grade: education.grade.trim(),
        description: education.description.trim(),
      };

      const result = editItem?.eduId
        ? await updateEducation(editItem.eduId, payload)
        : await addEducation(payload);

      if (result.success) {
        await loadProfile();
        setActivePopup(null);
      }
    };

    return (
      <Popup
        title={editItem?.eduId ? "Update Education" : "Add Education"}
        onClose={() => setActivePopup(null)}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institute *
            </label>
            <input
              type="text"
              value={education.institute}
              onChange={(e) =>
                setEducation({ ...education, institute: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Degree
            </label>
            <input
              type="text"
              value={education.degree}
              onChange={(e) =>
                setEducation({ ...education, degree: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field
            </label>
            <input
              type="text"
              value={education.field}
              onChange={(e) =>
                setEducation({ ...education, field: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={education.startDate}
              onChange={(e) =>
                setEducation({ ...education, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />

            <input
              type="date"
              value={education.endDate}
              onChange={(e) =>
                setEducation({ ...education, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <input
              type="text"
              value={education.grade}
              onChange={(e) =>
                setEducation({ ...education, grade: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="4"
              value={education.description}
              onChange={(e) =>
                setEducation({ ...education, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </Popup>
    );
  };

  // Job Preferences Popup
  const JobPreferencesPopup = ({ editItem = null }) => {
    const [formData, setFormData] = useState({
      preferredTitles: editItem?.preferredTitles || [],
      salaryMin: editItem?.salaryMin ?? null,
      salaryMax: editItem?.salaryMax ?? null,
      currency: editItem?.currency || "USD",
      salaryRangeKey: editItem?.salaryRangeKey || "",
      preferredSkills: editItem?.preferredSkills || [],
      jobTypes: editItem?.jobTypes || [],
      relocationPreference: editItem?.relocationPreference || "within_country",
      preferredLocations: editItem?.preferredLocations || [],
      noticePeriodDays: editItem?.noticePeriodDays ?? 0,
      openToRelocation: editItem?.openToRelocation || false,
    });

    const [titleInput, setTitleInput] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const [locationInput, setLocationInput] = useState("");

    const jobTypeOptions = [
      "full-time",
      "part-time",
      "contract",
      "internship",
      "temporary",
      "remote",
      "hybrid",
      "onsite",
    ];

    const relocationOptions = [
      { value: "within_country", label: "Within country" },
      { value: "international", label: "International" },
      { value: "not_open", label: "Not open to relocation" },
    ];

    const salaryRanges = [
      { key: "0-300", label: "$0 - $300", min: 0, max: 300 },
      { key: "300-500", label: "$300 - $500", min: 300, max: 500 },
      { key: "500-800", label: "$500 - $800", min: 500, max: 800 },
      { key: "800-1200", label: "$800 - $1,200", min: 800, max: 1200 },
      { key: "1200-2000", label: "$1,200 - $2,000", min: 1200, max: 2000 },
      { key: "2000-5000", label: "$2,000 - $5,000", min: 2000, max: 5000 },
      { key: "5000+", label: "$5,000+", min: 5000, max: null },
    ];

    const addChip = (field, value, setter) => {
      const normalized = value.trim();
      if (!normalized) return;

      const exists = formData[field].some(
        (item) => item.toLowerCase() === normalized.toLowerCase(),
      );
      if (exists) return;

      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], normalized],
      }));
      setter("");
    };

    const removeChip = (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((item) => item !== value),
      }));
    };

    const toggleJobType = (type) => {
      setFormData((prev) => ({
        ...prev,
        jobTypes: prev.jobTypes.includes(type)
          ? prev.jobTypes.filter((item) => item !== type)
          : [...prev.jobTypes, type],
      }));
    };

    const handleSalaryRangeChange = (rangeKey) => {
      const selected = salaryRanges.find((item) => item.key === rangeKey);

      setFormData((prev) => ({
        ...prev,
        salaryRangeKey: rangeKey,
        salaryMin: selected ? selected.min : null,
        salaryMax: selected ? selected.max : null,
      }));
    };

    const handleSave = async () => {
      const payload = {
        preferredTitles: formData.preferredTitles,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        currency: formData.currency,
        salaryRangeKey: formData.salaryRangeKey,
        preferredSkills: formData.preferredSkills,
        jobTypes: formData.jobTypes,
        relocationPreference: formData.relocationPreference,
        preferredLocations: formData.preferredLocations,
        noticePeriodDays: Number(formData.noticePeriodDays) || 0,
        openToRelocation: formData.openToRelocation,
      };

      const result = await updateJobPreferences(payload);

      if (result.success) {
        await loadProfile();
        setActivePopup(null);
      }
    };

    return (
      <Popup
        title="Job Preferences"
        onClose={() => setActivePopup(null)}
        onSave={handleSave}
        size="xl"
      >
        <div className="space-y-6">
          {/* Preferred Titles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desired Job Titles
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Add desired title"
              />
              <button
                type="button"
                onClick={() =>
                  addChip("preferredTitles", titleInput, setTitleInput)
                }
                className="px-4 py-2 bg-[#4eb956] text-white rounded-md"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.preferredTitles.map((title, index) => (
                <div
                  key={`${title}-${index}`}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                >
                  <span>{title}</span>
                  <button
                    type="button"
                    onClick={() => removeChip("preferredTitles", title)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desired Salary Range
            </label>
            <select
              value={formData.salaryRangeKey}
              onChange={(e) => handleSalaryRangeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select salary range</option>
              {salaryRanges.map((range) => (
                <option key={range.key} value={range.key}>
                  {range.label}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <input
                type="number"
                value={formData.salaryMin ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salaryMin: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Min salary"
              />

              <input
                type="number"
                value={formData.salaryMax ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salaryMax: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Max salary"
              />

              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    currency: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="USD">USD</option>
                <option value="BDT">BDT</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* Preferred Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Add preferred skill"
              />
              <button
                type="button"
                onClick={() =>
                  addChip("preferredSkills", skillInput, setSkillInput)
                }
                className="px-4 py-2 bg-[#4eb956] text-white rounded-md"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.preferredSkills.map((skill, index) => (
                <div
                  key={`${skill}-${index}`}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeChip("preferredSkills", skill)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Job Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Types
            </label>
            <div className="flex flex-wrap gap-2">
              {jobTypeOptions.map((type) => {
                const active = formData.jobTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleJobType(type)}
                    className={`px-3 py-2 rounded-full border text-sm ${
                      active
                        ? "bg-[#4eb956] text-white border-[#4eb956]"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Relocation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relocation Preference
            </label>
            <div className="space-y-2">
              {relocationOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="relocationPreference"
                    value={option.value}
                    checked={formData.relocationPreference === option.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        relocationPreference: e.target.value,
                      }))
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            <label className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={formData.openToRelocation}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    openToRelocation: e.target.checked,
                  }))
                }
              />
              <span>Open to relocation</span>
            </label>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Locations
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Add preferred location"
              />
              <button
                type="button"
                onClick={() =>
                  addChip("preferredLocations", locationInput, setLocationInput)
                }
                className="px-4 py-2 bg-[#4eb956] text-white rounded-md"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.preferredLocations.map((location, index) => (
                <div
                  key={`${location}-${index}`}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                >
                  <span>{location}</span>
                  <button
                    type="button"
                    onClick={() => removeChip("preferredLocations", location)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notice Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice Period (Days)
            </label>
            <input
              type="number"
              min="0"
              value={formData.noticePeriodDays}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  noticePeriodDays: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter notice period in days"
            />
          </div>
        </div>
      </Popup>
    );
  };

  // Projects Popup
  const ProjectsPopup = () => {
    const [project, setProject] = useState({
      name: "",
      url: "",
      startDate: { month: "", year: "" },
      endDate: { month: "", year: "" },
      currentlyOngoing: false,
      description: "",
      image: null,
    });

    const months = [
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
    const years = Array.from(
      { length: 20 },
      (_, i) => new Date().getFullYear() - i,
    );

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProject({ ...project, image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSave = async () => {
      const projectData = {
        name: project.name,
        role: "Developer", // You can add a role field
        stack: [], // You can add stack field
        liveUrl: project.url,
        repoUrl: "",
        description: project.description,
      };

      const result = await addProject(projectData);
      if (result.success) {
        loadProfile();
        setActivePopup(null);
      }
    };

    return (
      <Popup
        title="Add Project"
        onClose={() => setActivePopup(null)}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Image
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {project.image ? (
                  <img
                    src={project.image}
                    alt="Project preview"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <FiCamera className="text-gray-400" size={24} />
                  </div>
                )}
                <label className="absolute bottom-0 right-0">
                  <div className="w-8 h-8 bg-[#4eb956] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3da944]">
                    <FiPlus size={16} className="text-white" />
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Upload project screenshot or logo
                </p>
                <p className="text-xs text-gray-500">Recommended: 400x400px</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project URL
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={project.url}
              onChange={(e) => setProject({ ...project, url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currently ongoing?
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 rounded text-[#4eb956]"
                checked={project.currentlyOngoing}
                onChange={(e) =>
                  setProject({ ...project, currentlyOngoing: e.target.checked })
                }
              />
              Yes, this project is still ongoing
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="space-y-2">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
                  value={project.startDate.month}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      startDate: {
                        ...project.startDate,
                        month: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Month</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
                  value={project.startDate.year}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      startDate: { ...project.startDate, year: e.target.value },
                    })
                  }
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!project.currentlyOngoing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="space-y-2">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
                    value={project.endDate.month}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        endDate: { ...project.endDate, month: e.target.value },
                      })
                    }
                  >
                    <option value="">Month</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
                    value={project.endDate.year}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        endDate: { ...project.endDate, year: e.target.value },
                      })
                    }
                  >
                    <option value="">Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              rows="4"
              value={project.description}
              onChange={(e) =>
                setProject({ ...project, description: e.target.value })
              }
              placeholder="Describe your project, technologies used, and your role..."
            />
          </div>
        </div>
      </Popup>
    );
  };

  // Languages Popup
  const LanguagesPopup = () => {
    const [language, setLanguage] = useState({
      name: "",
      proficiency: "",
    });

    const languagesList = [
      "English",
      "Urdu",
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
    ];

    const proficiencyLevels = [
      "Native",
      "Fluent",
      "Professional Working Proficiency",
      "Limited Working Proficiency",
      "Elementary Proficiency",
      "Beginner",
    ];

    const handleSave = async () => {
      const result = await addLanguage({
        language: language.name,
        level: language.proficiency,
      });
      if (result.success) {
        loadProfile();
        setActivePopup(null);
      }
    };

    return (
      <Popup
        title="Add Language"
        onClose={() => setActivePopup(null)}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add a new language *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={language.name}
              onChange={(e) =>
                setLanguage({ ...language, name: e.target.value })
              }
            >
              <option value="">Select language</option>
              {languagesList.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-2">
              {languagesList.slice(0, 6).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage({ ...language, name: lang })}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proficiency with this language *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={language.proficiency}
              onChange={(e) =>
                setLanguage({ ...language, proficiency: e.target.value })
              }
            >
              <option value="">Select proficiency level</option>
              {proficiencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <div className="mt-2 space-y-1">
              {proficiencyLevels.slice(0, 4).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    setLanguage({ ...language, proficiency: level })
                  }
                  className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Popup>
    );
  };

  // Video CV Popup
  const UploadVideoPopup = () => {
    const [videoData, setVideoData] = useState({
      title: "",
      description: "",
      videoFile: null,
      videoUrl: null,
      uploadProgress: 0,
      isUploading: false,
    });

    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("video/")) {
        if (file.size > 50 * 1024 * 1024) {
          toast.error("File size must be less than 50MB");
          return;
        }

        setVideoData({
          ...videoData,
          videoFile: file,
          videoUrl: URL.createObjectURL(file),
          isUploading: true,
          uploadProgress: 0,
        });

        // Simulate upload progress
        const interval = setInterval(() => {
          setVideoData((prev) => {
            if (prev.uploadProgress >= 100) {
              clearInterval(interval);
              return { ...prev, isUploading: false };
            }
            return { ...prev, uploadProgress: prev.uploadProgress + 10 };
          });
        }, 200);
      } else {
        toast.error("Please select a video file");
      }
    };

    const handleSave = async () => {
      if (videoData.videoFile) {
        const formData = new FormData();
        formData.append("video", videoData.videoFile);
        formData.append("title", videoData.title);
        formData.append("description", videoData.description);

        const result = await uploadResumeVideo(formData);
        if (result.success) {
          loadProfile();
          setActivePopup(null);
        }
      } else {
        toast.error("Please upload a video first");
      }
    };

    return (
      <Popup
        title="Upload Video CV"
        onClose={() => setActivePopup(null)}
        onSave={handleSave}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              value={videoData.title}
              onChange={(e) =>
                setVideoData({ ...videoData, title: e.target.value })
              }
              placeholder="e.g., Professional Introduction"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4eb956]"
              rows="3"
              value={videoData.description}
              onChange={(e) =>
                setVideoData({ ...videoData, description: e.target.value })
              }
              placeholder="Briefly describe your video content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Video *
            </label>
            {videoData.videoUrl ? (
              <div className="space-y-3">
                <video
                  className="w-full rounded-lg"
                  controls
                  src={videoData.videoUrl}
                />
                <div className="text-sm text-gray-600">
                  <p>File: {videoData.videoFile?.name}</p>
                  <p>
                    Size:{" "}
                    {(videoData.videoFile?.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {videoData.isUploading && (
                  <div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4eb956] transition-all duration-300"
                        style={{ width: `${videoData.uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-center text-gray-600 mt-1">
                      Uploading... {videoData.uploadProgress}%
                    </p>
                  </div>
                )}
                <button
                  onClick={() =>
                    setVideoData({
                      ...videoData,
                      videoFile: null,
                      videoUrl: null,
                    })
                  }
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                >
                  Remove Video
                </button>
              </div>
            ) : (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4eb956] transition-colors cursor-pointer">
                  <FiVideo size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    Click to upload video
                  </p>
                  <p className="text-sm text-gray-500 mb-2">or drag and drop</p>
                  <p className="text-xs text-gray-400">
                    MP4, MOV, AVI up to 50MB
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max 2 minutes recommended
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileUpload}
                />
              </label>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              📹 Tips for a great Video CV:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Keep it under 2 minutes</li>
              <li>• Dress professionally</li>
              <li>• Introduce yourself and your key skills</li>
              <li>• Speak clearly and confidently</li>
              <li>• Use good lighting and background</li>
              <li>• Mention why you're interested in the role</li>
            </ul>
          </div>
        </div>
      </Popup>
    );
  };

  const Section = ({ title, icon: Icon, children, onAdd, hasData }) => {
    return (
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Icon className="text-[#4eb956]" size={20} />
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <button
            onClick={onAdd}
            className="p-2 text-gray-500 hover:text-[#4eb956] hover:bg-gray-50 rounded-full"
            title={`Add ${title}`}
          >
            <FiPlus size={20} />
          </button>
        </div>

        {hasData ? (
          children
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2 opacity-50">
              {title === "Projects"
                ? "📁"
                : title === "Languages"
                  ? "🌐"
                  : title === "Job Preferences"
                    ? "🎯"
                    : "📄"}
            </div>
            <p>No {title.toLowerCase()} has been added yet</p>
          </div>
        )}
      </div>
    );
  };

  const UploadVideoSection = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <FiVideo className="text-[#4eb956]" size={20} />
        <h3 className="font-semibold">Upload Video CV</h3>
        <button
          onClick={() => setActivePopup("video")}
          className="ml-auto p-2 text-gray-500 hover:text-[#4eb956] hover:bg-gray-50 rounded-full"
        >
          <FiPlus size={18} />
        </button>
      </div>
      {profile.videoCV ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden">
            <video
              className="w-full h-40 object-cover"
              src={profile.videoCV.videoUrl}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <FiVideo className="text-[#4eb956]" size={24} />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium">
              {profile.videoCV.title || "My Video CV"}
            </h4>
            <p className="text-sm text-gray-600 truncate">
              {profile.videoCV.description || "Professional introduction video"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Record a short video introduction
          </p>
          <div
            onClick={() => setActivePopup("video")}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4eb956] transition-colors cursor-pointer"
          >
            <FiVideo size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload video</p>
            <p className="text-xs text-gray-400 mt-1">Max 2 minutes, 50MB</p>
          </div>
        </>
      )}
    </div>
  );

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    let total = 10; // Total sections count

    if (profile.personalInfo) completed++;
    if (profile.summary) completed++;
    if (profile.experiences.length > 0) completed++;
    if (profile.skills.length > 0) completed++;
    if (profile.education.length > 0) completed++;
    if (profile.preferences) completed++;
    if (profile.projects.length > 0) completed++;
    if (profile.languages.length > 0) completed++;
    if (profile.profileImage) completed++;
    if (profile.videoCV) completed++;

    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-[#4eb956] text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-7/12">
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <FiUser className="text-[#4eb956]" size={20} />
                  <h2 className="text-lg font-semibold">
                    Personal Information
                  </h2>
                </div>
                <button
                  onClick={() => setActivePopup("personal")}
                  className="p-2 text-gray-500 hover:text-[#4eb956] hover:bg-gray-50 rounded-full"
                  title="Edit Personal Information"
                >
                  <FiEdit2 size={18} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="relative w-40 h-40">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#4eb956"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="282.74"
                          strokeDashoffset={
                            282.74 - (282.74 * calculateCompletion()) / 100
                          }
                        />
                      </svg>

                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow">
                          {profile.profileImage ? (
                            <img
                              src={profile.profileImage}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiUser size={48} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="relative">
                          <div className="w-8 h-8 bg-[#4eb956] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3da944]">
                            <FiPlus size={16} className="text-white" />
                          </div>
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const formData = new FormData();
                                formData.append("profileImage", file);
                                const result =
                                  await uploadProfileAssets(formData);
                                if (result.success) {
                                  loadProfile();
                                }
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="absolute top-1 right-0 w-8 h-8 bg-[#4eb956] rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs font-bold text-white">
                          {calculateCompletion()}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-sm text-gray-600 font-medium">
                        Profile Complete
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {profile.personalInfo?.name ||
                          user?.fullName ||
                          "Your Name"}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <FiMail size={18} className="text-gray-500 shrink-0" />
                        <span className="text-gray-700">
                          {profile.personalInfo?.email ||
                            user?.email ||
                            "email@example.com"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <FiPhone
                          size={18}
                          className="text-gray-500 flex-shrink-0"
                        />
                        <span className="text-gray-700">
                          {profile.personalInfo?.mobile || "Not provided"}
                        </span>
                      </div>

                      {profile.personalInfo?.dob?.month &&
                        profile.personalInfo?.dob?.year && (
                          <div className="flex items-center gap-3">
                            <FiCalendar
                              size={18}
                              className="text-gray-500 flex-shrink-0"
                            />
                            <span className="text-gray-700">
                              {profile.personalInfo.dob.month}{" "}
                              {profile.personalInfo.dob.year}
                            </span>
                          </div>
                        )}

                      {(profile.personalInfo?.city ||
                        profile.personalInfo?.country) && (
                        <div className="flex items-center gap-3">
                          <FiMapPin
                            size={18}
                            className="text-gray-500 flex-shrink-0"
                          />
                          <span className="text-gray-700">
                            {[
                              profile.personalInfo.city,
                              profile.personalInfo.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}

                      {profile.personalInfo?.expectedSalary && (
                        <div className="flex items-center gap-3">
                          <FiDollarSign
                            size={18}
                            className="text-gray-500 flex-shrink-0"
                          />
                          <span className="text-gray-700">
                            {profile.personalInfo.expectedSalary} BDT
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <Section
              title="Summary"
              icon={FiMessageSquare}
              onAdd={() => setActivePopup("summary")}
              hasData={profile.summary}
            >
              <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
            </Section>

            {/* Experience */}
            <Section
              title="Experience"
              icon={FiBriefcase}
              onAdd={() => setActivePopup("experience")}
              hasData={profile.experiences.length > 0}
            >
              <div className="space-y-4">
                {profile.experiences.map((exp) => (
                  <div
                    key={exp.expId}
                    className="border-l-2 border-[#4eb956] pl-4 py-2"
                  >
                    <h4 className="font-semibold">{exp.jobTitle}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startMonth}/{exp.startYear} -{" "}
                      {exp.isCurrent
                        ? "Present"
                        : `${exp.endMonth}/${exp.endYear}`}
                    </p>

                    {exp.managedTeam && (
                      <p className="text-xs text-green-600 mt-1">
                        Managed a team
                      </p>
                    )}

                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Skills */}
            <Section
              title="Skills"
              icon={FiStar}
              onAdd={() => setActivePopup({ type: "skills", item: null })}
              hasData={(profile.skills || []).length > 0}
            >
              <div className="flex flex-wrap gap-3">
                {(profile.skills || []).map((item) => (
                  <div
                    key={item.skillId}
                    className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-3"
                  >
                    <div>
                      <span className="font-medium">{item.skill}</span>
                      <span className="ml-2 text-sm text-gray-500 capitalize">
                        ({item.proficiency})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePopup({ type: "skills", item })}
                      className="text-blue-600 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const ok = window.confirm("Delete this skill?");
                        if (!ok) return;
                        await deleteSkill(item.skillId);
                        await loadProfile();
                      }}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            {/* Education */}
            <Section
              title="Education"
              icon={FiBookOpen}
              onAdd={() => setActivePopup({ type: "education", item: null })}
              hasData={(profile.education || []).length > 0}
            >
              <div className="space-y-4">
                {(profile.education || []).map((edu) => (
                  <div
                    key={edu.eduId}
                    className="border rounded-lg p-4 flex items-start justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-semibold">{edu.institute}</h4>

                      {(edu.degree || edu.field) && (
                        <p className="text-gray-600">
                          {[edu.degree, edu.field].filter(Boolean).join(" — ")}
                        </p>
                      )}

                      {(edu.startDate || edu.endDate) && (
                        <p className="text-sm text-gray-500">
                          {edu.startDate
                            ? new Date(edu.startDate).toLocaleDateString()
                            : "N/A"}{" "}
                          -{" "}
                          {edu.endDate
                            ? new Date(edu.endDate).toLocaleDateString()
                            : "Present"}
                        </p>
                      )}

                      {edu.grade && (
                        <p className="text-sm text-gray-600 mt-1">
                          Grade: {edu.grade}
                        </p>
                      )}

                      {edu.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {edu.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActivePopup({ type: "education", item: edu })
                        }
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const ok = window.confirm(
                            "Are you sure you want to delete this education item?",
                          );
                          if (!ok) return;

                          await deleteEducation(edu.eduId);
                          await loadProfile();
                        }}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Job Preferences Section */}
            <Section
              title="Job Preferences"
              icon={FiSettings}
              onAdd={() => setActivePopup("jobPreferences")}
              hasData={!!profile.preferences}
            >
              {profile.preferences && (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Preferred Titles:</span>{" "}
                    {(profile.preferences.preferredTitles || []).join(", ") ||
                      "N/A"}
                  </div>

                  <div>
                    <span className="font-medium">Salary Range:</span>{" "}
                    {profile.preferences.salaryMin || 0} -{" "}
                    {profile.preferences.salaryMax || "Above"}{" "}
                    {profile.preferences.currency || "USD"}
                  </div>

                  <div>
                    <span className="font-medium">Preferred Skills:</span>{" "}
                    {(profile.preferences.preferredSkills || []).join(", ") ||
                      "N/A"}
                  </div>

                  <div>
                    <span className="font-medium">Job Types:</span>{" "}
                    {(profile.preferences.jobTypes || []).join(", ") || "N/A"}
                  </div>

                  <div>
                    <span className="font-medium">Relocation Preference:</span>{" "}
                    {profile.preferences.relocationPreference || "N/A"}
                  </div>

                  <div>
                    <span className="font-medium">Preferred Locations:</span>{" "}
                    {(profile.preferences.preferredLocations || []).join(
                      ", ",
                    ) || "N/A"}
                  </div>

                  <div>
                    <span className="font-medium">Notice Period:</span>{" "}
                    {profile.preferences.noticePeriodDays ?? 0} days
                  </div>

                  <div>
                    <span className="font-medium">Open to Relocation:</span>{" "}
                    {profile.preferences.openToRelocation ? "Yes" : "No"}
                  </div>
                </div>
              )}
            </Section>

            {/* Projects Section */}
            <Section
              title="Projects"
              icon={FiFolder}
              onAdd={() => setActivePopup("projects")}
              hasData={profile.projects.length > 0}
            >
              <div className="grid gap-4">
                {profile.projects.map((project, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:border-[#4eb956] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{project.name}</h4>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#4eb956] hover:text-[#3da944]"
                            >
                              <FiExternalLink size={16} />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Languages Section */}
            <Section
              title="Languages"
              icon={FiLanguage}
              onAdd={() => setActivePopup("languages")}
              hasData={profile.languages.length > 0}
            >
              <div className="space-y-3">
                {profile.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-3 last:border-0"
                  >
                    <div>
                      <span className="font-medium">{lang.language}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">
                        {lang.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* CV Privacy */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <FiGlobe className="text-[#4eb956]" size={20} />
                <h2 className="text-lg font-semibold">CV Privacy Settings</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={profile.cvPrivacy === "public"}
                    onChange={() =>
                      setProfile((prev) => ({ ...prev, cvPrivacy: "public" }))
                    }
                    className="mt-1 text-[#4eb956]"
                  />
                  <div>
                    <h4 className="font-medium">Public</h4>
                    <p className="text-sm text-gray-600">
                      Your CV will be visible to every registered jobsplus
                      employer.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={profile.cvPrivacy === "private"}
                    onChange={() =>
                      setProfile((prev) => ({ ...prev, cvPrivacy: "private" }))
                    }
                    className="mt-1 text-[#4eb956]"
                  />
                  <div>
                    <h4 className="font-medium">Private</h4>
                    <p className="text-sm text-gray-600">
                      Your CV will not be visible to anyone except you. However,
                      you will be able to attach it when applying for a job.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-5/12">
            <div className="sticky top-8 space-y-6">
              <UploadVideoSection />

              {/* Download CV */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <button
                  onClick={() => {
                    // Implement download CV functionality
                    toast.info("CV download feature coming soon!");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4eb956] text-white rounded-md hover:bg-[#3da944] mb-4"
                >
                  <FiDownload size={18} />
                  Download CV
                </button>
                <p className="text-sm text-gray-600 text-center">
                  Update your profile for better job recommendations
                </p>
              </div>

              {/* Profile Completion */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-4">Profile Completion</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        profile.personalInfo ? "bg-[#4eb956]" : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`${
                        profile.personalInfo ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      Personal Info
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        profile.experiences.length > 0
                          ? "bg-[#4eb956]"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`${
                        profile.experiences.length > 0
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      Work History
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        profile.education.length > 0
                          ? "bg-[#4eb956]"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`${
                        profile.education.length > 0
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      Education
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        profile.profileImage ? "bg-[#4eb956]" : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`${
                        profile.profileImage ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      Profile Picture
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        profile.summary ? "bg-[#4eb956]" : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`${
                        profile.summary ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      Professional Summary
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        profile.skills.length > 0
                          ? "bg-[#4eb956]"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`${
                        profile.skills.length > 0
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      Skills
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        profile.projects.length > 0
                          ? "bg-[#4eb956]"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`${
                        profile.projects.length > 0
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      Projects
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        profile.languages.length > 0
                          ? "bg-[#4eb956]"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`${
                        profile.languages.length > 0
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      Languages
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        profile.preferences ? "bg-[#4eb956]" : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`${
                        profile.preferences ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      Job Preferences
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        profile.videoCV ? "bg-[#4eb956]" : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={`${
                        profile.videoCV ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      Video CV
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {calculateCompletion()}% Complete
                    </span>
                    <span className="text-sm text-gray-500">
                      Update more to reach 100%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4eb956] transition-all duration-300"
                      style={{ width: `${calculateCompletion()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {activePopup === "personal" && <PersonalInfoPopup />}
      {activePopup === "summary" && <SummaryPopup />}
      {activePopup === "experience" && <ExperiencePopup />}
      {activePopup === "skills" && <SkillsPopup />}
      {activePopup === "education" && <EducationPopup />}
      {activePopup === "preferences" && <JobPreferencesPopup />}
      {activePopup === "projects" && <ProjectsPopup />}
      {activePopup === "languages" && <LanguagesPopup />}
      {activePopup === "video" && <UploadVideoPopup />}
      {activePopup?.type === "education" && (
        <EducationPopup editItem={activePopup.item} />
      )}
      {activePopup?.type === "skills" && (
        <SkillsPopup editItem={activePopup.item} />
      )}
    </div>
  );
};

export default SeekerProfile;
