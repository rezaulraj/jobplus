import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaDollarSign,
  FaBriefcase,
  FaChevronDown,
  FaTimes,
  FaArrowRight,
  FaUsers,
} from "react-icons/fa";
import { BsBuildingsFill } from "react-icons/bs";
import { MdOutlineWifiProtectedSetup } from "react-icons/md";
import heroBgImage from "/images/rootpage/banner_bg.webp";
import useJobStore from "../../store/jobStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// ── Skeleton Components ──
const StatCardSkeleton = () => (
  <div className="px-2 md:px-6 py-4 rounded-xl bg-white/20 animate-pulse flex items-center space-x-1 md:space-x-3 min-w-[100px] md:min-w-[150px]">
    <div className="w-8 h-8 rounded-full bg-white/30" />
    <div className="flex flex-col gap-2">
      <div className="h-5 w-16 bg-white/30 rounded" />
      <div className="h-3 w-20 bg-white/20 rounded" />
    </div>
  </div>
);

const QuickLinkSkeleton = () => (
  <div className="flex items-center justify-between py-2 px-2 border-b border-gray-100 w-full animate-pulse">
    <div className="flex items-center gap-2 flex-1">
      <div className="w-3 h-3 rounded-full bg-gray-200" />
      <div className="h-3 bg-gray-200 rounded w-3/4" />
    </div>
    <div className="h-5 w-8 bg-gray-200 rounded ml-2" />
  </div>
);

