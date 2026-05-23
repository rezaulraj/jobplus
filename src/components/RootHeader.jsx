import React, { useState, useEffect, useRef, useMemo } from "react";
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
  FaUser,
  FaUserTie,
  FaSpinner,
} from "react-icons/fa";
import { MdOutlineDesignServices } from "react-icons/md";
import { GrDatabase } from "react-icons/gr";
import { AiFillNotification } from "react-icons/ai";
import ReactCountryFlag from "react-country-flag";
import logo from "/logo.png";
import { Link } from "react-router-dom";
import useJobStore from "../store/jobStore";

// ─── Category icon map ────────────────────────────────────────────────────────
const CATEGORY_ICON_MAP = {
  "Accounting/Finance": <FaMoneyBill />,
  "Business Development": <FaBusinessTime />,
  "Sales/Marketing": <AiFillNotification />,
  "IT/Telecommunication": <FaCode />,
  "Information Technology": <FaLaptopCode />,
  Engineering: <FaTools />,
  Manufacturing: <FaIndustry />,
  Services: <FaServicestack />,
  "Recruitment/Employment Firms": <FaUsers />,
  "Data Entry/Office Support": <GrDatabase />,
  "Hospitality/Travel/Tourism": <FaPlane />,
  "Education/Training": <FaGraduationCap />,
  "Customer/Service/Call Centre": <FaPhone />,
  Consultants: <FaBriefcase />,
  "Banking/Financial Services": <FaBuilding />,
  "N.G.O./Social Services": <FaHandHoldingHeart />,
  "E-Commerce/E-Business": <FaShoppingCart />,
  "Real Estate/Property": <FaHome />,
  "Healthcare/Hospital/Medical": <FaHospital />,
  BPO: <FaHeadset />,
  "Construction/Cement/Metals": <FaHardHat />,
  "Architect/Interior Design": <MdOutlineDesignServices />,
  "Importers/ Distributors/Exporters": <FaShippingFast />,
};

const getIcon = (title) => CATEGORY_ICON_MAP[title] || <FaBriefcase />;

// ─── Skeleton for category dropdown items ────────────────────────────────────
const CategorySkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-3 p-3 rounded"
        style={{
          background:
            "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
          backgroundSize: "600px 100%",
          animation: "shimmer 1.5s infinite linear",
          height: 62,
          borderRadius: 8,
        }}
      />
    ))}
  </div>
);

const RootHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [scrolled, setScrolled] = useState(false);
  const [showLoginSubNav, setShowLoginSubNav] = useState(false);
  const [showSignupSubNav, setShowSignupSubNav] = useState(false);

  const dropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);
  const signupDropdownRef = useRef(null);

  // ── Job store ──────────────────────────────────────────────────────────────
  const {
    categories: storeCategories,
    fetchCategories,
    isLoading: categoriesLoading,
  } = useJobStore();

  // ── Fetch categories on mount ──────────────────────────────────────────────
  useEffect(() => {
    fetchCategories();
  }, []);

  // ── Build dynamic category list from API ──────────────────────────────────
  const jobCategories = useMemo(() => {
    const list = Array.isArray(storeCategories) ? storeCategories : [];
    return list
      .filter((c) => c.isActive !== false)
      .map((c) => ({
        name: c.title || c.nameCategory || "",
        icon: getIcon(c.title || c.nameCategory),
        path: `/jobs?jobCategoryId=${c.jobCategoryId || c._id}`,
        jobCount: c.totalJobs || 0,
        vacancyCount: c.totalVacancies || 0,
        categoryId: c.jobCategoryId || c._id,
      }));
  }, [storeCategories]);

  // ── Scroll + click-outside ─────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setActiveNav(null);
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target)
      )
        setShowLoginSubNav(false);
      if (
        signupDropdownRef.current &&
        !signupDropdownRef.current.contains(event.target)
      )
        setShowSignupSubNav(false);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ── Nav items — subNav built from live categories ─────────────────────────
  const browseJobSubNav = useMemo(
    () => [
      {
        name: "All Industry",
        path: "/jobs",
        icon: <FaIndustry />,
        isAllIndustry: true,
      },
      ...jobCategories.map((c) => ({
        name: c.name,
        path: c.path,
        icon: c.icon,
        jobCount: c.jobCount,
        vacancyCount: c.vacancyCount,
      })),
    ],
    [jobCategories],
  );

  const navItems = [
    {
      label: "Browse Job",
      icon: <FaSearch className="text-xs" />,
      subNav: browseJobSubNav,
    },
    { label: "Community", path: "", icon: <FaComments className="text-xs" /> },
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

  const languages = [{ name: "English", code: "US", countryCode: "US" }];

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

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleBrowseJobClick = () => {
    setActiveNav((prev) => (prev === "Browse Job" ? null : "Browse Job"));
    setShowLoginSubNav(false);
    setShowSignupSubNav(false);
  };

  const handleLoginClick = () => {
    setShowLoginSubNav((v) => !v);
    setShowSignupSubNav(false);
    setActiveNav(null);
  };

  const handleSignupClick = () => {
    setShowSignupSubNav((v) => !v);
    setShowLoginSubNav(false);
    setActiveNav(null);
  };

  const closeAll = () => {
    setActiveNav(null);
    setShowLoginSubNav(false);
    setShowSignupSubNav(false);
    setIsMenuOpen(false);
  };

  // ── Auth dropdown ──────────────────────────────────────────────────────────
  const AuthDropdown = ({ showDropdown, dropdownRef: ref, type }) => (
    <div
      ref={ref}
      className={`absolute left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
        showDropdown
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
      }`}
      style={{ top: "calc(100% + 10px)", width: 800 }}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white" />
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {accountTypes.map((accountType, index) => (
            <div
              key={index}
              className={`rounded-xl ${accountType.bgColor} ${accountType.borderColor} border p-5 transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`bg-gradient-to-r ${accountType.color} p-2.5 rounded-lg`}
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
              <div className="grid grid-cols-2 gap-3">
                {accountType.options.map((option, idx) => (
                  <Link
                    key={idx}
                    to={option.path}
                    onClick={closeAll}
                    className="flex flex-col items-center justify-center p-4 rounded-lg bg-white border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] group"
                  >
                    <div
                      className={`bg-gradient-to-r ${accountType.color} p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300`}
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
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span
                  className={`text-xs font-medium ${accountType.textColor} flex items-center justify-center cursor-pointer hover:underline`}
                >
                  {type === "login"
                    ? "Forgot Password?"
                    : "Learn more about this account"}
                  <FaChevronRight className="ml-1 text-[10px]" />
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Need help choosing?{" "}
            <span className="text-blue-600 hover:underline font-medium cursor-pointer">
              Contact Support
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .browse-dropdown { animation: fadeSlideDown 0.25s cubic-bezier(0.4,0,0.2,1) both; }
        .category-grid-enter { animation: fadeSlideDown 0.2s ease both; }
      `}</style>

      <nav
        className={`bg-white sticky top-0 z-50 transition-all duration-300 font-ubuntu ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-auto transition-all duration-300"
                />
              </Link>
            </div>

            {/* Desktop nav */}
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
                  {/* Browse Job */}
                  {item.subNav ? (
                    <button
                      onClick={handleBrowseJobClick}
                      className={`flex flex-col items-center space-y-1 group cursor-pointer transition-colors duration-200 ${
                        activeNav === "Browse Job"
                          ? "text-[#4EB956]"
                          : "text-gray-600 hover:text-[#4EB956]"
                      }`}
                    >
                      <div className="text-xs">{item.icon}</div>
                      <span className="text-[10px] font-medium uppercase tracking-wider flex items-center gap-1">
                        {item.label}
                        {categoriesLoading && (
                          <FaSpinner className="text-[8px] animate-spin text-[#4EB956]" />
                        )}
                      </span>
                    </button>
                  ) : /* Login / Signup */
                  item.isLogin || item.isSignup ? (
                    <>
                      <button
                        onClick={
                          item.isLogin ? handleLoginClick : handleSignupClick
                        }
                        className={`flex flex-col items-center space-y-1 group cursor-pointer transition-colors duration-200 ${
                          (item.isLogin && showLoginSubNav) ||
                          (item.isSignup && showSignupSubNav)
                            ? "text-[#4EB956]"
                            : "text-gray-600 hover:text-[#4EB956]"
                        }`}
                      >
                        <div className="text-xs">{item.icon}</div>
                        <span className="text-[10px] font-medium uppercase tracking-wider">
                          {item.label}
                        </span>
                      </button>
                      {((item.isLogin && showLoginSubNav) ||
                        (item.isSignup && showSignupSubNav)) && (
                        <AuthDropdown
                          showDropdown
                          dropdownRef={
                            item.isLogin ? loginDropdownRef : signupDropdownRef
                          }
                          type={item.isLogin ? "login" : "signup"}
                        />
                      )}
                    </>
                  ) : (
                    /* Regular link */
                    <Link
                      to={item.path}
                      onClick={() => setActiveNav(null)}
                      className="flex flex-col items-center space-y-1 group text-gray-600 hover:text-[#4EB956] transition-colors duration-200"
                    >
                      <div className="text-xs">{item.icon}</div>
                      <span className="text-[10px] font-medium uppercase tracking-wider">
                        {item.label}
                      </span>
                    </Link>
                  )}

                  {/* Browse Job mega-dropdown — 60vh, grid scrolls inside */}
                  {item.subNav && activeNav === "Browse Job" && (
                    <div
                      className="browse-dropdown fixed left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-40 flex flex-col"
                      style={{ top: 64, maxHeight: "60vh" }}
                    >
                      {/* ── Sticky header (never scrolls) ── */}
                      <div className="container mx-auto px-4 pt-5 pb-3 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Browse by Industry
                          </span>
                          {!categoriesLoading && jobCategories.length > 0 && (
                            <span className="text-[10px] px-2 py-0.5 bg-[#4EB956]/10 text-[#4EB956] rounded-full font-bold border border-[#4EB956]/20">
                              {jobCategories.length} categories
                            </span>
                          )}
                        </div>
                        <Link
                          to="/jobs"
                          onClick={() => setActiveNav(null)}
                          className="text-xs text-[#4EB956] hover:text-[#3da345] font-semibold flex items-center gap-1"
                        >
                          View all <FaChevronRight className="text-[8px]" />
                        </Link>
                      </div>

                      {/* ── Scrollable category grid ── */}
                      <div
                        className="flex-1 overflow-y-auto"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#d1fae5 transparent",
                        }}
                      >
                        <div className="container mx-auto px-4 pb-3">
                          {categoriesLoading ? (
                            <CategorySkeleton />
                          ) : (
                            <div className="category-grid-enter grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                              {item.subNav.map((subItem, si) => (
                                <Link
                                  key={si}
                                  to={subItem.path}
                                  onClick={() => setActiveNav(null)}
                                  className={`flex items-center justify-between p-3 rounded transition-all duration-200 group/sub ${
                                    subItem.isAllIndustry
                                      ? "border-2 border-[#4EB956] bg-[#4EB956]/5"
                                      : "hover:bg-gray-50 border border-transparent hover:border-gray-100"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <span
                                      className={`transition-colors duration-200 ${
                                        subItem.isAllIndustry
                                          ? "text-[#4EB956]"
                                          : "text-gray-400 group-hover/sub:text-[#4EB956]"
                                      }`}
                                    >
                                      {subItem.icon}
                                    </span>
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
                                          {subItem.jobCount > 0
                                            ? `${subItem.jobCount} jobs`
                                            : "View jobs"}
                                          {subItem.vacancyCount > 0
                                            ? ` · ${subItem.vacancyCount} vacancies`
                                            : ""}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <FaChevronRight
                                    className={`text-[8px] shrink-0 ${
                                      subItem.isAllIndustry
                                        ? "text-[#4EB956]"
                                        : "text-gray-300 group-hover/sub:text-[#4EB956]"
                                    }`}
                                  />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── Sticky footer (never scrolls) ── */}
                      <div className="container mx-auto px-4 py-3 border-t border-gray-100 shrink-0 bg-white">
                        <Link
                          to="/jobs"
                          onClick={() => setActiveNav(null)}
                          className="text-xs text-[#4EB956] hover:text-[#3da345] font-medium hover:underline flex items-center space-x-1"
                        >
                          <span>View all job categories</span>
                          <FaChevronRight className="text-[8px]" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right: language + action buttons + hamburger */}
            <div className="flex items-center space-x-4">
              {/* Language selector */}
              <div className="hidden md:block relative group">
                <button className="flex items-center space-x-1.5 text-gray-600 hover:text-[#4EB956] transition-colors duration-200 cursor-pointer">
                  <ReactCountryFlag
                    countryCode={
                      languages.find((l) => l.name === selectedLanguage)
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
                  {languages.map((lang, i) => (
                    <button
                      key={i}
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

              {/* Action buttons */}
              <div className="hidden lg:flex items-center space-x-2">
                {actionButtons.map((button, i) => (
                  <Link
                    to={button.path}
                    key={i}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 ${
                      button.outline
                        ? "border border-[#1E2558] text-[#1E2558] hover:bg-[#1E2558] hover:text-white"
                        : `bg-gradient-to-r ${button.color} text-white`
                    } rounded text-[10px] font-medium uppercase tracking-wider transition-all duration-200 hover:shadow-md cursor-pointer`}
                  >
                    {button.icon}
                    <span>{button.label}</span>
                  </Link>
                ))}
              </div>

              {/* Hamburger */}
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

          {/* Tablet nav strip */}
          <div className="hidden md:flex lg:hidden justify-center border-t border-gray-100 pt-3 pb-2">
            <div className="flex items-center justify-center space-x-6">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.path || "#"}
                  className="flex flex-col items-center space-y-1 group cursor-pointer"
                >
                  <div className="text-gray-500 group-hover:text-[#4EB956] transition-colors duration-200 text-xs">
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

      {/* ── Mobile menu ─────────────────────────────────────────────────────── */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Link to="/">
                <img src={logo} alt="Logo" className="h-6 w-auto" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-[#4EB956] cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="h-[calc(100%-60px)] overflow-y-auto">
              {/* Language */}
              <div className="p-4 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider block mb-3">
                  Select Language
                </span>
                {languages.map((lang, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedLanguage(lang.name);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center cursor-pointer space-x-3 w-full p-3 rounded transition-colors duration-200 ${
                      selectedLanguage === lang.name
                        ? "bg-gradient-to-r from-[#1E2558]/10 to-[#4EB956]/10"
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
                      <div className="ml-auto w-2 h-2 rounded-full bg-[#4EB956]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Nav items */}
              <div className="p-4">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-50 last:border-0"
                    >
                      {/* Browse Job */}
                      {item.subNav ? (
                        <div>
                          <button
                            onClick={() =>
                              setActiveNav((p) =>
                                p === item.label ? null : item.label,
                              )
                            }
                            className="flex items-center justify-between w-full py-3 text-gray-700 hover:text-[#4EB956] transition-colors duration-200 cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-500 text-xs">
                                {item.icon}
                              </div>
                              <span className="text-sm font-medium">
                                {item.label}
                              </span>
                              {/* Live count badge */}
                              {!categoriesLoading &&
                                jobCategories.length > 0 && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-[#4EB956]/10 text-[#4EB956] rounded-full font-bold">
                                    {jobCategories.length}
                                  </span>
                                )}
                            </div>
                            {categoriesLoading ? (
                              <FaSpinner className="text-xs text-[#4EB956] animate-spin" />
                            ) : (
                              <FaChevronDown
                                className={`text-xs transition-transform duration-200 ${
                                  activeNav === item.label ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </button>

                          {activeNav === item.label && (
                            <div className="pl-8 pb-3">
                              {categoriesLoading ? (
                                <div className="space-y-2">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                      key={i}
                                      style={{
                                        height: 36,
                                        borderRadius: 8,
                                        background:
                                          "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
                                        backgroundSize: "600px 100%",
                                        animation:
                                          "shimmer 1.5s infinite linear",
                                      }}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                                  {item.subNav.map((subItem, si) => (
                                    <Link
                                      key={si}
                                      to={subItem.path}
                                      onClick={closeAll}
                                      className={`flex items-center justify-between py-2 text-gray-600 hover:text-[#4EB956] transition-colors duration-200 group ${
                                        subItem.isAllIndustry
                                          ? "border-l-2 border-[#4EB956] pl-2 bg-[#4EB956]/5"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <span
                                          className={`text-xs ${
                                            subItem.isAllIndustry
                                              ? "text-[#4EB956]"
                                              : "text-gray-400 group-hover:text-[#4EB956]"
                                          }`}
                                        >
                                          {subItem.icon}
                                        </span>
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
                                          {!subItem.isAllIndustry &&
                                            subItem.jobCount > 0 && (
                                              <p className="text-[10px] text-gray-400">
                                                {subItem.jobCount} jobs
                                              </p>
                                            )}
                                        </div>
                                      </div>
                                      <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                          subItem.isAllIndustry
                                            ? "bg-[#4EB956] text-white"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                      >
                                        {subItem.isAllIndustry
                                          ? "All"
                                          : subItem.jobCount || "—"}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              )}
                              <Link
                                to="/jobs"
                                onClick={closeAll}
                                className="block mt-2 text-xs text-[#4EB956] hover:text-[#3da345] font-medium hover:underline"
                              >
                                View all categories →
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : /* Login / Signup */
                      item.isLogin || item.isSignup ? (
                        <div>
                          <button
                            onClick={() =>
                              setActiveNav((p) =>
                                p === item.label ? null : item.label,
                              )
                            }
                            className="flex items-center justify-between w-full py-3 text-gray-700 hover:text-[#4EB956] transition-colors duration-200 cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-500 text-xs">
                                {item.icon}
                              </div>
                              <span className="text-sm font-medium">
                                {item.label}
                              </span>
                            </div>
                            <FaChevronDown
                              className={`text-xs transition-transform duration-200 ${activeNav === item.label ? "rotate-180" : ""}`}
                            />
                          </button>
                          {activeNav === item.label && (
                            <div className="pl-8 pb-3 space-y-4">
                              {accountTypes.map((type, i) => (
                                <div key={i} className="space-y-2">
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
                                        onClick={closeAll}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg ${type.bgColor} border ${type.borderColor} transition-all duration-300`}
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
                          )}
                        </div>
                      ) : (
                        /* Regular link */
                        <Link
                          to={item.path || "#"}
                          onClick={closeAll}
                          className="flex items-center space-x-3 py-3 text-gray-700 hover:text-[#4EB956] transition-colors duration-200"
                        >
                          <div className="text-gray-500 text-xs">
                            {item.icon}
                          </div>
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 border-t border-gray-100">
                <div className="space-y-3">
                  {actionButtons.map((button, i) => (
                    <Link
                      to={button.path}
                      key={i}
                      onClick={closeAll}
                      className={`w-full flex items-center justify-center space-x-2 py-3 ${
                        button.outline
                          ? "border border-[#1E2558] text-[#1E2558] hover:bg-[#1E2558] hover:text-white"
                          : `bg-gradient-to-r ${button.color} text-white`
                      } rounded text-sm font-medium transition-all duration-200 cursor-pointer`}
                    >
                      {button.icon}
                      <span>{button.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RootHeader;
