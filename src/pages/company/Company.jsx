import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaBriefcase, FaSearch, FaBuilding } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useJobStore from "../../store/JobStore";

const getCompanyId = (company) =>
  company.companyId || company._id || company.id;

const getCompanyName = (company) =>
  company.nameCompany ||
  company.companyName ||
  company.name ||
  "Unknown Company";

const getCompanyLogo = (company) => {
  const name = getCompanyName(company);

  return (
    company.companyLogo ||
    company.logo ||
    company.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=4f46e5&color=fff&bold=true`
  );
};

const Company = () => {
  const navigate = useNavigate();

  const { companies, jobs, fetchCompanies, fetchJobs, isLoading } =
    useJobStore();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanies();

    fetchJobs({
      page: 1,
      limit: 200,
      sortBy: "createdAt",
      order: "desc",
    });
  }, [fetchCompanies, fetchJobs]);

  const jobCountByCompany = useMemo(() => {
    const map = {};

    jobs.forEach((job) => {
      const companyId =
        job.companyId ||
        job.raw?.companyId?.companyId ||
        job.raw?.companyId?._id ||
        job.raw?.companyId;

      const companyName = job.company;

      if (companyId) {
        map[companyId] = (map[companyId] || 0) + 1;
      }

      if (companyName) {
        map[companyName.toLowerCase()] =
          (map[companyName.toLowerCase()] || 0) + 1;
      }
    });

    return map;
  }, [jobs]);

  const processedCompanies = useMemo(() => {
    return companies.map((company) => {
      const id = getCompanyId(company);
      const name = getCompanyName(company);

      return {
        id,
        name,
        logo: getCompanyLogo(company),
        totalJobs:
          jobCountByCompany[id] || jobCountByCompany[name.toLowerCase()] || 0,
      };
    });
  }, [companies, jobCountByCompany]);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return processedCompanies;

    return processedCompanies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, processedCompanies]);

  const totalOpenJobs = processedCompanies.reduce(
    (sum, company) => sum + Number(company.totalJobs || 0),
    0,
  );

  const handleCompanyClick = (company) => {
    navigate(`/jobs?companyId=${company.id}`);
  };

  if (isLoading && companies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#4EB956] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600 font-medium text-lg">
            Loading companies...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center justify-center w-18 h-18 rounded-3xl bg-[#4EB956]/10 text-[#4EB956] mb-5 shadow-sm">
            <FaBuilding className="text-3xl" />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-3 tracking-tight">
            Explore Companies
          </h1>

          <p className="text-gray-500 text-sm md:text-lg">
            {processedCompanies.length} Companies • {totalOpenJobs} Active Job
            Posts
          </p>
        </div>

        <div className="mb-8 md:mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

            <input
              type="text"
              placeholder="Search company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4EB956]/30 focus:border-[#4EB956] shadow-sm text-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-7">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id || company.name}
              initial={{ opacity: 0, scale: 0.92, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.025 }}
              whileHover={{ y: -8, scale: 1.03 }}
              onClick={() => handleCompanyClick(company)}
              className="relative bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1E2558] via-[#3949ab] to-[#4EB956]" />

              <div className="flex justify-center mb-5">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 shadow-inner flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.currentTarget.onerror = null;

                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        company.name,
                      )}&background=4f46e5&color=fff&bold=true`;
                    }}
                  />
                </div>
              </div>

              <h3 className="text-center font-bold text-gray-800 text-sm md:text-base mb-4 line-clamp-2 min-h-[44px] group-hover:text-[#4EB956] transition-colors">
                {company.name}
              </h3>

              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4EB956]/10 text-[#4EB956] shadow-sm">
                  <FaBriefcase className="text-sm" />

                  <span className="text-sm md:text-base font-extrabold">
                    {company.totalJobs}
                  </span>

                  <span className="text-xs md:text-sm font-medium">
                    Job Posts
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-300 text-6xl mb-4">🏢</div>

            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No Companies Found
            </h3>

            <p className="text-gray-500">
              Try searching with another company name
            </p>
          </div>
        )}

        {filteredCompanies.length > 0 && (
          <div className="mt-10 text-center text-gray-500 text-sm md:text-base">
            Showing{" "}
            <span className="font-bold text-[#1E2558]">
              {filteredCompanies.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#4EB956]">
              {processedCompanies.length}
            </span>{" "}
            companies
          </div>
        )}
      </div>
    </div>
  );
};

export default Company;
