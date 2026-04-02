import React, { useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaShareAlt,
  FaTrash,
  FaBookmark,
  FaBuilding,
  FaBriefcase,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SeekerSaveJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [savedJobs, setSavedJobs] = useState([
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      postedDate: "2024-01-15",
      deadline: "2024-02-15",
      logoColor: "bg-blue-100",
      isActive: true,
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Creative Minds Inc.",
      location: "Remote",
      postedDate: "2024-01-20",
      deadline: "2024-03-01",
      logoColor: "bg-purple-100",
      isActive: true,
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataSystems LLC",
      location: "New York, NY",
      postedDate: "2024-01-10",
      deadline: "2024-01-31",
      logoColor: "bg-green-100",
      isActive: true,
    },
    {
      id: 4,
      title: "Product Manager",
      company: "InnovateTech",
      location: "Austin, TX",
      postedDate: "2024-01-18",
      deadline: "2024-02-28",
      logoColor: "bg-yellow-100",
      isActive: true,
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudSystems",
      location: "Remote",
      postedDate: "2024-01-22",
      deadline: "2024-03-15",
      logoColor: "bg-indigo-100",
      isActive: true,
    },
  ]);

  const filteredJobs = savedJobs.filter((job) => {
    if (!searchQuery) return job.isActive;

    const query = searchQuery.toLowerCase();
    if (filterType === "company") {
      return job.company.toLowerCase().includes(query) && job.isActive;
    } else if (filterType === "title") {
      return job.title.toLowerCase().includes(query) && job.isActive;
    } else {
      return (
        (job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query)) &&
        job.isActive
      );
    }
  });

  const handleDeleteJob = (jobId) => {
    setSavedJobs(
      savedJobs.map((job) =>
        job.id === jobId ? { ...job, isActive: false } : job,
      ),
    );
    setShowDeleteConfirm(null);
  };

  const handleShareJob = (job) => {
    const shareText = `Check out this job: ${job.title} at ${job.company}`;
    navigator.clipboard.writeText(shareText);
    alert("Job link copied to clipboard!");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const daysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : "Expired";
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
                <span className="text-green-600 font-medium">Saved Jobs</span>
              </nav>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Saved Jobs
              </h1>
              <p className="text-gray-600 mt-1">Your saved job opportunities</p>
            </div>

            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search company or job title..."
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

                {/* Filter */}
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All</option>
                    <option value="company">Company</option>
                    <option value="title">Job Title</option>
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
                  <p className="text-sm text-gray-600">Total Saved</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {savedJobs.filter((j) => j.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaBookmark className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredJobs.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaBriefcase className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Companies</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {
                      [
                        ...new Set(
                          savedJobs
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

        {/* Jobs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {searchQuery
                ? `Search Results (${filteredJobs.length})`
                : "All Saved Jobs"}
            </h2>
          </div>

          {/* Jobs */}
          <div className="divide-y divide-gray-100">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className={`${job.logoColor} p-3 rounded-lg`}>
                          <FaBriefcase className="text-gray-700 text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600 cursor-pointer mb-2">
                            {job.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <FaBuilding className="text-gray-400" />
                              <span className="font-medium">{job.company}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-gray-400" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dates and Actions */}
                    <div className="lg:text-right">
                      <div className="flex flex-col gap-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 lg:justify-end">
                            <FaClock className="text-gray-400" size={14} />
                            <span className="text-sm text-gray-600">
                              Posted: {formatDate(job.postedDate)}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-2 lg:justify-end ${
                              daysRemaining(job.deadline) === "Expired"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            <FaCalendarAlt className="text-current" size={14} />
                            <span className="text-sm">
                              Deadline: {formatDate(job.deadline)}
                              <span className="ml-2 font-medium">
                                ({daysRemaining(job.deadline)})
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 lg:justify-end">
                          <button
                            onClick={() => handleShareJob(job)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Share job"
                          >
                            <FaShareAlt />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(job.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from saved"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {showDeleteConfirm === job.id && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <FaTrash className="text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              Remove from Saved Jobs?
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              This will remove "{job.title}" from your saved
                              jobs.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaBookmark className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {searchQuery ? "No jobs found" : "No saved jobs yet"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchQuery
                    ? "Try adjusting your search or filter to find what you're looking for."
                    : "Start saving jobs that interest you by clicking the bookmark icon on job listings."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaClock className="text-green-600" />
              </div>
              <h4 className="font-medium text-gray-800">Track Deadlines</h4>
            </div>
            <p className="text-sm text-gray-600">
              Keep an eye on application deadlines to never miss an opportunity.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaBookmark className="text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-800">Stay Organized</h4>
            </div>
            <p className="text-sm text-gray-600">
              Save jobs you're interested in and track them all from one place.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaShareAlt className="text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-800">Share Opportunities</h4>
            </div>
            <p className="text-sm text-gray-600">
              Share interesting job opportunities with friends using the share
              button.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerSaveJobs;
