import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useJobStore from "../../store/jobStore";

const SeniorManagment = () => {
  const containerRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [seniorJobs, setSeniorJobs] = useState([]);

  const { fetchJobs } = useJobStore();

  useEffect(() => {
    const loadJobs = async () => {
      const result = await fetchJobs({
        status: "published",
        limit: 50,
        sortBy: "createdAt",
        order: "desc",
      });

      if (result?.success && result?.data?.length > 0) {
        const jobs = result.data;
        // Shuffle and pick 7-8 random jobs
        const shuffled = [...jobs].sort(() => Math.random() - 0.5);
        const count = Math.random() < 0.5 ? 7 : 8;
        setSeniorJobs(shuffled.slice(0, count));
      }
    };

    loadJobs();
  }, []);

  const checkArrows = () => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current;
      setShowArrows(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener("resize", checkArrows);
    return () => window.removeEventListener("resize", checkArrows);
  }, [seniorJobs]);
  const nextSlide = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemWidth = container.scrollWidth / (seniorJobs.length || 1);
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollTo({
        left: Math.min(container.scrollLeft + itemWidth * 2, maxScroll),
        behavior: "smooth",
      });
    }
  };

  const prevSlide = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemWidth = container.scrollWidth / (seniorJobs.length || 1);
      container.scrollTo({
        left: Math.max(container.scrollLeft - itemWidth * 2, 0),
        behavior: "smooth",
      });
    }
  };

  const getJobUrl = (job) => {
    if (!job?.title) return "/jobs";
    const slug = job.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);
    return `/job/${slug}-${job.jobId || job.id}`;
  };

  if (seniorJobs.length === 0) return null;

  return (
    <div className="hidden md:block bg-white py-12 px-4 sm:px-6 lg:px-12 font-source">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="grow text-center">
            <h2 className="text-2xl font-bold font-lato text-gray-700">
              Senior Management Jobs
            </h2>
          </div>
          <div className="shrink-0">
            <a
              href="/jobs"
              className="hover:text-blue-700 text-sm font-lato hover:underline text-blue-800 font-semibold transition-colors"
            >
              View All &rarr;
            </a>
          </div>
        </div>

        <div className="relative">
          {showArrows && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-shadow z-10"
                aria-label="Previous jobs"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-shadow z-10"
                aria-label="Next jobs"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          <div
            ref={containerRef}
            className="flex overflow-x-hidden scroll-smooth py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.flex::-webkit-scrollbar { display: none; }`}</style>

            {seniorJobs.map((job, index) => (
              <div
                key={job.jobId || job.id || index}
                className="w-56 shrink-0 overflow-hidden"
              >
                <Link to={getJobUrl(job)} className="block group">
                  {/* Company Logo */}
                  <div className="w-46 h-36 overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 rounded-lg">
                    <img
                      className="w-full h-full object-contain p-2"
                      src={
                        job.companyLogo ||
                        job.clogo ||
                        "/images/default-company.png"
                      }
                      alt={job.company}
                      onError={(e) => {
                        e.target.src = "/images/default-company.png";
                      }}
                    />
                  </div>

                  <div className="px-2 py-4">
                    <h3 className="text-[15px] font-semibold font-lato text-gray-700 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 font-lato text-sm line-clamp-1">
                      {job.company}
                    </p>
                    {job.location && (
                      <p className="text-gray-400 font-lato text-xs mt-1 line-clamp-1">
                        📍 {job.location}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorManagment;
