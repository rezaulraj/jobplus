import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBusinessTime,
  FaLaptopCode,
  FaIndustry,
  FaServicestack,
  FaUsers,
  FaPlane,
  FaGraduationCap,
  FaPhone,
  FaBriefcase,
  FaBuilding,
  FaHandHoldingHeart,
  FaShoppingCart,
  FaHome,
  FaHospital,
  FaHeadset,
  FaTools,
  FaMoneyBill,
  FaHardHat,
  FaShippingFast,
  FaPlusCircle,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaCode,
  FaUserTie,
  FaSearch,
  FaCalculator,
  FaChartBar,
  FaFileContract,
  FaPencilAlt,
  FaRobot,
  FaNetworkWired,
  FaDatabase,
  FaMobileAlt,
  FaShieldAlt,
  FaProjectDiagram,
} from "react-icons/fa";
import { MdOutlineDesignServices } from "react-icons/md";
import { GrDatabase } from "react-icons/gr";
import { AiFillNotification } from "react-icons/ai";
import { Link } from "react-router-dom";
import jobData from "../../data/jobData.json";

const JobCategory = () => {
  const [activeTab, setActiveTab] = useState("industry");
  const [actualCompanies, setActualCompanies] = useState([]);
  const [actualLocations, setActualLocations] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Calculate function
  const calculateFunctionCount = () => {
    const functionMap = {};

    jobData.forEach((job) => {
      if (job.subCategory) {
        functionMap[job.subCategory] = (functionMap[job.subCategory] || 0) + 1;
      }
    });

    const getFunctionIcon = (funcName) => {
      const iconMap = {
        Accounting: <FaCalculator />,
        Finance: <FaChartBar />,
        Sales: <FaUserTie />,
        Marketing: <AiFillNotification />,
        "Software Developer": <FaCode />,
        "Web Developer": <FaLaptopCode />,
        "App Developer": <FaMobileAlt />,
        Networking: <FaNetworkWired />,
        Database: <FaDatabase />,
        Security: <FaShieldAlt />,
        "Information Technology": <FaLaptopCode />,
        "Project Management": <FaProjectDiagram />,
        Business: <FaBusinessTime />,
        "Business Development": <FaChartBar />,
        "Customer Service": <FaHeadset />,
        Service: <FaServicestack />,
        HR: <FaUsers />,
        Administration: <FaUsers />,
        Design: <MdOutlineDesignServices />,
        Architect: <MdOutlineDesignServices />,
        Law: <FaFileContract />,
        Education: <FaGraduationCap />,
        Training: <FaGraduationCap />,
        Medical: <FaHospital />,
        Healthcare: <FaHospital />,
        Engineering: <FaTools />,
        Electrical: <FaTools />,
        Mechanical: <FaTools />,
        Civil: <FaHardHat />,
        Audit: <FaSearch />,
        Tax: <FaMoneyBill />,
        Banking: <FaBuilding />,
      };

      return iconMap[funcName] || <FaBriefcase />;
    };

    return Object.entries(functionMap)
      .map(([name, count]) => ({
        name,
        count,
        icon: getFunctionIcon(name),
        path: name
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  // Get unique companies from jobData
  const getUniqueCompanies = () => {
    const companyMap = {};
    jobData.forEach((job) => {
      if (job.company) {
        companyMap[job.company] = (companyMap[job.company] || 0) + 1;
      }
    });

    return Object.entries(companyMap)
      .map(([name, count]) => ({
        name,
        count,
        path: name
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  };

  // Get unique locations from jobData
  const getUniqueLocations = () => {
    const locationMap = {};
    jobData.forEach((job) => {
      if (job.location) {
        let cleanLocation = job.location;
        if (cleanLocation.includes("(")) {
          cleanLocation = cleanLocation.split("(")[0].trim();
        }
        if (cleanLocation.includes("Dhaka")) {
          cleanLocation = "Dhaka";
        }
        locationMap[cleanLocation] = (locationMap[cleanLocation] || 0) + 1;
      }
    });

    return Object.entries(locationMap)
      .map(([name, count]) => ({
        name,
        count,
        path: name
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  useEffect(() => {
    setActualCompanies(getUniqueCompanies());
    setActualLocations(getUniqueLocations());
    setFunctions(calculateFunctionCount());
  }, []);

  const jobCategories = [
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
      vacancyCount: calculateVacancyCount("Importers/ Distributors/Exporters"),
      jobCount: calculateJobCount("Importers/ Distributors/Exporters"),
      icon: <FaShippingFast />,
      path: "importers-distributors-exporters",
    },
  ];

  const getDisplayCategories = () => {
    if (activeTab !== "industry") return jobCategories;

    if (isMobile && !showAllCategories) {
      return jobCategories.slice(0, 10);
    }
    return jobCategories;
  };

  const renderContent = () => {
    const displayCategories = getDisplayCategories();

    switch (activeTab) {
      case "industry":
        return (
          <div className="space-y-4 font-source">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {displayCategories.map((category) => (
                <motion.div
                  key={category.name}
                  whileHover={{ y: -2 }}
                  className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 group"
                >
                  <span className="text-gray-400 mr-3 text-lg shrink-0 group-hover:text-secondary">
                    {category.icon}
                  </span>
                  <Link
                    to={`/jobs/${category.path}`}
                    className="text-gray-700 group-hover:text-primary flex items-center font-lato w-full min-w-0"
                  >
                    <span className="truncate flex-1">{category.name}</span>
                    <div className="flex flex-col items-end ml-2 shrink-0">
                      <span className="text-xs text-gray-500">
                        {category.jobCount} jobs
                      </span>
                      <span className="text-xs font-medium text-secondary">
                        {category.vacancyCount} vacancies
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {(!isMobile || showAllCategories) && (
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
              )}
            </div>

            {isMobile && (
              <div className="flex justify-center mt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {showAllCategories ? (
                    <>
                      <FaChevronUp className="mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="mr-2" />
                      Show More Categories
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        );
      case "city":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-source">
            {actualLocations.map((location) => (
              <motion.div
                key={location.name}
                whileHover={{ y: -2 }}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 group"
              >
                <span className="text-gray-400 mr-3 text-lg group-hover:text-secondary">
                  <FaBuilding />
                </span>
                <Link
                  to={`/jobs?location=${location.path}`}
                  className="text-gray-700 group-hover:text-primary flex items-center w-full min-w-0"
                >
                  <span className="truncate flex-1">{location.name}</span>
                  <span className="text-gray-500 ml-1 shrink-0">
                    ({location.count})
                  </span>
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
                All Locations
              </Link>
            </motion.div>
          </div>
        );
      case "company":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-source">
            {actualCompanies.map((company) => (
              <motion.div
                key={company.name}
                whileHover={{ y: -2 }}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 group"
              >
                <span className="text-gray-400 mr-3 text-lg group-hover:text-secondary">
                  <FaBriefcase />
                </span>
                <Link
                  to={`/jobs?search=${encodeURIComponent(company.name)}`}
                  className="text-gray-700 group-hover:text-primary flex items-center w-full min-w-0"
                >
                  <span className="truncate flex-1">{company.name}</span>
                  <span className="text-gray-500 ml-1 shrink-0">
                    ({company.count})
                  </span>
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
      case "function":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-source">
            {functions.map((func) => (
              <motion.div
                key={func.name}
                whileHover={{ y: -2 }}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 group"
              >
                <span className="text-gray-400 mr-3 text-lg group-hover:text-secondary">
                  {func.icon}
                </span>
                <Link
                  to={`/jobs?search=${encodeURIComponent(func.name)}`}
                  className="text-gray-700 group-hover:text-primary flex items-center w-full min-w-0"
                >
                  <span className="truncate flex-1">{func.name}</span>
                  <span className="text-gray-500 ml-1 shrink-0">
                    ({func.count})
                  </span>
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
                All Functions
              </Link>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: "industry", label: "By Industry" },
    { id: "city", label: "By Location" },
    { id: "company", label: "By Company" },
    { id: "function", label: "By Function" },
  ];

  const totalJobs = jobData.length;
  const totalVacancies = jobData.reduce(
    (sum, job) => sum + (Number(job.vacancy) || 0),
    0
  );

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
                Showing {totalJobs} jobs with {totalVacancies} vacancies from{" "}
                {actualCompanies.length} companies
              </p>
            </div>
            <div className="flex flex-wrap border-b border-gray-200 mb-6 -mx-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== "industry") {
                      setShowAllCategories(false);
                    }
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
                {renderContent()}
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
              {actualCompanies.slice(0, 6).map((company) => (
                <motion.div
                  key={company.name}
                  whileHover={{ x: 5 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                    <FaBuilding className="text-gray-400 text-sm group-hover:text-secondary" />
                  </div>
                  <Link
                    to={`/jobs?search=${encodeURIComponent(company.name)}`}
                    className="text-gray-700 hover:text-blue-600 flex items-center w-full min-w-0"
                  >
                    <span className="truncate flex-1">{company.name}</span>
                    <span className="text-gray-400 text-xs ml-2 shrink-0">
                      {company.count}
                    </span>
                  </Link>
                </motion.div>
              ))}
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
