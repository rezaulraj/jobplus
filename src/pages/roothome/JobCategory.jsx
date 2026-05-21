import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBriefcase,
  FaBuilding,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaGlobeAsia,
  FaIndustry,
  FaPlusCircle,
  FaFire,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useJobStore from "../../store/jobstore";

const DEFAULT_LOGO = "/images/compna_defult.png";

const MOCK_CATEGORIES = Array.from({ length: 24 }, (_, i) => ({
  jobCategoryId: i + 1,
  title: [
    "Technology & IT",
    "Marketing & Sales",
    "Finance & Accounting",
    "Healthcare & Medical",
    "Engineering",
    "Education & Training",
    "Human Resources",
    "Design & Creative",
    "Legal & Compliance",
    "Customer Service",
    "Logistics & Supply Chain",
    "Manufacturing",
    "Real Estate",
    "Media & Communication",
    "Agriculture",
    "Hospitality & Tourism",
    "Banking & Insurance",
    "Construction",
    "Telecommunications",
    "Retail & Commerce",
    "Research & Development",
    "Non-Profit / NGO",
    "Garments & Textiles",
    "Oil & Gas",
  ][i],
  totalJobs: Math.floor(Math.random() * 980) + 20,
  categoryIcon: null,
  isActive: true,
}));

const MOCK_COMPANIES = Array.from({ length: 10 }, (_, i) => ({
  companyId: i + 1,
  nameCompany: [
    "BRAC",
    "Grameenphone",
    "Square Group",
    "PRAN-RFL",
    "ACI Limited",
    "Dutch-Bangla Bank",
    "Beximco",
    "Walton Group",
    "Robi Axiata",
    "BGMEA",
  ][i],
  totalJobs: Math.floor(Math.random() * 150) + 10,
  companyLogo: null,
}));

const MOCK_COUNTRIES = Array.from({ length: 12 }, (_, i) => ({
  countryId: i + 1,
  name: [
    "Bangladesh",
    "Saudi Arabia",
    "UAE",
    "Malaysia",
    "Singapore",
    "Qatar",
    "Kuwait",
    "Bahrain",
    "Oman",
    "Jordan",
    "United Kingdom",
    "USA",
  ][i],
  totalJobs: Math.floor(Math.random() * 500) + 50,
  flag: null,
  isActive: true,
}));

const INITIAL_VISIBLE = 20;

const TABS = [
  { id: "industry", label: "By Industry", icon: FaIndustry },
  { id: "company", label: "By Company", icon: FaBuilding },
  { id: "country", label: "By Country", icon: FaGlobeAsia },
];

// ── Shimmer keyframes injected once ──────────────────────────────────────────

const SHIMMER_STYLE = `
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
}
.skeleton-line {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.6s infinite linear;
  border-radius: 6px;
}
.skeleton-circle {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: shimmer 1.6s infinite linear;
  border-radius: 9999px;
}
.skeleton-card {
  background: linear-gradient(90deg, #f8f8f8 25%, #efefef 50%, #f8f8f8 75%);
  background-size: 600px 100%;
  animation: shimmer 1.8s infinite linear;
  border-radius: 12px;
}
`;

function injectShimmerStyles() {
  if (document.getElementById("__shimmer_styles__")) return;
  const tag = document.createElement("style");
  tag.id = "__shimmer_styles__";
  tag.textContent = SHIMMER_STYLE;
  document.head.appendChild(tag);
}

// ── Skeleton primitives ───────────────────────────────────────────────────────

const SkeletonCategoryCard = () => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div
      className="skeleton-circle shrink-0"
      style={{ width: 36, height: 36 }}
    />
    <div className="flex-1 space-y-2">
      <div className="skeleton-line" style={{ height: 13, width: "70%" }} />
      <div className="skeleton-line" style={{ height: 10, width: "40%" }} />
    </div>
    <div
      className="skeleton-line shrink-0"
      style={{ height: 20, width: 52, borderRadius: 9999 }}
    />
  </div>
);

const SkeletonCompanyCard = () => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div
      className="skeleton-circle shrink-0"
      style={{ width: 36, height: 36 }}
    />
    <div className="flex-1 space-y-2">
      <div className="skeleton-line" style={{ height: 13, width: "60%" }} />
      <div className="skeleton-line" style={{ height: 10, width: "35%" }} />
    </div>
    <div
      className="skeleton-line shrink-0"
      style={{ height: 20, width: 56, borderRadius: 9999 }}
    />
  </div>
);

