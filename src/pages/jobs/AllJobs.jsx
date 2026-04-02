import React, { useState, useEffect } from "react";
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
  Globe,
} from "lucide-react";
import jobData from "../../data/jobData.json";
// import ApplyPopUps from "./ApplyPopUps";

const AllJobs = () => {
  const {
    cate,
    location: locationParam,
    company: companyParam,
    function: functionParam,
  } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showMobileDescription, setShowMobileDescription] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedDeadline, setSelectedDeadline] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  // apply states
  // const [showApplyPopup, setShowApplyPopup] = useState(false);
  // const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  // const handleApplyClick = (job) => {
  //   setSelectedJobForApply(job);
  //   setShowApplyPopup(true);
  // };

  const colors = {
    primary: "#1e2558",
    secondary: "#4eb956",
    lightPrimary: "rgba(30, 37, 88, 0.1)",
    lightSecondary: "rgba(78, 185, 86, 0.1)",
    border: "#e2e8f0",
    bgLight: "#f8fafc",
  };

  // Format experience for display
  const formatExperience = (experience) => {
    if (Array.isArray(experience)) {
      if (experience[0] === 0 && experience[1] <= 1) {
        return "Fresher";
      }
      return `${experience[0]}-${experience[1]} Years`;
    }
    return experience === 0 || experience === "0"
      ? "Fresher"
      : `${experience} Years`;
  };

  // Check if experience matches filter
  const experienceMatches = (jobExperience, filterExperience) => {
    const jobExp = jobExperience;

    if (filterExperience === "Fresher") {
      if (Array.isArray(jobExp)) {
        return jobExp[0] === 0 && jobExp[1] <= 1;
      }
      return jobExp === 0 || jobExp === "0";
    }

    if (Array.isArray(jobExp)) {
      const minExp = jobExp[0];

      if (filterExperience === "1-2 Years") {
        return minExp >= 1 && minExp <= 2;
      }
      if (filterExperience === "3-5 Years") {
        return minExp >= 3 && minExp <= 5;
      }
      if (filterExperience === "5-10 Years") {
        return minExp >= 5 && minExp <= 10;
      }
      if (filterExperience === "10+ Years") {
        return minExp >= 10;
      }
    }
    return false;
  };

  // Map URL parameters to actual filter values
  useEffect(() => {
    // Set jobs from actual jobData
    setJobs(jobData);
    if (jobData.length > 0) {
      setSelectedJob(jobData[0]);
    }

    // Set initial filters based on URL params
    if (cate) {
      const categoryMapping = {
        "accounting-finance": "Accounting/Finance",
        "business-development": "Business Development",
        "sales-marketing": "Sales/Marketing",
        "it-telecommunication": "IT/Telecommunication",
        "information-technology": "Information Technology",
        engineering: "Engineering",
        manufacturing: "Manufacturing",
        services: "Services",
        "recruitment-employment": "Recruitment/Employment Firms",
        "data-entry-office-support": "Data Entry/Office Support",
        "hospitality-travel-tourism": "Hospitality/Travel/Tourism",
        "education-training": "Education/Training",
        "customer-service-call-centre": "Customer/Service/Call Centre",
        consultants: "Consultants",
        "banking-financial-services": "Banking/Financial Services",
        "ngo-social-services": "N.G.O./Social Services",
        "ecommerce-ebusiness": "E-Commerce/E-Business",
        "real-estate-property": "Real Estate/Property",
        "healthcare-hospital-medical": "Healthcare/Hospital/Medical",
        bpo: "BPO",
        "construction-cement-metals": "Construction/Cement/Metals",
        "architect-interior-design": "Architect/Interior Design",
        "importers-distributors-exporters": "Importers/ Distributors/Exporters",
      };

      const originalCategory = categoryMapping[cate];
      if (originalCategory) {
        setSelectedCategories([originalCategory]);
      }
    }

    if (locationParam) {
      const cleanLocation = locationParam.replace(/-/g, " ");
      const locationMapping = {
        dhaka: "Dhaka",
        chattogram: "Chattogram",
        kurigram: "Kurigram",
        jashore: "Jashore",
        bogra: "Bogra",
        gazipur: "Gazipur",
        savar: "Savar",
        ashulia: "Ashulia",
      };

      const mappedLocation =
        locationMapping[cleanLocation.toLowerCase()] || cleanLocation;
      setSelectedLocations([mappedLocation]);
    }

    if (companyParam) {
      const cleanCompany = companyParam.replace(/-/g, " ");
      const companies = [...new Set(jobData.map((job) => job.company))];
      const foundCompany = companies.find((company) =>
        company.toLowerCase().includes(cleanCompany.toLowerCase())
      );
      if (foundCompany) {
        setSelectedCompanies([foundCompany]);
      }
    }

    if (functionParam) {
      const cleanFunction = functionParam.replace(/-/g, " ");
      setSelectedSubcategories([cleanFunction]);
    }
  }, [cate, locationParam, companyParam, functionParam]);

  // Add this useEffect to handle URL search parameters
  useEffect(() => {
    // Parse URL search parameters
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");
    const locationParam = searchParams.get("location");
    const minSalary = searchParams.get("minSalary");
    const subcategoryParam = searchParams.get("subcategory");
    const filter = searchParams.get("filter");
    // Update search states based on URL parameters
    if (filter) {
      switch (filter) {
        case "recent":
          // Set to show recent jobs (posted in last 7 days)
          setSortBy("newest");
          break;
        case "deadline_tomorrow":
          setSelectedDeadline(["Within 24 Hours"]);
          break;
        case "internship":
          setSearchTerm("intern");
          setSelectedJobTypes(["Internship"]);
          break;
        case "contractual":
          setSearchTerm("contractual");
          setSelectedJobTypes(["Contractual"]);
          break;
        case "part_time":
          setSearchTerm("part time");
          setSelectedJobTypes(["Part Time"]);
          break;
        case "overseas":
          setSearchTerm("overseas");
          break;
        case "remote":
          setSelectedJobTypes(["Remote", "Hybrid"]);
          break;
        case "fresher":
          setSelectedExperience(["Fresher"]);
          break;
      }
    }

    if (searchQuery) {
      setSearchTerm(searchQuery);
    }

    if (locationParam) {
      setSelectedLocations([locationParam]);
    }

    if (minSalary) {
      const minSalaryNum = parseInt(minSalary);
      setSalaryRange([minSalaryNum, salaryRange[1]]);
    }

    if (subcategoryParam) {
      const subcategory = subcategoryParam.replace(/-/g, " ");
      setSelectedSubcategories([subcategory]);
    }
  }, [location.search]);

  // Get actual salary range from job data
  useEffect(() => {
    const salaries = jobData
      .map((job) => job.salary.max)
      .filter((salary) => salary > 0);
    if (salaries.length > 0) {
      const maxSalary = Math.max(...salaries);
      setSalaryRange([0, maxSalary]);
    }
  }, []);

  // Calculate days left until deadline
  const getDaysLeft = (job) => {
    if (!job.jobEndDate) return Infinity;

    const endDate = new Date(job.jobEndDate);
    const today = new Date("2025-12-10");
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Check deadline filter
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

  // Filter jobs based on all criteria
  const filterAndSortJobs = () => {
    let filtered = jobs.filter((job) => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const jobMatches =
          job.title.toLowerCase().includes(term) ||
          (job.company && job.company.toLowerCase().includes(term)) ||
          (job.description && job.description.toLowerCase().includes(term)) ||
          (job.skills &&
            job.skills.some((skill) => skill.toLowerCase().includes(term))) ||
          (job.category && job.category.toLowerCase().includes(term));
        if (!jobMatches) return false;
      }

      // Salary filter
      const jobMinSalary = job.salary?.min || 0;
      const jobMaxSalary = job.salary?.max || 0;
      if (jobMaxSalary < salaryRange[0] || jobMinSalary > salaryRange[1]) {
        return false;
      }

      // Category filter
      if (
        selectedCategories.length > 0 &&
        (!job.category || !selectedCategories.includes(job.category))
      ) {
        return false;
      }

      // Experience filter
      if (selectedExperience.length > 0) {
        const matchesExperience = selectedExperience.some((exp) =>
          experienceMatches(job.experience, exp)
        );
        if (!matchesExperience) return false;
      }

      // Job type filter
      if (
        selectedJobTypes.length > 0 &&
        !selectedJobTypes.includes(job.jobType)
      ) {
        return false;
      }

      // Location filter
      if (selectedLocations.length > 0) {
        const jobLocation = job.location ? job.location.toLowerCase() : "";
        const matchesLocation = selectedLocations.some((loc) =>
          jobLocation.includes(loc.toLowerCase())
        );
        if (!matchesLocation) return false;
      }

      // Gender filter
      if (selectedGenders.length > 0 && !selectedGenders.includes(job.gender)) {
        return false;
      }

      // Company filter
      if (
        selectedCompanies.length > 0 &&
        (!job.company || !selectedCompanies.includes(job.company))
      ) {
        return false;
      }

      // Education filter
      if (selectedEducation.length > 0) {
        const jobEducation = job.education || "";
        const matchesEducation = selectedEducation.some((edu) =>
          jobEducation.toLowerCase().includes(edu.toLowerCase())
        );
        if (!matchesEducation) return false;
      }

      // Subcategory filter
      if (selectedSubcategories.length > 0) {
        const jobSubcategory = job.subCategory || "";
        const matchesSubcategory = selectedSubcategories.some((subcat) =>
          jobSubcategory.toLowerCase().includes(subcat.toLowerCase())
        );
        if (!matchesSubcategory) return false;
      }

      // Deadline filter
      if (selectedDeadline.length > 0) {
        const matchesDeadline = selectedDeadline.some((deadline) =>
          deadlineMatches(job, deadline)
        );
        if (!matchesDeadline) return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          // Sort by posted date (newest first)
          const dateA = new Date(a.jobPostedDate || 0);
          const dateB = new Date(b.jobPostedDate || 0);
          return dateB - dateA;

        case "salary-high":
          // Sort by max salary (highest first)
          const salaryA = a.salary?.max || 0;
          const salaryB = b.salary?.max || 0;
          return salaryB - salaryA;

        case "deadline":
          // Sort by deadline (closest first)
          const deadlineA = getDaysLeft(a);
          const deadlineB = getDaysLeft(b);
          if (deadlineA === Infinity && deadlineB === Infinity) return 0;
          if (deadlineA === Infinity) return 1;
          if (deadlineB === Infinity) return -1;
          return deadlineA - deadlineB;

        case "relevance":
        default:
          // Default: Sort by ID or keep original order
          // You can add more sophisticated relevance algorithm here
          return a.id - b.id;
      }
    });

    return filtered;
  };

  const filteredJobs = filterAndSortJobs();

  // Update selected job when filters change
  useEffect(() => {
    if (filteredJobs.length > 0) {
      // Check if current selectedJob is in filteredJobs
      const isSelectedJobInFiltered =
        selectedJob && filteredJobs.some((job) => job.id === selectedJob.id);

      // If selectedJob is not in filtered results OR no job is selected, select the first one
      if (!isSelectedJobInFiltered || !selectedJob) {
        setSelectedJob(filteredJobs[0]);
      }
    } else {
      // No jobs found, clear selected job
      setSelectedJob(null);
    }
  }, [filteredJobs]);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // When user types in search, clear selected job if it doesn't match
    if (value.trim() !== "" && selectedJob) {
      const term = value.toLowerCase();
      const selectedMatches =
        (selectedJob.title && selectedJob.title.toLowerCase().includes(term)) ||
        (selectedJob.company &&
          selectedJob.company.toLowerCase().includes(term)) ||
        (selectedJob.description &&
          selectedJob.description.toLowerCase().includes(term)) ||
        (selectedJob.category &&
          selectedJob.category.toLowerCase().includes(term));

      if (!selectedMatches) {
        setSelectedJob(null);
      }
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSalaryRange([0, 200000]);
    setSelectedCategories([]);
    setSelectedExperience([]);
    setSelectedJobTypes([]);
    setSelectedLocations([]);
    setSelectedGenders([]);
    setSelectedCompanies([]);
    setSelectedEducation([]);
    setSelectedDeadline([]);
    setSelectedSubcategories([]);
    setSearchTerm("");
    setSortBy("relevance");
    if (jobData.length > 0) {
      setSelectedJob(jobData[0]);
    }
    navigate("/jobs");
  };

  const uniqueLocations = [
    ...new Set(
      jobs
        .flatMap((job) => {
          let location = job.location;
          if (location && location.includes("(")) {
            location = location.split("(")[0].trim();
          }
          if (location && location.includes("Dhaka")) {
            location = "Dhaka";
          }
          return location || "Not specified";
        })
        .filter((loc) => loc)
    ),
  ].sort();

  const uniqueCompanies = [
    ...new Set(jobs.map((job) => job.company).filter((company) => company)),
  ].sort();

  const uniqueCategories = [
    ...new Set(jobs.map((job) => job.category).filter((category) => category)),
  ].sort();

  const uniqueJobTypes = [
    ...new Set(jobs.map((job) => job.jobType).filter((type) => type)),
  ].sort();

  const uniqueGenders = [
    ...new Set(jobs.map((job) => job.gender).filter((gender) => gender)),
  ].sort();

  const uniqueSubcategories = [
    ...new Set(jobs.map((job) => job.subCategory).filter((subcat) => subcat)),
  ].sort();

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    if (window.innerWidth < 1024) {
      setShowMobileDescription(true);
    }
  };

  const filterOptions = {
    categories: uniqueCategories,
    locations: uniqueLocations,
    companies: uniqueCompanies,
    experiences: [
      "Fresher",
      "1-2 Years",
      "3-5 Years",
      "5-10 Years",
      "10+ Years",
    ],
    jobTypes: uniqueJobTypes,
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

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return "Not specified";

    if (salary.min === 0 && salary.max === 0 && salary.default) {
      return salary.default;
    }
    if (salary.min > 0 && salary.max > 0) {
      return `৳${salary.min.toLocaleString()} - ৳${salary.max.toLocaleString()}`;
    }
    return "Negotiable";
  };

  // Calculate days ago from posted date
  const getPostedDate = (job) => {
    if (!job.jobPostedDate) return "Recently posted";

    const postedDate = new Date(job.jobPostedDate);
    const today = new Date("2025-12-10");
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  // Calculate deadline display
  const getDeadline = (job) => {
    if (!job.jobEndDate) return "No deadline";

    const daysLeft = getDaysLeft(job);

    if (daysLeft < 0) return "Deadline passed";
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "Tomorrow";
    return `${daysLeft} days left`;
  };

  // Filter checkbox component
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
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon &&
            React.createElement(icon, { className: "w-4 h-4 text-gray-400" })}
          <span className="text-gray-700">{label}</span>
        </div>
        {count !== undefined && (
          <span className="text-gray-400 text-sm">({count})</span>
        )}
      </div>
    </label>
  );

  // Check if job is urgent/featured
  const isUrgent = (job) => {
    const daysLeft = getDaysLeft(job);
    return daysLeft <= 3 && daysLeft >= 0;
  };

  const isFeatured = (job) => {
    if (!job.jobPostedDate) return false;
    const postedDate = new Date(job.jobPostedDate);
    const today = new Date("2025-12-10");
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    return Object.values({
      categories: selectedCategories,
      locations: selectedLocations,
      experiences: selectedExperience,
      jobTypes: selectedJobTypes,
      genders: selectedGenders,
      companies: selectedCompanies,
      education: selectedEducation,
      deadlines: selectedDeadline,
      subcategories: selectedSubcategories,
    }).flat().length;
  };

  return (
    <div className="min-h-screen font-ubuntu" style={{ backgroundColor: colors.bgLight }}>
      <div
        className="sticky top-0 z-40 bg-white shadow-sm border-b"
        style={{ borderColor: colors.border }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                  ({filteredJobs.length} jobs • {getActiveFiltersCount()}{" "}
                  filters)
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

              {/* Salary Range */}
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
                      setSalaryRange([parseInt(e.target.value), salaryRange[1]])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--thumb-color)]"
                    style={{ "--thumb-color": colors.primary }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={salaryRange[1]}
                    onChange={(e) =>
                      setSalaryRange([salaryRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--thumb-color)]"
                    style={{ "--thumb-color": colors.primary }}
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
                            : [...prev, exp]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Job Category */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase
                    className="w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <h3 className="font-semibold text-gray-900">Job Category</h3>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {filterOptions.categories.map((category) => (
                    <FilterCheckbox
                      key={category}
                      label={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => {
                        setSelectedCategories((prev) =>
                          prev.includes(category)
                            ? prev.filter((c) => c !== category)
                            : [...prev, category]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Subcategory */}
              {selectedCategories.length > 0 &&
                filterOptions.subcategories.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase
                        className="w-5 h-5"
                        style={{ color: colors.secondary }}
                      />
                      <h3 className="font-semibold text-gray-900">
                        Subcategory
                      </h3>
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                      {filterOptions.subcategories.map((subcategory) => (
                        <FilterCheckbox
                          key={subcategory}
                          label={subcategory}
                          checked={selectedSubcategories.includes(subcategory)}
                          onChange={() => {
                            setSelectedSubcategories((prev) =>
                              prev.includes(subcategory)
                                ? prev.filter((c) => c !== subcategory)
                                : [...prev, subcategory]
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* Location */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                  <h3 className="font-semibold text-gray-900">Location</h3>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {filterOptions.locations.map((location) => (
                    <FilterCheckbox
                      key={location}
                      label={location}
                      checked={selectedLocations.includes(location)}
                      onChange={() => {
                        setSelectedLocations((prev) =>
                          prev.includes(location)
                            ? prev.filter((l) => l !== location)
                            : [...prev, location]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock
                    className="w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <h3 className="font-semibold text-gray-900">Job Type</h3>
                </div>
                <div className="space-y-1">
                  {filterOptions.jobTypes.map((type) => (
                    <FilterCheckbox
                      key={type}
                      label={type}
                      checked={selectedJobTypes.includes(type)}
                      onChange={() => {
                        setSelectedJobTypes((prev) =>
                          prev.includes(type)
                            ? prev.filter((t) => t !== type)
                            : [...prev, type]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Gender */}
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
                            : [...prev, gender]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Education */}
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
                            : [...prev, edu]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Application Deadline */}
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
                            : [...prev, deadline]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Companies */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Building
                    className="w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <h3 className="font-semibold text-gray-900">Companies</h3>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {filterOptions.companies.map((company) => (
                    <FilterCheckbox
                      key={company}
                      label={company}
                      checked={selectedCompanies.includes(company)}
                      onChange={() => {
                        setSelectedCompanies((prev) =>
                          prev.includes(company)
                            ? prev.filter((c) => c !== company)
                            : [...prev, company]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left - Job Cards */}
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
                        Jobs Found: {filteredJobs.length}
                      </h3>
                      <select
                        className="border rounded-lg px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        style={{ borderColor: colors.border }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
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
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                              selectedJob?.id === job.id
                                ? "border-l-6"
                                : "border"
                            }`}
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
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
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
                              <div className="">
                                {/* <span
                                  className="px-2 py-1 text-xs rounded font-medium"
                                  style={{
                                    backgroundColor: colors.lightPrimary,
                                    color: colors.primary,
                                  }}
                                >
                                  {job.category || "N/A"}
                                </span> */}
                                <span className="font-bold text-base text-green-700 uppercase">
                                  Vacancy: {job.vacancy || "N/A"}
                                </span>
                              </div>
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

              {/* Right - Job Description */}
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
                            <div className="flex items-center gap-6 text-sm text-gray-600">
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

                        {/* Salary and Apply */}
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
                              className="px-6 py-3 rounded-lg font-semibold border transition-colors cursor-pointer"
                              style={{
                                borderColor: colors.primary,
                                color: colors.primary,
                              }}
                            >
                              Save Job
                            </button>
                            <button
                              // onClick={() => handleApplyClick(selectedJob)}
                              className="px-8 py-3 rounded-lg font-semibold transition-colors hover:shadow-lg cursor-pointer"
                              style={{
                                backgroundColor: colors.secondary,
                                color: "white",
                              }}
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Job Details - Scrollable Content */}
                      <div
                        className="flex-1 overflow-y-auto"
                        style={{ maxHeight: "calc(100vh - 350px)" }}
                      >
                        <div className="p-6">
                          <div className="space-y-8">
                            {/* Job Summary */}
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

                            {/* Requirements */}
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
                                  ))}
                              </ul>
                            </div>

                            {/* Job Description */}
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
                              <div className="prose max-w-none text-gray-700 leading-relaxed">
                                {selectedJob.description}
                              </div>
                            </div>

                            {/* Benefits */}
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
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Skills */}
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

                            {/* Company Contact Info */}
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

                            {/* Apply Section */}
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
                              <button
                                // onClick={() => handleApplyClick(selectedJob)}
                                className="px-8 py-3 rounded-lg font-semibold text-lg transition-transform hover:scale-105 cursor-pointer"
                                style={{
                                  backgroundColor: colors.primary,
                                  color: "white",
                                }}
                              >
                                Apply Now
                              </button>
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
                      information, requirements, and application details here.
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

      {/* Mobile Job Description Modal */}
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
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
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
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements &&
                      selectedJob.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle
                            className="w-4 h-4 mt-0.5"
                            style={{ color: colors.secondary }}
                          />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: colors.primary }}
                  >
                    Description
                  </h3>
                  <p className="text-gray-700">{selectedJob.description}</p>
                </div>
                {/* Benefits */}
                {selectedJob.benefits && selectedJob.benefits.length > 0 && (
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
                      {selectedJob.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg"
                          style={{
                            backgroundColor: colors.lightSecondary,
                          }}
                        >
                          <CheckCircle
                            className="w-4 h-4"
                            style={{ color: colors.secondary }}
                          />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {selectedJob.skills && selectedJob.skills.length > 0 && (
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

                {/* Company Contact Info */}
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
              </div>
            </div>

            {/* Apply Button for Mobile */}
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
                <button
                  // onClick={() => handleApplyClick(selectedJob)}
                  className="flex-1 py-3 rounded-lg font-semibold cursor-pointer"
                  style={{ backgroundColor: colors.secondary, color: "white" }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {showApplyPopup && selectedJobForApply && (
        <ApplyPopUps
          isOpen={showApplyPopup}
          onClose={() => {
            setShowApplyPopup(false);
            setSelectedJobForApply(null);
          }}
          jobTitle={selectedJobForApply.title}
          company={selectedJobForApply.company}
        />
      )} */}
    </div>
  );
};

export default AllJobs;
