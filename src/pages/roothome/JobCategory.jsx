import React, { useEffect, useState } from "react";
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
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useJobStore from "../../store/jobstore";

const DEFAULT_LOGO = "/images/compna_defult.png";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

const JobCategory = () => {
  const [activeTab, setActiveTab] = useState("industry");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { categories, countries, companies, fetchJobFilters, isLoading } =
    useJobStore();

  useEffect(() => {
    fetchJobFilters();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [fetchJobFilters]);

  const categoryList = Array.isArray(categories) ? categories : [];

  const countryList = Array.isArray(countries) ? countries : [];

  const companyList = Array.isArray(companies)
    ? companies
    : companies?.items || [];

  const activeCategories = categoryList.filter(
    (item) => item.isActive !== false,
  );
  const activeCountries = countryList.filter((item) => item.isActive !== false);
  const activeCompanies = companyList;

  const displayCategories =
    isMobile && !showAllCategories
      ? activeCategories.slice(0, 10)
      : activeCategories;

  const topEmployers = activeCompanies.slice(0, 6);

  const tabs = [
    { id: "industry", label: "By Industry" },
    { id: "company", label: "By Company" },
    { id: "country", label: "By Country" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "industry":
        return (
          <div className="space-y-4 font-source">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {displayCategories.map((category) => (
                <motion.div
                  key={category.jobCategoryId || category._id}
                  whileHover={{ y: -2 }}
                  className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center mr-3 overflow-hidden">
                    {category.categoryIcon ? (
                      <img
                        src={category.categoryIcon}
                        alt={category.title}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <FaIndustry className="text-gray-400 group-hover:text-secondary" />
                    )}
                  </div>

                  <Link
                    to={`/jobs?jobCategoryId=${category.jobCategoryId}`}
                    className="text-gray-700 group-hover:text-primary flex items-center font-lato w-full min-w-0"
                  >
                    <span className="truncate flex-1">{category.title}</span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200"
              >
                <span className="text-gray-400 mr-3 text-lg">
                  <FaPlusCircle />
                </span>
                <Link
                  to="/jobs"
                  className="text-primary font-lato font-semibold"
                >
                  All Industries
                </Link>
              </motion.div>
            </div>

            {isMobile && activeCategories.length > 10 && (
              <div className="flex justify-center mt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {showAllCategories ? (
                    <>
                      <FaChevronUp className="mr-2" /> Show Less
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="mr-2" /> Show More Categories
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        );

      case "company":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-source">
            {activeCompanies.map((company) => (
              <motion.div
                key={company.companyId || company._id}
                whileHover={{ y: -2 }}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 group"
              >
                <img
                  src={company.companyLogo || DEFAULT_LOGO}
                  alt={company.nameCompany}
                  className="w-9 h-9 rounded-full object-cover mr-3 bg-gray-100"
                />

                <Link
                  to={`/jobs?companyId=${company.companyId}`}
                  className="text-gray-700 group-hover:text-primary flex items-center w-full min-w-0"
                >
                  <span className="truncate flex-1">{company.nameCompany}</span>
                </Link>
              </motion.div>
            ))}

            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200"
            >
              <span className="text-gray-400 mr-3 text-lg">
                <FaPlusCircle />
              </span>
              <Link to="/jobs" className="text-primary font-lato font-semibold">
                All Companies
              </Link>
            </motion.div>
          </div>
        );

      case "country":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-source">
            {activeCountries.map((country) => (
              <motion.div
                key={country.countryId || country._id}
                whileHover={{ y: -2 }}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                  {country.flag ? (
                    <img
                      src={country.flag}
                      alt={country.name}
                      className="w-7 h-7 object-contain"
                    />
                  ) : (
                    <FaGlobeAsia className="text-gray-400" />
                  )}
                </div>

                <Link
                  to={`/jobs?countryId=${country.countryId}`}
                  className="text-gray-700 group-hover:text-primary flex items-center w-full min-w-0"
                >
                  <span className="truncate flex-1">{country.name}</span>
                </Link>
              </motion.div>
            ))}

            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200"
            >
              <span className="text-gray-400 mr-3 text-lg">
                <FaPlusCircle />
              </span>
              <Link to="/jobs" className="text-primary font-lato font-semibold">
                All Countries
              </Link>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 pb-12 pt-4 px-4 sm:px-6 lg:px-6 font-source">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-700 mb-3">
                Browse Jobs in Bangladesh
              </h2>
              <p className="text-gray-600 text-sm">
                Browse jobs by industry, company, and country.
              </p>
            </div>

            <div className="flex flex-wrap border-b border-gray-200 mb-6 -mx-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== "industry") setShowAllCategories(false);
                  }}
                  className={`px-4 py-3 text-sm font-semibold rounded-t-lg mx-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-secondary bg-blue-50"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[300px]"
              >
                {isLoading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : (
                  renderContent()
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-700">Top Employers</h2>
              <Link
                to="/jobs"
                className="hover:text-secondary text-primary hover:underline text-sm font-semibold flex items-center"
              >
                View All <FaChevronRight className="ml-1 text-xs" />
              </Link>
            </div>

            <div className="space-y-3">
              {topEmployers.map((company) => (
                <motion.div
                  key={company.companyId || company._id}
                  whileHover={{ x: 5 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
                >
                  <img
                    src={company.companyLogo || DEFAULT_LOGO}
                    alt={company.nameCompany}
                    className="w-10 h-10 rounded-full object-cover mr-3 bg-white border"
                  />

                  <Link
                    to={`/jobs?companyId=${company.companyId}`}
                    className="text-gray-700 hover:text-blue-600 flex items-center w-full min-w-0"
                  >
                    <span className="truncate flex-1 font-medium">
                      {company.nameCompany}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {!topEmployers.length && (
                <p className="text-sm text-gray-500">No employers found.</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link
                to="/jobs"
                className="flex items-center justify-center text-primary font-semibold hover:text-secondary transition-colors"
              >
                <FaPlusCircle className="mr-2" /> Browse All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCategory;
