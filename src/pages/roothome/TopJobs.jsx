import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jobData from "../../data/jobData.json";

const TopJobs = () => {
  const [randomJobs, setRandomJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRandomJobs = () => {
      const shuffled = [...jobData].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 20);
    };

    const timer = setTimeout(() => {
      setRandomJobs(getRandomJobs());
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const getCompanyLogo = (job) => {
    if (job.clogo && job.clogo !== "" && job.clogo !== "N/A") {
      return job.clogo;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      job.company
    )}&background=1e2558&color=fff&size=128`;
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-2">
          <h2 className="text-2xl font-bold text-[#1E2558]/90 mb-4">
            Top Jobs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm animate-pulse"
              >
                <div className="p-4 flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="size-14 bg-gray-300 rounded-lg"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-12 font-source">
      <div className="container mx-auto px-4 sm:px-6 lg:px-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#1E2558]/90">Top Jobs</h2>
          <Link
            to="/jobs"
            className="text-[#4EB956] hover:text-[#1E2558] font-medium text-sm flex items-center gap-1"
          >
            View All Jobs
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 border border-primary/20 rounded-2xl shadow p-2">
          {randomJobs.map((job) => (
            <Link
              key={job.id}
              to={`/job/${job.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="p-4 flex items-start gap-3">
                <div className="shrink-0">
                  <img
                    src={getCompanyLogo(job)}
                    alt={`${job.company} logo`}
                    className="size-14 object-contain rounded-lg border border-gray-200 group-hover:border-[#4EB956] transition-colors"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        job.company
                      )}&background=1e2558&color=fff&size=128`;
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-[#1E2558] mb-1">
                    {job.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                    {job.company}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopJobs;
