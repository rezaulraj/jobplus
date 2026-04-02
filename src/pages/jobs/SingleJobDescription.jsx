import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle,
  Heart,
  Share2,
  Award,
  User,
  Mail,
  Phone,
  Globe,
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Users,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import jobData from "../../data/jobData.json";
import seniorJobs from "../../data/senior.json";
// import ApplyPopUps from "./ApplyPopUps";

const SingleJobDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  // apply states
  // const [showApplyPopup, setShowApplyPopup] = useState(false);
  // const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  // const handleApplyClick = (job) => {
  //   setSelectedJobForApply(job);
  //   setShowApplyPopup(true);
  // };

  const colors = {
    primary: "#1e2558",
    secondary: "#4eb956",
    lightPrimary: "rgba(30, 37, 88, 0.1)",
    lightSecondary: "rgba(78, 185, 86, 0.1)",
    border: "#e2e8f0",
    bgLight: "#f8fafc",
    accent: "#3b82f6",
  };

  useEffect(() => {
    // Find the job by ID
    const foundJob = jobData.find((j) => j.id === parseInt(id));
    if (foundJob) {
      setJob(foundJob);

      // Find related jobs based on category
      const related = jobData
        .filter(
          (j) =>
            j.id !== foundJob.id &&
            (j.category === foundJob.category || j.company === foundJob.company)
        )
        .slice(0, 6);
      setRelatedJobs(related);
    }
  }, [id]);

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    if (salary.min === 0 && salary.max === 0 && salary.default) {
      return salary.default;
    }
    if (salary.min > 0 && salary.max > 0) {
      return `৳${salary.min.toLocaleString()} - ৳${salary.max.toLocaleString()}`;
    }
    if (salary.min > 0) {
      return `৳${salary.min.toLocaleString()}+`;
    }
    return "Negotiable";
  };

  // Calculate days ago 
  const getPostedDate = (jobId) => {
    const days = (jobId % 30) + 1;
    return `${days} days ago`;
  };

  // Get experience text
  const getExperienceText = (years) => {
    if (years === 0) return "Fresher";
    if (years === 1) return "1 year";
    return `${years} years`;
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);

    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    if (!isSaved) {
      savedJobs.push(job.id);
    } else {
      const index = savedJobs.indexOf(job.id);
      if (index > -1) {
        savedJobs.splice(index, 1);
      }
    }
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  };


  const handleApply = () => {
    navigate(`/apply/${id}`);
  };


  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.company}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!job) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-source"
        style={{ backgroundColor: colors.bgLight }}
      >
        <div className="text-center">
          <Briefcase
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: colors.lightPrimary }}
          />
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            Job Not Found
          </h2>
          <button
            onClick={() => navigate("/jobs")}
            className="mt-4 px-6 py-2 rounded-lg font-medium"
            style={{ backgroundColor: colors.primary, color: "white" }}
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-ubuntu" style={{ backgroundColor: colors.bgLight }}>

      <div
        className="sticky top-0 z-40 bg-white shadow-sm border-b"
        style={{ borderColor: colors.border }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/jobs")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Jobs</span>
              </button>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Link to="/" className="hover:underline">
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/jobs" className="hover:underline">
                  Jobs
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-700 truncate max-w-xs">
                  {job.title}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveJob}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                style={{ borderColor: colors.border, color: colors.primary }}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isSaved ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="hidden sm:inline">
                  {isSaved ? "Saved" : "Save Job"}
                </span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                style={{ borderColor: colors.border, color: colors.primary }}
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Job Description (80%) */}
          <div className="lg:w-4/5">
            <div
              className="bg-white rounded-xl shadow-lg border overflow-hidden"
              style={{ borderColor: colors.border }}
            >
              {/* Job Header */}
              <div
                className="p-6 border-b"
                style={{ borderColor: colors.border }}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {job.clogo && (
                        <div
                          className="w-16 h-16 rounded-lg overflow-hidden border"
                          style={{ borderColor: colors.border }}
                        >
                          <img
                            src={job.clogo}
                            alt={job.company}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h1
                          className="text-2xl md:text-3xl font-bold mb-2"
                          style={{ color: colors.primary }}
                        >
                          {job.title}
                        </h1>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg text-gray-800">
                            {job.company}
                          </span>
                          <span
                            className="px-3 py-1 text-sm rounded-full font-medium"
                            style={{
                              backgroundColor: colors.lightSecondary,
                              color: colors.secondary,
                            }}
                          >
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin
                          className="w-5 h-5"
                          style={{ color: colors.primary }}
                        />
                        <span className="text-gray-700">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase
                          className="w-5 h-5"
                          style={{ color: colors.primary }}
                        />
                        <span className="text-gray-700">
                          {getExperienceText(job.experience)} experience
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users
                          className="w-5 h-5"
                          style={{ color: colors.primary }}
                        />
                        <span className="text-gray-700">
                          {job.vacancy} vacancies
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User
                          className="w-5 h-5"
                          style={{ color: colors.primary }}
                        />
                        <span className="text-gray-700">{job.gender}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:text-right">
                    <div className="mb-3">
                      <div className="text-sm text-gray-600">
                        Monthly Salary
                      </div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: colors.primary }}
                      >
                        {formatSalary(job.salary)}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleSaveJob}
                        className="px-6 py-3 rounded-lg font-semibold border flex items-center justify-center gap-2"
                        style={{
                          borderColor: colors.primary,
                          color: colors.primary,
                        }}
                      >
                        <Bookmark className="w-5 h-5" />
                        {isSaved ? "Saved" : "Save Job"}
                      </button>
                      <button
                        // onClick={() => handleApplyClick(job)}
                        className="px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                        style={{
                          backgroundColor: colors.secondary,
                          color: "white",
                        }}
                      >
                        Apply Now
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="p-6 space-y-8">
                {/* Job Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: colors.lightPrimary }}
                  >
                    <div className="text-sm text-gray-600 mb-1">Category</div>
                    <div
                      className="font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {job.category}
                    </div>
                  </div>
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: colors.lightPrimary }}
                  >
                    <div className="text-sm text-gray-600 mb-1">Posted</div>
                    <div
                      className="font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {getPostedDate(job.id)}
                    </div>
                  </div>
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: colors.lightPrimary }}
                  >
                    <div className="text-sm text-gray-600 mb-1">Education</div>
                    <div
                      className="font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {job.education}
                    </div>
                  </div>
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: colors.lightPrimary }}
                  >
                    <div className="text-sm text-gray-600 mb-1">Deadline</div>
                    <div
                      className="font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {getPostedDate(job.id + 10)} left
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3
                    className="text-xl font-semibold mb-4 pb-2 border-b"
                    style={{
                      borderColor: colors.border,
                      color: colors.primary,
                    }}
                  >
                    Job Description
                  </h3>
                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-line">{job.description}</p>
                  </div>
                </div>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b"
                      style={{
                        borderColor: colors.border,
                        color: colors.primary,
                      }}
                    >
                      Job Requirements
                    </h3>
                    <ul className="space-y-3">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle
                            className="w-5 h-5 mt-0.5 shrink-0"
                            style={{ color: colors.secondary }}
                          />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b"
                      style={{
                        borderColor: colors.border,
                        color: colors.primary,
                      }}
                    >
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-lg font-medium"
                          style={{
                            backgroundColor: colors.lightPrimary,
                            color: colors.primary,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b"
                      style={{
                        borderColor: colors.border,
                        color: colors.primary,
                      }}
                    >
                      Benefits & Perks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg"
                          style={{ backgroundColor: colors.lightSecondary }}
                        >
                          <CheckCircle
                            className="w-4 h-4"
                            style={{ color: colors.secondary }}
                          />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Information */}
                <div
                  className="p-6 rounded-lg border"
                  style={{ borderColor: colors.border }}
                >
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: colors.primary }}
                  >
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          Company Name
                        </div>
                        <div className="font-semibold text-gray-800">
                          {job.company}
                        </div>
                      </div>
                      {job.compnay?.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="text-sm text-gray-600 mb-1">
                              Address
                            </div>
                            <div className="text-gray-700">
                              {job.compnay.address}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {job.compnay?.email &&
                        job.compnay.email !== "Not specified" && (
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600 mb-1">
                                Email
                              </div>
                              <div className="text-gray-700">
                                {job.compnay.email}
                              </div>
                            </div>
                          </div>
                        )}
                      {job.compnay?.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600 mb-1">
                              Phone
                            </div>
                            <div className="text-gray-700">
                              {job.compnay.phone}
                            </div>
                          </div>
                        </div>
                      )}
                      {job.compnay?.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600 mb-1">
                              Website
                            </div>
                            <a
                              href={job.compnay.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Apply Section */}
                <div
                  className="p-8 rounded-lg text-center"
                  style={{ backgroundColor: colors.lightSecondary }}
                >
                  <h4
                    className="text-2xl font-semibold mb-3"
                    style={{ color: colors.primary }}
                  >
                    Ready to Apply?
                  </h4>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Don't miss this opportunity! Click the button below to start
                    your application process.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleSaveJob}
                      className="px-8 py-3 rounded-lg font-semibold border flex items-center justify-center gap-2"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                      }}
                    >
                      <Bookmark className="w-5 h-5" />
                      {isSaved ? "Job Saved" : "Save for Later"}
                    </button>
                    <button
                      // onClick={() => handleApplyClick(job)}
                      className="px-10 py-3 rounded-lg font-semibold text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                      style={{
                        backgroundColor: colors.primary,
                        color: "white",
                      }}
                    >
                      Apply Now
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Related Jobs (20%) */}
          <div className="lg:w-1/5">
            <div className="sticky top-24 space-y-6">
              {/* Related Jobs */}
              <div
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
                style={{ borderColor: colors.border }}
              >
                <div
                  className="p-4 border-b"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.lightPrimary,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                    <h3
                      className="font-semibold"
                      style={{ color: colors.primary }}
                    >
                      Related Jobs
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  {relatedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {relatedJobs.map((relatedJob) => (
                        <Link
                          key={relatedJob.id}
                          to={`/job/${relatedJob.id}`}
                          className="block p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all duration-200"
                          style={{ borderColor: colors.border }}
                        >
                          <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                            {relatedJob.title}
                          </h4>
                          <p className="text-gray-700 text-xs mb-2">
                            {relatedJob.company}
                          </p>
                          <div className="flex items-center justify-between">
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor: colors.lightSecondary,
                                color: colors.secondary,
                              }}
                            >
                              {relatedJob.type}
                            </span>
                            <div className="text-xs text-gray-500">
                              {formatSalary(relatedJob.salary)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-gray-500 text-sm">
                        No related jobs found
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Senior Management Jobs */}
              <div
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
                style={{ borderColor: colors.border }}
              >
                <div
                  className="p-4 border-b"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.lightPrimary,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Award
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                    <h3
                      className="font-semibold"
                      style={{ color: colors.primary }}
                    >
                      Senior Management
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {seniorJobs.slice(0, 4).map((seniorJob, index) => (
                      <Link
                        key={index}
                        to={`/job/${seniorJob.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div
                          className="w-10 h-10 rounded overflow-hidden border"
                          style={{ borderColor: colors.border }}
                        >
                          <img
                            src={seniorJob.clogo}
                            alt={seniorJob.companyname}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {seniorJob.title}
                          </h4>
                          <p className="text-gray-600 text-xs">
                            {seniorJob.companyname}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/jobs"
                    className="block mt-4 text-center py-2 text-sm rounded-lg border transition-colors"
                    style={{
                      borderColor: colors.primary,
                      color: colors.primary,
                    }}
                  >
                    View All Senior Jobs
                  </Link>
                </div>
              </div>

              {/* Quick Actions */}
              <div
                className="p-4 rounded-lg border"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.lightPrimary,
                }}
              >
                <h4
                  className="font-semibold mb-3"
                  style={{ color: colors.primary }}
                >
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={handleSaveJob}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors hover:bg-white"
                    style={{
                      borderColor: colors.border,
                      color: colors.primary,
                    }}
                  >
                    <Bookmark className="w-4 h-4" />
                    {isSaved ? "Remove from Saved" : "Save This Job"}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors hover:bg-white"
                    style={{
                      borderColor: colors.border,
                      color: colors.primary,
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share with Friends
                  </button>
                  <Link
                    to="/jobs"
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors hover:bg-white text-center"
                    style={{
                      borderColor: colors.border,
                      color: colors.primary,
                    }}
                  >
                    <Briefcase className="w-4 h-4" />
                    Browse More Jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Apply Button */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg"
        style={{ borderColor: colors.border }}
      >
        <div className="flex gap-3">
          <button
            onClick={handleSaveJob}
            className="flex-1 py-3 rounded-lg font-semibold border flex items-center justify-center gap-2"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            <Bookmark className="w-5 h-5" />
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            // onClick={() => handleApplyClick(job)}
            className="flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: colors.secondary, color: "white" }}
          >
            Apply Now
          </button>
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

export default SingleJobDescription;
