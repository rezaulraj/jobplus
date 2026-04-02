import React, { useState, useEffect, useRef } from "react";
import {
  FaBusinessTime,
  FaLaptopCode,
  FaIndustry,
  FaServicestack,
  FaUsers,
  FaPlane,
  FaGraduationCap,
  FaCode,
  FaPhone,
  FaBriefcase,
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
  FaChevronDown,
  FaBars,
  FaTimes,
  FaBriefcase as FaJob,
  FaHandshake,
  FaBuilding as FaCompany,
  FaSearch,
  FaComments,
  FaFileAlt,
  FaSignInAlt,
  FaUserPlus,
  FaChevronRight,
  FaPlusCircle,
  FaUser,
  FaUserTie,
} from "react-icons/fa";
import { MdOutlineDesignServices } from "react-icons/md";
import { GrDatabase } from "react-icons/gr";
import { AiFillNotification } from "react-icons/ai";
import ReactCountryFlag from "react-country-flag";
import logo from "/logo.png";
import { Link } from "react-router-dom";
import jobData from "../data/jobData.json";

const RootHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);
  const signupDropdownRef = useRef(null);
  const [jobCategories, setJobCategories] = useState([]);
  const [showLoginSubNav, setShowLoginSubNav] = useState(false);
  const [showSignupSubNav, setShowSignupSubNav] = useState(false);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveNav(null);
      }
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target)
      ) {
        setShowLoginSubNav(false);
      }
      if (
        signupDropdownRef.current &&
        !signupDropdownRef.current.contains(event.target)
      ) {
        setShowSignupSubNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    // Initialize job categories
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
        icon: <FaUsers />,
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
  }, []);

  const navItems = [
    {
      label: "Browse Job",
      icon: <FaSearch className="text-xs" />,
      subNav: [
        {
          name: "All Industry",
          path: "/jobs",
          count: "View All",
          icon: <FaIndustry />,
          isAllIndustry: true,
        },
        ...jobCategories.map((category) => ({
          name: category.name,
          path: `/jobs/${category.path}`,
          count: category?.jobCount,
          icon: category.icon,
          vacancyCount: category?.vacancyCount,
        })),
      ],
    },
    {
      label: "Community",
      path: "",
      icon: <FaComments className="text-xs" />,
    },
    {
      label: "Free CV Review",
      path: "",
      icon: <FaFileAlt className="text-xs" />,
    },
    {
      label: "Login",
      icon: <FaSignInAlt className="text-xs" />,
      isLogin: true,
    },
    {
      label: "Sign Up",
      icon: <FaUserPlus className="text-xs" />,
      isSignup: true,
    },
  ];

  const accountTypes = [
    {
      name: "Job Seeker Account",
      icon: <FaUser />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      options: [
        {
          label: "Sign In",
          path: "/jobseeker/login",
          icon: <FaSignInAlt className="text-xs" />,
          description: "Access your job seeker dashboard",
        },
        {
          label: "Create Account",
          path: "/jobseeker/signup",
          icon: <FaUserPlus className="text-xs" />,
          description: "Start your job search journey",
        },
      ],
    },
    {
      name: "Employer Account",
      icon: <FaUserTie />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      options: [
        {
          label: "Sign In",
          path: "/employer/login",
          icon: <FaSignInAlt className="text-xs" />,
          description: "Access your employer dashboard",
        },
        {
          label: "Create Account",
          path: "/employer/signup",
          icon: <FaUserPlus className="text-xs" />,
          description: "Start hiring talented professionals",
        },
      ],
    },
  ];

  const languages = [
    {
      name: "English",
      code: "US",
      countryCode: "US",
    },
  ];

  const actionButtons = [
    {
      label: "Post a Job",
      path: "/employers/post-job",
      icon: <FaJob className="text-xs" />,
      color: "from-[#1E2558] to-[#2d377a]",
    },
    {
      label: "Hire a Freelancer",
      path: "/freelancer/post-job",
      icon: <FaHandshake className="text-xs" />,
      color: "from-[#4EB956] to-[#3da345]",
    },
    {
      label: "Employers",
      path: "employer",
      icon: <FaCompany className="text-xs" />,
      outline: true,
    },
  ];

  const handleBrowseJobClick = () => {
    if (activeNav === "Browse Job") {
      setActiveNav(null);
    } else {
      setActiveNav("Browse Job");
      setShowLoginSubNav(false);
      setShowSignupSubNav(false);
    }
  };

  const handleNavItemClick = (label) => {
    if (label === "Browse Job") {
      handleBrowseJobClick();
    } else {
      setActiveNav(null);
    }
  };

  const handleLoginClick = () => {
    setShowLoginSubNav(!showLoginSubNav);
    setShowSignupSubNav(false);
    setActiveNav(null);
  };

  const handleSignupClick = () => {
    setShowSignupSubNav(!showSignupSubNav);
    setShowLoginSubNav(false);
    setActiveNav(null);
  };

  const AuthDropdown = ({ showDropdown, dropdownRef, type }) => (
    <div
      ref={dropdownRef}
      className={`absolute left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
        showDropdown
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
      }`}
      style={{
        top: "calc(100% + 10px)",
        width: "800px",
        minHeight: "260px",
      }}
    >
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {accountTypes.map((accountType, index) => (
            <div
              key={index}
              className={`rounded-xl ${accountType.bgColor} ${accountType.borderColor} border p-5 transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`bg-linear-to-r ${accountType.color} p-2.5 rounded-lg`}
                >
                  <div className="text-white text-lg">{accountType.icon}</div>
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${accountType.textColor}`}>
                    {accountType.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {type === "login" ? "Sign in to continue" : "Join us today"}
                  </p>
                </div>
              </div>

              {/* Options Grid - Side by Side */}
              <div className="grid grid-cols-2 gap-3">
                {accountType.options.map((option, idx) => (
                  <Link
                    key={idx}
                    to={option.path}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg bg-white border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] group`}
                    onClick={() => {
                      setShowLoginSubNav(false);
                      setShowSignupSubNav(false);
                    }}
                  >
                    <div
                      className={`bg-linear-to-r ${accountType.color} p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white text-sm">{option.icon}</div>
                    </div>
                    <span
                      className={`font-semibold text-sm ${accountType.textColor} mb-1`}
                    >
                      {option.label}
                    </span>
                    <p className="text-xs text-gray-500 text-center leading-tight">
                      {option.description}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Quick Link */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  // to={type === "login" ? "/forgot-password" : "/learn-more"}
                  className={`text-xs font-medium ${accountType.textColor} hover:underline flex items-center justify-center`}
                >
                  {type === "login"
                    ? "Forgot Password?"
                    : "Learn more about this account"}
                  <FaChevronRight className="ml-1 text-[10px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Need help choosing?{" "}
            <Link
              // to="/help"
              className="text-blue-600 hover:underline font-medium"
            >
              Contact Support
            </Link>
          </p>
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
                    item.label === "Browse Job"
                      ? dropdownRef
                      : item.isLogin
                        ? loginDropdownRef
                        : item.isSignup
                          ? signupDropdownRef
                          : null
                  }
                >
                  {item.subNav ? (
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
                  ) : item.isLogin || item.isSignup ? (
                    <>
                      <button
                        onClick={
                          item.isLogin ? handleLoginClick : handleSignupClick
                        }
                        className={`flex flex-col items-center space-y-1 group cursor-pointer ${
                          (item.isLogin && showLoginSubNav) ||
                          (item.isSignup && showSignupSubNav)
                            ? "text-[#4EB956]"
                            : ""
                        }`}
                      >
                        <div
                          className={`${
                            (item.isLogin && showLoginSubNav) ||
                            (item.isSignup && showSignupSubNav)
                              ? "text-[#4EB956]"
                              : "text-gray-500"
                          } transition-colors duration-200`}
                        >
                          {item.icon}
                        </div>
                        <span
                          className={`text-[10px] font-medium uppercase tracking-wider transition-colors duration-200 ${
                            (item.isLogin && showLoginSubNav) ||
                            (item.isSignup && showSignupSubNav)
                              ? "text-[#4EB956]"
                              : "text-gray-600"
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>

                      {/* Auth Dropdown */}
                      {(item.isLogin && showLoginSubNav) ||
                      (item.isSignup && showSignupSubNav) ? (
                        <AuthDropdown
                          showDropdown={true}
                          dropdownRef={
                            item.isLogin ? loginDropdownRef : signupDropdownRef
                          }
                          type={item.isLogin ? "login" : "signup"}
                        />
                      ) : null}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex flex-col items-center space-y-1 group"
                      onClick={() => setActiveNav(null)}
                    >
                      <div className="text-gray-500 group-hover:text-[#4EB956] transition-colors duration-200">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-medium text-gray-600 group-hover:text-[#4EB956] uppercase tracking-wider transition-colors duration-200">
                        {item.label}
                      </span>
                    </Link>
                  )}

                  {item.subNav && activeNav === item.label && (
                    <div
                      className="fixed left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-40"
                      style={{ top: "64px" }}
                    >
                      <div className="container mx-auto px-4 py-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                          {item.subNav.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.path}
                              className={`flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors duration-200 group/sub ${
                                subItem.isAllIndustry
                                  ? "border-2 border-[#4EB956] bg-[#4EB956]/5"
                                  : ""
                              }`}
                              onClick={() => setActiveNav(null)}
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
                            to="/jobs"
                            className="text-xs text-primary hover:text-secondary font-medium hover:underline flex items-center space-x-1 cursor-pointer"
                            onClick={() => setActiveNav(null)}
                          >
                            <span>View all job categories</span>
                            <FaChevronRight className="text-[8px]" />
                          </Link>
                        </div>
                      </div>
                    </div>
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

                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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

              <div className="hidden lg:flex items-center space-x-2">
                {actionButtons.map((button, index) => (
                  <Link
                    to={button.path}
                    key={index}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 ${
                      button.outline
                        ? "border border-[#1E2558] text-[#1E2558] hover:bg-[#1E2558] hover:text-white"
                        : `bg-linear-to-r ${button.color} text-white`
                    } rounded text-[10px] font-medium uppercase tracking-wider transition-all duration-200 hover:shadow-md cursor-pointer`}
                  >
                    {button.icon}
                    <span>{button.label}</span>
                  </Link>
                ))}
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

          <div className="hidden md:flex lg:hidden justify-center border-t border-gray-100 pt-3 pb-2">
            <div className="flex items-center justify-center space-x-6">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex flex-col items-center space-y-1 group cursor-pointer"
                >
                  <div className="text-gray-500 group-hover:text-[#4EB956] transition-colors duration-200">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 group-hover:text-[#4EB956] uppercase tracking-wider transition-colors duration-200">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile */}
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
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Select Language
                  </span>
                </div>
                <div className="space-y-2">
                  {languages.map((lang, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedLanguage(lang.name);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center cursor-pointer space-x-3 w-full p-3 rounded transition-colors duration-200 ${
                        selectedLanguage === lang.name
                          ? "bg-linear-to-r from-[#1E2558]/10 to-[#4EB956]/10"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{
                          width: "1.5em",
                          height: "1.5em",
                          borderRadius: "50%",
                        }}
                        title={lang.name}
                      />
                      <span className="text-sm font-medium">{lang.name}</span>
                      {selectedLanguage === lang.name && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-[#4EB956]"></div>
                      )}
                    </button>
                  ))}
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
                            className="flex items-center justify-between w-full py-3 text-gray-700 hover:text-[#4EB956] transition-colors duration-200 cursor-pointer"
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
                                    className={`flex items-center justify-between py-2 text-gray-600 hover:text-[#4EB956] transition-colors duration-200 group ${
                                      subItem.isAllIndustry
                                        ? "border-l-2 border-[#4EB956] pl-2 bg-[#4EB956]/5"
                                        : ""
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
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
                                href="/jobs"
                                className="block mt-2 text-xs text-primary hover:text-secondary font-medium hover:underline"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                View all categories →
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : item.isLogin || item.isSignup ? (
                        <div>
                          <button
                            onClick={() =>
                              setActiveNav(
                                activeNav === item.label ? null : item.label,
                              )
                            }
                            className="flex items-center justify-between w-full py-3 text-gray-700 hover:text-[#4EB956] transition-colors duration-200 cursor-pointer"
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
                              <div className="space-y-4">
                                {accountTypes.map((type, index) => (
                                  <div key={index} className="space-y-2">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <div
                                        className={`bg-gradient-to-r ${type.color} p-2 rounded-lg`}
                                      >
                                        <div className="text-white">
                                          {type.icon}
                                        </div>
                                      </div>
                                      <h4
                                        className={`font-semibold ${type.textColor}`}
                                      >
                                        {type.name}
                                      </h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {type.options.map((option, idx) => (
                                        <Link
                                          key={idx}
                                          to={option.path}
                                          className={`flex flex-col items-center justify-center p-3 rounded-lg ${type.bgColor} border ${type.borderColor} transition-all duration-300`}
                                          onClick={() => setIsMenuOpen(false)}
                                        >
                                          <div
                                            className={`text-lg ${type.textColor} mb-1`}
                                          >
                                            {option.icon}
                                          </div>
                                          <span
                                            className={`text-xs font-medium ${type.textColor}`}
                                          >
                                            {option.label}
                                          </span>
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className="flex items-center space-x-3 py-3 text-gray-700 hover:text-[#4EB956] transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
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
                <div className="space-y-3">
                  {actionButtons.map((button, index) => (
                    <button
                      key={index}
                      className={`w-full flex items-center justify-center space-x-2 py-3 ${
                        button.outline
                          ? "border border-[#1E2558] text-[#1E2558] hover:bg-[#1E2558] hover:text-white"
                          : `bg-linear-to-r ${button.color} text-white`
                      } rounded text-sm font-medium transition-all duration-200 cursor-pointer`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {button.icon}
                      <span>{button.label}</span>
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

export default RootHeader;