const HeroHome = () => {
  const navigate = useNavigate();

  const {
    jobs,
    categories,
    countries,
    companies,
    jobTypes,
    fetchJobs,
    fetchJobFilters,
  } = useJobStore();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    jobTitleSkillsCompany: "",
    location: "",
    minSalary: "",
  });
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showSalaryDropdown, setShowSalaryDropdown] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  // ── Stats state ──
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalVacancies: 0,
    newJobsCount: 0,
    deadlineTomorrowCount: 0,
    companiesCount: 0,
  });
  const [jobTypesList, setJobTypesList] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const searchInputRef = useRef(null);
  const locationInputRef = useRef(null);
  const salaryInputRef = useRef(null);

  useEffect(() => {
    fetchJobFilters();
    fetchJobs({ page: 1, limit: 20, sortBy: "createdAt", order: "desc" });
  }, []);

  // ── Fetch all stats independently ──
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().slice(0, 10);

        const [allJobsRes, jobTypesRes, companiesRes] = await Promise.all([
          axios.get(`${API_URL}/jobs`, {
            withCredentials: true,
            params: { status: "published", limit: 1000, page: 1 },
          }),
          axios.get(`${API_URL}/job-types`, { withCredentials: true }),
          axios.get(`${API_URL}/company`, { withCredentials: true }),
        ]);

        const allItems = allJobsRes.data?.data?.items || [];
        const totalJobs = allJobsRes.data?.data?.meta?.total || allItems.length;

        const totalVacancies = allItems.reduce(
          (sum, job) => sum + (Number(job.vacancy) || 0),
          0,
        );

        const newJobsCount = allItems.filter((job) => {
          const date = new Date(job.publishedAt || job.createdAt);
          return !isNaN(date.getTime()) && date >= sevenDaysAgo;
        }).length;

        const deadlineTomorrowCount = allItems.filter((job) => {
          if (!job.endDate) return false;
          return (
            new Date(job.endDate).toISOString().slice(0, 10) === tomorrowDate
          );
        }).length;

        const companiesData =
          companiesRes.data?.data?.items || companiesRes.data?.data || [];

        const types = (jobTypesRes.data?.data || []).filter(
          (t) => t.isActive !== false,
        );
        setJobTypesList(types);

        setStats({
          totalJobs,
          totalVacancies,
          newJobsCount,
          deadlineTomorrowCount,
          companiesCount: companiesData.length,
        });
      } catch (err) {
        console.error("Failed to fetch hero stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const jobStats = useMemo(
    () => [
      {
        label: "Vacancy Open",
        count: stats.totalVacancies || stats.totalJobs,
        icon: FaUsers,
        bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
      },
      {
        label: "Companies",
        count: stats.companiesCount,
        icon: BsBuildingsFill,
        bgColor: "bg-gradient-to-r from-green-400 to-teal-500",
      },
      {
        label: "New Jobs",
        count: stats.newJobsCount,
        icon: MdOutlineWifiProtectedSetup,
        bgColor: "bg-gradient-to-r from-pink-500 to-red-500",
      },
    ],
    [stats],
  );

  const quickLinks = useMemo(() => {
    const base = [
      { label: "All Jobs", count: stats.totalJobs, path: "/jobs" },
      { label: "Company List", count: stats.companiesCount, path: "/companys" },
      {
        label: "New Jobs",
        count: stats.newJobsCount,
        path: "/jobs?filter=recent",
      },
      {
        label: "Deadline Tomorrow",
        count: stats.deadlineTomorrowCount,
        path: "/jobs?filter=deadline_tomorrow",
      },
    ];

    const typeLinks = jobTypesList.map((type) => ({
      label: `${type.title} Jobs`,
      count: type.totalJobs ?? 0,
      path: `/jobs?jobTypeId=${type.jobTypeId || type._id}`,
    }));

    return [...base, ...typeLinks];
  }, [stats, jobTypesList]);

  const locationOptions = useMemo(() => {
    const apiCountries = countries.map((c) => c.name).filter(Boolean);
    const jobLocations = jobs
      .map((j) => j.location || j.country)
      .filter(Boolean)
      .map((loc) =>
        loc.includes(",") ? loc.split(",")[0].trim() : loc.trim(),
      );
    return [...new Set([...apiCountries, ...jobLocations])].sort();
  }, [countries, jobs]);

  const salaryRanges = [
    { value: "", label: "Min Salary" },
    { value: "10000", label: "৳10,000+" },
    { value: "20000", label: "৳20,000+" },
    { value: "30000", label: "৳30,000+" },
    { value: "50000", label: "৳50,000+" },
    { value: "75000", label: "৳75,000+" },
    { value: "100000", label: "৳1,00,000+" },
    { value: "150000", label: "৳1,50,000+" },
    { value: "200000", label: "৳2,00,000+" },
  ];

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 300);
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    setShowLocationSuggestions(false);
    setShowSalaryDropdown(false);
    setSearchQuery({ jobTitleSkillsCompany: "", location: "", minSalary: "" });
    setSearchSuggestions([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.jobTitleSkillsCompany)
      params.append("search", searchQuery.jobTitleSkillsCompany);
    if (searchQuery.location) params.append("location", searchQuery.location);
    if (searchQuery.minSalary)
      params.append("minSalary", searchQuery.minSalary);
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
    handleCloseSearch();
  };

  const generateSearchSuggestions = (query) => {
    const q = query.toLowerCase();
    const suggestions = new Set();
    jobs.forEach((job) => {
      if (job.title?.toLowerCase().includes(q)) suggestions.add(job.title);
      if (job.company?.toLowerCase().includes(q)) suggestions.add(job.company);
      if (job.category?.toLowerCase().includes(q))
        suggestions.add(job.category);
      if (job.jobType?.toLowerCase().includes(q)) suggestions.add(job.jobType);
      job.skills?.forEach((s) => {
        if (s?.toLowerCase().includes(q)) suggestions.add(s);
      });
    });
    categories.forEach((c) => {
      if (c.title?.toLowerCase().includes(q)) suggestions.add(c.title);
    });
    companies.forEach((c) => {
      const n = c.nameCompany || c.companyName || c.name;
      if (n?.toLowerCase().includes(q)) suggestions.add(n);
    });
    jobTypes.forEach((t) => {
      if (t.title?.toLowerCase().includes(q)) suggestions.add(t.title);
    });
    return Array.from(suggestions).slice(0, 8);
  };

  const handleInputChange = (field, value) => {
    setSearchQuery((prev) => ({ ...prev, [field]: value }));
    if (field === "location") setShowLocationSuggestions(value.length > 0);
    if (field === "jobTitleSkillsCompany")
      setSearchSuggestions(
        value.length > 0 ? generateSearchSuggestions(value) : [],
      );
  };

  const filteredLocations = locationOptions.filter((loc) =>
    loc.toLowerCase().includes(searchQuery.location.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showLocationSuggestions &&
        locationInputRef.current &&
        !locationInputRef.current.contains(e.target)
      )
        setShowLocationSuggestions(false);
      if (
        showSalaryDropdown &&
        salaryInputRef.current &&
        !salaryInputRef.current.contains(e.target)
      )
        setShowSalaryDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLocationSuggestions, showSalaryDropdown]);

  return (
    <div className="relative min-h-[400px] overflow-hidden font-source">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E2558]/20 to-[#4EB956]/70" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col items-center lg:flex-row gap-6 lg:gap-8">
            {/* ── LEFT: Hero + Search ── */}
            <div className="w-full lg:w-9/12 py-8">
              <div className="mb-8 lg:mb-12">
                {/* Title skeleton or real */}
                {statsLoading ? (
                  <div className="flex justify-center mb-6">
                    <div className="h-10 w-80 bg-white/20 animate-pulse rounded-lg" />
                  </div>
                ) : (
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight uppercase text-center animate-fadeIn">
                    Find Your <span className="text-[#4EB956]">Dream Job</span>{" "}
                    With Us!
                  </h1>
                )}

                {/* Stat Cards */}
                <div className="mt-6 flex items-center justify-center gap-2 md:gap-6">
                  {statsLoading
                    ? [1, 2, 3].map((i) => <StatCardSkeleton key={i} />)
                    : jobStats.map((stat, i) => (
                        <div
                          key={i}
                          className={`${stat.bgColor} px-2 md:px-6 py-4 rounded-xl shadow-lg flex items-center space-x-1 md:space-x-3 transform hover:scale-105 transition duration-300 animate-fadeIn`}
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          <div className="text-white">
                            <stat.icon className="text-xl md:text-3xl" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm md:text-xl font-bold text-white">
                              {Number(stat.count || 0).toLocaleString()}
                            </span>
                            <span className="text-xs md:text-sm text-white/90">
                              {stat.label}
                            </span>
                          </div>
                        </div>
                      ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-4xl lg:max-w-6xl">
                {/* Collapsed */}
                {!isSearchExpanded && (
                  <div
                    className="bg-white rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer animate-fadeIn"
                    onClick={handleSearchClick}
                  >
                    <div className="flex items-center h-14 sm:h-16">
                      <div className="flex-1 pl-4 sm:pl-6 h-full">
                        <input
                          className="text-sm sm:text-base text-gray-400 w-full h-full outline-none cursor-pointer"
                          placeholder="Search by job title, company, location, or salary..."
                          readOnly
                        />
                      </div>
                      <button
                        type="button"
                        className="bg-gradient-to-r from-[#1E2558] to-[#2d377a] text-white rounded-r-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center h-full px-6 sm:px-10 cursor-pointer"
                      >
                        <FaSearch className="text-base sm:text-lg" />
                        <span className="ml-2 hidden sm:inline text-sm sm:text-base">
                          Search
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Expanded */}
                {isSearchExpanded && (
                  <div className="animate-fadeIn">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl p-2">
                      <form onSubmit={handleSearchSubmit} className="w-full">
                        <div className="flex flex-col sm:flex-row items-stretch gap-2 relative">
                          {/* Job Title */}
                          <div
                            className="flex-1 min-w-0 relative animate-slideInLeft"
                            style={{ animationDelay: "0.1s" }}
                          >
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                              <FaBriefcase />
                            </div>
                            <input
                              ref={searchInputRef}
                              type="text"
                              placeholder="Job title, skills, company, type"
                              value={searchQuery.jobTitleSkillsCompany}
                              onChange={(e) =>
                                handleInputChange(
                                  "jobTitleSkillsCompany",
                                  e.target.value,
                                )
                              }
                              className="w-full h-12 sm:h-14 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/20 transition-all text-gray-800 placeholder-gray-400"
                              autoFocus
                            />
                            {searchSuggestions.length > 0 && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                {searchSuggestions.map((s, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                      setSearchQuery((p) => ({
                                        ...p,
                                        jobTitleSkillsCompany: s,
                                      }));
                                      setSearchSuggestions([]);
                                    }}
                                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-0 cursor-pointer"
                                  >
                                    <FaBriefcase className="text-gray-400 text-sm shrink-0" />
                                    <span className="text-sm truncate">
                                      {s}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Location */}
                          <div
                            className="sm:w-48 relative animate-slideInRight"
                            ref={locationInputRef}
                            style={{ animationDelay: "0.2s" }}
                          >
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                              <FaMapMarkerAlt />
                            </div>
                            <input
                              type="text"
                              placeholder="Location"
                              value={searchQuery.location}
                              onChange={(e) =>
                                handleInputChange("location", e.target.value)
                              }
                              onFocus={() => setShowLocationSuggestions(true)}
                              className="w-full h-12 sm:h-14 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/20 transition-all text-gray-800 placeholder-gray-400"
                            />
                            {showLocationSuggestions &&
                              filteredLocations.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                                  {filteredLocations.map((loc, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => {
                                        setSearchQuery((p) => ({
                                          ...p,
                                          location: loc,
                                        }));
                                        setShowLocationSuggestions(false);
                                      }}
                                      className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-0 cursor-pointer"
                                    >
                                      <FaMapMarkerAlt className="text-gray-400 text-sm shrink-0" />
                                      <span className="text-sm truncate">
                                        {loc}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                          </div>

                          {/* Salary */}
                          <div
                            className="sm:w-40 relative animate-slideInRight"
                            ref={salaryInputRef}
                            style={{ animationDelay: "0.3s" }}
                          >
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                              <FaDollarSign />
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setShowSalaryDropdown(!showSalaryDropdown)
                              }
                              className="w-full h-12 sm:h-14 pl-10 pr-8 border border-gray-300 rounded-lg text-left focus:outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/20 transition-all"
                            >
                              <span className="text-sm text-gray-800 block truncate">
                                {searchQuery.minSalary
                                  ? salaryRanges.find(
                                      (s) => s.value === searchQuery.minSalary,
                                    )?.label
                                  : "Min Salary"}
                              </span>
                            </button>
                            <FaChevronDown
                              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 pointer-events-none ${
                                showSalaryDropdown ? "rotate-180" : ""
                              }`}
                            />
                            {showSalaryDropdown && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                                {salaryRanges.map((range, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                      setSearchQuery((p) => ({
                                        ...p,
                                        minSalary: range.value,
                                      }));
                                      setShowSalaryDropdown(false);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                                      searchQuery.minSalary === range.value
                                        ? "bg-[#4EB956]/10 text-[#4EB956] font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    {range.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Submit */}
                          <div
                            className="animate-slideInRight"
                            style={{ animationDelay: "0.4s" }}
                          >
                            <button
                              type="submit"
                              className="h-12 sm:h-14 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white px-4 sm:px-6 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center min-w-[130px] cursor-pointer"
                            >
                              <FaSearch className="mr-2" />
                              Search Jobs
                            </button>
                          </div>

                          {/* Mobile close */}
                          <button
                            type="button"
                            onClick={handleCloseSearch}
                            className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-900 sm:hidden cursor-pointer"
                          >
                            <FaTimes className="text-sm" />
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="hidden sm:flex justify-end mt-3">
                      <button
                        onClick={handleCloseSearch}
                        className="text-white text-sm hover:text-[#4EB956] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <FaTimes />
                        Close search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Quick Links ── */}
            <div className="w-full lg:w-3/12 py-6 md:py-0">
              <div className="bg-white h-full w-full overflow-hidden shadow-lg">
                <div className="border-b border-gray-200 px-4 sm:px-6 py-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Quick Links
                  </h3>
                </div>

                <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
                  <div className="px-4 sm:px-6 py-1 flex flex-col">
                    {statsLoading
                      ? [...Array(10)].map((_, i) => (
                          <QuickLinkSkeleton key={i} />
                        ))
                      : quickLinks.map((link, i) => (
                          <Link
                            key={i}
                            to={link.path}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(link.path);
                            }}
                            className="group flex items-center justify-between py-2 px-2 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-0 cursor-pointer w-full animate-fadeIn"
                            style={{ animationDelay: `${i * 0.04}s` }}
                          >
                            <div className="flex items-center min-w-0">
                              <span className="text-[#4EB956] mr-2 text-xs group-hover:mr-3 transition-all duration-200">
                                <FaArrowRight />
                              </span>
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors truncate">
                                {link.label}
                              </span>
                            </div>
                            <span className="text-xs font-semibold bg-[#4EB956]/10 text-[#4EB956] px-2 py-1 rounded shrink-0 ml-2">
                              {Number(link.count || 0).toLocaleString()}
                            </span>
                          </Link>
                        ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out forwards;
          opacity: 0;
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out forwards;
          opacity: 0;
        }
        .overflow-y-auto { scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
        .overflow-y-auto::-webkit-scrollbar { width: 4px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
    </div>
  );
};

export default HeroHome;
