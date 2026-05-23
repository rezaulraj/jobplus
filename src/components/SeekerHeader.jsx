import { useState, useEffect, useRef } from "react";
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
  FaSpinner,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";
import { MdTipsAndUpdates, MdOutlineDesignServices } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { GrDatabase } from "react-icons/gr";
import { AiFillNotification } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import ReactCountryFlag from "react-country-flag";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import useAuthStore from "../store/authStore";
import useJobStore from "../store/jobStore";
import useSeekerStore from "../store/seekerStore";

// ─── Category icon map ────────────────────────────────────────────────────────
const CATEGORY_ICON_MAP = {
  "Accounting/Finance": <FaMoneyBill />,
  "Business Development": <FaBusinessTime />,
  "Sales/Marketing": <AiFillNotification />,
  "IT/Telecommunication": <FaCode />,
  "Information Technology": <FaLaptopCode />,
  Engineering: <FaTools />,
  Manufacturing: <FaIndustry />,
  Services: <FaStar />,
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
const getDefaultIcon = () => <FaBriefcase />;

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

// ─── Profile Completion Ring ──────────────────────────────────────────────────
const CompletionRing = ({ pct, size = 44 }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#f87171";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={3}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.7s ease" }}
      />
    </svg>
  );
};

// ─── Animations ───────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .nav-dropdown  { animation: slideDown 0.22s cubic-bezier(0.4,0,0.2,1) both; }
  .menu-overlay  { animation: fadeIn   0.2s  ease both; }
  .menu-panel    { animation: slideDown 0.25s cubic-bezier(0.4,0,0.2,1) both; }
  .cat-grid-in   { animation: slideDown 0.2s  ease both; }
  .skel-shimmer  {
    background: linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%);
    background-size: 600px 100%;
    animation: shimmer 1.5s infinite linear;
    border-radius: 10px;
  }
  /* thin custom scrollbar for the category panel */
  .cat-scroll::-webkit-scrollbar { width: 4px; }
  .cat-scroll::-webkit-scrollbar-track { background: transparent; }
  .cat-scroll::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 4px; }
  .cat-scroll { scrollbar-width: thin; scrollbar-color: #d1fae5 transparent; }
`;

// ─── Category skeleton row ────────────────────────────────────────────────────
const CatSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
    {Array.from({ length: 15 }).map((_, i) => (
      <div key={i} className="skel-shimmer" style={{ height: 58 }} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const SeekerHeader = () => {
  const navigate = useNavigate();
  const { user, tokens, logout, fetchMe } = useAuthStore();

  // ── Stores ─────────────────────────────────────────────────────────────────
  const {
    categories: storeCategories,
    fetchCategories,
    isLoading: categoriesLoading,
  } = useJobStore();
  const { seekerProfile, fetchSeekerProfile } = useSeekerStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const browseJobRef = useRef(null);
  const featuresRef = useRef(null);
  const profileRef = useRef(null);

  // ── Display user ───────────────────────────────────────────────────────────
  const displayUser = {
    name: user?.fullName || user?.name || "Guest User",
    email: user?.email || "",
    avatar: user?.profileImage || user?.avatar || user?.photo || null,
  };

  // ── Profile completion ─────────────────────────────────────────────────────
  const completionItems = [
    { label: "Personal Info", done: !!seekerProfile?.personalInfo },
    {
      label: "Work History",
      done: (seekerProfile?.experience?.length || 0) > 0,
    },
    { label: "Education", done: (seekerProfile?.education?.length || 0) > 0 },
    { label: "Profile Picture", done: !!seekerProfile?.profileImage },
    { label: "Summary", done: !!seekerProfile?.summary },
    { label: "Skills", done: (seekerProfile?.skills?.length || 0) > 0 },
    { label: "Projects", done: (seekerProfile?.projects?.length || 0) > 0 },
    { label: "Languages", done: (seekerProfile?.languages?.length || 0) > 0 },
    { label: "Job Preferences", done: !!seekerProfile?.jobPreferences },
    { label: "Video CV", done: !!seekerProfile?.videoCV },
  ];
  const profileComplete = seekerProfile
    ? Math.round(
        (completionItems.filter((i) => i.done).length /
          completionItems.length) *
          100,
      )
    : user?.profileComplete || 0;

  // ── Fetch profile on auth ──────────────────────────────────────────────────
  useEffect(() => {
    if (tokens?.accessToken && !profileLoaded) {
      Promise.all([fetchMe(), fetchSeekerProfile()]).then(() =>
        setProfileLoaded(true),
      );
    }
  }, [tokens?.accessToken]);

  // ── Fetch categories only if store is empty (avoid duplicate API calls) ───
  useEffect(() => {
    if (!storeCategories || storeCategories.length === 0) {
      fetchCategories();
    }
  }, []);

  // ── Dynamic categories ────────────────────────────────────────────────────
  const dynamicCategories = (storeCategories || [])
    .filter((c) => c.isActive !== false)
    .map((c) => ({
      name: c.title || c.nameCategory || "",
      icon:
        CATEGORY_ICON_MAP[c.title] ||
        CATEGORY_ICON_MAP[c.nameCategory] ||
        getDefaultIcon(),
      path: `jobs?jobCategoryId=${c.jobCategoryId || c._id}`,
      jobCount: c.totalJobs || 0,
      vacancyCount: c.totalVacancies || 0,
      categoryId: c.jobCategoryId || c._id,
    }));

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

  // ── Nav config ─────────────────────────────────────────────────────────────
  const navItems = [
    {
      label: "Browse Job",
      icon: <FaSearch className="text-xs" />,
      ref: browseJobRef,
      subNav: [
        {
          name: "All Industry",
          path: "jobs",
          icon: <FaIndustry />,
          isAllIndustry: true,
        },
        ...dynamicCategories,
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
      icon: <FaFileAlt className="text-xs" />,
      path: "cv-review",
    },
    { label: "Community", icon: <FaUsers className="text-xs" />, path: "" },
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
    },
    {
      label: "Applied Jobs",
      icon: <FaBriefcase />,
      path: "seeker/applied-jobs",
      color: "text-emerald-600",
    },
    {
      label: "Shortlisted",
      icon: <FaClipboardCheck />,
      path: "seeker/shortlisted",
      color: "text-violet-600",
    },
    {
      label: "Job Alerts",
      icon: <IoMdNotifications />,
      path: "seeker/job-alerts",
      color: "text-blue-500",
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
                <span
                  className={`font-bold ${profileComplete >= 80 ? "text-emerald-600" : profileComplete >= 50 ? "text-amber-500" : "text-red-400"}`}
                >
                  {profileComplete}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${profileComplete}%`,
                    background:
                      profileComplete >= 80
                        ? "linear-gradient(90deg,#10b981,#059669)"
                        : profileComplete >= 50
                          ? "linear-gradient(90deg,#f59e0b,#d97706)"
                          : "linear-gradient(90deg,#f87171,#ef4444)",
                  }}
                />
              </div>
            </div>
            {profileComplete < 100 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {completionItems
                  .filter((i) => !i.done)
                  .slice(0, 3)
                  .map((item) => (
                    <span
                      key={item.label}
                      className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded border border-amber-100 font-medium"
                    >
                      + {item.label}
                    </span>
                  ))}
                {completionItems.filter((i) => !i.done).length > 3 && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded border border-gray-100 font-medium">
                    +{completionItems.filter((i) => !i.done).length - 3} more
                  </span>
                )}
              </div>
            )}
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
          </Link>
        ))}
      </div>

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

  // ── Browse Job dropdown: 60vh with sticky header+footer, scrollable grid ──
  const BrowseJobDropdown = ({ subNav }) => (
    <div
      className="nav-dropdown fixed left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-40 flex flex-col"
      style={{ top: 64, maxHeight: "60vh" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Sticky header */}
      <div className="container mx-auto px-4 pt-4 pb-3 flex items-center justify-between shrink-0 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Browse by Industry
          </span>
          {!categoriesLoading && dynamicCategories.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold border border-emerald-100">
              {dynamicCategories.length} categories
            </span>
          )}
        </div>
        <Link
          to="jobs"
          onClick={handleLinkClick}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
        >
          View all <FaChevronRight className="text-[8px]" />
        </Link>
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto cat-scroll">
        <div className="container mx-auto px-4 py-4">
          {categoriesLoading ? (
            <CatSkeleton />
          ) : (
            <div className="cat-grid-in grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {subNav.map((sub, si) => (
                <Link
                  key={si}
                  to={sub.path}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkClick();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group/sub
                    ${
                      sub.isAllIndustry
                        ? "border-2 border-emerald-400 bg-emerald-50"
                        : "hover:bg-gray-50 border border-transparent hover:border-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-sm transition-colors shrink-0
                      ${sub.isAllIndustry ? "text-emerald-600" : "text-gray-400 group-hover/sub:text-emerald-500"}`}
                    >
                      {sub.icon}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold leading-tight truncate
                        ${sub.isAllIndustry ? "text-emerald-700" : "text-gray-700 group-hover/sub:text-gray-900"}`}
                      >
                        {sub.name}
                      </p>
                      {sub.isAllIndustry ? (
                        <p className="text-[10px] text-emerald-500 mt-0.5">
                          Browse all
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {sub.jobCount > 0
                            ? `${sub.jobCount} jobs`
                            : "View jobs"}
                          {sub.vacancyCount > 0
                            ? ` · ${sub.vacancyCount} vacancies`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <FaChevronRight
                    className={`text-[8px] shrink-0 ml-1
                    ${sub.isAllIndustry ? "text-emerald-500" : "text-gray-300 group-hover/sub:text-emerald-400"}`}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="container mx-auto px-4 py-3 border-t border-gray-100 shrink-0 bg-white">
        <Link
          to="jobs"
          onClick={handleLinkClick}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline flex items-center gap-1"
        >
          View all job categories <FaChevronRight className="text-[8px]" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>

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
                        className={`flex flex-col items-center gap-1 transition-colors duration-200
                          ${activeNav === item.label ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"}`}
                      >
                        <span className="text-xs">{item.icon}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                          {item.label}
                          {item.label === "Browse Job" && categoriesLoading && (
                            <FaSpinner className="text-[8px] animate-spin text-emerald-400" />
                          )}
                        </span>
                      </button>

                      {activeNav === item.label &&
                        (item.label === "Browse Job" ? (
                          <BrowseJobDropdown subNav={item.subNav} />
                        ) : (
                          /* Features dropdown — small, no scroll needed */
                          <div
                            className="nav-dropdown fixed left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-40"
                            style={{ top: 64 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="container mx-auto px-4 py-6">
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
                            </div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className="flex flex-col items-center gap-1 text-gray-500 hover:text-emerald-600 transition-colors duration-200"
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

            {/* Right: language + completion ring + profile + hamburger */}
            <div className="flex items-center gap-3">
              {/* Language */}
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

              {/* Completion ring */}
              <div
                className="hidden md:flex items-center relative group/ring cursor-pointer"
                onClick={() => navigate("seeker/profile")}
              >
                <div className="relative" style={{ width: 32, height: 32 }}>
                  <CompletionRing pct={profileComplete} size={32} />
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-600">
                    {profileComplete}%
                  </span>
                </div>
                {/* Hover tooltip */}
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-3
                  opacity-0 group-hover/ring:opacity-100 pointer-events-none transition-opacity duration-200"
                >
                  <p className="text-[11px] font-bold text-gray-700 mb-2">
                    Profile Completion
                  </p>
                  <div className="space-y-1">
                    {completionItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-1.5"
                      >
                        {item.done ? (
                          <FaCheckCircle className="text-emerald-500 text-[9px]" />
                        ) : (
                          <FaCircle className="text-gray-200 text-[9px]" />
                        )}
                        <span
                          className={`text-[10px] ${item.done ? "text-gray-600" : "text-gray-400"}`}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
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
                    className={`text-[8px] text-gray-400 group-hover:text-emerald-500 transition-transform duration-200
                    ${activeNav === "Profile" ? "rotate-180" : ""}`}
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

      {/* ── Mobile menu ───────────────────────────────────────────────────────── */}
      {isMenuOpen && (
        <div className="menu-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden">
          <div className="menu-panel absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
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
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-gray-100 shrink-0">
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
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-sm truncate">
                    {displayUser.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {displayUser.email}
                  </p>
                </div>
                <div
                  className="relative shrink-0"
                  style={{ width: 40, height: 40 }}
                >
                  <CompletionRing pct={profileComplete} size={40} />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-700">
                    {profileComplete}%
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Profile complete</span>
                  <span
                    className={`font-bold ${profileComplete >= 80 ? "text-emerald-600" : profileComplete >= 50 ? "text-amber-500" : "text-red-400"}`}
                  >
                    {profileComplete}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${profileComplete}%`,
                      background:
                        profileComplete >= 80
                          ? "linear-gradient(90deg,#10b981,#059669)"
                          : profileComplete >= 50
                            ? "linear-gradient(90deg,#f59e0b,#d97706)"
                            : "linear-gradient(90deg,#f87171,#ef4444)",
                    }}
                  />
                </div>
                {completionItems.filter((i) => !i.done).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {completionItems
                      .filter((i) => !i.done)
                      .slice(0, 3)
                      .map((item) => (
                        <span
                          key={item.label}
                          className="text-[9px] px-1.5 py-0.5 bg-white text-amber-600 rounded border border-amber-100 font-medium"
                        >
                          + {item.label}
                        </span>
                      ))}
                    {completionItems.filter((i) => !i.done).length > 3 && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-white text-gray-400 rounded border border-gray-100 font-medium">
                        +{completionItems.filter((i) => !i.done).length - 3}{" "}
                        more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
                {navItems.map((item, idx) => (
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
                            {item.label === "Browse Job" &&
                              dynamicCategories.length > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold">
                                  {dynamicCategories.length}
                                </span>
                              )}
                          </div>
                          {categoriesLoading && item.label === "Browse Job" ? (
                            <FaSpinner className="text-xs text-emerald-400 animate-spin" />
                          ) : (
                            <FaChevronDown
                              className={`text-xs text-gray-400 transition-transform duration-200 ${activeNav === item.label ? "rotate-180" : ""}`}
                            />
                          )}
                        </button>

                        {activeNav === item.label && (
                          <div className="pl-7 pb-3 max-h-60 overflow-y-auto cat-scroll space-y-1">
                            {categoriesLoading &&
                            item.label === "Browse Job" ? (
                              <div className="space-y-1.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="skel-shimmer"
                                    style={{ height: 36 }}
                                  />
                                ))}
                              </div>
                            ) : (
                              item.subNav.map((sub, si) => (
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
                                        sub.jobCount > 0 && (
                                          <p className="text-[10px] text-gray-400">
                                            {sub.jobCount} jobs
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0
                                    ${sub.isAllIndustry ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"}`}
                                  >
                                    {sub.isAllIndustry
                                      ? "All"
                                      : sub.jobCount || "—"}
                                  </span>
                                </Link>
                              ))
                            )}
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

              {/* Account */}
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                        ${item.isLogout ? "hover:bg-red-50" : "hover:bg-gray-50"}`}
                    >
                      <span className={`${item.color} text-sm`}>
                        {item.icon}
                      </span>
                      <span
                        className={`text-sm font-medium flex-1 ${item.isLogout ? "text-red-500" : "text-gray-700"}`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div className="p-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Profile Checklist
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {completionItems.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${item.done ? "bg-emerald-50" : "bg-gray-50"}`}
                    >
                      {item.done ? (
                        <FaCheckCircle className="text-emerald-500 text-[10px] shrink-0" />
                      ) : (
                        <FaCircle className="text-gray-300 text-[10px] shrink-0" />
                      )}
                      <span
                        className={`text-[10px] font-medium truncate ${item.done ? "text-emerald-700" : "text-gray-400"}`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  to="seeker/profile"
                  onClick={handleLinkClick}
                  className="block mt-3 text-center text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 py-2 rounded-xl transition-colors"
                >
                  Complete Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SeekerHeader;
