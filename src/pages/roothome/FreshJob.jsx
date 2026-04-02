import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiGraduationCapFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import freshImage from "/gratuate.png";
import jobData from "../../data/jobData.json";

const FreshJob = () => {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [freshJobs, setFreshJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFreshJobs = () => {
      const filteredJobs = jobData.filter((job) => {
        const exp = parseInt(job.experience) || 0;
        const isFresher = exp <= 1;

        const titleLower = job.title?.toLowerCase() || "";
        const descLower = job.description?.toLowerCase() || "";
        const isEntryLevel =
          titleLower.includes("fresher") ||
          titleLower.includes("entry") ||
          titleLower.includes("junior") ||
          titleLower.includes("trainee") ||
          descLower.includes("fresher") ||
          descLower.includes("entry level");

        return isFresher || isEntryLevel;
      });

      if (filteredJobs.length < 20) {
        const shuffled = [...jobData].sort(() => 0.5 - Math.random());
        const additionalJobs = shuffled
          .filter((job) => !filteredJobs.some((fj) => fj.id === job.id))
          .slice(0, 20 - filteredJobs.length);

        return [...filteredJobs, ...additionalJobs].slice(0, 20);
      }

      return filteredJobs.slice(0, 20);
    };

    const timer = setTimeout(() => {
      setFreshJobs(getFreshJobs());
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handlePrev = () => {
    setCurrentJobIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, freshJobs.length - 4) : prevIndex - 4,
    );
  };

  const handleNext = () => {
    setCurrentJobIndex((prevIndex) =>
      prevIndex + 8 >= freshJobs.length ? 0 : prevIndex + 4,
    );
  };

  const visibleJobs = freshJobs.slice(currentJobIndex, currentJobIndex + 4);

  const formatLocation = (location) => {
    if (!location) return "Location not specified";

    let cleanLocation = location;
    if (cleanLocation.includes("(")) {
      cleanLocation = cleanLocation.split("(")[0].trim();
    }
    return cleanLocation;
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
                  <h1 className="text-4xl md:text-5xl uppercase font-bold tracking-wider ">
                    Fresh
                  </h1>
                </div>
                <h2 className="text-3xl md:text-4xl font-medium text-gray-950 uppercase">
                  Graduate Jobs
                </h2>
                <p className="text-lg">
                  Kickstart your career with these excellent entry level
                  positions. Find the job best suited to your skills and begin
                  your new and exciting career
                </p>
              </div>
              <div>
                <button className="bg-secondary px-6 py-3 text-lg md:text-xl font-bold uppercase text-black cursor-pointer">
                  Graduate Jobs
                </button>
              </div>
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
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-50 animate-pulse"
                >
                  <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
              <Link to="/jobs?filter=fresher">
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

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Featured Jobs in Bangladesh
            </h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 grow">
            {visibleJobs.map((job, index) => (
              <Link
                to={`/job/${job.id}`}
                key={job.id}
                className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition duration-300 animate-fade-in border-l-4 border-transparent hover:border-[#4EB956] group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate group-hover:text-[#1E2558]">
                  {job.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-1">
                  {job.company}, {formatLocation(job.location)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                    {job.type || "Full Time"}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    {job.category?.split("/")[0] || "General"}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {freshJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No fresh graduate jobs found at the moment.
              </p>
              <Link
                to="/jobs"
                className="inline-block mt-2 text-[#4EB956] hover:underline"
              >
                Browse all jobs →
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FreshJob;
