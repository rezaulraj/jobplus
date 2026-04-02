import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaTachometerAlt,
  FaUserCircle,
  FaFileUpload,
  FaStar,
  FaUsers,
  FaFileAlt,
  FaBriefcase,
  FaHeart,
  FaClipboardCheck,
  FaKey,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaUserTie,
  FaCog,
  FaBusinessTime,
  FaLaptopCode,
  FaIndustry,
  FaServicestack,
  FaUsers as FaUsersIcon,
  FaPlane,
  FaCode,
  FaPhone,
  FaBuilding,
  FaHandHoldingHeart,
  FaShoppingCart,
  FaHome,
  FaHospital,
  FaHeadset,
  FaHardHat,
  FaMoneyBill,
  FaTools,
  FaShippingFast,
} from "react-icons/fa";
import { MdTipsAndUpdates, MdOutlineDesignServices } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { GrDatabase } from "react-icons/gr";
import { AiFillNotification } from "react-icons/ai";
import ReactCountryFlag from "react-country-flag";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import jobData from "../data/jobData.json";
import { IoMdNotifications } from "react-icons/io";
import useAuthStore from "../store/authStore";

const SeekerHeader = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [scrolled, setScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const dropdownRef = useRef(null);
  const browseJobDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const [jobCategories, setJobCategories] = useState([]);

  const { user, tokens, logout, fetchMe, getBearerToken } = useAuthStore();

  const displayUser = {
    name: user?.fullName || "Guest User",
    email: user?.email || "No email",
    avatar:
      user?.avatar ||
      user?.profileImage ||
      "https://randomuser.me/api/portraits/men/32.jpg",
    profileComplete: user?.profileComplete || 65,
  };

  const bearerToken = getBearerToken ? getBearerToken() : null;

  useEffect(() => {
    if (tokens?.accessToken && !user?._id && fetchMe) {
      fetchMe();
    }
  }, [tokens?.accessToken, user?._id, fetchMe]);

  // Calculate total vacancies for a category
  const calculateVacancyCount = (categoryName) => {
    const categoryMapping = {
      "Accounting/Finance": "Accounting/Finance",
      "Business Development": "Business Development",
      "Sales/Marketing": "Sales/Marketing",
      "IT/Telecommunication": "IT/Telecommunication",
      "Information Technology": "Information Technology",
      Engineering: "Engineering",
      Manufacturing: "Manufacturing",
      Services: "Services",
      "Recruitment/Employment Firms": "Recruitment/Employment Firms",
      "Data Entry/Office Support": "Data Entry/Office Support",
      "Hospitality/Travel/Tourism": "Hospitality/Travel/Tourism",
      "Education/Training": "Education/Training",
      "Customer/Service/Call Centre": "Customer/Service/Call Centre",
      Consultants: "Consultants",
      "Banking/Financial Services": "Banking/Financial Services",
      "N.G.O./Social Services": "N.G.O./Social Services",
      "E-Commerce/E-Business": "E-Commerce/E-Business",
      "Real Estate/Property": "Real Estate/Property",
      "Healthcare/Hospital/Medical": "Healthcare/Hospital/Medical",
      BPO: "BPO",
      "Construction/Cement/Metals": "Construction/Cement/Metals",
      "Architect/Interior Design": "Architect/Interior Design",
      "Importers/ Distributors/Exporters": "Importers/ Distributors/Exporters",
    };

    const mappedCategory = categoryMapping[categoryName];
    if (!mappedCategory) return 0;

    const totalVacancies = jobData
      .filter((job) => job.category === mappedCategory)
      .reduce((sum, job) => sum + (Number(job.vacancy) || 0), 0);

    return totalVacancies;
  };

  // Calculate total jobs for a category
  const calculateJobCount = (categoryName) => {
    const categoryMapping = {
      "Accounting/Finance": "Accounting/Finance",
      "Business Development": "Business Development",
      "Sales/Marketing": "Sales/Marketing",
      "IT/Telecommunication": "IT/Telecommunication",
      "Information Technology": "Information Technology",
      Engineering: "Engineering",
      Manufacturing: "Manufacturing",
      Services: "Services",
      "Recruitment/Employment Firms": "Recruitment/Employment Firms",
      "Data Entry/Office Support": "Data Entry/Office Support",
      "Hospitality/Travel/Tourism": "Hospitality/Travel/Tourism",
      "Education/Training": "Education/Training",
      "Customer/Service/Call Centre": "Customer/Service/Call Centre",
      Consultants: "Consultants",
      "Banking/Financial Services": "Banking/Financial Services",
      "N.G.O./Social Services": "N.G.O./Social Services",
      "E-Commerce/E-Business": "E-Commerce/E-Business",
      "Real Estate/Property": "Real Estate/Property",
      "Healthcare/Hospital/Medical": "Healthcare/Hospital/Medical",
      BPO: "BPO",
      "Construction/Cement/Metals": "Construction/Cement/Metals",
      "Architect/Interior Design": "Architect/Interior Design",
      "Importers/ Distributors/Exporters": "Importers/ Distributors/Exporters",
    };

    const mappedCategory = categoryMapping[categoryName];
    if (!mappedCategory) return 0;

    return jobData.filter((job) => job.category === mappedCategory).length;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      if (isNavigating) return;

      const dropdowns = [
        dropdownRef.current,
        browseJobDropdownRef.current,
        profileDropdownRef.current,
      ];

      const isInside = dropdowns.some(
        (ref) => ref && ref.contains(event.target),
      );

      if (!isInside) {
        setActiveNav(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    const categories = [
      {
        name: "Accounting/Finance",
        vacancyCount: calculateVacancyCount("Accounting/Finance"),
        jobCount: calculateJobCount("Accounting/Finance"),
        icon: <FaMoneyBill />,
        path: "accounting-finance",
      },
      {
        name: "Business Development",
        vacancyCount: calculateVacancyCount("Business Development"),
        jobCount: calculateJobCount("Business Development"),
        icon: <FaBusinessTime />,
        path: "business-development",
      },
      {
        name: "Sales/Marketing",
        vacancyCount: calculateVacancyCount("Sales/Marketing"),
        jobCount: calculateJobCount("Sales/Marketing"),
        icon: <AiFillNotification />,
        path: "sales-marketing",
      },
      {
        name: "IT/Telecommunication",
        vacancyCount: calculateVacancyCount("IT/Telecommunication"),
        jobCount: calculateJobCount("IT/Telecommunication"),
        icon: <FaCode />,
        path: "it-telecommunication",
      },
      {
        name: "Information Technology",
        vacancyCount: calculateVacancyCount("Information Technology"),
        jobCount: calculateJobCount("Information Technology"),
        icon: <FaLaptopCode />,
        path: "information-technology",
      },
      {
        name: "Engineering",
        vacancyCount: calculateVacancyCount("Engineering"),
        jobCount: calculateJobCount("Engineering"),
        icon: <FaTools />,
        path: "engineering",
      },
      {
        name: "Manufacturing",
        vacancyCount: calculateVacancyCount("Manufacturing"),
        jobCount: calculateJobCount("Manufacturing"),
        icon: <FaIndustry />,
        path: "manufacturing",
      },
      {
        name: "Services",
        vacancyCount: calculateVacancyCount("Services"),
        jobCount: calculateJobCount("Services"),
        icon: <FaServicestack />,
        path: "services",
      },
      {
        name: "Recruitment/Employment Firms",
        vacancyCount: calculateVacancyCount("Recruitment/Employment Firms"),
        jobCount: calculateJobCount("Recruitment/Employment Firms"),
        icon: <FaUsersIcon />,
        path: "recruitment-employment",
      },
      {
        name: "Data Entry/Office Support",
        vacancyCount: calculateVacancyCount("Data Entry/Office Support"),
        jobCount: calculateJobCount("Data Entry/Office Support"),
        icon: <GrDatabase />,
        path: "data-entry-office-support",
      },
      {
        name: "Hospitality/Travel/Tourism",
        vacancyCount: calculateVacancyCount("Hospitality/Travel/Tourism"),
        jobCount: calculateJobCount("Hospitality/Travel/Tourism"),
        icon: <FaPlane />,
        path: "hospitality-travel-tourism",
      },
      {
        name: "Education/Training",
        vacancyCount: calculateVacancyCount("Education/Training"),
        jobCount: calculateJobCount("Education/Training"),
        icon: <FaGraduationCap />,
        path: "education-training",
      },
      {
        name: "Customer/Service/Call Centre",
        vacancyCount: calculateVacancyCount("Customer/Service/Call Centre"),
        jobCount: calculateJobCount("Customer/Service/Call Centre"),
        icon: <FaPhone />,
        path: "customer-service-call-centre",
      },
      {
        name: "Consultants",
        vacancyCount: calculateVacancyCount("Consultants"),
        jobCount: calculateJobCount("Consultants"),
        icon: <FaBriefcase />,
        path: "consultants",
      },
      {
        name: "Banking/Financial Services",
        vacancyCount: calculateVacancyCount("Banking/Financial Services"),
        jobCount: calculateJobCount("Banking/Financial Services"),
        icon: <FaBuilding />,
        path: "banking-financial-services",
      },
      {
        name: "N.G.O./Social Services",
        vacancyCount: calculateVacancyCount("N.G.O./Social Services"),
        jobCount: calculateJobCount("N.G.O./Social Services"),
        icon: <FaHandHoldingHeart />,
        path: "ngo-social-services",
      },
      {
        name: "E-Commerce/E-Business",
        vacancyCount: calculateVacancyCount("E-Commerce/E-Business"),
        jobCount: calculateJobCount("E-Commerce/E-Business"),
        icon: <FaShoppingCart />,
        path: "ecommerce-ebusiness",
      },
      {
        name: "Real Estate/Property",
        vacancyCount: calculateVacancyCount("Real Estate/Property"),
        jobCount: calculateJobCount("Real Estate/Property"),
        icon: <FaHome />,
        path: "real-estate-property",
      },
      {
        name: "Healthcare/Hospital/Medical",
        vacancyCount: calculateVacancyCount("Healthcare/Hospital/Medical"),
        jobCount: calculateJobCount("Healthcare/Hospital/Medical"),
        icon: <FaHospital />,
        path: "healthcare-hospital-medical",
      },
      {
        name: "BPO",
        vacancyCount: calculateVacancyCount("BPO"),
        jobCount: calculateJobCount("BPO"),
        icon: <FaHeadset />,
        path: "bpo",
      },
      {
        name: "Construction/Cement/Metals",
        vacancyCount: calculateVacancyCount("Construction/Cement/Metals"),
        jobCount: calculateJobCount("Construction/Cement/Metals"),
        icon: <FaHardHat />,
        path: "construction-cement-metals",
      },
      {
        name: "Architect/Interior Design",
        vacancyCount: calculateVacancyCount("Architect/Interior Design"),
        jobCount: calculateJobCount("Architect/Interior Design"),
        icon: <MdOutlineDesignServices />,
        path: "architect-interior-design",
      },
      {
        name: "Importers/ Distributors/Exporters",
        vacancyCount: calculateVacancyCount(
          "Importers/ Distributors/Exporters",
        ),
        jobCount: calculateJobCount("Importers/ Distributors/Exporters"),
        icon: <FaShippingFast />,
        path: "importers-distributors-exporters",
      },
    ];

    setJobCategories(categories);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavigating]);

  const navItems = [
    {
      label: "Browse Job",
      icon: <FaSearch className="text-xs" />,
      subNav: [
        {
          name: "All Industry",
          path: "jobs",
          count: "View All",
          icon: <FaIndustry />,
          isAllIndustry: true,
        },
        ...jobCategories.map((category) => ({
          name: category.name,
          path: `jobs/${category.path}`,
          count: category?.jobCount,
          icon: category.icon,
          vacancyCount: category?.vacancyCount,
          jobCount: category?.jobCount,
        })),
      ],
    },
    {
      label: "Dashboard",
      icon: <FaTachometerAlt className="text-xs" />,
      path: "seeker/dashboard",
    },
    {
      label: "Profile",
      icon: <FaUserCircle className="text-xs" />,
      path: "seeker/profile",
    },
    {
      label: "CV Upload",
      icon: <FaFileUpload className="text-xs" />,
      path: "seeker/cv-upload",
    },
    {
      label: "Features",
      icon: <FaStar className="text-xs" />,
      subNav: [
        {
          name: "CV & Resume Writing",
          path: "features/cv-writing",
          icon: <FaFileAlt className="text-sm" />,
          description: "Professional resume building tools",
        },
        {
          name: "Career Tips",
          path: "features/career-tips",
          icon: <MdTipsAndUpdates className="text-sm" />,
          description: "Expert career guidance",
        },
        {
          name: "Interview Tips",
          path: "features/interview-tips",
          icon: <FaUserTie className="text-sm" />,
          description: "Ace your interviews",
        },
        {
          name: "Skill Development",
          path: "features/skill-development",
          icon: <GiSkills className="text-sm" />,
          description: "Enhance your skills",
        },
      ],
    },
    {
      label: "Free CV Review",
      path: "cv-review",
      icon: <FaFileAlt className="text-xs" />,
    },
    {
      label: "Community",
      icon: <FaUsers className="text-xs" />,
      path: "",
    },
  ];

  const profileMenuItems = [
    {
      label: "View Profile",
      icon: <FaUserCircle className="text-sm" />,
      path: "seeker/profile",
      color: "text-blue-600",
    },
    {
      label: "Saved Jobs",
      icon: <FaHeart className="text-sm" />,
      path: "seeker/saved-jobs",
      color: "text-red-600",
      badge: "3",
    },
    {
      label: "Applied Jobs",
      icon: <FaBriefcase className="text-sm" />,
      path: "seeker/applied-jobs",
      color: "text-green-600",
      badge: "12",
    },
    {
      label: "Shortlisted",
      icon: <FaClipboardCheck className="text-sm" />,
      path: "seeker/shortlisted",
      color: "text-purple-600",
      badge: "5",
    },
    {
      label: "Job Alerts",
      icon: <IoMdNotifications className="text-sm" />,
      path: "seeker/job-alerts",
      color: "text-blue-600",
      badge: "2",
    },
    {
      label: "Change Password",
      icon: <FaKey className="text-sm" />,
      path: "seeker/change-password",
      color: "text-yellow-600",
    },
    {
      label: "Logout",
      icon: <FaSignOutAlt className="text-sm" />,
      path: "#",
      color: "text-red-500",
      isLogout: true,
    },
  ];

  const languages = [
    {
      name: "English",
      code: "US",
      countryCode: "US",
    },
  ];

  const handleNavItemClick = (label) => {
    if (activeNav === label) {
      setActiveNav(null);
    } else {
      setActiveNav(label);
    }
  };

  const handleLinkClick = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setActiveNav(null);
      setIsMenuOpen(false);
      setIsNavigating(false);
    }, 100);
  };

  const handleLogout = () => {
    logout();
    setActiveNav(null);
    setIsMenuOpen(false);
    navigate("/jobseeker/login");
  };

  const ProfileDropdown = () => (
    <div
      ref={profileDropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
      style={{ top: "calc(100% + 10px)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>

      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={displayUser.avatar}
              alt={displayUser.name}
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-800 truncate">
              {displayUser.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {displayUser.email}
            </p>

            {/* {bearerToken && (
              <p className="text-[10px] text-gray-500 mt-1 break-all line-clamp-2">
                {bearerToken}
              </p>
            )} */}

            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Profile Complete</span>
                <span className="font-bold text-[#4EB956]">
                  {displayUser.profileComplete}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-[#4EB956] to-primary h-1.5 rounded-full"
                  style={{ width: `${displayUser.profileComplete}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-1">
          {profileMenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.isLogout ? "#" : item.path}
              onClick={(e) => {
                e.stopPropagation();

                if (item.isLogout) {
                  e.preventDefault();
                  handleLogout();
                  return;
                }

                handleLinkClick();
              }}
              className="group"
            >
              <div className="flex space-x-4 items-center p-1 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
                <div
                  className={`p-3 rounded-full ${item.color} bg-white group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                >
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#4EB956]">
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${item.color} bg-opacity-10`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <button className="text-xs text-gray-600 hover:text-[#4EB956] font-medium flex items-center space-x-1">
            <FaCog className="text-xs" />
            <span>Privacy Settings</span>
          </button>
          <button className="text-xs text-gray-600 hover:text-[#4EB956] font-medium flex items-center space-x-1">
            <FaGraduationCap className="text-xs" />
            <span>Help Center</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <nav
        className={`bg-white sticky top-0 z-50 transition-all duration-300 font-ubuntu ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Link to={"/"}>
                <img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-auto transition-all duration-300"
                />
              </Link>
            </div>

            <div className="hidden lg:flex items-center justify-center space-x-8">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  ref={
                    item.subNav
                      ? item.label === "Browse Job"
                        ? browseJobDropdownRef
                        : dropdownRef
                      : null
                  }
                >
                  {item.subNav ? (
                    <>
                      <button
                        onClick={() => handleNavItemClick(item.label)}
                        className={`flex flex-col items-center space-y-1 group cursor-pointer ${
                          activeNav === item.label ? "text-[#4EB956]" : ""
                        }`}
                      >
                        <div
                          className={`${
                            activeNav === item.label
                              ? "text-[#4EB956]"
                              : "text-gray-500"
                          } transition-colors duration-200`}
                        >
                          {item.icon}
                        </div>
                        <span
                          className={`text-[10px] font-medium uppercase tracking-wider transition-colors duration-200 ${
                            activeNav === item.label
                              ? "text-[#4EB956]"
                              : "text-gray-600"
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>

                      {activeNav === item.label && (
                        <div
                          className="fixed left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-40"
                          style={{ top: "64px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="container mx-auto px-4 py-6">
                            {item.label === "Browse Job" ? (
                              <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                  {item.subNav.map((subItem, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      to={subItem.path}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleLinkClick();
                                      }}
                                      className={`flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors duration-200 group/sub ${
                                        subItem.isAllIndustry
                                          ? "border-2 border-[#4EB956] bg-[#4EB956]/5"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div
                                          className={`transition-colors duration-200 ${
                                            subItem.isAllIndustry
                                              ? "text-[#4EB956]"
                                              : "text-gray-400 group-hover/sub:text-[#4EB956]"
                                          }`}
                                        >
                                          {subItem.icon}
                                        </div>
                                        <div>
                                          <p
                                            className={`text-xs font-medium ${
                                              subItem.isAllIndustry
                                                ? "text-[#1E2558] font-bold"
                                                : "text-gray-700 group-hover/sub:text-[#1E2558]"
                                            }`}
                                          >
                                            {subItem.name}
                                          </p>
                                          {subItem.isAllIndustry ? (
                                            <p className="text-[10px] text-[#4EB956] mt-0.5 font-medium">
                                              Browse all categories
                                            </p>
                                          ) : (
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                              {subItem.jobCount} jobs •{" "}
                                              {subItem.vacancyCount} vacancies
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <FaChevronRight
                                        className={`text-[8px] ${
                                          subItem.isAllIndustry
                                            ? "text-[#4EB956]"
                                            : "text-gray-300 group-hover/sub:text-[#4EB956]"
                                        }`}
                                      />
                                    </Link>
                                  ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <Link
                                    to="jobs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLinkClick();
                                    }}
                                    className="text-xs text-primary hover:text-secondary font-medium hover:underline flex items-center space-x-1 cursor-pointer"
                                  >
                                    <span>View all job categories</span>
                                    <FaChevronRight className="text-[8px]" />
                                  </Link>
                                </div>
                              </>
                            ) : (
                              <div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {item.subNav.map((subItem, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    to={subItem.path}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLinkClick();
                                    }}
                                    className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-300 group/sub"
                                  >
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 group-hover/sub:from-blue-100 group-hover/sub:to-indigo-100">
                                      <div className="text-gray-400 group-hover/sub:text-[#45bb4d]">
                                        {subItem.icon}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-800 group-hover/sub:text-[#4EB956]">
                                        {subItem.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {subItem.description}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className="flex flex-col items-center space-y-1 group"
                    >
                      <div className="text-gray-500 group-hover:text-[#4EB956] transition-colors duration-200">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-medium text-gray-600 group-hover:text-[#4EB956] uppercase tracking-wider transition-colors duration-200">
                        {item.label}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative group">
                <button className="flex items-center space-x-1.5 text-gray-600 hover:text-[#4EB956] transition-colors duration-200 cursor-pointer">
                  <ReactCountryFlag
                    countryCode={
                      languages.find((lang) => lang.name === selectedLanguage)
                        ?.countryCode || "US"
                    }
                    svg
                    style={{
                      width: "1.2em",
                      height: "1.2em",
                      borderRadius: "50%",
                    }}
                    title={selectedLanguage}
                  />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    {selectedLanguage}
                  </span>
                  <FaChevronDown className="text-[8px]" />
                </button>

                <div className="absolute right-0 mt-0 w-36 bg-white rounded-lg shadow-lg border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {languages.map((lang, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedLanguage(lang.name)}
                      className={`flex items-center space-x-2 w-full p-2 rounded transition-colors duration-200 cursor-pointer ${
                        selectedLanguage === lang.name
                          ? "bg-gray-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{
                          width: "1.2em",
                          height: "1.2em",
                          borderRadius: "50%",
                        }}
                        title={lang.name}
                      />
                      <span className="text-xs font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => handleNavItemClick("Profile")}
                  className="flex items-center space-x-2 group cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={displayUser.avatar}
                      alt={displayUser.name}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-blue-500 transition-colors duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-medium text-gray-700 group-hover:text-blue-600">
                      {displayUser.name.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-gray-500">Job Seeker</p>
                  </div>
                  <FaChevronDown
                    className={`text-[8px] text-gray-400 group-hover:text-blue-600 transition-transform duration-200 ${
                      activeNav === "Profile" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeNav === "Profile" && <ProfileDropdown />}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden cursor-pointer text-gray-600 hover:text-[#4EB956] transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <FaTimes className="text-lg" />
                ) : (
                  <FaBars className="text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Link to={"/"}>
                  <img src={logo} alt="Logo" className="h-6 w-auto" />
                </Link>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-[#4EB956] cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="h-[calc(100%-60px)] overflow-y-auto">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={displayUser.avatar}
                    alt={displayUser.name}
                    className="w-12 h-12 rounded-full border-3 border-white shadow"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">
                      {displayUser.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {displayUser.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-50 last:border-0"
                    >
                      {item.subNav ? (
                        <div>
                          <button
                            onClick={() =>
                              setActiveNav(
                                activeNav === item.label ? null : item.label,
                              )
                            }
                            className="flex items-center justify-between w-full py-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-500">{item.icon}</div>
                              <span className="text-sm font-medium">
                                {item.label}
                              </span>
                            </div>
                            <FaChevronDown
                              className={`text-xs transition-transform duration-200 ${
                                activeNav === item.label ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {activeNav === item.label && (
                            <div className="pl-8 pb-3">
                              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {item.subNav.map((subItem, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    to={subItem.path}
                                    onClick={handleLinkClick}
                                    className={`flex items-center justify-between py-2 text-gray-600 hover:text-[#4EB956] transition-colors duration-200 group ${
                                      subItem.isAllIndustry
                                        ? "border-l-2 border-[#4EB956] pl-2 bg-[#4EB956]/5"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div
                                        className={`${
                                          subItem.isAllIndustry
                                            ? "text-[#4EB956]"
                                            : "text-gray-400 group-hover:text-[#4EB956]"
                                        }`}
                                      >
                                        {subItem.icon}
                                      </div>
                                      <div>
                                        <span
                                          className={`text-xs ${
                                            subItem.isAllIndustry
                                              ? "font-bold text-[#1E2558]"
                                              : ""
                                          }`}
                                        >
                                          {subItem.name}
                                        </span>
                                        {!subItem.isAllIndustry && (
                                          <p className="text-[10px] text-gray-400">
                                            {subItem.jobCount} jobs
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {subItem.isAllIndustry ? (
                                      <span className="text-[10px] px-1.5 py-0.5 bg-[#4EB956] text-white rounded">
                                        View All
                                      </span>
                                    ) : (
                                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded">
                                        {subItem.jobCount}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                              <Link
                                to="jobs"
                                onClick={handleLinkClick}
                                className="block mt-2 text-xs text-primary hover:text-secondary font-medium hover:underline"
                              >
                                View all categories →
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={handleLinkClick}
                          className="flex items-center space-x-3 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                        >
                          <div className="text-gray-500">{item.icon}</div>
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Account Settings
                </h4>
                <div className="space-y-2">
                  {profileMenuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.isLogout ? "#" : item.path}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
                        item.isLogout ? "hover:bg-red-50" : ""
                      }`}
                      onClick={(e) => {
                        if (item.isLogout) {
                          e.preventDefault();
                          handleLogout();
                          return;
                        }
                        handleLinkClick();
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${item.color}`}>{item.icon}</div>
                        <span
                          className={`text-sm ${
                            item.isLogout ? "text-red-500" : "text-gray-700"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Language
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedLanguage(lang.name);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                        selectedLanguage === lang.name
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{
                          width: "1.2em",
                          height: "1.2em",
                          borderRadius: "50%",
                        }}
                        title={lang.name}
                      />
                      <span className="text-xs">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @media (min-width: 1024px) {
          .fixed {
            animation: slideDown 0.3s ease-out;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default SeekerHeader;
