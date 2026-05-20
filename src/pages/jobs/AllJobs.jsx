import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Building,
  X,
  Search,
  Star,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Award,
  User,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import DOMPurify from "dompurify";
import useSeekerStore from "../../store/seekerStore";
import useAuthStore from "../../store/authStore";
import useJobStore from "../../store/JobStore";
import ApplyJobModal from "../../components/ApplyJobModal";
const AllJobs = () => {
  const {
    cate,
    location: locationParam,
    company: companyParam,
    function: functionParam,
  } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    jobs,
    meta,
    fetchJobs,
    fetchJobFilters,
    jobTypes,
    companies,
    categories,
    countries,
    isLoading,
  } = useJobStore();
  const { fetchMyApplications } = useSeekerStore();
  const { isAuthenticated, user } = useAuthStore();
  const [appliedJobIds, setAppliedJobIds] = useState({});

  const [selectedJob, setSelectedJob] = useState(null);
  const [showMobileDescription, setShowMobileDescription] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedDeadline, setSelectedDeadline] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  // apply job
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyTargetJob, setApplyTargetJob] = useState(null);

  const handleOpenApply = (job) => {
    setApplyTargetJob(job);
    setApplyModalOpen(true);
  };

  const colors = {
    primary: "#1e2558",
    secondary: "#4eb956",
    lightPrimary: "rgba(30, 37, 88, 0.1)",
    lightSecondary: "rgba(78, 185, 86, 0.1)",
    border: "#e2e8f0",
    bgLight: "#f8fafc",
  };

  const queryParams = useMemo(() => {
    const params = new URLSearchParams(location.search);

    return {
      page: params.get("page") || 1,
      limit: params.get("limit") || 10,
      search: params.get("search") || "",
      jobCategoryId: params.get("jobCategoryId") || "",
      companyId: params.get("companyId") || "",
      countryId: params.get("countryId") || "",
      jobTypeId: params.get("jobTypeId") || "",
      status: params.get("status") || "",
      sortBy: params.get("sortBy") || "createdAt",
      order: params.get("order") || "desc",
      location: params.get("location") || "",
      minSalary: params.get("minSalary") || "",
      subcategory: params.get("subcategory") || "",
      filter: params.get("filter") || "",
    };
  }, [location.search]);

  const updateUrlParams = (updates = {}) => {
    const params = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.set("page", "1");

    const query = params.toString();
    navigate(`/jobs${query ? `?${query}` : ""}`);
  };

  useEffect(() => {
    fetchJobFilters();
  }, [fetchJobFilters]);

  useEffect(() => {
    setSearchTerm(queryParams.search);

    fetchJobs({
      page: queryParams.page,
      limit: queryParams.limit,
      search: queryParams.search,
      jobCategoryId: queryParams.jobCategoryId,
      companyId: queryParams.companyId,
      countryId: queryParams.countryId,
      jobTypeId: queryParams.jobTypeId,
      status: queryParams.status,
      sortBy: queryParams.sortBy,
      order: queryParams.order,
    });
  }, [
    queryParams.page,
    queryParams.limit,
    queryParams.search,
    queryParams.jobCategoryId,
    queryParams.companyId,
    queryParams.countryId,
    queryParams.jobTypeId,
    queryParams.status,
    queryParams.sortBy,
    queryParams.order,
    fetchJobs,
  ]);

  useEffect(() => {
    if (jobs.length > 0) {
      setSelectedJob(jobs[0]);
    } else {
      setSelectedJob(null);
    }
  }, [jobs]);

  useEffect(() => {
    if (queryParams.filter === "recent") {
      setSortBy("newest");
      updateUrlParams({ sortBy: "createdAt", order: "desc", filter: "" });
    }

    if (queryParams.filter === "deadline_tomorrow") {
      setSelectedDeadline(["Within 24 Hours"]);
    }

    if (queryParams.location) {
      setSelectedLocations([queryParams.location]);
    }

    if (queryParams.minSalary) {
      const minSalaryNum = parseInt(queryParams.minSalary, 10);
      if (!Number.isNaN(minSalaryNum)) {
        setSalaryRange([minSalaryNum, salaryRange[1]]);
      }
    }

    if (queryParams.subcategory) {
      setSelectedSubcategories([queryParams.subcategory.replace(/-/g, " ")]);
    }
  }, [location.search]);

  const getDaysLeft = (job) => {
    if (!job.jobEndDate) return Infinity;

    const endDate = new Date(job.jobEndDate);
    const today = new Date();
    const diffTime = endDate - today;

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const deadlineMatches = (job, deadlineFilter) => {
    const daysLeft = getDaysLeft(job);

    if (daysLeft === Infinity) return false;

    switch (deadlineFilter) {
      case "Within 24 Hours":
        return daysLeft <= 1 && daysLeft >= 0;
      case "Within 3 Days":
        return daysLeft <= 3 && daysLeft >= 0;
      case "Within 7 Days":
        return daysLeft <= 7 && daysLeft >= 0;
      case "Within 30 Days":
        return daysLeft <= 30 && daysLeft >= 0;
      default:
        return false;
    }
  };

  const formatExperience = (experience) => {
    if (Array.isArray(experience)) {
      if (experience[0] === 0 && experience[1] <= 1) return "Fresher";
      return `${experience[0]}-${experience[1]} Years`;
    }

    if (!experience || experience === 0 || experience === "0") return "Fresher";

    return String(experience).includes("Year")
      ? experience
      : `${experience} Years`;
  };

  const experienceMatches = (jobExperience, filterExperience) => {
    const jobExp = jobExperience;

    if (filterExperience === "Fresher") {
      if (Array.isArray(jobExp)) return jobExp[0] === 0 && jobExp[1] <= 1;
      return (
        jobExp === 0 ||
        jobExp === "0" ||
        !jobExp ||
        String(jobExp).toLowerCase().includes("fresher")
      );
    }

    if (Array.isArray(jobExp)) {
      const minExp = jobExp[0];

      if (filterExperience === "1-2 Years") return minExp >= 1 && minExp <= 2;
      if (filterExperience === "3-5 Years") return minExp >= 3 && minExp <= 5;
      if (filterExperience === "5-10 Years") return minExp >= 5 && minExp <= 10;
      if (filterExperience === "10+ Years") return minExp >= 10;
    }

    return String(jobExp || "")
      .toLowerCase()
      .includes(filterExperience.toLowerCase());
  };

  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    filtered = filtered.filter((job) => {
      if (queryParams.location) {
        const jobLocation = job.location ? job.location.toLowerCase() : "";
        if (!jobLocation.includes(queryParams.location.toLowerCase())) {
          return false;
        }
      }

      if (queryParams.minSalary) {
        const minSalary = Number(queryParams.minSalary);
        const jobMaxSalary = job.salary?.max || 0;

        if (jobMaxSalary > 0 && jobMaxSalary < minSalary) {
          return false;
        }
      }

      const jobMinSalary = job.salary?.min || 0;
      const jobMaxSalary = job.salary?.max || 0;

      if (jobMaxSalary > 0 || jobMinSalary > 0) {
        if (jobMaxSalary < salaryRange[0] || jobMinSalary > salaryRange[1]) {
          return false;
        }
      }

      if (selectedExperience.length > 0) {
        const matchesExperience = selectedExperience.some((exp) =>
          experienceMatches(job.experience, exp),
        );
        if (!matchesExperience) return false;
      }

      if (selectedLocations.length > 0) {
        const jobLocation = job.location ? job.location.toLowerCase() : "";
        const matchesLocation = selectedLocations.some((loc) =>
          jobLocation.includes(loc.toLowerCase()),
        );
        if (!matchesLocation) return false;
      }

      if (selectedGenders.length > 0 && !selectedGenders.includes(job.gender)) {
        return false;
      }

      if (selectedEducation.length > 0) {
        const jobEducation = job.education || "";
        const matchesEducation = selectedEducation.some((edu) =>
          jobEducation.toLowerCase().includes(edu.toLowerCase()),
        );
        if (!matchesEducation) return false;
      }

      if (selectedSubcategories.length > 0) {
        const jobSubcategory = job.subCategory || "";
        const matchesSubcategory = selectedSubcategories.some((subcat) =>
          jobSubcategory.toLowerCase().includes(subcat.toLowerCase()),
        );
        if (!matchesSubcategory) return false;
      }

      if (selectedDeadline.length > 0) {
        const matchesDeadline = selectedDeadline.some((deadline) =>
          deadlineMatches(job, deadline),
        );
        if (!matchesDeadline) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest": {
          const dateA = new Date(a.jobPostedDate || 0);
          const dateB = new Date(b.jobPostedDate || 0);
          return dateB - dateA;
        }

        case "salary-high": {
          const salaryA = a.salary?.max || 0;
          const salaryB = b.salary?.max || 0;
          return salaryB - salaryA;
        }

        case "deadline": {
          const deadlineA = getDaysLeft(a);
          const deadlineB = getDaysLeft(b);

          if (deadlineA === Infinity && deadlineB === Infinity) return 0;
          if (deadlineA === Infinity) return 1;
          if (deadlineB === Infinity) return -1;

          return deadlineA - deadlineB;
        }

        default:
          return 0;
      }
    });

    return filtered;
  }, [
    jobs,
    queryParams.location,
    queryParams.minSalary,
    salaryRange,
    selectedExperience,
    selectedLocations,
    selectedGenders,
    selectedEducation,
    selectedSubcategories,
    selectedDeadline,
    sortBy,
  ]);

  useEffect(() => {
    if (filteredJobs.length > 0) {
      const exists =
        selectedJob && filteredJobs.some((job) => job.id === selectedJob.id);

      if (!exists) {
        setSelectedJob(filteredJobs[0]);
      }
    } else {
      setSelectedJob(null);
    }
  }, [filteredJobs.length]);

  // filter job already apply or not
  useEffect(() => {
    const loadApplications = async () => {
      const authState = useAuthStore.getState();
      if (!authState.isAuthenticated || authState.user?.role !== "seeker")
        return;

      try {
        const result = await fetchMyApplications({ limit: 100 });
        if (result?.success && Array.isArray(result.data)) {
          const map = {};
          result.data.forEach((app) => {
            if (app.jobId) map[app.jobId] = app.status;
          });
          setAppliedJobIds(map);
        }
      } catch (e) {
        console.error("Failed to fetch applications:", e);
      }
    };

    loadApplications();
  }, []);

  const STATUS_CONFIG = {
    applied: {
      label: "Applied",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    shortlisted: {
      label: "Shortlisted",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    reviewed: {
      label: "Under Review",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
    hired: {
      label: "Hired!",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    rejected: {
      label: "Not Selected",
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      dot: "bg-red-400",
    },
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateUrlParams({ search: value.trim() });
  };

  const clearFilters = () => {
    setSalaryRange([0, 200000]);
    setSelectedExperience([]);
    setSelectedLocations([]);
    setSelectedGenders([]);
    setSelectedEducation([]);
    setSelectedDeadline([]);
    setSelectedSubcategories([]);
    setSearchTerm("");
    setSortBy("relevance");
    navigate("/jobs");
  };

  const uniqueLocations = [
    ...new Set(
      jobs
        .map((job) => {
          let jobLocation = job.location || job.country || "";

          if (jobLocation.includes("(")) {
            jobLocation = jobLocation.split("(")[0].trim();
          }

          if (jobLocation.includes("Dhaka")) {
            jobLocation = "Dhaka";
          }

          return jobLocation || "Not specified";
        })
        .filter(Boolean),
    ),
  ].sort();

  const uniqueGenders = [
    ...new Set(jobs.map((job) => job.gender).filter(Boolean)),
  ].sort();

  const uniqueSubcategories = [
    ...new Set(jobs.map((job) => job.subCategory).filter(Boolean)),
  ].sort();

  const filterOptions = {
    categories: categories.filter((item) => item.isActive !== false),
    countries: countries.filter((item) => item.isActive !== false),
    companies: companies,
    jobTypes: jobTypes.filter((item) => item.isActive !== false),
    locations: uniqueLocations,
    experiences: [
      "Fresher",
      "1-2 Years",
      "3-5 Years",
      "5-10 Years",
      "10+ Years",
    ],
    genders: uniqueGenders,
    deadlines: [
      "Within 24 Hours",
      "Within 3 Days",
      "Within 7 Days",
      "Within 30 Days",
    ],
    education: [
      "HSC",
      "Diploma",
      "Bachelor",
      "Masters",
      "PhD",
      "Any Bachelor's degree",
      "B.Sc.",
      "MBA",
    ],
    subcategories: uniqueSubcategories,
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";

    if (salary.min === 0 && salary.max === 0 && salary.default) {
      return salary.default;
    }

    if (salary.min > 0 && salary.max > 0) {
      return `৳${salary.min.toLocaleString()} - ৳${salary.max.toLocaleString()}`;
    }

    if (salary.min > 0) {
      return `৳${salary.min.toLocaleString()}+`;
    }

    if (salary.max > 0) {
      return `Up to ৳${salary.max.toLocaleString()}`;
    }

    return "Negotiable";
  };

  const getPostedDate = (job) => {
    if (!job.jobPostedDate) return "Recently posted";

    const postedDate = new Date(job.jobPostedDate);
    const today = new Date();
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return `${diffDays} days ago`;
  };

  const getDeadline = (job) => {
    if (!job.jobEndDate) return "No deadline";

    const daysLeft = getDaysLeft(job);

    if (daysLeft < 0) return "Deadline passed";
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "Tomorrow";

    return `${daysLeft} days left`;
  };

  const isUrgent = (job) => {
    const daysLeft = getDaysLeft(job);
    return daysLeft <= 3 && daysLeft >= 0;
  };

  const isFeatured = (job) => {
    if (!job.jobPostedDate) return false;

    const postedDate = new Date(job.jobPostedDate);
    const today = new Date();
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 7;
  };

  const getActiveFiltersCount = () => {
    return Object.values({
      locations: selectedLocations,
      experiences: selectedExperience,
      genders: selectedGenders,
      education: selectedEducation,
      deadlines: selectedDeadline,
      subcategories: selectedSubcategories,
      apiCategory: queryParams.jobCategoryId ? [queryParams.jobCategoryId] : [],
      apiCompany: queryParams.companyId ? [queryParams.companyId] : [],
      apiCountry: queryParams.countryId ? [queryParams.countryId] : [],
      apiJobType: queryParams.jobTypeId ? [queryParams.jobTypeId] : [],
      search: queryParams.search ? [queryParams.search] : [],
    }).flat().length;
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);

    if (window.innerWidth < 1024) {
      setShowMobileDescription(true);
    }
  };

  const FilterCheckbox = ({ label, checked, onChange, count, icon }) => (
    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        {checked && (
          <CheckCircle className="absolute top-0 left-0 w-5 h-5 text-blue-600 pointer-events-none" />
        )}
      </div>

      <div className="flex-1 flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          {icon &&
            React.createElement(icon, { className: "w-4 h-4 text-gray-400" })}

          <span className="text-gray-700 truncate">{label}</span>
        </div>

        {count !== undefined && (
          <span className="text-gray-400 text-sm">({count})</span>
        )}
      </div>
    </label>
  );

  if (isLoading && jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-ubuntu"
      style={{ backgroundColor: colors.bgLight }}
    >
      <div
        className="sticky top-0 z-40 bg-white shadow-sm border-b"
        style={{ borderColor: colors.border }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <a
                href="/"
                className="text-gray-600 text-sm hover:underline hover:text-secondary"
              >
                Home
              </a>
              <span>/</span>
              <p className="text-gray-600 text-sm">All Jobs</p>
            </div>

            <div className="relative w-full max-w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type="text"
                placeholder="Search jobs, companies, keywords..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ borderColor: colors.border }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5" style={{ color: colors.primary }} />

              <div>
                <span
                  className="font-semibold"
                  style={{ color: colors.primary }}
                >
                  Filters
                </span>

                <span className="text-gray-500 text-sm ml-2">
                  ({meta?.total ?? filteredJobs.length} jobs •{" "}
                  {getActiveFiltersCount()} filters)
                </span>
              </div>
            </div>

            {isFilterOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex gap-6">
          <div
            className={`
              ${isFilterOpen ? "block" : "hidden"}
              lg:block lg:w-1/4
            `}
          >
            <div
              className="bg-white rounded-xl shadow-sm border p-6 sticky top-24"
              style={{
                borderColor: colors.border,
                maxHeight: "calc(100vh - 120px)",
                overflowY: "auto",
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className="font-bold text-lg"
                  style={{ color: colors.primary }}
                >
                  Filter Jobs
                </h2>

                <button
                  onClick={clearFilters}
                  className="text-sm px-3 py-1 rounded hover:bg-gray-100 transition-colors"
                  style={{ color: colors.primary }}
                >
                  Clear All
                </button>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign
                    className="w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <h3 className="font-semibold text-gray-900">
                    Salary Range (৳)
                  </h3>
                </div>

                <div className="space-y-4 px-1">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={salaryRange[0]}
                    onChange={(e) =>
                      setSalaryRange([
                        parseInt(e.target.value, 10),
                        salaryRange[1],
                      ])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />

                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={salaryRange[1]}
                    onChange={(e) =>
                      setSalaryRange([
                        salaryRange[0],
                        parseInt(e.target.value, 10),
                      ])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Min</div>
                      <div
                        className="font-bold"
                        style={{ color: colors.primary }}
                      >
                        ৳{salaryRange[0].toLocaleString()}
                      </div>
                    </div>

                    <div className="text-gray-400">—</div>

                    <div className="text-center">
                      <div className="text-sm text-gray-600">Max</div>
                      <div
                        className="font-bold"
                        style={{ color: colors.primary }}
                      >
                        ৳{salaryRange[1].toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Award
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                  <h3 className="font-semibold text-gray-900">
                    Experience Level
                  </h3>
                </div>

                <div className="space-y-1">
                  {filterOptions.experiences.map((exp) => (
                    <FilterCheckbox
                      key={exp}
                      label={exp}
                      checked={selectedExperience.includes(exp)}
                      onChange={() => {
                        setSelectedExperience((prev) =>
                          prev.includes(exp)
                            ? prev.filter((e) => e !== exp)
                            : [...prev, exp],
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase
                    className="w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <h3 className="font-semibold text-gray-900">Job Category</h3>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {filterOptions.categories.map((category) => {
                    const id = category.jobCategoryId || category._id;
                    const checked = queryParams.jobCategoryId === id;

                    return (
                      <FilterCheckbox
                        key={id}
                        label={category.title}
                        checked={checked}
                        onChange={() =>
                          updateUrlParams({
                            jobCategoryId: checked ? "" : id,
                          })
                        }
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock
                    className="w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <h3 className="font-semibold text-gray-900">Job Type</h3>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {filterOptions.jobTypes.map((type) => {
                    const id = type.jobTypeId || type._id;
                    const checked = queryParams.jobTypeId === id;

                    return (
                      <FilterCheckbox
                        key={id}
                        label={type.title}
                        checked={checked}
                        onChange={() =>
                          updateUrlParams({
                            jobTypeId: checked ? "" : id,
                          })
                        }
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                  <h3 className="font-semibold text-gray-900">Country</h3>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {filterOptions.countries.map((country) => {
                    const id = country.countryId || country._id;
                    const checked = queryParams.countryId === id;

                    return (
                      <FilterCheckbox
                        key={id}
                        label={country.name}
                        checked={checked}
                        onChange={() =>
                          updateUrlParams({
                            countryId: checked ? "" : id,
                          })
                        }
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                  <h3 className="font-semibold text-gray-900">Location</h3>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {filterOptions.locations.map((loc) => (
                    <FilterCheckbox
                      key={loc}
                      label={loc}
                      checked={selectedLocations.includes(loc)}
                      onChange={() => {
                        setSelectedLocations((prev) =>
                          prev.includes(loc)
                            ? prev.filter((l) => l !== loc)
                            : [...prev, loc],
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5" style={{ color: colors.primary }} />
                  <h3 className="font-semibold text-gray-900">Gender</h3>
                </div>

                <div className="space-y-1">
                  {filterOptions.genders.map((gender) => (
                    <FilterCheckbox
                      key={gender}
                      label={gender}
                      checked={selectedGenders.includes(gender)}
                      onChange={() => {
                        setSelectedGenders((prev) =>
                          prev.includes(gender)
                            ? prev.filter((g) => g !== gender)
                            : [...prev, gender],
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Award
                    className="w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <h3 className="font-semibold text-gray-900">Education</h3>
                </div>

                <div className="space-y-1">
                  {filterOptions.education.map((edu) => (
                    <FilterCheckbox
                      key={edu}
                      label={edu}
                      checked={selectedEducation.includes(edu)}
                      onChange={() => {
                        setSelectedEducation((prev) =>
                          prev.includes(edu)
                            ? prev.filter((e) => e !== edu)
                            : [...prev, edu],
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                  <h3 className="font-semibold text-gray-900">
                    Application Deadline
                  </h3>
                </div>

                <div className="space-y-1">
                  {filterOptions.deadlines.map((deadline) => (
                    <FilterCheckbox
                      key={deadline}
                      label={deadline}
                      checked={selectedDeadline.includes(deadline)}
                      onChange={() => {
                        setSelectedDeadline((prev) =>
                          prev.includes(deadline)
                            ? prev.filter((d) => d !== deadline)
                            : [...prev, deadline],
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Building
                    className="w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <h3 className="font-semibold text-gray-900">Companies</h3>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {filterOptions.companies.map((company) => {
                    const id = company.companyId || company._id;
                    const name =
                      company.nameCompany ||
                      company.companyName ||
                      company.name;
                    const checked = queryParams.companyId === id;

                    return (
                      <FilterCheckbox
                        key={id}
                        label={name}
                        checked={checked}
                        onChange={() =>
                          updateUrlParams({
                            companyId: checked ? "" : id,
                          })
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-2/5">
                <div
                  className="bg-white rounded-xl shadow-sm border overflow-hidden mb-4"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="p-4 border-b"
                    style={{ borderColor: colors.border }}
                  >
                    <div className="flex justify-between items-center">
                      <h3
                        className="font-semibold"
                        style={{ color: colors.primary }}
                      >
                        Jobs Found: {meta?.total ?? filteredJobs.length}
                      </h3>

                      <select
                        className="border rounded-lg px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        style={{ borderColor: colors.border }}
                        value={sortBy}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSortBy(value);

                          if (value === "newest") {
                            updateUrlParams({
                              sortBy: "createdAt",
                              order: "desc",
                            });
                          }

                          if (value === "salary-high") {
                            updateUrlParams({
                              sortBy: "salaryMax",
                              order: "desc",
                            });
                          }

                          if (value === "deadline") {
                            updateUrlParams({
                              sortBy: "endDate",
                              order: "asc",
                            });
                          }
                        }}
                      >
                        <option value="relevance">Sort by: Relevance</option>
                        <option value="newest">Sort by: Newest</option>
                        <option value="salary-high">
                          Sort by: Salary High-Low
                        </option>
                        <option value="deadline">Sort by: Deadline</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4">
                    {filteredJobs.length > 0 ? (
                      <div className="space-y-4">
                        {filteredJobs.map((job) => (
                          <div
                            key={job.id}
                            onClick={() => handleJobSelect(job)}
                            className="p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md"
                            style={{
                              borderColor:
                                selectedJob?.id === job.id
                                  ? colors.secondary
                                  : colors.border,
                              borderLeftColor:
                                selectedJob?.id === job.id
                                  ? colors.secondary
                                  : colors.border,
                              borderLeftWidth:
                                selectedJob?.id === job.id ? "6px" : "1px",
                              backgroundColor:
                                selectedJob?.id === job.id
                                  ? colors.lightSecondary
                                  : "white",
                            }}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-gray-900 mb-1">
                                  {job.title}
                                </h4>
                                <p className="text-gray-700 font-medium">
                                  {job.company}
                                </p>
                              </div>

                              <div className="flex flex-col items-end gap-1">
                                {isFeatured(job) && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Featured
                                  </span>
                                )}

                                {isUrgent(job) && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                    Urgent
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location || "Not specified"}
                                </span>

                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {job.jobType || "Not specified"}
                                </span>

                                <span className="flex items-center gap-1">
                                  <Award className="w-4 h-4" />
                                  {formatExperience(job.experience)}
                                </span>
                              </div>

                              <div
                                className="font-bold text-lg"
                                style={{ color: colors.primary }}
                              >
                                {formatSalary(job.salary)}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="font-bold text-base text-green-700 uppercase">
                                Vacancy: {job.vacancy || "N/A"}
                              </span>

                              <div className="text-right">
                                <div className="text-xs text-gray-500">
                                  {getPostedDate(job)}
                                </div>

                                <div
                                  className="text-xs font-medium"
                                  style={{ color: colors.secondary }}
                                >
                                  {getDeadline(job)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                          No jobs found
                        </h4>
                        <p className="text-gray-500 mb-4">
                          Try adjusting your filters
                        </p>

                        <button
                          onClick={clearFilters}
                          className="px-6 py-2 rounded-lg font-medium transition-colors"
                          style={{
                            backgroundColor: colors.primary,
                            color: "white",
                          }}
                        >
                          Clear All Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden md:block lg:w-3/5">
                {selectedJob ? (
                  <div className="sticky top-24">
                    <div
                      className="bg-white rounded-xl shadow-lg border overflow-hidden flex flex-col"
                      style={{
                        borderColor: colors.border,
                        maxHeight: "calc(100vh - 120px)",
                      }}
                    >
                      <div
                        className="sticky top-0 z-10 p-6 border-b-2 bg-white"
                        style={{
                          borderColor: colors.border,
                          backgroundColor: colors.lightPrimary,
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h2
                              className="text-2xl font-bold mb-2"
                              style={{ color: colors.primary }}
                            >
                              {selectedJob.title}
                            </h2>

                            <div className="flex items-center flex-wrap gap-4 mb-3">
                              {selectedJob.clogo && (
                                <img
                                  src={selectedJob.clogo}
                                  alt={selectedJob.company}
                                  className="h-8 w-8 object-contain"
                                />
                              )}

                              <span className="font-semibold text-gray-800">
                                {selectedJob.company}
                              </span>

                              <div className="flex gap-2">
                                <span
                                  className="px-3 py-1 text-sm rounded-full font-medium"
                                  style={{
                                    backgroundColor: colors.secondary,
                                    color: "white",
                                  }}
                                >
                                  {selectedJob.jobType || "Full Time"}
                                </span>

                                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                                  {selectedJob.gender || "Any"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {selectedJob.location || "Not specified"}
                              </span>

                              <span className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                {formatExperience(selectedJob.experience)}
                              </span>

                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {getPostedDate(selectedJob)}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Save Job"
                            >
                              <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                            </button>

                            <button
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Share"
                            >
                              <Share2 className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                            </button>
                          </div>
                        </div>

                        <div
                          className="flex items-center justify-between pt-4 border-t"
                          style={{ borderColor: colors.border }}
                        >
                          <div>
                            <div className="text-sm text-gray-600">
                              Monthly Salary
                            </div>

                            <div
                              className="text-2xl font-bold"
                              style={{ color: colors.primary }}
                            >
                              {formatSalary(selectedJob.salary)}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              className="px-3 py-3 rounded-lg font-semibold border transition-colors cursor-pointer"
                              style={{
                                borderColor: colors.primary,
                                color: colors.primary,
                              }}
                            >
                              Save Job
                            </button>

                            {appliedJobIds[
                              selectedJob?.jobId || selectedJob?.id
                            ] ? (
                              (() => {
                                const status =
                                  appliedJobIds[
                                    selectedJob?.jobId || selectedJob?.id
                                  ];
                                const cfg =
                                  STATUS_CONFIG[status] ||
                                  STATUS_CONFIG.applied;
                                return (
                                  <div
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-sm ${cfg.bg} ${cfg.text} ${cfg.border}`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${cfg.dot}`}
                                    />
                                    {cfg.label}
                                  </div>
                                );
                              })()
                            ) : (
                              <button
                                onClick={() => handleOpenApply(selectedJob)}
                                className="flex-1 px-3 py-3 rounded-lg font-semibold cursor-pointer"
                                style={{
                                  backgroundColor: colors.secondary,
                                  color: "white",
                                }}
                              >
                                Apply Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex-1 overflow-y-auto"
                        style={{ maxHeight: "calc(100vh - 350px)" }}
                      >
                        <div className="p-6">
                          <div className="space-y-8">
                            <div className="flex items-start gap-4">
                              <div className="p-3 rounded-lg bg-gray-50">
                                <div className="text-sm text-gray-600">
                                  Vacancy
                                </div>

                                <div className="font-bold text-lg">
                                  {selectedJob.vacancy || "N/A"}
                                </div>
                              </div>

                              <div className="p-3 rounded-lg bg-gray-50 flex-1">
                                <div className="text-sm text-gray-600">
                                  Education
                                </div>

                                <div className="font-bold text-lg">
                                  {selectedJob.education || "Not specified"}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3
                                className="text-xl font-semibold mb-4 pb-2 border-b"
                                style={{
                                  color: colors.primary,
                                  borderColor: colors.border,
                                }}
                              >
                                Requirements
                              </h3>

                              <ul className="space-y-3">
                                {selectedJob.requirements &&
                                selectedJob.requirements.length > 0 ? (
                                  selectedJob.requirements.map((req, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-3"
                                    >
                                      <CheckCircle
                                        className="w-5 h-5 mt-0.5 shrink-0"
                                        style={{ color: colors.secondary }}
                                      />

                                      <span className="text-gray-700">
                                        {req}
                                      </span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-gray-500">
                                    Not specified
                                  </li>
                                )}
                              </ul>
                            </div>

                            <div>
                              <h3
                                className="text-xl font-semibold mb-4 pb-2 border-b"
                                style={{
                                  color: colors.primary,
                                  borderColor: colors.border,
                                }}
                              >
                                Job Description
                              </h3>

                              <div
                                className="prose max-w-none text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    selectedJob.description ||
                                      "No description found.",
                                  ),
                                }}
                              />
                            </div>

                            {selectedJob.benefits &&
                              selectedJob.benefits.length > 0 && (
                                <div>
                                  <h3
                                    className="text-xl font-semibold mb-4 pb-2 border-b"
                                    style={{
                                      color: colors.primary,
                                      borderColor: colors.border,
                                    }}
                                  >
                                    Benefits & Perks
                                  </h3>

                                  <div className="grid grid-cols-2 gap-3">
                                    {selectedJob.benefits.map(
                                      (benefit, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-3 p-3 rounded-lg"
                                          style={{
                                            backgroundColor:
                                              colors.lightSecondary,
                                          }}
                                        >
                                          <CheckCircle
                                            className="w-4 h-4"
                                            style={{ color: colors.secondary }}
                                          />

                                          <span className="text-gray-700">
                                            {benefit}
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}

                            {selectedJob.skills &&
                              selectedJob.skills.length > 0 && (
                                <div>
                                  <h3
                                    className="text-xl font-semibold mb-4 pb-2 border-b"
                                    style={{
                                      color: colors.primary,
                                      borderColor: colors.border,
                                    }}
                                  >
                                    Required Skills
                                  </h3>

                                  <div className="flex flex-wrap gap-2">
                                    {selectedJob.skills.map((skill, index) => (
                                      <span
                                        key={index}
                                        className="px-4 py-2 rounded-lg font-medium"
                                        style={{
                                          backgroundColor: colors.lightPrimary,
                                          color: colors.primary,
                                        }}
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {selectedJob.compnay && (
                              <div
                                className="p-4 rounded-lg border"
                                style={{ borderColor: colors.border }}
                              >
                                <h3
                                  className="text-xl font-semibold mb-4"
                                  style={{ color: colors.primary }}
                                >
                                  Company Information
                                </h3>

                                <div className="space-y-3">
                                  {selectedJob.compnay.email && (
                                    <div className="flex items-center gap-3">
                                      <Mail className="w-5 h-5 text-gray-400" />
                                      <span>{selectedJob.compnay.email}</span>
                                    </div>
                                  )}

                                  {selectedJob.compnay.phone && (
                                    <div className="flex items-center gap-3">
                                      <Phone className="w-5 h-5 text-gray-400" />
                                      <span>{selectedJob.compnay.phone}</span>
                                    </div>
                                  )}

                                  {selectedJob.compnay.address && (
                                    <div className="flex items-center gap-3">
                                      <MapPin className="w-5 h-5 text-gray-400" />
                                      <span>{selectedJob.compnay.address}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div
                              className="p-6 rounded-lg text-center"
                              style={{ backgroundColor: colors.lightSecondary }}
                            >
                              <h4
                                className="text-xl font-semibold mb-2"
                                style={{ color: colors.primary }}
                              >
                                Ready to Apply?
                              </h4>

                              <p className="text-gray-600 mb-4">
                                Don't miss this opportunity!
                              </p>

                              {appliedJobIds[
                                selectedJob?.jobId || selectedJob?.id
                              ] ? (
                                (() => {
                                  const status =
                                    appliedJobIds[
                                      selectedJob?.jobId || selectedJob?.id
                                    ];
                                  const cfg =
                                    STATUS_CONFIG[status] ||
                                    STATUS_CONFIG.applied;
                                  return (
                                    <div
                                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
                                    >
                                      <span
                                        className={`w-2 h-2 rounded-full ${cfg.dot}`}
                                      />
                                      ✓ {cfg.label}
                                    </div>
                                  );
                                })()
                              ) : (
                                <button
                                  onClick={() => handleOpenApply(selectedJob)}
                                  className="px-8 py-3 rounded-lg font-semibold hover:shadow-lg cursor-pointer"
                                  style={{
                                    backgroundColor: colors.secondary,
                                    color: "white",
                                  }}
                                >
                                  Apply Now
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="bg-white rounded-xl shadow-sm border p-12 text-center"
                    style={{ borderColor: colors.border, minHeight: "500px" }}
                  >
                    <Briefcase
                      className="w-20 h-20 mx-auto mb-6"
                      style={{ color: colors.lightPrimary }}
                    />

                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ color: colors.primary }}
                    >
                      Select a Job
                    </h3>

                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Choose a job from the list on the left to view detailed
                      information.
                    </p>

                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                      style={{ backgroundColor: colors.lightSecondary }}
                    >
                      <Star
                        className="w-4 h-4"
                        style={{ color: colors.secondary }}
                      />

                      <span style={{ color: colors.primary }}>
                        {jobs.filter((j) => isFeatured(j)).length} Featured Jobs
                        Available
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMobileDescription && selectedJob && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileDescription(false)}
          />

          <div className="absolute inset-0 bg-white overflow-y-auto">
            <div
              className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between"
              style={{ borderColor: colors.border }}
            >
              <h3 className="font-bold" style={{ color: colors.primary }}>
                Job Details
              </h3>

              <button onClick={() => setShowMobileDescription(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 pb-24">
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-xl font-bold mb-2"
                    style={{ color: colors.primary }}
                  >
                    {selectedJob.title}
                  </h2>

                  <div className="flex flex-wrap items-start gap-4">
                    {selectedJob.clogo && (
                      <img
                        src={selectedJob.clogo}
                        alt={selectedJob.company}
                        className="h-8 w-8"
                      />
                    )}

                    <p className="font-semibold text-gray-800 mb-3">
                      {selectedJob.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedJob.location || "Not specified"}
                    </span>

                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {selectedJob.jobType || "Full Time"}
                    </span>
                  </div>

                  <div
                    className="text-2xl font-bold mb-6"
                    style={{ color: colors.primary }}
                  >
                    {formatSalary(selectedJob.salary)}
                  </div>
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: colors.primary }}
                  >
                    Description
                  </h3>

                  <div
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        selectedJob.description || "No description found.",
                      ),
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg"
              style={{ borderColor: colors.border }}
            >
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-lg font-semibold border"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
                  Save
                </button>

                {appliedJobIds[selectedJob?.jobId || selectedJob?.id] ? (
                  (() => {
                    const status =
                      appliedJobIds[selectedJob?.jobId || selectedJob?.id];
                    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.applied;
                    return (
                      <div
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />✓{" "}
                        {cfg.label}
                      </div>
                    );
                  })()
                ) : (
                  <button
                    onClick={() => handleOpenApply(selectedJob)}
                    className="px-8 py-3 rounded-lg font-semibold hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: colors.secondary,
                      color: "white",
                    }}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ApplyJobModal
        job={applyTargetJob}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onSuccess={() => {
          setApplyModalOpen(false);
          if (applyTargetJob) {
            const jobId = applyTargetJob.jobId || applyTargetJob.id;
            setAppliedJobIds((prev) => ({ ...prev, [jobId]: "applied" }));
          }
        }}
      />
    </div>
  );
};

export default AllJobs;
