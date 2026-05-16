import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiGraduationCapFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import freshImage from "/gratuate.png";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const FreshJob = () => {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [freshJobs, setFreshJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFreshJobs = async () => {
      try {
        // Step 1: Get job types to find "Fresher" typeId
        const typesRes = await axios.get(`${API_URL}/job-types`, {
          withCredentials: true,
        });

        const types = typesRes.data?.data || [];
        const fresherType = types.find(
          (t) => t.title?.toLowerCase() === "fresher",
        );

        if (!fresherType?.jobTypeId) {
          setIsLoading(false);
          return;
        }

        // Step 2: Fetch jobs filtered by Fresher jobTypeId
        const jobsRes = await axios.get(`${API_URL}/jobs`, {
          withCredentials: true,
          params: {
            jobTypeId: fresherType.jobTypeId,
            status: "published",
            limit: 50,
            sortBy: "createdAt",
            order: "desc",
          },
        });

        if (jobsRes.data?.success) {
          const items = jobsRes.data.data?.items || [];
          setFreshJobs(items);
        }
      } catch (error) {
        console.error("Failed to fetch fresh jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFreshJobs();
  }, []);

  const handlePrev = () => {
    setCurrentJobIndex((prev) =>
      prev === 0 ? Math.max(0, freshJobs.length - 8) : prev - 8,
    );
  };

  const handleNext = () => {
    setCurrentJobIndex((prev) => (prev + 8 >= freshJobs.length ? 0 : prev + 8));
  };

  const visibleJobs = freshJobs.slice(currentJobIndex, currentJobIndex + 8);

  const getJobUrl = (job) => {
    const title = job.jobTitle || "";
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);
    const id = job.jobId || job._id;
    return `/job/${slug}-${id}`;
  };

  const formatLocation = (location) => {
    if (!location) return "Location not specified";
    return location.includes("(") ? location.split("(")[0].trim() : location;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
            <div className="space-y-9">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <RiGraduationCapFill className="text-5xl md:text-6xl text-black" />
                  <h1 className="text-4xl md:text-5xl uppercase font-bold tracking-wider">
                    Fresh
                  </h1>
                </div>
                <h2 className="text-3xl md:text-4xl font-medium text-gray-950 uppercase">
                  Graduate Jobs
                </h2>
                <p className="text-lg">
                  Kickstart your career with these excellent entry level
                  positions.
                </p>
              </div>
              <button className="bg-secondary px-6 py-3 text-lg md:text-xl font-bold uppercase text-black cursor-pointer">
                Graduate Jobs
              </button>
            </div>
            <div className="overflow-hidden h-full">
              <img
                src={freshImage}
                alt="Fresh Jobs"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Featured Jobs in Bangladesh
              </h2>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  <IoIosArrowBack size={22} className="text-gray-300" />
                </div>
                <div className="p-2 rounded-full bg-gray-100">
                  <IoIosArrowForward size={22} className="text-gray-300" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 grow">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-gray-50 animate-pulse"
                >
                  <div className="h-6 bg-gray-300 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 font-source">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left: Hero */}
        <div className="grid grid-cols-2 items-center">
          <div className="space-y-9">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <RiGraduationCapFill className="text-5xl md:text-6xl text-black" />
                <h1 className="text-4xl md:text-5xl uppercase font-bold tracking-wider">
                  Fresh
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-medium text-gray-950 uppercase">
                Graduate Jobs
              </h2>
              <p className="text-lg">
                Kickstart your career with these excellent entry level
                positions. Find the job best suited to your skills and begin
                your new and exciting career.
              </p>
            </div>
            <div>
              <Link to="/jobs?jobTypeId=ec88aafe-bdd7-4ece-819e-a5007abe054e">
                <button className="bg-[#4EB956] px-6 py-3 text-lg md:text-xl font-bold uppercase text-white hover:bg-[#3da345] transition-colors cursor-pointer">
                  Graduate Jobs
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-hidden h-full">
            <img
              src={freshImage}
              alt="Fresh Jobs"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Right: Job List */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Fresher Jobs</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={freshJobs.length <= 8}
                className={`p-2 rounded-full transition ${
                  freshJobs.length > 8
                    ? "bg-gray-100 hover:bg-blue-100 text-blue-600 cursor-pointer"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <IoIosArrowBack size={22} />
              </button>
              <button
                onClick={handleNext}
                disabled={freshJobs.length <= 8}
                className={`p-2 rounded-full transition ${
                  freshJobs.length > 8
                    ? "bg-gray-100 hover:bg-blue-100 text-blue-600 cursor-pointer"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <IoIosArrowForward size={22} />
              </button>
            </div>
          </div>

          {freshJobs.length === 0 ? (
            <div className="text-center py-8 grow flex flex-col items-center justify-center">
              <RiGraduationCapFill className="text-5xl text-gray-300 mb-3" />
              <p className="text-gray-500">
                No fresher jobs found at the moment.
              </p>
              <Link
                to="/jobs"
                className="inline-block mt-2 text-[#4EB956] hover:underline"
              >
                Browse all jobs →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 grow">
              {visibleJobs.map((job, index) => (
                <Link
                  to={getJobUrl(job)}
                  key={job.jobId || job._id || index}
                  className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition duration-300 animate-fade-in border-l-4 border-transparent hover:border-[#4EB956] group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate group-hover:text-[#1E2558]">
                    {job.jobTitle}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-1">
                    {job.companyId?.nameCompany || "Unknown Company"},{" "}
                    {formatLocation(job.jobLocation)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                      {job.jobTypeId?.title || "Fresher"}
                    </span>
                    {job.jobCategoryId?.title && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                        {job.jobCategoryId.title}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FreshJob;
