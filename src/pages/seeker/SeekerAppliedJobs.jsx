import React, { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
  FaBuilding,
  FaBriefcase,
  FaFilter,
  FaTimes,
  FaClock,
  FaHourglassHalf,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SeekerAppliedJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [appliedJobs, setAppliedJobs] = useState([
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      appliedDate: "2024-01-15",
      expectedSalary: "$120,000 - $150,000",
      profileViews: 0,
      status: "pending",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Creative Minds Inc.",
      location: "Remote",
      appliedDate: "2024-01-12",
      expectedSalary: "$90,000 - $110,000",
      profileViews: 2,
      status: "under_review",
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataSystems LLC",
      location: "New York, NY",
      appliedDate: "2024-01-10",
      expectedSalary: "$130,000 - $160,000",
      profileViews: 4,
      status: "under_review",
    },
    {
      id: 4,
      title: "Product Manager",
      company: "InnovateTech",
      location: "Austin, TX",
      appliedDate: "2024-01-08",
      expectedSalary: "$140,000 - $180,000",
      profileViews: 0,
      status: "pending",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudSystems",
      location: "Remote",
      appliedDate: "2024-01-18",
      expectedSalary: "$115,000 - $140,000",
      profileViews: 2,
      status: "under_review",
    },
    {
      id: 6,
      title: "Data Scientist",
      company: "Analytics Pro",
      location: "Boston, MA",
      appliedDate: "2024-01-20",
      expectedSalary: "$125,000 - $155,000",
      profileViews: 0,
      status: "pending",
    },
    {
      id: 7,
      title: "Mobile Developer",
      company: "AppMasters",
      location: "Seattle, WA",
      appliedDate: "2024-01-14",
      expectedSalary: "$100,000 - $130,000",
      profileViews: 2,
      status: "under_review",
    },
  ]);

  const filteredJobs = appliedJobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || job.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case "under_review":
        return {
          text: "Under Review",
          color: "bg-yellow-100 text-yellow-800",
          icon: <FaHourglassHalf className="text-yellow-600" />,
        };
      case "pending":
        return {
          text: "Pending",
          color: "bg-blue-100 text-blue-800",
          icon: <FaClock className="text-blue-600" />,
        };
      default:
        return {
          text: "Applied",
          color: "bg-gray-100 text-gray-800",
          icon: <FaClock className="text-gray-600" />,
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTotalProfileViews = () => {
    return appliedJobs.reduce((total, job) => total + job.profileViews, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <nav className="text-sm text-gray-600 mb-2">
                <Link to="/" className="hover:text-green-600 cursor-pointer">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span className="text-green-600 font-medium">Applied Jobs</span>
              </nav>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Applied Jobs
              </h1>
              <p className="text-gray-600 mt-1">
                Track all your job applications
              </p>
            </div>

            {/* Search and Filter */}
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs or companies..."
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

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {appliedJobs.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaBriefcase className="text-secondary text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Profile Views</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {getTotalProfileViews()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaEye className="text-secondary text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Companies Applied</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {[...new Set(appliedJobs.map((j) => j.company))].length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaBuilding className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applied Jobs List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {searchQuery || filterStatus !== "all"
                  ? `Filtered Results (${filteredJobs.length})`
                  : "All Applied Jobs"}
              </h2>
              <div className="text-sm text-gray-600">
                Showing {filteredJobs.length} of {appliedJobs.length}{" "}
                applications
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const statusInfo = getStatusInfo(job.status);

                return (
                  <div
                    key={job.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="p-3 bg-gray-100 rounded-lg">
                              <FaBriefcase className="text-gray-700 text-lg" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start gap-3 mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800 hover:text-secondary cursor-pointer mb-1">
                                  {job.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-3">
                                  <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color} flex items-center gap-1`}
                                  >
                                    {statusInfo.icon}
                                    {statusInfo.text}
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
                                <FaMapMarkerAlt className="text-gray-400" />
                                <span>{job.location}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Applied Date
                                  </p>
                                  <p className="text-sm font-medium text-gray-800">
                                    {formatDate(job.appliedDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaMoneyBillWave className="text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Expected Salary
                                  </p>
                                  <p className="text-sm font-medium text-green-700">
                                    {job.expectedSalary}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Profile Views */}
                      <div className="lg:w-48">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <FaEye className="text-secondary" />
                              <span className="text-sm font-medium text-gray-700">
                                Profile Views
                              </span>
                            </div>
                            <div className="text-3xl font-bold text-secondary mb-1">
                              {job.profileViews}
                            </div>
                            <p className="text-xs text-gray-500">
                              times employer viewed your profile
                            </p>
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
                  <FaBriefcase className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {searchQuery || filterStatus !== "all"
                    ? "No matching applications found"
                    : "No applications yet"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start applying to jobs to see them listed here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerAppliedJobs;
