import React, { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaBriefcase,
  FaTimes,
  FaEye,
  FaIndustry,
  FaBuilding,
} from "react-icons/fa";

const SeekerShortlisted = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [shortlistedJobs, setShortlistedJobs] = useState([
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Banglalink Digital",
      location: "Dhaka, Bangladesh",
      expectedSalary: "৳120,000 - ৳150,000",
      appliedDate: "2024-01-10",
      shortlistedDate: "2024-01-18",
      interviewDate: "2024-01-25",
      notes: "Technical interview with team lead",
      companyLogo: "bg-blue-100",
      isActive: true,
      industry: "Telecommunications",
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Pathao",
      location: "Dhaka, Bangladesh",
      expectedSalary: "৳80,000 - ৳110,000",
      appliedDate: "2024-01-05",
      shortlistedDate: "2024-01-12",
      interviewDate: null,
      notes: "React.js specialist position",
      companyLogo: "bg-green-100",
      isActive: true,
      industry: "Transport & Logistics",
    },
    {
      id: 3,
      title: "Backend Engineer (Node.js)",
      company: "ShopUp",
      location: "Dhaka, Bangladesh",
      expectedSalary: "৳90,000 - ৳130,000",
      appliedDate: "2024-01-15",
      shortlistedDate: "2024-01-22",
      interviewDate: "2024-01-30",
      notes: "Final technical round",
      companyLogo: "bg-purple-100",
      isActive: true,
      industry: "E-commerce",
    },
    {
      id: 4,
      title: "UX/UI Designer",
      company: "Grameenphone",
      location: "Dhaka, Bangladesh",
      expectedSalary: "৳70,000 - ৳100,000",
      appliedDate: "2024-01-08",
      shortlistedDate: "2024-01-20",
      interviewDate: null,
      notes: "Design system implementation",
      companyLogo: "bg-red-100",
      isActive: true,
      industry: "Telecommunications",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "bKash Limited",
      location: "Dhaka, Bangladesh",
      expectedSalary: "৳110,000 - ৳140,000",
      appliedDate: "2024-01-12",
      shortlistedDate: "2024-01-25",
      interviewDate: null,
      notes: "AWS infrastructure management",
      companyLogo: "bg-yellow-100",
      isActive: true,
      industry: "FinTech",
    },
    {
      id: 6,
      title: "Product Manager",
      company: "Daraz Bangladesh",
      location: "Dhaka, Bangladesh",
      expectedSalary: "৳150,000 - ৳200,000",
      appliedDate: "2024-01-20",
      shortlistedDate: "2024-01-28",
      interviewDate: "2024-02-05",
      notes: "E-commerce product development",
      companyLogo: "bg-indigo-100",
      isActive: true,
      industry: "E-commerce",
    },
    {
      id: 7,
      title: "Data Analyst",
      company: "Nagad",
      location: "Dhaka, Bangladesh",
      expectedSalary: "৳65,000 - ৳90,000",
      appliedDate: "2024-01-18",
      shortlistedDate: "2024-01-26",
      interviewDate: null,
      notes: "Financial data analysis",
      companyLogo: "bg-teal-100",
      isActive: true,
      industry: "FinTech",
    },
    {
      id: 8,
      title: "Mobile App Developer",
      company: "Chaldal",
      location: "Dhaka, Bangladesh",
      expectedSalary: "৳85,000 - ৳115,000",
      appliedDate: "2024-01-22",
      shortlistedDate: "2024-01-30",
      interviewDate: "2024-02-10",
      notes: "Flutter development position",
      companyLogo: "bg-orange-100",
      isActive: true,
      industry: "E-commerce",
    },
  ]);

  const filteredJobs = shortlistedJobs.filter((job) => {
    if (!job.isActive) return false;

    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.industry.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <nav className="text-sm text-gray-600 mb-2">
                <span className="hover:text-green-600 cursor-pointer">
                  Home
                </span>
                <span className="mx-2">/</span>
                <span className="text-green-600 font-medium">
                  Shortlisted Jobs
                </span>
              </nav>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Profile Shortlisted Jobs
              </h1>
              <p className="text-gray-600 mt-1">
                Jobs where employers have shortlisted your profile
              </p>
            </div>

            <div className="w-full md:w-auto">
              <div className="relative md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, companies or industries..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaTimes className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Shortlisted</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {shortlistedJobs.filter((j) => j.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaStar className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interview Scheduled</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      shortlistedJobs.filter(
                        (j) => j.interviewDate && j.isActive,
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaClock className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Companies</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {
                      [
                        ...new Set(
                          shortlistedJobs
                            .filter((j) => j.isActive)
                            .map((j) => j.company),
                        ),
                      ].length
                    }
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaBuilding className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="divide-y divide-gray-100">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const daysUntilInterview = job.interviewDate
                  ? getDaysUntil(job.interviewDate)
                  : null;

                return (
                  <div
                    key={job.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div
                            className={`${job.companyLogo} p-3 rounded-lg shrink-0`}
                          >
                            <FaBriefcase className="text-gray-700 text-lg" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start gap-3 mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {job.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
                                    <FaStar
                                      className="text-green-600"
                                      size={10}
                                    />
                                    Profile Shortlisted
                                  </span>
                                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                    {job.industry}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-1">
                                <FaBuilding className="text-gray-400" />
                                <span className="font-medium">
                                  {job.company}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-green-600" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaIndustry className="text-gray-400" />
                                <span>{job.industry}</span>
                              </div>
                            </div>

                            {/* Expected Salary */}
                            <div className="mb-4">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">
                                  Expected Salary:
                                </span>
                                <span className="text-lg font-bold text-green-700">
                                  {job.expectedSalary}
                                </span>
                              </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    Applied Date
                                  </p>
                                  <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-400" />
                                    {formatDate(job.appliedDate)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    Shortlisted Date
                                  </p>
                                  <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                                    <FaStar className="text-green-600" />
                                    {formatDate(job.shortlistedDate)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    {job.interviewDate
                                      ? "Interview Date"
                                      : "Interview Status"}
                                  </p>
                                  <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
                                    <FaClock className="text-blue-600" />
                                    {job.interviewDate
                                      ? formatDate(job.interviewDate)
                                      : "Awaiting Schedule"}
                                    {daysUntilInterview &&
                                      daysUntilInterview > 0 && (
                                        <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                          in {daysUntilInterview} days
                                        </span>
                                      )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            {job.notes && (
                              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium text-blue-800">
                                    Note from Employer:{" "}
                                  </span>
                                  {job.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:w-64">
                        <div className="bg-gray-50 rounded-lg p-4 h-full">
                          <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                            <FaStar className="text-green-600" />
                            Application Status
                          </h4>

                          <div className="space-y-4">
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="p-1 bg-green-100 rounded">
                                  <FaStar
                                    className="text-green-600"
                                    size={14}
                                  />
                                </div>
                                <span className="text-sm font-medium text-green-800">
                                  Profile Shortlisted
                                </span>
                              </div>
                              <p className="text-xs text-green-700">
                                Your profile has been selected by the employer
                                for further consideration.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Next Step:
                                </span>
                                <span className="text-sm font-medium text-blue-600">
                                  {job.interviewDate ? "Interview" : "Review"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Location:
                                </span>
                                <span className="text-sm font-medium text-gray-800">
                                  Bangladesh
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                            <button className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                              <FaEye />
                              View Details
                            </button>
                            {/* <button className="w-full py-2.5 px-4 border border-green-600 text-green-600 hover:bg-green-50 font-medium rounded-lg transition-colors">
                              Update Profile
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaStar className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {searchQuery
                    ? "No matching jobs found"
                    : "No profile shortlisted jobs yet"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "Your profile needs to be shortlisted by employers in Bangladesh to appear here."}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <span className="text-sm text-blue-700">
                    All jobs shown are from Bangladesh
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerShortlisted;