const SkeletonCountryCard = () => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div
      className="skeleton-circle shrink-0"
      style={{ width: 36, height: 36 }}
    />
    <div className="flex-1 space-y-2">
      <div className="skeleton-line" style={{ height: 13, width: "55%" }} />
      <div className="skeleton-line" style={{ height: 10, width: "30%" }} />
    </div>
    <div
      className="skeleton-line shrink-0"
      style={{ height: 20, width: 52, borderRadius: 9999 }}
    />
  </div>
);

const SkeletonEmployerRow = () => (
  <div className="flex items-center gap-3 p-2.5 rounded-xl">
    <div
      className="skeleton-circle shrink-0"
      style={{ width: 36, height: 36 }}
    />
    <div className="flex-1 space-y-2">
      <div className="skeleton-line" style={{ height: 13, width: "65%" }} />
      <div className="skeleton-line" style={{ height: 10, width: "40%" }} />
    </div>
    <div
      className="skeleton-circle shrink-0"
      style={{ width: 12, height: 12 }}
    />
  </div>
);

// ── Skeleton panels (full tab skeletons) ─────────────────────────────────────

const SkeletonIndustryPanel = memo(() => (
  <div>
    {/* Faint header label skeleton */}
    <div className="flex items-center gap-2 mb-4">
      <div className="skeleton-line" style={{ height: 10, width: 80 }} />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCategoryCard key={i} />
      ))}
      {/* "All Industries" placeholder */}
      <div className="skeleton-card" style={{ height: 62 }} />
    </div>
    {/* Button skeleton */}
    <div className="flex justify-center mt-5">
      <div
        className="skeleton-line"
        style={{ height: 40, width: 220, borderRadius: 9999 }}
      />
    </div>
  </div>
));
SkeletonIndustryPanel.displayName = "SkeletonIndustryPanel";

const SkeletonCompanyPanel = memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCompanyCard key={i} />
    ))}
    <div className="skeleton-card" style={{ height: 62 }} />
  </div>
));
SkeletonCompanyPanel.displayName = "SkeletonCompanyPanel";

const SkeletonCountryPanel = memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
    {Array.from({ length: 9 }).map((_, i) => (
      <SkeletonCountryCard key={i} />
    ))}
    <div className="skeleton-card" style={{ height: 62 }} />
  </div>
));
SkeletonCountryPanel.displayName = "SkeletonCountryPanel";

// ── Real card components ──────────────────────────────────────────────────────

const CategoryCard = memo(({ category }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-green-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0 overflow-hidden">
      {category.categoryIcon ? (
        <img
          src={category.categoryIcon}
          alt={category.title}
          className="w-5 h-5 object-contain"
        />
      ) : (
        <FaIndustry className="text-[#4eb956] text-sm" />
      )}
    </div>
    <Link
      to={`/jobs?jobCategoryId=${category.jobCategoryId}`}
      className="flex-1 min-w-0 text-gray-800 group-hover:text-[#4eb956] text-sm font-medium truncate transition-colors"
    >
      {category.title}
    </Link>
    <span className="shrink-0 text-[11px] font-bold text-[#4eb956] bg-green-50 group-hover:bg-green-100 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap">
      {(category.totalJobs || 0).toLocaleString()} jobs
    </span>
  </div>
));
CategoryCard.displayName = "CategoryCard";

const CompanyCard = memo(({ company }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
    <img
      src={company.companyLogo || DEFAULT_LOGO}
      alt={company.nameCompany}
      className="w-9 h-9 rounded-full object-cover bg-gray-100 border border-gray-200 shrink-0"
    />
    <Link
      to={`/jobs?companyId=${company.companyId}`}
      className="flex-1 min-w-0 text-gray-700 group-hover:text-purple-600 text-sm font-medium truncate transition-colors"
    >
      {company.nameCompany}
    </Link>
    <span className="shrink-0 text-[11px] font-bold text-purple-600 bg-purple-50 group-hover:bg-purple-100 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap">
      {(company.totalJobs || 0).toLocaleString()} jobs
    </span>
  </div>
));
CompanyCard.displayName = "CompanyCard";

const CountryCard = memo(({ country }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center overflow-hidden shrink-0 border border-emerald-100">
      {country.flag ? (
        <img
          src={country.flag}
          alt={country.name}
          className="w-7 h-7 object-contain"
        />
      ) : (
        <FaGlobeAsia className="text-emerald-400 group-hover:text-emerald-600 transition-colors" />
      )}
    </div>
    <Link
      to={`/jobs?countryId=${country.countryId}`}
      className="flex-1 min-w-0 text-gray-700 group-hover:text-emerald-600 text-sm font-medium truncate transition-colors"
    >
      {country.name}
    </Link>
    <span className="shrink-0 text-[11px] font-bold text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap">
      {(country.totalJobs || 0).toLocaleString()} jobs
    </span>
  </div>
));
CountryCard.displayName = "CountryCard";

