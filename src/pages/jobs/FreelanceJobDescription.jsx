import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import freelanceJobData from "../../data/freelanceJob.json";
import {
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Building,
  CheckCircle,
  Clock,
  Users,
  Award,
  Star,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Heart,
  Share2,
  FileText,
  TrendingUp,
  Tag,
  ArrowLeft,
  Bookmark,
} from "lucide-react";
// import ApplyPopUps from "./ApplyPopUps";

const FreelanceJobDescription = () => {
  // Get job ID from URL
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  // apply states
  // const [showApplyPopup, setShowApplyPopup] = useState(false);
  // const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  // const handleApplyClick = (job) => {
  //   setSelectedJobForApply(job);
  //   setShowApplyPopup(true);
  // };

  // Parse job ID from URL
  useEffect(() => {
    if (jobId) {
      // Extract numeric ID from URL (e.g., "web-developer-needed-1" -> 1)
      const extractedId = parseInt(jobId.split("-").pop());
      const job = freelanceJobData.find((j) => j.id === extractedId);

      if (job) {
        setSelectedJob(job);
      } else {
        // Fallback to first job if not found
        setSelectedJob(freelanceJobData[0]);
      }
    } else {
      // Default to first job if no ID in URL
      setSelectedJob(freelanceJobData[0]);
    }
    setLoading(false);
  }, [jobId]);

  const colors = {
    primary: "#1e40af",
    secondary: "#059669",
    accent: "#f59e0b",
    lightPrimary: "rgba(30, 64, 175, 0.1)",
    lightSecondary: "rgba(5, 150, 105, 0.1)",
    lightAccent: "rgba(245, 158, 11, 0.1)",
    border: "#e5e7eb",
    bgLight: "#f9fafb",
  };

  // Format rate display
  const formatRate = (rate) => {
    if (!rate) return "Negotiable";
    if (rate.includes("/hour")) {
      return rate;
    }
    if (rate.includes("৳")) {
      return rate;
    }
    return `$${rate}/hour`;
  };

  // Calculate estimated earnings
  const calculateEarnings = (rate, duration) => {
    if (!rate || !duration) return "Negotiable";
    if (rate.includes("/hour")) {
      const hourlyRate = parseInt(rate.replace(/\D/g, "")) || 10;
      const hours = duration.includes("week")
        ? parseInt(duration) * 20
        : parseInt(duration) * 160;
      return `৳${(hourlyRate * hours).toLocaleString()}`;
    }
    return rate;
  };

  // Toggle save job
  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId],
    );
  };

  // Get related jobs (excluding current selected)
  const relatedJobs = freelanceJobData
    .filter((job) => job.id !== selectedJob?.id)
    .slice(0, 4);

  // Get similar skills jobs
  const similarJobs = freelanceJobData
    .filter(
      (job) =>
        job.id !== selectedJob?.id &&
        job.skills?.some((skill) => selectedJob?.skills?.includes(skill)),
    )
    .slice(0, 3);

  // Function to create job URL
  const getJobUrl = (job) => {
    const slug = job.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);
    return `/freelance/${slug}-${job.id}`;
  };

  // Handle navigation to job
  const handleJobNavigation = (job) => {
    const url = getJobUrl(job);
    navigate(url);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/freelance-jobs")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-ubuntu">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-secondary cursor-pointer mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>

        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-secondary">
              Home
            </Link>
            {/* <ChevronRight className="w-4 h-4" /> */}
            {/* <Link to="/freelance-jobs" className="hover:text-secondary">
              Freelance Jobs
            </Link> */}
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {selectedJob.title}
            </span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - 80% Job Description */}
          <div className="lg:w-4/5 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {selectedJob.title}
                      </h1>
                      {selectedJob.isFeatured && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-gray-800">
                          {selectedJob.company}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          {selectedJob.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Posted 2 days ago</span>
                      </div>
                    </div>

                    {/* Rate and Duration */}
                    <div className="flex flex-wrap items-center gap-6 mb-6">
                      <div className="bg-emerald-50 border border-gray-900 rounded-lg p-4">
                        <div className="text-sm text-gray-900 mb-1">
                          Hourly Rate
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatRate(selectedJob.rate)}
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-gray-900 rounded-lg p-4">
                        <div className="text-sm text-gray-900 mb-1">
                          Project Duration
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedJob.duration || "Flexible"}
                        </div>
                      </div>
                      <div className="bg-gray-100 border border-orange-200 rounded-lg p-4">
                        <div className="text-sm text-gray-900 mb-1">
                          Estimated Earnings
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {calculateEarnings(
                            selectedJob.rate,
                            selectedJob.duration,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => toggleSaveJob(selectedJob.id)}
                      className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                        savedJobs.includes(selectedJob.id)
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          savedJobs.includes(selectedJob.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      {savedJobs.includes(selectedJob.id)
                        ? "Saved"
                        : "Save Job"}
                    </button>
                    <button
                      // onClick={() => handleApplyClick(selectedJob)}
                      className="px-6 py-3 bg-secondary text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Apply Now
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="space-y-8">
                {/* Project Overview */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-gray-500" />
                    Project Overview
                  </h2>
                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    <p className="text-lg mb-4">{selectedJob.description}</p>

                    {selectedJob.details && (
                      <div className="space-y-4">
                        {selectedJob.details.map((detail, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                    <Award className="w-6 h-6 text-gray-500" />
                    Required Skills & Expertise
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {selectedJob.skills?.map((skill, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full flex items-center gap-2"
                      >
                        <Tag className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-800">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Scope */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-gray-500" />
                    Project Scope & Deliverables
                  </h2>
                  <div className="space-y-4">
                    {selectedJob.scope?.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 text-gray-500 rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <h4 className="font-semibold text-gray-800">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-gray-600 ml-11">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Information */}
                {selectedJob.client && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      About the Client
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">
                          {selectedJob.client.company}
                        </span>
                      </div>
                      {selectedJob.client.rating && (
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <span className="text-gray-700">
                            {selectedJob.client.rating} rating (
                            {selectedJob.client.reviews} reviews)
                          </span>
                        </div>
                      )}
                      {selectedJob.client.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">
                            {selectedJob.client.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 20% Related Data */}
          <div className="lg:w-1/5 space-y-6">
            {/* Similar Jobs */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-500" />
                Similar Projects
              </h3>
              <div className="space-y-4">
                {similarJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleJobNavigation(job)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
                      {job.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-medium">
                        {formatRate(job.rate)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {job.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-secondary rounded-xl shadow-lg p-6 text-gray-900">
              <h3 className="text-lg font-bold mb-4">Project Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Proposals</span>
                  <span className="font-bold">12 Received</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Interviewing</span>
                  <span className="font-bold">3 Candidates</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Last Viewed</span>
                  <span className="font-bold">2 hours ago</span>
                </div>
                <div className="pt-4 border-t border-gray-900">
                  <div className="text-center text-gray-900 text-sm mb-2">
                    Project Activity
                  </div>
                  <div className="w-full bg-primary rounded-full h-2">
                    <div
                      className="bg-purple-300 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Client Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold">
                    95%
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      Response Rate
                    </div>
                    <div className="text-sm text-gray-500">
                      Typically replies in 4 hours
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-secondary rounded-full flex items-center justify-center font-bold">
                    48h
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      Avg. Hire Time
                    </div>
                    <div className="text-sm text-gray-500">
                      Usually hires within 2 days
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Tips */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Pro Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Highlight relevant experience in your cover letter 0{" "}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Include portfolio links for similar projects
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Be specific about your availability
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    Ask clarifying questions about project scope
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Jobs Carousel */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              More Freelance Opportunities
            </h2>
            <button
              onClick={() => navigate("/freelance-jobs")}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 bg-transparent border-none cursor-pointer"
            >
              View all projects
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleJobNavigation(job)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-blue-600">
                      {job.title}
                    </h3>
                    {job.isFeatured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span className="text-sm">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{job.duration}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-primary font-bold text-lg mb-1">
                      {formatRate(job.rate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {calculateEarnings(job.rate, job.duration)} estimated
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills?.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 3 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJobNavigation(job);
                    }}
                    className="w-full py-2 bg-secondary cursor-pointer text-white font-medium rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* {showApplyPopup && selectedJobForApply && (
        <ApplyPopUps
          isOpen={showApplyPopup}
          onClose={() => {
            setShowApplyPopup(false);
            setSelectedJobForApply(null);
          }}
          jobTitle={selectedJobForApply.title}
          company={selectedJobForApply.company}
        />
      )} */}
    </div>
  );
};

export default FreelanceJobDescription;
