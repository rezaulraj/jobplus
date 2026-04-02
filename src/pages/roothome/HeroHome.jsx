import React, { useState, useRef, useEffect } from "react";
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
import heroBgImage from "/images/rootpage/banner_bg.webp";
import { BsBuildingsFill } from "react-icons/bs";
import { MdOutlineWifiProtectedSetup } from "react-icons/md";
import jobData from "../../data/jobData.json";

const HeroHome = () => {
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    jobTitleSkillsCompany: "",
    location: "",
    minSalary: "",
  });

  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showSalaryDropdown, setShowSalaryDropdown] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [jobStats, setJobStats] = useState([]);

  const searchInputRef = useRef(null);
  const locationInputRef = useRef(null);
  const salaryInputRef = useRef(null);

  const calculateDeadlineTomorrowCount = () => {
    const today = new Date("2025-12-10");
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return jobData.filter((job) => {
      const jobEndDate = new Date(job.jobEndDate);
      // Check if deadline
      const diffTime = jobEndDate - tomorrow;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 1 && diffDays >= 0;
    }).length;
  };

  const calculateInternshipCount = () => {
    return jobData.filter(
      (job) =>
        job.title.toLowerCase().includes("internship") ||
        (job.employeeStatus &&
          job.employeeStatus.toLowerCase().includes("internship")) ||
        (job.description &&
          job.description.toLowerCase().includes("internship")) ||
        (job.jobType && job.jobType.toLowerCase().includes("internship")),
    ).length;
  };

  const calculateContractualCount = () => {
    return jobData.filter(
      (job) =>
        (job.employeeStatus &&
          job.employeeStatus.toLowerCase().includes("contractual")) ||
        (job.employeeStatus &&
          job.employeeStatus.toLowerCase().includes("contract")) ||
        (job.jobType && job.jobType.toLowerCase().includes("contractual")) ||
        (job.jobType && job.jobType.toLowerCase().includes("contract")),
    ).length;
  };

  const calculatePartTimeCount = () => {
    return jobData.filter(
      (job) =>
        (job.employeeStatus &&
          job.employeeStatus.toLowerCase().includes("part time")) ||
        (job.employeeStatus &&
          job.employeeStatus.toLowerCase().includes("part-time")) ||
        (job.description &&
          job.description.toLowerCase().includes("part time")) ||
        (job.jobType && job.jobType.toLowerCase().includes("part time")),
    ).length;
  };

  const calculateOverseasCount = () => {
    return jobData.filter(
      (job) =>
        (job.description &&
          job.description.toLowerCase().includes("overseas")) ||
        (job.description && job.description.toLowerCase().includes("abroad")) ||
        (job.title && job.title.toLowerCase().includes("overseas")) ||
        (job.location && job.location.toLowerCase().includes("overseas")) ||
        (job.title && job.title.toLowerCase().includes("migration")) ||
        (job.description &&
          job.description.toLowerCase().includes("migration")),
    ).length;
  };

  const calculateRemoteCount = () => {
    return jobData.filter(
      (job) =>
        (job.jobType && job.jobType.toLowerCase().includes("remote")) ||
        (job.jobType && job.jobType.toLowerCase().includes("hybrid")) ||
        (job.description && job.description.toLowerCase().includes("remote")) ||
        (job.description &&
          job.description.toLowerCase().includes("work from home")) ||
        (job.description && job.description.toLowerCase().includes("wfh")),
    ).length;
  };

  const calculateFresherCount = () => {
    return jobData.filter((job) => {
      if (Array.isArray(job.experience)) {
        return job.experience[0] === 0 && job.experience[1] <= 1;
      }
      // Check if experience is 0 or "Fresher"
      return (
        job.experience === 0 ||
        job.experience === "0" ||
        (typeof job.experience === "string" &&
          job.experience.toLowerCase().includes("fresher")) ||
        (job.title && job.title.toLowerCase().includes("fresher")) ||
        (job.description && job.description.toLowerCase().includes("fresher"))
      );
    }).length;
  };

  const calculateNewJobsCount = () => {
    const today = new Date("2025-12-10");
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return jobData.filter((job) => {
      const jobDate = new Date(job.jobPostedDate);
      return jobDate >= sevenDaysAgo;
    }).length;
  };

  useEffect(() => {
    // Calculate total vacancies
    const totalVacancies = jobData.reduce((sum, job) => {
      const vacancy = parseInt(job.vacancy) || 0;
      return sum + vacancy;
    }, 0);

    const uniqueCompanies = [
      ...new Set(jobData.map((job) => job.company).filter(Boolean)),
    ].length;

    setJobStats([
      {
        label: "Vacancy Open",
        count: totalVacancies.toLocaleString(),
        icon: FaUsers,
        bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
      },
      {
        label: "Companies",
        count: `${uniqueCompanies}+`,
        icon: BsBuildingsFill,
        bgColor: "bg-gradient-to-r from-green-400 to-teal-500",
      },
      {
        label: "New Jobs",
        count: calculateNewJobsCount(),
        icon: MdOutlineWifiProtectedSetup,
        bgColor: "bg-gradient-to-r from-pink-500 to-red-500",
      },
    ]);

    const calculatedQuickLinks = [
      {
        label: "All jobs",
        count: totalVacancies.toLocaleString(),
        path: "/jobs",
      },
      {
        label: "Company List",
        count: uniqueCompanies,
        path: "/companys",
      },
      {
        label: "New Jobs",
        count: calculateNewJobsCount(),
        path: "/jobs?filter=recent",
      },
      {
        label: "Deadline Tomorrow",
        count: calculateDeadlineTomorrowCount(),
        path: "/jobs?filter=deadline_tomorrow",
      },
      {
        label: "Internship Opportunity",
        count: calculateInternshipCount(),
        path: "/jobs?filter=internship",
      },
      {
        label: "Contractual Jobs",
        count: calculateContractualCount(),
        path: "/jobs?filter=contractual",
      },
      {
        label: "Part time Jobs",
        count: calculatePartTimeCount(),
        path: "/jobs?filter=part_time",
      },
      {
        label: "Overseas Jobs",
        count: calculateOverseasCount(),
        path: "/jobs?filter=overseas",
      },
      {
        label: "Work From Home",
        count: calculateRemoteCount(),
        path: "/jobs?filter=remote",
      },
      {
        label: "Fresher Jobs",
        count: calculateFresherCount(),
        path: "/jobs?filter=fresher",
      },
    ];

    setQuickLinks(calculatedQuickLinks);
  }, []);

  const getUniqueLocations = () => {
    const locations = new Set();
    jobData.forEach((job) => {
      if (job.location) {
        let cleanLocation = job.location;
        if (cleanLocation.includes("(")) {
          cleanLocation = cleanLocation.split("(")[0].trim();
        }
        if (cleanLocation.includes("Dhaka")) {
          cleanLocation = "Dhaka";
        }
        locations.add(cleanLocation);
      }
    });
    return Array.from(locations).sort();
  };

  const bangladeshCities = getUniqueLocations();

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

  const handleInputChange = (field, value) => {
    setSearchQuery((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "location" && value.length > 0) {
      setShowLocationSuggestions(true);
    } else if (field === "location" && value.length === 0) {
      setShowLocationSuggestions(false);
    }

    if (field === "jobTitleSkillsCompany" && value.length > 0) {
      const suggestions = generateSearchSuggestions(value);
      setSearchSuggestions(suggestions);
    } else if (field === "jobTitleSkillsCompany" && value.length === 0) {
      setSearchSuggestions([]);
    }
  };

  const generateSearchSuggestions = (query) => {
    const lowerQuery = query.toLowerCase();
    const suggestions = new Set();

    jobData.forEach((job) => {
      if (job.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.title);
      }
      if (job.company && job.company.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.company);
      }
      if (job.skills) {
        job.skills.forEach((skill) => {
          if (skill.toLowerCase().includes(lowerQuery)) {
            suggestions.add(skill);
          }
        });
      }
      if (job.category && job.category.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.category);
      }
    });

    return Array.from(suggestions).slice(0, 8);
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

  const filteredCities = bangladeshCities.filter((city) =>
    city.toLowerCase().includes(searchQuery.location.toLowerCase()),
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
        <div className="absolute inset-0 bg-linear-to-r from-[#1E2558]/20 to-[#4EB956]/70"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col items-center lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:w-9/12  py-8">
              <div className="lg:text-left mb-8 lg:mb-12">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight uppercase text-center">
                  Find Your <span className="text-[#4EB956]">Dream Job</span>{" "}
                  With Us!
                </h1>
                <div className="mt-6 flex items-center justify-center gap-2 md:gap-6">
                  {jobStats.map((stat, indx) => (
                    <div
                      key={indx}
                      className={`${stat.bgColor} px-2 md:px-6 py-4 rounded-xl shadow-lg flex  items-center space-x-1 md:space-x-3 transform hover:scale-105 transition duration-300`}
                    >
                      <div className="text-white">
                        <stat.icon className="text-xl md:text-3xl" />
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-sm md:text-xl font-bold text-white">
                          {stat.count}
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
                          placeholder="Search by job title, location, or salary"
                        />
                      </div>
                      <button className="bg-linear-to-r from-[#1E2558] to-[#2d377a] text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center h-full px-6 sm:px-10 cursor-pointer">
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
                                placeholder="Job title, skills, or company"
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
                                filteredCities.length > 0 && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto animate-fadeIn">
                                    {filteredCities.map((city, index) => (
                                      <button
                                        key={index}
                                        type="button"
                                        onClick={() =>
                                          handleLocationSelect(city)
                                        }
                                        className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center border-b border-gray-100 last:border-0 cursor-pointer"
                                      >
                                        <FaMapMarkerAlt className="text-gray-400 mr-2 text-sm" />
                                        <span className="text-sm">{city}</span>
                                      </button>
                                    ))}
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
              <div className="bg-white h-full w-full">
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
                        className="group flex items-center justify-between py-2 px-2 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-0 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <span className="text-[#4EB956] mr-2 text-xs group-hover:mr-3 transition-all duration-200">
                            <FaArrowRight />
                          </span>
                          <span className="text-sm text-primary group-hover:text-gray-900 transition-colors duration-200">
                            {link.label}
                          </span>
                        </div>
                        <span className="text-xs font-medium bg-[#4EB956]/10 text-[#4EB956] px-2 py-1 rounded">
                          {link.count > 0 ? link.count : "0"}
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

        .max-h-48 {
          max-height: 12rem;
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
