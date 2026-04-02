import { useState, useEffect, useRef, useCallback } from "react";
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
import { IoMdNotifications } from "react-icons/io";
import ReactCountryFlag from "react-country-flag";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import jobData from "../data/jobData.json";
import useAuthStore from "../store/authStore";

// ─── Avatar with fallback ─────────────────────────────────────────────────────
const UserAvatar = ({ src, name, size = 32, className = "" }) => {
  const [imgError, setImgError] = useState(false);
  const initials = (name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        className={className}
        style={{ width: size, height: size, objectFit: "cover" }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #10b981, #059669)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 700,
        fontSize: Math.round(size * 0.35),
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
};

// ─── Smooth slide-down animation ──────────────────────────────────────────────
const slideDownStyle = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .nav-dropdown   { animation: slideDown 0.22s cubic-bezier(0.4,0,0.2,1) both; }
  .menu-overlay   { animation: fadeIn   0.2s  ease both; }
  .menu-panel     { animation: slideDown 0.25s cubic-bezier(0.4,0,0.2,1) both; }
`;

const SeekerHeader = () => {
  const navigate = useNavigate();
  const { user, tokens, logout, fetchMe, getBearerToken, isAuthenticated } =
    useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [scrolled, setScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [jobCategories, setJobCategories] = useState([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const browseJobRef = useRef(null);
  const featuresRef = useRef(null);
  const profileRef = useRef(null);
  const navRefs = useRef({});

  // ── Derived display user ───────────────────────────────────────────────────
  const displayUser = {
    name: user?.fullName || user?.name || "Guest User",
    email: user?.email || "",
    avatar: user?.profileImage || user?.avatar || user?.photo || null,
    profileComplete: user?.profileComplete || 0,
  };

  // ── Fetch user profile once on mount ──────────────────────────────────────
  useEffect(() => {
    if (tokens?.accessToken && !profileLoaded) {
      fetchMe().then(() => setProfileLoaded(true));
    }
  }, [tokens?.accessToken]);

  // ── Scroll + click-outside ─────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const onClickOutside = (e) => {
      if (isNavigating) return;
      const refs = [
        browseJobRef.current,
        featuresRef.current,
        profileRef.current,
      ];
      if (!refs.some((r) => r?.contains(e.target))) setActiveNav(null);
    };
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isNavigating]);

  // ── Category helpers ──────────────────────────────────────────────────────
  const getJobStats = useCallback((categoryName) => {
    const jobs = jobData.filter((j) => j.category === categoryName);
    return {
      jobCount: jobs.length,
      vacancyCount: jobs.reduce((s, j) => s + (Number(j.vacancy) || 0), 0),
    };
  }, []);

  useEffect(() => {
    const cats = [
      {
        name: "Accounting/Finance",
        icon: <FaMoneyBill />,
        path: "accounting-finance",
      },
      {
        name: "Business Development",
        icon: <FaBusinessTime />,
        path: "business-development",
      },
      {
        name: "Sales/Marketing",
        icon: <AiFillNotification />,
        path: "sales-marketing",
      },
      {
        name: "IT/Telecommunication",
        icon: <FaCode />,
        path: "it-telecommunication",
      },
      {
        name: "Information Technology",
        icon: <FaLaptopCode />,
        path: "information-technology",
      },
      { name: "Engineering", icon: <FaTools />, path: "engineering" },
      { name: "Manufacturing", icon: <FaIndustry />, path: "manufacturing" },
      { name: "Services", icon: <FaStar />, path: "services" },
      {
        name: "Recruitment/Employment Firms",
        icon: <FaUsers />,
        path: "recruitment-employment",
      },
      {
        name: "Data Entry/Office Support",
        icon: <GrDatabase />,
        path: "data-entry-office-support",
      },
      {
        name: "Hospitality/Travel/Tourism",
        icon: <FaPlane />,
        path: "hospitality-travel-tourism",
      },
      {
        name: "Education/Training",
        icon: <FaGraduationCap />,
        path: "education-training",
      },
      {
        name: "Customer/Service/Call Centre",
        icon: <FaPhone />,
        path: "customer-service-call-centre",
      },
      { name: "Consultants", icon: <FaBriefcase />, path: "consultants" },
      {
        name: "Banking/Financial Services",
        icon: <FaBuilding />,
        path: "banking-financial-services",
      },
      {
        name: "N.G.O./Social Services",
        icon: <FaHandHoldingHeart />,
        path: "ngo-social-services",
      },
      {
        name: "E-Commerce/E-Business",
        icon: <FaShoppingCart />,
        path: "ecommerce-ebusiness",
      },
      {
        name: "Real Estate/Property",
        icon: <FaHome />,
        path: "real-estate-property",
      },
      {
        name: "Healthcare/Hospital/Medical",
        icon: <FaHospital />,
        path: "healthcare-hospital-medical",
      },
      { name: "BPO", icon: <FaHeadset />, path: "bpo" },
      {
        name: "Construction/Cement/Metals",
        icon: <FaHardHat />,
        path: "construction-cement-metals",
      },
      {
        name: "Architect/Interior Design",
        icon: <MdOutlineDesignServices />,
        path: "architect-interior-design",
      },
      {
        name: "Importers/ Distributors/Exporters",
        icon: <FaShippingFast />,
        path: "importers-distributors-exporters",
      },
    ].map((c) => ({ ...c, ...getJobStats(c.name) }));
    setJobCategories(cats);
  }, [getJobStats]);

  // ── Nav config ────────────────────────────────────────────────────────────
  const navItems = [
    {
      label: "Browse Job",
      icon: <FaSearch className="text-xs" />,
      ref: browseJobRef,
      subNav: [
        {
          name: "All Industry",
          path: "jobs",
          count: "View All",
          icon: <FaIndustry />,
          isAllIndustry: true,
        },
        ...jobCategories.map((c) => ({
          name: c.name,
          path: `jobs/${c.path}`,
          icon: c.icon,
          jobCount: c.jobCount,
          vacancyCount: c.vacancyCount,
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
      ref: featuresRef,
      subNav: [
        {
          name: "CV & Resume Writing",
          path: "features/cv-writing",
          icon: <FaFileAlt />,
          description: "Professional resume building tools",
        },
        {
          name: "Career Tips",
          path: "features/career-tips",
          icon: <MdTipsAndUpdates />,
          description: "Expert career guidance",
        },
        {
          name: "Interview Tips",
          path: "features/interview-tips",
          icon: <FaUserTie />,
          description: "Ace your interviews",
        },
        {
          name: "Skill Development",
          path: "features/skill-development",
          icon: <GiSkills />,
          description: "Enhance your skills",
        },
      ],
    },
    {
      label: "Free CV Review",
      path: "cv-review",
      icon: <FaFileAlt className="text-xs" />,
    },
    { label: "Community", path: "", icon: <FaUsers className="text-xs" /> },
  ];

  const profileMenuItems = [
    {
      label: "View Profile",
      icon: <FaUserCircle />,
      path: "seeker/profile",
      color: "text-blue-600",
    },
    {
      label: "Saved Jobs",
      icon: <FaHeart />,
      path: "seeker/saved-jobs",
      color: "text-red-500",
      badge: "3",
    },
    {
      label: "Applied Jobs",
      icon: <FaBriefcase />,
      path: "seeker/applied-jobs",
      color: "text-emerald-600",
      badge: "12",
    },
    {
      label: "Shortlisted",
      icon: <FaClipboardCheck />,
      path: "seeker/shortlisted",
      color: "text-violet-600",
      badge: "5",
    },
    {
      label: "Job Alerts",
      icon: <IoMdNotifications />,
      path: "seeker/job-alerts",
      color: "text-blue-500",
      badge: "2",
    },
    {
      label: "Change Password",
      icon: <FaKey />,
      path: "seeker/change-password",
      color: "text-amber-600",
    },
    {
      label: "Logout",
      icon: <FaSignOutAlt />,
      path: "#",
      color: "text-red-500",
      isLogout: true,
    },
  ];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggle = (label) => setActiveNav((p) => (p === label ? null : label));

  const handleLinkClick = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setActiveNav(null);
      setIsMenuOpen(false);
      setIsNavigating(false);
    }, 100);
  };

  const handleLogout = async () => {
    await logout();
    setActiveNav(null);
    setIsMenuOpen(false);
    navigate("/jobseeker/login");
  };

  // ── Profile dropdown ───────────────────────────────────────────────────────
  const ProfileDropdown = () => (
    <div
      className="nav-dropdown absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
      style={{ top: "calc(100% + 10px)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Arrow */}
      <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />

      {/* Header */}
      <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <UserAvatar
              src={displayUser.avatar}
              name={displayUser.name}
              size={56}
              className="rounded-full border-4 border-white shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base truncate">
              {displayUser.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {displayUser.email}
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Profile complete</span>
                <span className="font-bold text-emerald-600">
                  {displayUser.profileComplete}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${displayUser.profileComplete}%`,
                    background: "linear-gradient(90deg,#10b981,#059669)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="p-3 space-y-0.5">
        {profileMenuItems.map((item, i) => (
          <Link
            key={i}
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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${item.isLogout ? "hover:bg-red-50" : "hover:bg-gray-50"}`}
          >
            <span className={`${item.color} text-sm`}>{item.icon}</span>
            <span
              className={`text-sm font-medium flex-1 ${item.isLogout ? "text-red-500" : "text-gray-700 group-hover:text-emerald-600"}`}
            >
              {item.label}
            </span>
            {item.badge && (
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 flex justify-between">
        <button className="text-xs text-gray-500 hover:text-emerald-600 flex items-center gap-1 font-medium transition-colors">
          <FaCog className="text-[10px]" /> Privacy Settings
        </button>
        <button className="text-xs text-gray-500 hover:text-emerald-600 flex items-center gap-1 font-medium transition-colors">
          <FaGraduationCap className="text-[10px]" /> Help Center
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{slideDownStyle}</style>

      <nav
        className={`bg-white sticky top-0 z-50 transition-all duration-300 font-ubuntu ${scrolled ? "shadow-md" : "shadow-sm border-b border-gray-100"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item, idx) => (
                <div key={idx} className="relative" ref={item.ref}>
                  {item.subNav ? (
                    <>
                      <button
                        onClick={() => toggle(item.label)}
                        className={`flex flex-col items-center gap-1 transition-colors duration-200 ${activeNav === item.label ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"}`}
                      >
                        <span className="text-xs">{item.icon}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider">
                          {item.label}
                        </span>
                      </button>

                      {activeNav === item.label && (
                        <div
                          className="nav-dropdown fixed left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-40"
                          style={{ top: 64 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="container mx-auto px-4 py-6">
                            {item.label === "Browse Job" ? (
                              <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                  {item.subNav.map((sub, si) => (
                                    <Link
                                      key={si}
                                      to={sub.path}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleLinkClick();
                                      }}
                                      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group/sub
                                        ${sub.isAllIndustry ? "border-2 border-emerald-400 bg-emerald-50" : "hover:bg-gray-50 border border-transparent hover:border-gray-100"}`}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <span
                                          className={`text-sm transition-colors ${sub.isAllIndustry ? "text-emerald-600" : "text-gray-400 group-hover/sub:text-emerald-500"}`}
                                        >
                                          {sub.icon}
                                        </span>
                                        <div>
                                          <p
                                            className={`text-xs font-semibold ${sub.isAllIndustry ? "text-emerald-700" : "text-gray-700 group-hover/sub:text-gray-900"}`}
                                          >
                                            {sub.name}
                                          </p>
                                          {sub.isAllIndustry ? (
                                            <p className="text-[10px] text-emerald-500 mt-0.5">
                                              Browse all categories
                                            </p>
                                          ) : (
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                              {sub.jobCount} jobs ·{" "}
                                              {sub.vacancyCount} vacancies
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <FaChevronRight
                                        className={`text-[8px] ${sub.isAllIndustry ? "text-emerald-500" : "text-gray-300 group-hover/sub:text-emerald-400"}`}
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
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                                  >
                                    View all job categories{" "}
                                    <FaChevronRight className="text-[8px]" />
                                  </Link>
                                </div>
                              </>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {item.subNav.map((sub, si) => (
                                  <Link
                                    key={si}
                                    to={sub.path}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLinkClick();
                                    }}
                                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-emerald-50 transition-all duration-200 group/sub"
                                  >
                                    <div className="p-3 rounded-xl bg-emerald-50 group-hover/sub:bg-emerald-100 transition-colors">
                                      <span className="text-gray-400 group-hover/sub:text-emerald-600">
                                        {sub.icon}
                                      </span>
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-800 group-hover/sub:text-emerald-600 text-sm">
                                        {sub.name}
                                      </h4>
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {sub.description}
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
                      className="flex flex-col items-center gap-1 text-gray-500 hover:text-emerald-600 transition-colors duration-200 group"
                    >
                      <span className="text-xs">{item.icon}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        {item.label}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right: language + profile + hamburger */}
            <div className="flex items-center gap-3">
              {/* Language selector */}
              <div className="hidden md:block relative group">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-600 transition-colors">
                  <ReactCountryFlag
                    countryCode="US"
                    svg
                    style={{
                      width: "1.2em",
                      height: "1.2em",
                      borderRadius: "50%",
                    }}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    EN
                  </span>
                  <FaChevronDown className="text-[8px]" />
                </button>
              </div>

              {/* Profile button */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => toggle("Profile")}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <div className="relative">
                    <UserAvatar
                      src={displayUser.avatar}
                      name={displayUser.name}
                      size={32}
                      className="rounded-full border-2 border-gray-200 group-hover:border-emerald-400 transition-colors duration-200"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors leading-none">
                      {displayUser.name.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Job Seeker
                    </p>
                  </div>
                  <FaChevronDown
                    className={`text-[8px] text-gray-400 group-hover:text-emerald-500 transition-transform duration-200 ${activeNav === "Profile" ? "rotate-180" : ""}`}
                  />
                </button>

                {activeNav === "Profile" && <ProfileDropdown />}
              </div>

              {/* Hamburger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-gray-500 hover:text-emerald-600 transition-colors"
              >
                {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {isMenuOpen && (
        <div className="menu-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden">
          <div className="menu-panel absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col">
            {/* Mobile header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <Link to="/">
                <img src={logo} alt="Logo" className="h-7 w-auto" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-emerald-600 transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* User card */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <UserAvatar
                    src={displayUser.avatar}
                    name={displayUser.name}
                    size={44}
                    className="rounded-full border-2 border-white shadow"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">
                    {displayUser.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {displayUser.email}
                  </p>
                </div>
              </div>
              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Profile complete</span>
                  <span className="font-bold text-emerald-600">
                    {displayUser.profileComplete}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${displayUser.profileComplete}%`,
                      background: "linear-gradient(90deg,#10b981,#059669)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
                {navItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-b border-gray-50 last:border-0"
                  >
                    {item.subNav ? (
                      <>
                        <button
                          onClick={() =>
                            setActiveNav((p) =>
                              p === item.label ? null : item.label,
                            )
                          }
                          className="flex items-center justify-between w-full py-3 text-gray-700 hover:text-emerald-600 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm">
                              {item.icon}
                            </span>
                            <span className="text-sm font-semibold">
                              {item.label}
                            </span>
                          </div>
                          <FaChevronDown
                            className={`text-xs text-gray-400 transition-transform duration-200 ${activeNav === item.label ? "rotate-180" : ""}`}
                          />
                        </button>
                        {activeNav === item.label && (
                          <div className="pl-7 pb-3 max-h-60 overflow-y-auto space-y-1">
                            {item.subNav.map((sub, si) => (
                              <Link
                                key={si}
                                to={sub.path}
                                onClick={handleLinkClick}
                                className={`flex items-center justify-between py-2 px-2 rounded-lg transition-colors text-gray-600 hover:text-emerald-600 hover:bg-emerald-50
                                  ${sub.isAllIndustry ? "border-l-2 border-emerald-500 bg-emerald-50 pl-3" : ""}`}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs ${sub.isAllIndustry ? "text-emerald-600" : "text-gray-400"}`}
                                  >
                                    {sub.icon}
                                  </span>
                                  <div>
                                    <span
                                      className={`text-xs font-medium ${sub.isAllIndustry ? "text-emerald-700 font-bold" : ""}`}
                                    >
                                      {sub.name}
                                    </span>
                                    {!sub.isAllIndustry &&
                                      sub.jobCount !== undefined && (
                                        <p className="text-[10px] text-gray-400">
                                          {sub.jobCount} jobs
                                        </p>
                                      )}
                                  </div>
                                </div>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${sub.isAllIndustry ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"}`}
                                >
                                  {sub.isAllIndustry ? "All" : sub.jobCount}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 py-3 text-gray-700 hover:text-emerald-600 transition-colors"
                      >
                        <span className="text-gray-400 text-sm">
                          {item.icon}
                        </span>
                        <span className="text-sm font-semibold">
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Account section */}
              <div className="p-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Account
                </p>
                <div className="space-y-0.5">
                  {profileMenuItems.map((item, i) => (
                    <Link
                      key={i}
                      to={item.isLogout ? "#" : item.path}
                      onClick={(e) => {
                        if (item.isLogout) {
                          e.preventDefault();
                          handleLogout();
                          return;
                        }
                        handleLinkClick();
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${item.isLogout ? "hover:bg-red-50" : "hover:bg-gray-50"}`}
                    >
                      <span className={`${item.color} text-sm`}>
                        {item.icon}
                      </span>
                      <span
                        className={`text-sm font-medium flex-1 ${item.isLogout ? "text-red-500" : "text-gray-700"}`}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
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

export default SeekerHeader;
