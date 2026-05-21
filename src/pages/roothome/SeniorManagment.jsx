import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useJobStore from "../../store/jobStore";

// ── Shimmer styles — injected once globally ───────────────────────────────────

const SHIMMER_CSS = `
@keyframes skl-sweep {
  0%   { background-position: -700px 0; }
  100% { background-position:  700px 0; }
}
.skl {
  background: linear-gradient(90deg, #f2f2f2 25%, #e8e8e8 50%, #f2f2f2 75%);
  background-size: 700px 100%;
  animation: skl-sweep 1.6s infinite linear;
}
.skl-r4   { border-radius: 4px; }
.skl-r8   { border-radius: 8px; }
.skl-pill { border-radius: 9999px; }
`;

function injectSklStyles() {
  if (document.getElementById("__sm_skl__")) return;
  const s = document.createElement("style");
  s.id = "__sm_skl__";
  s.textContent = SHIMMER_CSS;
  document.head.appendChild(s);
}

// ── Single skeleton card — mirrors the real card layout exactly ───────────────
// Real card: w-56, logo box h-36, then title + company + location below

const SkeletonCard = ({ delay = 0 }) => (
  <div
    className="w-56 shrink-0 overflow-hidden"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Logo box */}
    <div className="skl skl-r8" style={{ height: 144, width: 224 }} />

    {/* Text block */}
    <div className="px-2 py-4 space-y-2.5">
      {/* Job title */}
      <div className="skl skl-r4" style={{ height: 14, width: "85%" }} />
      {/* Company */}
      <div className="skl skl-r4" style={{ height: 13, width: "65%" }} />
      {/* Location */}
      <div className="skl skl-r4" style={{ height: 11, width: "50%" }} />
    </div>
  </div>
);

// ── Skeleton section header ───────────────────────────────────────────────────

const SkeletonHeader = () => (
  <div className="flex justify-between items-center mb-10">
    <div className="grow flex justify-center">
      <div className="skl skl-r4" style={{ height: 22, width: 240 }} />
    </div>
    <div className="shrink-0">
      <div className="skl skl-r4" style={{ height: 14, width: 72 }} />
    </div>
  </div>
);

// ── Full skeleton layout (8 cards in a row) ───────────────────────────────────

const SeniorManagmentSkeleton = () => (
  <div className="hidden md:block bg-white py-12 px-4 sm:px-6 lg:px-12 font-source">
    <div className="container mx-auto">
      <SkeletonHeader />
      <div className="flex gap-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 80} />
        ))}
      </div>
    </div>
  </div>
);

// ── Granular store selectors ──────────────────────────────────────────────────

const selectFetchJobs = (s) => s.fetchJobs;

// ── Main component ────────────────────────────────────────────────────────────

const SeniorManagment = () => {
  const containerRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [seniorJobs, setSeniorJobs] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(true);

  const fetchJobs = useJobStore(selectFetchJobs);

  useEffect(() => {
    injectSklStyles();

    let cancelled = false;

    const loadJobs = async () => {
      setSectionLoading(true);

      const result = await fetchJobs({
        status: "published",
        limit: 50,
        sortBy: "createdAt",
        order: "desc",
      });

      if (!cancelled) {
        if (result?.success && result?.data?.length > 0) {
          const jobs = result.data;
          const shuffled = [...jobs].sort(() => Math.random() - 0.5);
          const count = Math.random() < 0.5 ? 7 : 8;
          setSeniorJobs(shuffled.slice(0, count));
        }
        setSectionLoading(false);
      }
    };

    loadJobs();
    return () => {
      cancelled = true;
    };
  }, [fetchJobs]);

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
    if (!containerRef.current) return;
    const container = containerRef.current;
    const itemWidth = container.scrollWidth / (seniorJobs.length || 1);
    const maxScroll = container.scrollWidth - container.clientWidth;
    container.scrollTo({
      left: Math.min(container.scrollLeft + itemWidth * 2, maxScroll),
      behavior: "smooth",
    });
  };

  const prevSlide = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const itemWidth = container.scrollWidth / (seniorJobs.length || 1);
    container.scrollTo({
      left: Math.max(container.scrollLeft - itemWidth * 2, 0),
      behavior: "smooth",
    });
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

  // ── Skeleton while fetching ───────────────────────────────────────────────
  if (sectionLoading) return <SeniorManagmentSkeleton />;

  // ── Nothing to show ───────────────────────────────────────────────────────
  if (seniorJobs.length === 0) return null;

  return (
    <div className="hidden md:block bg-white py-12 px-4 sm:px-6 lg:px-12 font-source">
      <div className="container mx-auto">
        {/* Header */}
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

        {/* Carousel */}
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
                  {/* Company logo */}
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
