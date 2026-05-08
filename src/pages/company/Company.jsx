import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaSearch,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaBuilding,
} from "react-icons/fa";
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
        email: company.emailCompany || company.email || "",
        phone: company.phoneCompany || company.phone || "",
        website: company.website || "",
        address: company.address || company.companyAddress || "",
        description: company.description || company.companyDescription || "",
        totalJobs:
          jobCountByCompany[id] || jobCountByCompany[name.toLowerCase()] || 0,
        raw: company,
      };
    });
  }, [companies, jobCountByCompany]);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return processedCompanies;

    const term = searchTerm.toLowerCase();

    return processedCompanies.filter((company) => {
      return (
        company.name.toLowerCase().includes(term) ||
        company.email.toLowerCase().includes(term) ||
        company.phone.toLowerCase().includes(term) ||
        company.address.toLowerCase().includes(term) ||
        company.website.toLowerCase().includes(term)
      );
    });
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4EB956] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4EB956]/10 text-[#4EB956] mb-4">
            <FaBuilding className="text-3xl" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Companies
          </h1>

          <p className="text-gray-600">
            {processedCompanies.length} companies • {totalOpenJobs} open
            positions
          </p>
        </div>

        <div className="mb-6 md:mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search companies by name, email, phone, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4EB956]/30 focus:border-[#4EB956] shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id || company.name}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => handleCompanyClick(company)}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  whileHover={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        company.name,
                      )}&background=4f46e5&color=fff&bold=true`;
                    }}
                  />
                </motion.div>
              </div>

              <h3 className="text-center font-bold text-gray-800 text-sm md:text-base mb-2 line-clamp-2 min-h-[40px] group-hover:text-[#4EB956] transition-colors">
                {company.name}
              </h3>

              <div className="flex items-center justify-center gap-1 text-xs md:text-sm mb-3">
                <FaBriefcase className="text-[#4EB956]" />

                <span className="font-bold text-[#4EB956]">
                  {company.totalJobs}
                </span>

                <span className="text-gray-500">jobs</span>
              </div>

              <div className="space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
                {company.email && (
                  <div className="flex items-center gap-2 min-w-0">
                    <FaEnvelope className="text-gray-400 shrink-0" />
                    <span className="truncate">{company.email}</span>
                  </div>
                )}

                {company.phone && (
                  <div className="flex items-center gap-2 min-w-0">
                    <FaPhone className="text-gray-400 shrink-0" />
                    <span className="truncate">{company.phone}</span>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-center gap-2 min-w-0">
                    <FaGlobe className="text-gray-400 shrink-0" />
                    <span className="truncate">{company.website}</span>
                  </div>
                )}

                {company.address && (
                  <div className="flex items-center gap-2 min-w-0">
                    <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                    <span className="truncate">{company.address}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="w-full mt-4 py-2 rounded-xl text-sm font-semibold bg-[#1E2558]/5 text-[#1E2558] group-hover:bg-[#4EB956] group-hover:text-white transition-all"
              >
                View Jobs
              </button>
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
            Showing {filteredCompanies.length} of {processedCompanies.length}{" "}
            companies
          </div>
        )}
      </div>
    </div>
  );
};

export default Company;
