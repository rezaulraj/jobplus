import React, { useState, useRef, useEffect } from "react";
import seniorJobs from "../../data/senior.json";
import { Link } from "react-router-dom";
const SeniorManagment = () => {
  const containerRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
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
  }, []);

  const nextSlide = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemWidth = container.scrollWidth / seniorJobs.length;
      const maxScroll = container.scrollWidth - container.clientWidth;

      const newScrollPosition = Math.min(
        container.scrollLeft + itemWidth * 2,
        maxScroll
      );

      container.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  const prevSlide = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemWidth = container.scrollWidth / seniorJobs.length;

      const newScrollPosition = Math.max(
        container.scrollLeft - itemWidth * 2,
        0
      );

      container.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

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
                  xmlns="http://www.w3.org/2000/svg"
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
                  xmlns="http://www.w3.org/2000/svg"
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
            <style>{`
              .flex::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {seniorJobs.map((job, index) => (
              <div key={index} className="w-56 shrink-0 overflow-hidden">
                <Link to={`/job/${job.id}`} className="block">
                  <div className="w-46 h-36 overflow-hidden">
                    <img
                      className="w-full h-full object-center"
                      src={job.clogo}
                      alt={job.companyname}
                    />
                  </div>

                  <div className="px-2 py-4">
                    <h3 className="text-[15px] font-semibold font-lato text-gray-700 mb-1 line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 font-lato text-sm">
                      {job.companyname}
                    </p>
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