const EmployerRow = memo(({ company, index }) => (
  <div
    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    <img
      src={company.companyLogo || DEFAULT_LOGO}
      alt={company.nameCompany}
      className="w-9 h-9 rounded-full object-cover bg-gray-100 border border-gray-200 shrink-0"
    />
    <div className="flex-1 min-w-0">
      <Link
        to={`/jobs?companyId=${company.companyId}`}
        className="text-gray-700 group-hover:text-blue-600 text-sm font-semibold truncate block transition-colors"
      >
        {company.nameCompany}
      </Link>
      {company.totalJobs !== undefined && (
        <span className="text-[11px] text-gray-400">
          {company.totalJobs} open roles
        </span>
      )}
    </div>
    <FaChevronRight className="text-gray-300 group-hover:text-blue-400 text-[10px] shrink-0 transition-colors" />
  </div>
));
EmployerRow.displayName = "EmployerRow";

// ── Real panels ───────────────────────────────────────────────────────────────

const IndustryPanel = memo(({ categories, expanded, onToggle }) => {
  const displayList = expanded
    ? categories
    : categories.slice(0, INITIAL_VISIBLE);
  const hasMore = categories.length > INITIAL_VISIBLE;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {displayList.map((cat) => (
          <CategoryCard key={cat.jobCategoryId || cat._id} category={cat} />
        ))}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <FaPlusCircle className="text-[#4eb956] text-sm" />
          </div>
          <Link to="/jobs" className="text-[#4eb956] font-semibold text-sm">
            All Industries
          </Link>
        </div>
      </div>
      {hasMore && (
        <div className="flex justify-center mt-5">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 px-7 py-2.5 rounded-full font-semibold text-sm shadow-md transition-all duration-200 bg-[#4eb956] text-white hover:bg-[#3da045] active:scale-95"
          >
            {expanded ? (
              <>
                <FaChevronUp className="text-xs" /> Show Less
              </>
            ) : (
              <>
                <FaPlusCircle className="text-xs" /> Show{" "}
                {categories.length - INITIAL_VISIBLE} More Categories{" "}
                <FaChevronDown className="text-xs" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
});
IndustryPanel.displayName = "IndustryPanel";

const CompanyPanel = memo(({ companies }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
    {companies.map((company) => (
      <CompanyCard key={company.companyId || company._id} company={company} />
    ))}
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-200">
      <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
        <FaPlusCircle className="text-purple-500 text-sm" />
      </div>
      <Link to="/jobs" className="text-purple-600 font-semibold text-sm">
        All Companies
      </Link>
    </div>
  </div>
));
CompanyPanel.displayName = "CompanyPanel";

const CountryPanel = memo(({ countries }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
    {countries.map((country) => (
      <CountryCard key={country.countryId || country._id} country={country} />
    ))}
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200">
      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
        <FaPlusCircle className="text-emerald-500 text-sm" />
      </div>
      <Link to="/jobs" className="text-emerald-600 font-semibold text-sm">
        All Countries
      </Link>
    </div>
  </div>
));
CountryPanel.displayName = "CountryPanel";

// ── Sidebar skeleton ─────────────────────────────────────────────────────────

const SkeletonSidebar = memo(() => (
  <div className="space-y-2">
    {/* header */}
    <div className="flex items-center justify-between mb-5">
      <div className="space-y-2">
        <div className="skeleton-line" style={{ height: 10, width: 60 }} />
        <div className="skeleton-line" style={{ height: 16, width: 120 }} />
      </div>
      <div
        className="skeleton-line"
        style={{ height: 12, width: 52, borderRadius: 9999 }}
      />
    </div>
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonEmployerRow key={i} />
    ))}
    <div className="mt-5 pt-4 border-t border-gray-100">
      <div className="skeleton-card" style={{ height: 42, borderRadius: 12 }} />
    </div>
  </div>
));
SkeletonSidebar.displayName = "SkeletonSidebar";

// ── Selectors ─────────────────────────────────────────────────────────────────

const selectCategories = (s) => s.categories;
const selectCountries = (s) => s.countries;
const selectCompanies = (s) => s.companies;
const selectIsLoading = (s) => s.isLoading;
const selectFetchJobFilters = (s) => s.fetchJobFilters;

// ── Main component ────────────────────────────────────────────────────────────

const JobCategory = () => {
  const [activeTab, setActiveTab] = useState("industry");
  const [expanded, setExpanded] = useState(false);

  const categories = useJobStore(selectCategories);
  const countries = useJobStore(selectCountries);
  const companies = useJobStore(selectCompanies);
  const isLoading = useJobStore(selectIsLoading);
  const fetchJobFilters = useJobStore(selectFetchJobFilters);

  // inject shimmer CSS exactly once
  useEffect(() => {
    injectShimmerStyles();
  }, []);

  useEffect(() => {
    fetchJobFilters();
  }, [fetchJobFilters]);

  const activeCategories = useMemo(
    () =>
      (Array.isArray(categories) && categories.length
        ? categories
        : MOCK_CATEGORIES
      ).filter((c) => c.isActive !== false),
    [categories],
  );
  const activeCountries = useMemo(
    () =>
      (Array.isArray(countries) && countries.length
        ? countries
        : MOCK_COUNTRIES
      ).filter((c) => c.isActive !== false),
    [countries],
  );
  const activeCompanies = useMemo(() => {
    const list = Array.isArray(companies) ? companies : companies?.items || [];
    return list.length ? list : MOCK_COMPANIES;
  }, [companies]);
  const topEmployers = useMemo(
    () => activeCompanies.slice(0, 6),
    [activeCompanies],
  );

  const handleToggleExpand = useCallback(() => setExpanded((v) => !v), []);
  const handleTabChange = useCallback((id) => {
    setActiveTab(id);
    if (id !== "industry") setExpanded(false);
  }, []);

  // ── Skeleton panel matched to active tab ─────────────────────────────────
  const skeletonPanel = useMemo(() => {
    switch (activeTab) {
      case "company":
        return <SkeletonCompanyPanel />;
      case "country":
        return <SkeletonCountryPanel />;
      default:
        return <SkeletonIndustryPanel />;
    }
  }, [activeTab]);

  const realPanel = useMemo(() => {
    switch (activeTab) {
      case "industry":
        return (
          <IndustryPanel
            categories={activeCategories}
            expanded={expanded}
            onToggle={handleToggleExpand}
          />
        );
      case "company":
        return <CompanyPanel companies={activeCompanies} />;
      case "country":
        return <CountryPanel countries={activeCountries} />;
      default:
        return null;
    }
  }, [
    activeTab,
    activeCategories,
    activeCompanies,
    activeCountries,
    expanded,
    handleToggleExpand,
  ]);

  const panelContent = isLoading ? skeletonPanel : realPanel;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-gray-100 pb-14 pt-6 px-4 sm:px-6 lg:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* ── Main Panel ─────────────────────────────── */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xs p-6 border border-gray-100">
            {/* Header skeleton or real */}
            {isLoading ? (
              <div className="mb-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="skeleton-circle"
                    style={{ width: 14, height: 14 }}
                  />
                  <div
                    className="skeleton-line"
                    style={{ height: 10, width: 80 }}
                  />
                </div>
                <div
                  className="skeleton-line"
                  style={{ height: 28, width: "55%" }}
                />
                <div
                  className="skeleton-line"
                  style={{ height: 13, width: "70%" }}
                />
              </div>
            ) : (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <FaFire className="text-orange-400 text-sm" />
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                    Live Listings
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 leading-tight">
                  Browse Jobs in Bangladesh
                </h2>
                <p className="text-gray-400 text-sm">
                  Explore opportunities by industry, company, or destination
                  country.
                </p>
              </div>
            )}

            {/* Tabs — always visible so user can switch while loading */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === id
                      ? "bg-white text-[#4eb956] shadow-sm"
                      : "text-[#1e2558] hover:text-gray-700"
                  }`}
                >
                  <Icon className="text-xs" />
                  {label}
                </button>
              ))}
            </div>

            {/* Content — fade between skeleton and real, and between tabs */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isLoading ? `skeleton-${activeTab}` : `real-${activeTab}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="min-h-[300px]"
              >
                {panelContent}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Sidebar ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xs p-6 border border-gray-100 h-fit lg:sticky lg:top-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="sidebar-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SkeletonSidebar />
                </motion.div>
              ) : (
                <motion.div
                  key="sidebar-real"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                          Featured
                        </span>
                      </div>
                      <h2 className="text-lg font-extrabold text-gray-800">
                        Top Employers
                      </h2>
                    </div>
                    <Link
                      to="/jobs"
                      className="text-blue-500 hover:text-blue-700 text-xs font-semibold flex items-center gap-0.5 transition-colors"
                    >
                      View All <FaChevronRight className="text-[9px]" />
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {topEmployers.map((company, i) => (
                      <EmployerRow
                        key={company.companyId || company._id}
                        company={company}
                        index={i}
                      />
                    ))}
                    {!topEmployers.length && (
                      <p className="text-sm text-gray-400 text-center py-6">
                        No employers found.
                      </p>
                    )}
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <Link
                      to="/jobs"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1e2558] to-[#4eb956] text-white text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaBriefcase className="text-xs" />
                      Browse All Jobs
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCategory;
