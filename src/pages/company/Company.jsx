import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBuilding, FaBriefcase, FaSearch } from "react-icons/fa";
import jobData from "../../data/jobData.json";

const processCompanyData = () => {
  const companyMap = new Map();

  jobData.forEach((job) => {
    if (!companyMap.has(job.company)) {
      companyMap.set(job.company, {
        name: job?.company,
        logo:
          job?.clogo ||
          `https://ui-avatars.com/api/?name=${job.company}&background=4f46e5&color=fff&bold=true`,
        totalJobs: 0,
      });
    }

    const company = companyMap.get(job.company);
    company.totalJobs += 1;
  });

  return Array.from(companyMap.values());
};

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const processed = processCompanyData();
    setCompanies(processed);
    setFilteredCompanies(processed);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
      return;
    }

    const result = companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(result);
  }, [searchTerm, companies]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Companies
          </h1>
          <p className="text-gray-600">
            {companies.length} companies •{" "}
            {companies.reduce((sum, c) => sum + c.totalJobs, 0)} open positions
          </p>
        </div>

        <div className="mb-6 md:mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
            >
              <div className="flex justify-center mb-3">
                <motion.div
                  whileHover={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-white shadow-md"
                >
                  <img
                    src={company?.logo}
                    alt={company.name}
                    className="w-full h-full object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=4f46e5&color=fff&bold=true`;
                    }}
                  />
                </motion.div>
              </div>

              <h3 className="text-center font-semibold text-gray-800 text-sm md:text-base mb-2 truncate group-hover:text-blue-600 transition-colors">
                {company.name}
              </h3>

              <div className="flex items-center justify-center gap-1 text-xs md:text-sm">
                <FaBriefcase className="text-blue-500" />
                <span className="font-bold text-blue-600">
                  {company.totalJobs}
                </span>
                <span className="text-gray-500">jobs</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No companies found
            </h3>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        )}

        {filteredCompanies.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredCompanies.length} of {companies.length} companies
          </div>
        )}
      </div>
    </div>
  );
};

export default Company;
