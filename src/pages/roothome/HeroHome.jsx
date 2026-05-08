import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const HeroHome = () => {
  const navigate = useNavigate();

  const {
    jobs,
    meta,
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

  const searchInputRef = useRef(null);
  const locationInputRef = useRef(null);
  const salaryInputRef = useRef(null);

  useEffect(() => {
    fetchJobFilters();
    fetchJobs({
      page: 1,
      limit: 100,
      sortBy: "createdAt",
      order: "desc",
    });
  }, [fetchJobFilters, fetchJobs]);

  const totalJobs = meta?.total || jobs.length || 0;

  const totalVacancies = useMemo(() => {
    return jobs.reduce((sum, job) => {
      const vacancy = Number(job.vacancy) || 0;
      return sum + vacancy;
    }, 0);
  }, [jobs]);

  const newJobsCount = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return jobs.filter((job) => {
      const date = new Date(job.jobPostedDate);
      return !Number.isNaN(date.getTime()) && date >= sevenDaysAgo;
    }).length;
  }, [jobs]);

  const deadlineTomorrowCount = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowDate = tomorrow.toISOString().slice(0, 10);

    return jobs.filter((job) => {
      if (!job.jobEndDate) return false;
      const endDate = new Date(job.jobEndDate).toISOString().slice(0, 10);
      return endDate === tomorrowDate;
    }).length;
  }, [jobs]);

  const jobTypeCountMap = useMemo(() => {
    const map = {};

    jobs.forEach((job) => {
      const id =
        job.jobTypeId ||
        job.raw?.jobTypeId?.jobTypeId ||
        job.raw?.jobTypeId?._id ||
        job.raw?.jobTypeId;

      const title = job.jobType || job.type;

      if (id) {
        map[id] = (map[id] || 0) + 1;
      } else if (title) {
        map[title.toLowerCase()] = (map[title.toLowerCase()] || 0) + 1;
      }
    });

    return map;
  }, [jobs]);

  const jobStats = useMemo(() => {
    return [
      {
        label: "Vacancy Open",
        count: totalVacancies || totalJobs,
        icon: FaUsers,
        bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
      },
      {
        label: "Companies",
        count: `${companies.length || 0}+`,
        icon: BsBuildingsFill,
        bgColor: "bg-gradient-to-r from-green-400 to-teal-500",
      },
      {
        label: "New Jobs",
        count: newJobsCount,
        icon: MdOutlineWifiProtectedSetup,
        bgColor: "bg-gradient-to-r from-pink-500 to-red-500",
      },
    ];
  }, [totalVacancies, totalJobs, companies.length, newJobsCount]);

  const quickLinks = useMemo(() => {
    const baseLinks = [
      {
        label: "All jobs",
        count: totalJobs,
        path: "/jobs",
      },
      {
        label: "Company List",
        count: companies.length || 0,
        path: "/companys",
      },
      {
        label: "New Jobs",
        count: newJobsCount,
        path: "/jobs?filter=recent",
      },
      {
        label: "Deadline Tomorrow",
        count: deadlineTomorrowCount,
        path: "/jobs?filter=deadline_tomorrow",
      },
    ];

    const jobTypeLinks = jobTypes
      .filter((type) => type.isActive !== false)
      .map((type) => {
        const id = type.jobTypeId || type._id;
        const titleKey = type.title?.toLowerCase();

        return {
          label: `${type.title} Jobs`,
          count: jobTypeCountMap[id] || jobTypeCountMap[titleKey] || 0,
          path: `/jobs?jobTypeId=${id}`,
        };
      });

    return [...baseLinks, ...jobTypeLinks];
  }, [
    totalJobs,
    companies.length,
    newJobsCount,
    deadlineTomorrowCount,
    jobTypes,
    jobTypeCountMap,
  ]);

  const locationOptions = useMemo(() => {
    const apiCountries = countries
      .map((country) => country.name)
      .filter(Boolean);

    const jobLocations = jobs
      .map((job) => job.location || job.country)
      .filter(Boolean)
      .map((location) => {
        if (location.includes(",")) return location.split(",")[0].trim();
        return location.trim();
      });

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

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    setShowLocationSuggestions(false);
    setShowSalaryDropdown(false);
    setSearchQuery({
      jobTitleSkillsCompany: "",
      location: "",
      minSalary: "",
    });
    setSearchSuggestions([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchQuery.jobTitleSkillsCompany) {
      params.append("search", searchQuery.jobTitleSkillsCompany);
    }

    if (searchQuery.location) {
      params.append("location", searchQuery.location);
    }

    if (searchQuery.minSalary) {
      params.append("minSalary", searchQuery.minSalary);
    }

    const queryString = params.toString();

    navigate(`/jobs${queryString ? `?${queryString}` : ""}`);
    handleCloseSearch();
  };

  const generateSearchSuggestions = (query) => {
    const lowerQuery = query.toLowerCase();
    const suggestions = new Set();

    jobs.forEach((job) => {
      if (job.title?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.title);
      }

      if (job.company?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.company);
      }

      if (job.category?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.category);
      }

      if (job.jobType?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.jobType);
      }

      if (Array.isArray(job.skills)) {
        job.skills.forEach((skill) => {
          if (skill?.toLowerCase().includes(lowerQuery)) {
            suggestions.add(skill);
          }
        });
      }
    });

    categories.forEach((category) => {
      if (category.title?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(category.title);
      }
    });

    companies.forEach((company) => {
      const name = company.nameCompany || company.companyName || company.name;

      if (name?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(name);
      }
    });

    jobTypes.forEach((type) => {
      if (type.title?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(type.title);
      }
    });

    return Array.from(suggestions).slice(0, 8);
  };

  const handleInputChange = (field, value) => {
    setSearchQuery((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "location") {
      setShowLocationSuggestions(value.length > 0);
    }

    if (field === "jobTitleSkillsCompany") {
      if (value.length > 0) {
        setSearchSuggestions(generateSearchSuggestions(value));
      } else {
        setSearchSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery((prev) => ({
      ...prev,
      jobTitleSkillsCompany: suggestion,
    }));

    setSearchSuggestions([]);
  };

  const handleLocationSelect = (city) => {
    setSearchQuery((prev) => ({
      ...prev,
      location: city,
    }));

    setShowLocationSuggestions(false);
  };

  const handleSalarySelect = (value) => {
    setSearchQuery((prev) => ({
      ...prev,
      minSalary: value,
    }));

    setShowSalaryDropdown(false);
  };

  const filteredLocations = locationOptions.filter((location) =>
    location.toLowerCase().includes(searchQuery.location.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showLocationSuggestions &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target)
      ) {
        setShowLocationSuggestions(false);
      }

      if (
        showSalaryDropdown &&
        salaryInputRef.current &&
        !salaryInputRef.current.contains(event.target)
      ) {
        setShowSalaryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLocationSuggestions, showSalaryDropdown]);

  return (
    <div className="relative min-h-[400px] sm:min-h-[400px] overflow-hidden font-source">
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImage}
          alt="Background"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-r from-[#1E2558]/20 to-[#4EB956]/70" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col items-center lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:w-9/12 py-8">
              <div className="lg:text-left mb-8 lg:mb-12">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight uppercase text-center">
                  Find Your <span className="text-[#4EB956]">Dream Job</span>{" "}
                  With Us!
                </h1>

                <div className="mt-6 flex items-center justify-center gap-2 md:gap-6">
                  {jobStats.map((stat, index) => (
                    <div
                      key={index}
                      className={`${stat.bgColor} px-2 md:px-6 py-4 rounded-xl shadow-lg flex items-center space-x-1 md:space-x-3 transform hover:scale-105 transition duration-300`}
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

              <div className="max-w-4xl lg:max-w-6xl">
                {!isSearchExpanded && (
                  <div
                    className="bg-white rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 cursor-pointer"
                    onClick={handleSearchClick}
                  >
                    <div className="flex items-center h-14 sm:h-16">
                      <div className="flex-1 pl-4 sm:pl-6 h-full">
                        <input
                          className="text-sm sm:text-base text-gray-600 w-full h-full outline-none"
                          placeholder="Search by job title, company, location, or salary"
                          readOnly
                        />
                      </div>

                      <button
                        type="button"
                        className="bg-linear-to-r from-[#1E2558] to-[#2d377a] text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center h-full px-6 sm:px-10 cursor-pointer"
                      >
                        <FaSearch className="text-base sm:text-lg" />

                        <span className="ml-2 hidden sm:inline text-sm sm:text-base">
                          Search
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {isSearchExpanded && (
                  <div className="animate-fadeIn">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl p-2">
                      <form onSubmit={handleSearchSubmit} className="w-full">
                        <div className="flex flex-col sm:flex-row items-stretch gap-2">
                          <div
                            className="flex-1 min-w-0 animate-slideInLeft relative"
                            style={{ animationDelay: "0.1s" }}
                          >
                            <div className="relative h-full">
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <FaBriefcase className="text-base" />
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
                                className="w-full h-12 sm:h-14 pl-10 pr-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/20 transition-all duration-300 text-gray-800 placeholder-gray-500"
                                autoFocus
                              />

                              {searchSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-fadeIn">
                                  {searchSuggestions.map(
                                    (suggestion, index) => (
                                      <button
                                        key={index}
                                        type="button"
                                        onClick={() =>
                                          handleSuggestionClick(suggestion)
                                        }
                                        className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center border-b border-gray-100 last:border-0 cursor-pointer"
                                      >
                                        <FaBriefcase className="text-gray-400 mr-2 text-sm" />

                                        <span className="text-sm">
                                          {suggestion}
                                        </span>
                                      </button>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div
                            className="sm:w-48 relative animate-slideInRight"
                            ref={locationInputRef}
                            style={{ animationDelay: "0.2s" }}
                          >
                            <div className="relative h-full">
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <FaMapMarkerAlt className="text-base" />
                              </div>

                              <input
                                type="text"
                                placeholder="Location"
                                value={searchQuery.location}
                                onChange={(e) =>
                                  handleInputChange("location", e.target.value)
                                }
                                onFocus={() => setShowLocationSuggestions(true)}
                                className="w-full h-12 sm:h-14 pl-10 pr-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/20 transition-all duration-300 text-gray-800 placeholder-gray-500"
                              />

                              {showLocationSuggestions &&
                                filteredLocations.length > 0 && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto animate-fadeIn">
                                    {filteredLocations.map(
                                      (location, index) => (
                                        <button
                                          key={index}
                                          type="button"
                                          onClick={() =>
                                            handleLocationSelect(location)
                                          }
                                          className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center border-b border-gray-100 last:border-0 cursor-pointer"
                                        >
                                          <FaMapMarkerAlt className="text-gray-400 mr-2 text-sm" />

                                          <span className="text-sm">
                                            {location}
                                          </span>
                                        </button>
                                      ),
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>

                          <div
                            className="sm:w-40 relative animate-slideInRight"
                            ref={salaryInputRef}
                            style={{ animationDelay: "0.3s" }}
                          >
                            <div className="relative h-full">
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <FaDollarSign className="text-base" />
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setShowSalaryDropdown(!showSalaryDropdown)
                                }
                                className="w-full h-12 sm:h-14 pl-10 pr-8 bg-white border border-gray-300 rounded-lg text-left focus:outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/20 transition-all duration-300"
                              >
                                <span className="text-gray-800 text-sm block truncate">
                                  {searchQuery.minSalary
                                    ? salaryRanges.find(
                                        (s) =>
                                          s.value === searchQuery.minSalary,
                                      )?.label
                                    : "Min Salary"}
                                </span>
                              </button>

                              <FaChevronDown
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-transform duration-300 ${
                                  showSalaryDropdown ? "rotate-180" : ""
                                }`}
                              />

                              {showSalaryDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto animate-fadeIn">
                                  {salaryRanges.map((range, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() =>
                                        handleSalarySelect(range.value)
                                      }
                                      className={`w-full px-3 py-2 text-left transition-colors duration-200 ${
                                        searchQuery.minSalary === range.value
                                          ? "bg-[#4EB956]/10 text-[#4EB956] font-medium"
                                          : "text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      <span className="text-sm">
                                        {range.label}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div
                            className="animate-slideInRight"
                            style={{ animationDelay: "0.4s" }}
                          >
                            <button
                              type="submit"
                              className="h-12 sm:h-14 bg-linear-to-r from-[#1E2558] to-[#4EB956] text-white px-4 sm:px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center min-w-32 cursor-pointer"
                            >
                              <FaSearch className="mr-2" />
                              <span>Search Jobs</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleCloseSearch}
                            className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-900 transition-colors duration-200 sm:hidden animate-slideInRight cursor-pointer"
                            style={{ animationDelay: "0.5s" }}
                          >
                            <FaTimes className="text-sm" />
                          </button>
                        </div>
                      </form>
                    </div>

                    <div
                      className="hidden sm:flex justify-end mt-3 animate-fadeIn"
                      style={{ animationDelay: "0.6s" }}
                    >
                      <button
                        onClick={handleCloseSearch}
                        className="text-white text-sm hover:text-[#4EB956] transition-colors duration-200 flex items-center cursor-pointer"
                      >
                        <FaTimes className="mr-1" />
                        Close search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-3/12 py-6 md:py-0">
              <div className="bg-white h-full w-full overflow-hidden shadow-lg">
                <div className="border-b border-gray-200">
                  <div className="px-4 sm:px-6 py-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Quick Links
                    </h3>
                  </div>
                </div>

                <div
                  className="overflow-y-auto"
                  style={{ maxHeight: "calc(100% - 73px)" }}
                >
                  <div className="px-4 sm:px-6 py-1 flex flex-wrap md:flex-col">
                    {quickLinks.map((link, index) => (
                      <Link
                        key={index}
                        to={link.path}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(link.path);
                        }}
                        className="group flex items-center justify-between py-2 px-2 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-0 cursor-pointer w-full"
                      >
                        <div className="flex items-center min-w-0">
                          <span className="text-[#4EB956] mr-2 text-xs group-hover:mr-3 transition-all duration-200">
                            <FaArrowRight />
                          </span>

                          <span className="text-sm text-primary group-hover:text-gray-900 transition-colors duration-200 truncate">
                            {link.label}
                          </span>
                        </div>

                        <span className="text-xs font-medium bg-[#4EB956]/10 text-[#4EB956] px-2 py-1 rounded shrink-0 ml-2">
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

      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
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

        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 2px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default HeroHome;
